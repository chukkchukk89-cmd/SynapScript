require('dotenv').config(); // Load environment variables

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises; // Import fs.promises
const execPromise = util.promisify(exec);

/**
 * Executes a Termux command and returns its stdout and stderr.
 * @param {string} command - The Termux command to execute.
 * @returns {Promise<{stdout: string, stderr: string}>} - The stdout and stderr of the command.
 */
async function executeTermuxCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command);
    return { stdout, stderr };
  } catch (error) {
    // execPromise throws an error if the command exits with a non-zero code
    // We want to capture stderr in this case.
    return { stdout: error.stdout, stderr: error.stderr };
  }
}

const GeminiClient = require('./server/ai/gemini-client'); // Import GeminiClient
const ResponseParser = require('./server/ai/response-parser'); // Import ResponseParser
const express = require('express');
const { nanoid } = require('nanoid');
const cron = require('node-cron');
const { initializeDatabase, createAutomation, getAutomationById, getAllAutomations, updateAutomation, deleteAutomation, createApiToken, getApiToken, deleteApiToken, logExecution } = require('./server/modules/database');

const app = express();
const port = 3000;

// Initialize GeminiClient
const gemini = new GeminiClient();

// In-memory storage for pairing codes (for now)
const pairingCodes = {};

// Map to store scheduled cron jobs
const scheduledJobs = new Map();

/**
 * Schedules an automation using node-cron.
 * @param {object} automation - The automation object containing id and schedule.
 */
async function scheduleAutomation(automation) {
  if (automation.schedule && cron.validate(automation.schedule)) {
    // Ensure any existing job for this automation is unscheduled first
    unscheduleAutomation(automation.id);

    const job = cron.schedule(automation.schedule, async () => {
      console.log(`Executing scheduled automation: ${automation.name} (${automation.id})`);
      // Here, you would call the automation execution logic
      // For now, we'll just log it. The actual execution will be handled by the /api/automations/execute/:id endpoint.
      // We need to make an internal call to that endpoint or refactor the execution logic.
      try {
        // This is a simplified call. In a real scenario, you might use an internal function
        // that mimics the /api/automations/execute/:id endpoint's logic.
        const response = await fetch(`http://localhost:${port}/api/automations/execute/${automation.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer YOUR_INTERNAL_API_TOKEN`, // Use an internal token for server-to-server calls
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (!result.success) {
          console.error(`Scheduled automation ${automation.id} failed:`, result.error);
        }
      } catch (error) {
        console.error(`Error executing scheduled automation ${automation.id}:`, error);
      }
    }, {
      scheduled: true,
      timezone: "America/New_York" // Or dynamically set based on user's timezone
    });
    scheduledJobs.set(automation.id, job);
    console.log(`Automation ${automation.name} (${automation.id}) scheduled with cron: ${automation.schedule}`);
  } else if (automation.schedule) {
    console.warn(`Invalid cron schedule for automation ${automation.name} (${automation.id}): ${automation.schedule}`);
  }
}

/**
 * Unschedules an automation.
 * @param {string} automationId - The ID of the automation to unschedule.
 */
function unscheduleAutomation(automationId) {
  const job = scheduledJobs.get(automationId);
  if (job) {
    job.stop();
    scheduledJobs.delete(automationId);
    console.log(`Automation ${automationId} unscheduled.`);
  }
}

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SynapScript Bridge is running!');
});

// New endpoint to initiate pairing
app.post('/api/pair/initiate', (req, res) => {
  const code = nanoid(6).toUpperCase(); // Generate a 6-character code
  const expiry = Date.now() + 5 * 60 * 1000; // Code valid for 5 minutes

  pairingCodes[code] = { expiry };
  console.log(`Pairing initiated. Code: ${code}, expires: ${new Date(expiry).toLocaleTimeString()}`);

  res.json({ code, expiry });
});

// New endpoint to verify pairing code and issue API token
app.post('/api/pair/verify', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Pairing code is required.' });
  }

  const pairingEntry = pairingCodes[code];

  if (!pairingEntry) {
    return res.status(404).json({ error: 'Invalid or expired pairing code.' });
  }

  if (Date.now() > pairingEntry.expiry) {
    delete pairingCodes[code]; // Clean up expired code
    return res.status(404).json({ error: 'Pairing code has expired.' });
  }

  // Code is valid and not expired, generate a long-lived API token
  const apiToken = nanoid(32);
  await createApiToken(apiToken, 'Paired device API Token'); // Store token in SQLite

  delete pairingCodes[code]; // Remove used pairing code

  console.log(`Pairing successful. Issued API Token: ${apiToken}`);
  res.json({ apiToken });
});

// --- Authentication Middleware ---
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  // Allow internal API token to bypass authentication for server-to-server calls
  if (token === INTERNAL_API_TOKEN) {
    return next();
  }

  const apiToken = await getApiToken(token);
  if (!apiToken) {
    return res.status(403).json({ error: 'Invalid or unauthorized token.' });
  }

  // Token is valid, proceed to the next middleware/route handler
  next();
};

// --- Protected Routes ---
// New endpoint to create automation from natural language
app.post('/api/create', authenticateToken, async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'User input is required.' });
    }

    console.log('Creating automation from:', userInput);

    // Build prompt with system context + template
    const SYSTEM_CONTEXT = `# SYSTEM CONTEXT - SYNAPSCRIPT AI CORE\n\nYou are the AI core of SynapScript, an Android automation assistant.\n\n## Your Environment\n- **Platform:** Android device (phone/tablet)\n- **Runtime:** Node.js v20.x running in Termux\n- **Available APIs:** Termux API (complete Android system access)\n- **Bundled Packages:** axios, cheerio, express, fs-extra, node-cron, dayjs, chalk, dotenv, commander, ws, csv-parser, qrcode\n- **Database:** SQLite (synap.db)\n- **User Interface:** Web-based (HTML/CSS/JS)\n\n## Termux API Commands Available\n\n### System Control\n- \`termux-wifi-enable <true|false>\` - WiFi on/off\n- \`termux-brightness <0-255>\` - Screen brightness\n- \`termux-volume <stream> <volume>\` - Volume control\n- \`termux-torch <on|off>\` - Flashlight control\n\n### Sensors & Status\n- \`termux-battery-status\` - Battery info (JSON)\n- \`termux-location\` - GPS coordinates (JSON)\n- \`termux-sensor -s <sensor>\` - Sensor data\n- \`termux-telephony-deviceinfo\` - Device info\n\n### Communication\n- \`termux-sms-send -n <number> <text>\` - Send SMS\n- \`termux-notification --title <text> --content <text>\` - Show notification\n- \`termux-contact-list\` - Get contacts\n- \`termux-telephony-call <number>\` - Make call\n\n### Network\n- \`termux-wifi-connectioninfo\` - Current WiFi info\n- \`termux-wifi-scaninfo\` - Available networks\n\n### Media & Files\n- \`termux-camera-photo <filename>\` - Take photo\n- \`termux-media-scan <file>\` - Scan media file\n- \`termux-storage-get <file>\` - Access external storage\n\n## V1.0 Constraints\n- ✓ Node.js support only (no Python)\n- ✓ No browser automation (no puppeteer)\n- ✓ No advanced UI automation (Accessibility Service limited)\n- ✓ Manual execution + scheduled (node-cron) only\n- ✓ Static visual blocks (no drag-and-drop)\n\n## Your Goals\n1. Translate natural language → executable Node.js/bash code\n2. Generate visual representations users can understand\n3. Suggest improvements and handle edge cases\n4. Provide clear error explanations\n5. Maintain user privacy (on-device first)\n`;

    const PROMPT_TEMPLATE = `# NATURAL LANGUAGE TO AUTOMATION TRANSLATOR\n\n## User Request\n${userInput}\n\n## Your Task\nConvert this request into a complete automation specification.\n\n## RESPONSE FORMAT (ALWAYS RESPOND WITH VALID JSON)\n\n{\n  "understanding": "Brief summary of user's intent in simple terms",\n  "automation": {\n    "name": "Short descriptive name (2-4 words)",\n    "trigger": {\n      "type": "schedule|manual|event",\n      "description": "Plain English explanation of when this runs",\n      "icon": "emoji representing the trigger",\n      "schedule": {\n        "cron": "cron expression (if type=schedule)",\n        "human": "human-readable schedule (e.g., 'Daily at 9 AM')"\n      },\n      "conditions": [\n        {\n          "what": "what to check (battery, location, time, etc.)",\n          "operator": "less_than|greater_than|equals|not_equals|contains",\n          "value": "the comparison value",\n          "visual": "emoji representation (e.g., '🔋 < 20%')"\n        }\n      ]\n    },\n    "actions": [\n      {\n        "description": "Plain English explanation of this action",\n        "icon": "emoji representing the action",\n        "type": "termux_api|node_script|bash_command",\n        "command": "actual command to execute",\n        "visual": "Simple user-friendly text"\n      }\n    ]\n  },\n  "generated_code": {\n    "language": "javascript|bash",\n    "code": "Complete executable code for this automation"\n  },\n  "smart_suggestions": [\n    {\n      "suggestion": "Improvement or addition",\n      "reason": "Why this helps the user",\n      "complexity": "low|medium|high"\n    }\n  ],\n  "edge_cases": [\n    {\n      "scenario": "What could go wrong",\n      "current_handling": "How your code handles it",\n      "recommendation": "Better approach (if any)"\n    }\n  ],\n  "requirements": {\n    "permissions": ["list of Android permissions needed"],\n    "packages": ["list of npm packages needed (only if not bundled)"],\n    "battery_impact": "none|low|medium|high",\n    "data_usage": "none|low|medium|high"\n  }\n}\n\n## CODE GENERATION RULES\n\n### For Node.js Scripts\n- Use async/await (not callbacks)\n- Include error handling (try/catch)\n- Use bundled packages only\n- Add comments explaining key steps\n- Export main function: \`module.exports = async function() { ... }`\n\n### For Bash Scripts\n- Start with: \`#!/data/data/com.termux/files/usr/bin/bash`\n- Check command availability before use\n- Use Termux API commands\n- Handle errors with exit codes\n\n### For Cron Schedules\n- Use standard cron syntax: \`minute hour day month weekday`\n- Provide human-readable translation\n- Examples:\n  - \`0 9 * * 1-5\` = "Weekdays at 9 AM"\n  - \`0 */4 * * *\` = "Every 4 hours"\n  - \`0 0 * * 0\` = "Sundays at midnight"\n`;

    const prompt = `${SYSTEM_CONTEXT}\n${PROMPT_TEMPLATE}`;

    const aiResponse = await gemini.generate(prompt, { cache: true });
    console.log('Raw AI Response:', aiResponse);
    let parsed;
    try {
      parsed = ResponseParser.extractJSON(aiResponse);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError.message);
      return res.status(500).json({
        success: false,
        error: 'Could not extract valid JSON from AI response',
        rawAiResponse: aiResponse // Include raw AI response for debugging
      });
    }

    ResponseParser.validateAutomation(parsed);
    parsed.generated_code.code = ResponseParser.sanitizeCode(parsed.generated_code.code);

    const { name, trigger, actions } = parsed.automation;
    const { generated_code } = parsed;
    const id = nanoid(10); // Generate a unique ID for the automation
    const newAutomation = await createAutomation({ id, name, trigger, actions, generated_code });
    console.log('Automation stored in DB:', newAutomation.id);

    res.json({
      success: true,
      automation: parsed,
      id: newAutomation.id // Return the ID of the newly created automation
    });

  } catch (error) {
    console.error('Automation creation error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// New endpoint to execute Termux commands
app.post('/api/execute/command', authenticateToken, async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  console.log(`Executing command: ${command}`);

  try {
    const { stdout, stderr } = await executeTermuxCommand(command);
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      return res.status(400).json({ success: false, command, stdout, stderr, error: 'Command executed with errors.' });
    }
    res.json({ success: true, command, stdout, stderr });
  } catch (error) {
    console.error('Command execution error:', error.message, error.stack);
    res.status(500).json({ success: false, command, error: error.message });
  }
});

app.post('/api/automations/execute/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const automation = await getAutomationById(id);
    if (!automation) {
      return res.status(404).json({ error: 'Automation not found.' });
    }

    const { generated_code } = automation;
    if (!generated_code || !generated_code.code) {
      return res.status(400).json({ error: 'Automation has no executable code.' });
    }

    console.log(`Executing automation ID ${id}. Language: ${generated_code.language}`);

    let stdout = '';
    let stderr = '';
    let executionError = null;
    let status = 'success';
    let errorMessage = null;

    if (generated_code.language === 'javascript') {
      const tempFileName = `/data/data/com.termux/files/home/.gemini/tmp/${id}.js`;
      try {
        await fs.writeFile(tempFileName, generated_code.code);
        const { stdout: jsStdout, stderr: jsStderr } = await execPromise(`node ${tempFileName}`);
        stdout = jsStdout;
        stderr = jsStderr;
      } catch (jsExecError) {
        executionError = jsExecError;
        stderr = jsExecError.stderr || jsExecError.message;
        status = 'failed';
        errorMessage = jsExecError.message;
      } finally {
        // Clean up the temporary file
        try {
          await fs.unlink(tempFileName);
        } catch (unlinkError) {
          console.error(`Error deleting temporary file ${tempFileName}:`, unlinkError);
        }
      }
    } else if (generated_code.language === 'bash' || generated_code.language === 'termux_api') {
      try {
        const { stdout: bashStdout, stderr: bashStderr } = await execPromise(generated_code.code);
        stdout = bashStdout;
        stderr = bashStderr;
      } catch (bashExecError) {
        executionError = bashExecError;
        stderr = bashExecError.stderr || bashExecError.message;
        status = 'failed';
        errorMessage = bashExecError.message;
      }
    } else {
      status = 'failed';
      errorMessage = `Unsupported language: ${generated_code.language}`;
      await logExecution(id, status, '', errorMessage);
      return res.status(400).json({ success: false, automationId: id, error: errorMessage });
    }

    if (executionError || stderr) {
      status = 'failed';
      errorMessage = executionError ? executionError.message : 'Command executed with errors.';
      console.error(`Execution stderr for automation ${id}: ${stderr}`);
      await logExecution(id, status, stdout + stderr, errorMessage);
      return res.status(400).json({ success: false, automationId: id, stdout, stderr, error: errorMessage });
    }

    await logExecution(id, status, stdout + stderr);
    res.json({ success: true, automationId: id, stdout, stderr });

  } catch (error) {
    console.error('Error executing automation:', error.message, error.stack);
    res.status(500).json({ success: false, automationId: id, error: error.message });
  }
});

// CRUD Endpoints for Automations

const speakerRoute = require('./server/routes/speaker');

app.use('/api', speakerRoute);
app.post('/api/automations', authenticateToken, async (req, res) => {
  try {
    const { name, trigger, actions, generated_code, schedule } = req.body;
    if (!name || !trigger || !actions || !generated_code) {
      return res.status(400).json({ error: 'Missing required automation fields.' });
    }
    const id = nanoid(10);
    const newAutomation = await createAutomation({ id, name, trigger, actions, generated_code, schedule });
    scheduleAutomation(newAutomation); // Schedule the new automation
    res.status(201).json({ success: true, automation: newAutomation });
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/automations', authenticateToken, async (req, res) => {
  try {
    const automations = await getAllAutomations();
    res.json({ success: true, automations });
  } catch (error) {
    console.error('Error getting all automations:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/automations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const automation = await getAutomationById(id);
    if (automation) {
      res.json({ success: true, automation });
    } else {
      res.status(404).json({ error: 'Automation not found.' });
    }
  } catch (error) {
    console.error('Error getting automation by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/automations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existingAutomation = await getAutomationById(id);
    if (!existingAutomation) {
      return res.status(404).json({ error: 'Automation not found.' });
    }

    const updatedAutomation = await updateAutomation(id, updates);
    if (updatedAutomation) {
      // If schedule was updated, unschedule the old one and schedule the new one
      if (updates.schedule !== undefined) {
        unscheduleAutomation(id);
        scheduleAutomation(updatedAutomation);
      }
      res.json({ success: true, automation: updatedAutomation });
    } else {
      res.status(404).json({ error: 'Automation not found.' });
    }
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/automations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    unscheduleAutomation(id); // Unschedule the automation before deleting
    const deleted = await deleteAutomation(id);
    if (deleted) {
      res.json({ success: true, message: 'Automation deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Automation not found.' });
    }
  } catch (error) {
    console.error('Error deleting automation:', error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  await initializeDatabase(); // Initialize the database before starting the server

  // Schedule existing automations
  const automations = await getAllAutomations();
  for (const automation of automations) {
    scheduleAutomation(automation);
  }

  app.listen(port, () => {
    console.log(`SynapScript Bridge listening at http://localhost:${port}`);
  });
}

startServer();

// Internal API token for server-to-server communication (e.g., scheduled tasks)
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || 'super-secret-internal-token'; // Use environment variable in production
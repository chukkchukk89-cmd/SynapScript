require('dotenv').config(); // Load environment variables

const express = require('express');
const { nanoid } = require('nanoid');
const { exec } = require('child_process');
const GeminiClient = require('./server/ai/gemini-client'); // Import GeminiClient
const ResponseParser = require('./server/ai/response-parser'); // Import ResponseParser

const app = express();
const port = 3000;

// Initialize GeminiClient
const gemini = new GeminiClient();

// In-memory storage for pairing codes (for now)
const pairingCodes = {};
// In-memory storage for authorized API tokens
const authorizedTokens = {};

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
  const apiToken = nanoid(32); // Generate a longer, more secure token
  authorizedTokens[apiToken] = { createdAt: Date.now() }; // Store token

  delete pairingCodes[code]; // Remove used pairing code

  console.log(`Pairing successful. Issued API Token: ${apiToken}`);
  res.json({ apiToken });
});

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  if (!authorizedTokens[token]) {
    return res.status(403).json({ error: 'Invalid or unauthorized token.' });
  }

  // Token is valid, proceed to the next middleware/route handler
  next();
};

// Apply authentication middleware to all subsequent routes
app.use(authenticateToken);

// --- Protected Routes ---
// New endpoint to create automation from natural language
app.post('/api/create', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'User input is required.' });
    }

    console.log('Creating automation from:', userInput);

    // Build prompt with system context + template
    const SYSTEM_CONTEXT = `# SYSTEM CONTEXT - SYNAPSCRIPT AI CORE\n\nYou are the AI core of SynapScript, an Android automation assistant.\n\n## Your Environment\n- **Platform:** Android device (phone/tablet)\n- **Runtime:** Node.js v20.x running in Termux\n- **Available APIs:** Termux API (complete Android system access)\n- **Bundled Packages:** axios, cheerio, express, fs-extra, node-cron, dayjs, chalk, dotenv, commander, ws, csv-parser, qrcode\n- **Database:** SQLite (synap.db)\n- **User Interface:** Web-based (HTML/CSS/JS)\n\n## Termux API Commands Available\n\n### System Control\n- \`termux-wifi-enable <true|false>\` - WiFi on/off\n- \`termux-brightness <0-255>\` - Screen brightness\n- \`termux-volume <stream> <volume>\` - Volume control\n- \`termux-torch <on|off>\` - Flashlight control\n\n### Sensors & Status\n- \`termux-battery-status\` - Battery info (JSON)\n- \`termux-location\` - GPS coordinates (JSON)\n- \`termux-sensor -s <sensor>\` - Sensor data\n- \`termux-telephony-deviceinfo\` - Device info\n\n### Communication\n- \`termux-sms-send -n <number> <text>\` - Send SMS\n- \`termux-notification --title <text> --content <text>\` - Show notification\n- \`termux-contact-list\` - Get contacts\n- \`termux-telephony-call <number>\` - Make call\n\n### Network\n- \`termux-wifi-connectioninfo\` - Current WiFi info\n- \`termux-wifi-scaninfo\` - Available networks\n\n### Media & Files\n- \`termux-camera-photo <filename>\` - Take photo\n- \`termux-media-scan <file>\` - Scan media file\n- \`termux-storage-get <file>\` - Access external storage\n\n## V1.0 Constraints\n- ✓ Node.js support only (no Python)\n- ✓ No browser automation (no puppeteer)\n- ✓ No advanced UI automation (Accessibility Service limited)\n- ✓ Manual execution + scheduled (node-cron) only\n- ✓ Static visual blocks (no drag-and-drop)\n\n## Your Goals\n1. Translate natural language → executable Node.js/bash code\n2. Generate visual representations users can understand\n3. Suggest improvements and handle edge cases\n4. Provide clear error explanations\n5. Maintain user privacy (on-device first)\n`;

    const PROMPT_TEMPLATE = `# NATURAL LANGUAGE TO AUTOMATION TRANSLATOR\n\n## User Request\n${userInput}\n\n## Your Task\nConvert this request into a complete automation specification.\n\n## RESPONSE FORMAT (ALWAYS RESPOND WITH VALID JSON)\n\n{\n  "understanding": "Brief summary of user's intent in simple terms",\n  "automation": {\n    "name": "Short descriptive name (2-4 words)",\n    "trigger": {\n      "type": "schedule|manual|event",\n      "description": "Plain English explanation of when this runs",\n      "icon": "emoji representing the trigger",\n      "schedule": {\n        "cron": "cron expression (if type=schedule)",\n        "human": "human-readable schedule (e.g., 'Daily at 9 AM')"\n      },\n      "conditions": [\n        {\n          "what": "what to check (battery, location, time, etc.)",\n          "operator": "less_than|greater_than|equals|not_equals|contains",\n          "value": "the comparison value",\n          "visual": "emoji representation (e.g., '🔋 < 20%')"\n        }\n      ]\n    },\n    "actions": [\n      {\n        "description": "Plain English explanation of this action",\n        "icon": "emoji representing the action",\n        "type": "termux_api|node_script|bash_command",\n        "command": "actual command to execute",\n        "visual": "Simple user-friendly text"\n      }\n    ]\n  },\n  "generated_code": {\n    "language": "javascript|bash",\n    "code": "Complete executable code for this automation"\n  },\n  "smart_suggestions": [\n    {\n      "suggestion": "Improvement or addition",\n      "reason": "Why this helps the user",\n      "complexity": "low|medium|high"\n    }\n  ],\n  "edge_cases": [\n    {\n      "scenario": "What could go wrong",\n      "current_handling": "How your code handles it",\n      "recommendation": "Better approach (if any)"\n    }\n  ],\n  "requirements": {\n    "permissions": ["list of Android permissions needed"],\n    "packages": ["list of npm packages needed (only if not bundled)"],\n    "battery_impact": "none|low|medium|high",\n    "data_usage": "none|low|medium|high"\n  }\n}\n\n## CODE GENERATION RULES\n\n### For Node.js Scripts\n- Use async/await (not callbacks)\n- Include error handling (try/catch)\n- Use bundled packages only\n- Add comments explaining key steps\n- Export main function: \`module.exports = async function() { ... }\`\n\n### For Bash Scripts\n- Start with: \`#!/data/data/com.termux/files/usr/bin/bash\`\n- Check command availability before use\n- Use Termux API commands\n- Handle errors with exit codes\n\n### For Cron Schedules\n- Use standard cron syntax: \`minute hour day month weekday\`\n- Provide human-readable translation\n- Examples:\n  - \`0 9 * * 1-5\` = "Weekdays at 9 AM"\n  - \`0 */4 * * *\` = "Every 4 hours"\n  - \`0 0 * * 0\` = "Sundays at midnight"\n`;

    const prompt = `${SYSTEM_CONTEXT}\n${PROMPT_TEMPLATE}`;

    const aiResponse = await gemini.generate(prompt, { cache: true });
    const parsed = ResponseParser.extractJSON(aiResponse);

    ResponseParser.validateAutomation(parsed);
    parsed.generated_code.code = ResponseParser.sanitizeCode(parsed.generated_code.code);

    res.json({
      success: true,
      automation: parsed
    });

  } catch (error) {
    console.error('Automation creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// New endpoint to execute Termux commands
app.post('/api/execute/command', (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: stderr || error.message });
    }
    res.json({ stdout, stderr });
  });
});


app.listen(port, () => {
  console.log(`SynapScript Bridge listening at http://localhost:${port}`);
});

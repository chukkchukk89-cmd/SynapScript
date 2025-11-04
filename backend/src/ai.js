// backend/src/ai.js

// This is a placeholder for the actual Gemini API call.
// In a real implementation, this would use the Google AI SDK.
async function callGeminiAPI(prompt) {
  console.log("----PROMPT FOR GEMINI----");
  console.log(prompt);
  console.log("-------------------------");

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real app, you would parse the command and figure out what to do.
  // For now, we'll return a hardcoded response for a specific command.
  if (prompt.includes("Deploy my website")) {
    return JSON.stringify({
      emoji: '🚀',
      title: 'Deploy Website',
      description: 'Deploys the latest version of the website to production.',
      steps: [
        { label: 'Building project...', status: 'pending', command: 'npm run build --prefix frontend' },
        { label: 'Running tests...', status: 'pending', command: 'npm test --prefix frontend' },
        { label: 'Deploying to server...', status: 'pending', command: 'firebase deploy' },
        { label: 'Verifying deployment...', status: 'pending', command: 'echo "Deployment successful!"' },
      ],
    });
  }

  return JSON.stringify({
      emoji: '🤔',
      title: 'Unknown Command',
      description: `I'm not sure how to handle the command: "${prompt.split('\n').pop()}"`,
      steps: [
        { label: 'Command not understood', status: 'failed', command: '' },
      ],
  });
}

async function processCommand(command) {
  const prompt = `
You are an expert developer assistant. Your job is to take a user's high-level command and break it down into a sequence of executable steps.
The user is working on a project with a 'frontend' (React) and a 'backend' (Node.js/Express) directory.
The output must be a JSON object with the following structure:
{
  "emoji": "<a single emoji representing the task>",
  "title": "<A short, descriptive title for the automation>",
  "description": "<A one-sentence description of what the automation does>",
  "steps": [
    {
      "label": "<A user-friendly label for the step>",
      "status": "pending",
      "command": "<The shell command to execute for this step>"
    }
  ]
}

The user wants to: "${command}"
`;

  try {
    const geminiResponse = await callGeminiAPI(prompt.trim());
    return JSON.parse(geminiResponse);
  } catch (error) {
    console.error('Error processing command with AI:', error);
    return {
      emoji: '🔥',
      title: 'Error',
      description: 'An error occurred while processing the command.',
      steps: [{ label: 'AI processing failed', status: 'failed', command: '' }],
    };
  }
}

module.exports = { processCommand };

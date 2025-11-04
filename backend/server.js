const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupWebSocket } = require('./src/websocket');
const { processCommand } = require('./src/ai');
const { execute } = require('./src/execution');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Set up WebSocket server
setupWebSocket(server);

app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  console.log(`Received command: ${command}`);

  const result = await processCommand(command);
  res.json(result); // Send the initial plan to the client

  // Start executing the steps in the background
  if (result.steps) {
    execute(result.steps);
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

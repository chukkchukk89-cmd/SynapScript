const express = require('express');
const { nanoid } = require('nanoid'); // Import nanoid
const app = express();
const port = 3000;

// In-memory storage for pairing codes (for now)
const pairingCodes = {};

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

app.listen(port, () => {
  console.log(`SynapScript Bridge listening at http://localhost:${port}`);
});

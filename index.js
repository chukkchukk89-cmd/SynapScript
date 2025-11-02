const express = require('express');
const { nanoid } = require('nanoid'); // Import nanoid
const app = express();
const port = 3000;

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

// --- Protected Routes (will be added here later) ---
app.get('/api/protected', (req, res) => {
  res.send('This is a protected route!');
});


app.listen(port, () => {
  console.log(`SynapScript Bridge listening at http://localhost:${port}`);
});

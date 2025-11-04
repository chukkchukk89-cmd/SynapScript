const express = require('express');
const { speak } = require('../modules/speaker');

const router = express.Router();

router.get('/speak', async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text to speak is required.' });
  }

  try {
    await speak(text);
    res.json({ success: true, message: `Spoke: "${text}"` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

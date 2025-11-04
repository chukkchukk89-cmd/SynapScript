const { exec } = require('child_process');

/**
 * Speaks the given text using the Termux TTS engine.
 * @param {string} text The text to speak.
 * @returns {Promise<void>}
 */
function speak(text) {
  return new Promise((resolve, reject) => {
    if (!text) {
      return reject(new Error('Text to speak cannot be empty.'));
    }

    const command = `termux-tts-speak "${text}"`;
    console.log(`Executing TTS command: ${command}`);

    let timeoutId; // To store the timeout ID

    // Manual timeout implementation
    timeoutId = setTimeout(() => {
      // exec doesn't return a child process object directly for killing, so we just reject
      reject(new Error('TTS command timed out after 5 seconds.'));
    }, 5000); // 5 second timeout

    exec(command, (error, stdout, stderr) => {
      clearTimeout(timeoutId); // Clear the timeout if the process completes

      if (stdout) {
        console.log(`termux-tts-speak stdout: ${stdout.trim()}`);
      }
      if (stderr) {
        console.error(`termux-tts-speak stderr: ${stderr.trim()}`);
      }

      if (error) {
        console.error(`Error executing termux-tts-speak: ${error.message}`);
        return reject(new Error(`TTS command failed: ${error.message}. Stderr: ${stderr.trim()}`));
      }
      resolve();
    });
  });
}

module.exports = { speak };

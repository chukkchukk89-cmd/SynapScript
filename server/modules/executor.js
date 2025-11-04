const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function executeTermuxCommand(command, timeout = 5000) {
  let timer;
  const timeoutPromise = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Command timed out after ${timeout}ms: ${command}`));
    }, timeout);
  });

  try {
    const { stdout, stderr } = await Promise.race([
      execPromise(command),
      timeoutPromise
    ]);
    clearTimeout(timer);
    if (stderr) {
      console.error(`Stderr for command "${command}":`, stderr);
    }
    return { stdout, stderr };
  } catch (error) {
    clearTimeout(timer);
    console.error(`Error executing command "${command}":`, error);
    throw error;
  }
}

module.exports = {
  executeTermuxCommand
};

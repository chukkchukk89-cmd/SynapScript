// backend/src/execution.js

const { exec } = require('child_process');
const { broadcast } = require('./websocket');

function execute(steps) {
  let currentStep = 0;

  function runNextStep() {
    if (currentStep >= steps.length) {
      broadcast({ type: 'automation-complete' });
      return;
    }

    const step = steps[currentStep];
    step.status = 'in-progress';
    broadcast({ type: 'step-update', step, stepIndex: currentStep });

    if (!step.command) {
        step.status = 'completed';
        broadcast({ type: 'step-update', step, stepIndex: currentStep });
        currentStep++;
        runNextStep();
        return;
    }

    const child = exec(step.command);

    child.stdout.on('data', (data) => {
      broadcast({ type: 'log', message: data.toString() });
    });

    child.stderr.on('data', (data) => {
      broadcast({ type: 'log', message: `ERROR: ${data.toString()}` });
    });

    child.on('close', (code) => {
      if (code === 0) {
        step.status = 'completed';
      } else {
        step.status = 'failed';
      }
      broadcast({ type: 'step-update', step, stepIndex: currentStep });

      if (code !== 0) {
        // Stop execution on failure
        broadcast({ type: 'automation-failed', message: `Step failed with exit code ${code}` });
        return;
      }

      currentStep++;
      runNextStep();
    });
  }

  runNextStep();
}

module.exports = { execute };

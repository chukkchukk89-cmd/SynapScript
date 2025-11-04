import React, { useState } from 'react';
import '../styles/main.css';
import CommandInput from './components/CommandInput';
import AutomationCard from './components/AutomationCard';
import StatusTimeline from './components/StatusTimeline';
import LogViewer from './components/LogViewer';
import WebSocketManager from './components/WebSocketManager';

function App() {
  const [lastCommand, setLastCommand] = useState('');
  const [automation, setAutomation] = useState(null);
  const [steps, setSteps] = useState([]);
  const [logs, setLogs] = useState([]);

  const handleSendCommand = async (command) => {
    setLastCommand(command);
    setAutomation(null);
    setSteps([]);
    setLogs([]);

    try {
      const response = await fetch('http://localhost:3001/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      const data = await response.json();
      console.log('Backend response:', data);

      const { emoji, title, description, steps } = data;
      setAutomation({ emoji, title, description });
      setSteps(steps);

    } catch (error) {
      console.error('Error sending command:', error);
      setAutomation({
        emoji: '🔥',
        title: 'Error',
        description: 'An error occurred while sending the command.',
      });
      setSteps([{ label: 'Error sending command', status: 'failed' }]);
    }
  };

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'step-update':
        setSteps((prevSteps) => {
          const newSteps = [...prevSteps];
          newSteps[message.stepIndex] = message.step;
          return newSteps;
        });
        break;
      case 'log':
        setLogs((prevLogs) => [...prevLogs, message.message]);
        break;
      case 'automation-complete':
        console.log('Automation complete');
        break;
      case 'automation-failed':
        console.error('Automation failed:', message.message);
        break;
      default:
        console.warn('Unknown WebSocket message type:', message.type);
    }
  };

  return (
    <div className="App">
       <WebSocketManager onMessage={handleWebSocketMessage} />
      <header className="App-header">
        <h1>SynapScript</h1>
        <p>What can I automate for you?</p>
      </header>
      <CommandInput onSendCommand={handleSendCommand} />
      {lastCommand && <p>Last command: {lastCommand}</p>}

      {automation && <AutomationCard automation={automation} />}
      {steps.length > 0 && <StatusTimeline steps={steps} />}
      {logs.length > 0 && <LogViewer logs={logs} />}

    </div>
  );
}

export default App;

import React, { useState } from 'react';

function CommandInput({ onSendCommand }) {
  const [command, setCommand] = useState('');

  const handleInputChange = (event) => {
    setCommand(event.target.value);
  };

  const handleSendClick = () => {
    if (command.trim()) {
      onSendCommand(command);
      setCommand('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendClick();
    }
  };

  return (
    <div className="command-input">
      <input
        type="text"
        value={command}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Describe the task you want to accomplish..."
      />
      <button onClick={handleSendClick}>Send</button>
    </div>
  );
}

export default CommandInput;

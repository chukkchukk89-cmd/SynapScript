import React, { useEffect, useRef } from 'react';

function WebSocketManager({ onMessage, onOpen, onClose }) {
  const ws = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      if (onOpen) {
        onOpen();
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
      if (onMessage) {
        onMessage(message);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      if (onClose) {
        onClose();
      }
    };

    // Clean up the connection when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onMessage, onOpen, onClose]);

  // This component doesn't render anything
  return null;
}

export default WebSocketManager;

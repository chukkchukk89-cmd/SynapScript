import React from 'react';
import '../../styles/components/LogViewer.css';

function LogViewer({ logs }) {
  return (
    <div className="log-viewer">
      <h3>Logs</h3>
      <pre>
        {logs.join('')}
      </pre>
    </div>
  );
}

export default LogViewer;

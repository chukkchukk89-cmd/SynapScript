import React from 'react';

function StatusTimeline({ steps }) {
  return (
    <div className="status-timeline">
      <ul>
        {steps.map((step, index) => (
          <li key={index} className={step.status}>
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StatusTimeline;
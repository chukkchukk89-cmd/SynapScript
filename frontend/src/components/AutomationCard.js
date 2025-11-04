import React from 'react';

function AutomationCard({ automation }) {
  return (
    <div className="automation-card">
      <div className="automation-card-emoji">{automation.emoji}</div>
      <div className="automation-card-info">
        <h3>{automation.title}</h3>
        <p>{automation.description}</p>
      </div>
    </div>
  );
}

export default AutomationCard;
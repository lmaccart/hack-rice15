import React, { useState, useEffect } from 'react';
import './Components.css';

function CreditUniversity() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    // In a real application, fetch modules from the backend
    setModules([
      { id: 1, title: 'What is Credit?', content: 'Credit is a contractual agreement in which a borrower receives something of value now and agrees to repay the lender at a later date—generally with interest.' },
      { id: 2, title: 'How to Improve Your Credit Score', content: 'To improve your credit score, focus on paying bills on time, keeping credit utilization low, and avoiding new credit applications too frequently.' },
      { id: 3, title: 'Managing Your Income', content: 'Effective income management involves budgeting, saving, and investing to achieve financial goals.' },
    ]);
  }, []);

  return (
    <div className="credit-university-container">
      <h2>credit university</h2>
      <div className="module-list">
        <h3>modules:</h3>
        <ul>
          {modules.map((module) => (
            <li key={module.id} onClick={() => setSelectedModule(module)}>
              {module.title.toLowerCase()}
            </li>
          ))}
        </ul>
      </div>

      {selectedModule && (
        <div className="module-content">
          <h3>{selectedModule.title.toLowerCase()}</h3>
          <p>{selectedModule.content.toLowerCase()}</p>
          <button onClick={() => setSelectedModule(null)}>back to modules</button>
        </div>
      )}
    </div>
  );
}

export default CreditUniversity;

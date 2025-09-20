import React, { useState, useEffect } from 'react';
import './Components.css';

function CreditUniversity({ onClose }) {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/modules');
        if (response.ok) {
          const data = await response.json();
          setModules(data);
        } else {
          console.error('failed to fetch modules:', response.statusText);
        }
      } catch (error) {
        console.error('error fetching modules:', error);
      }
    };
    fetchModules();
  }, []);

  return (
    <div className="credit-university-container">
      <button onClick={onClose} className="close-button">x</button>
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

import React, { useState } from 'react';
import './Onboarding.css';

function Onboarding({ onOnboardingComplete }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, monthlyIncome: parseInt(monthlyIncome) }),
      });

      if (response.ok) {
        console.log('user registered successfully!');
        onOnboardingComplete();
      } else {
        const errorData = await response.json();
        console.error('registration failed:', errorData.error);
        alert(`registration failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('error during registration:', error);
      alert('an error occurred during registration.');
    }
  };

  return (
    <div className="onboarding-container">
      <h1>welcome to financial literacy!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          monthly income:
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            required
          />
        </label>
        <button type="submit">start game</button>
      </form>
    </div>
  );
}

export default Onboarding;

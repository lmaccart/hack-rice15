import React, { useState } from 'react';
import './Components.css';

function CreditScoreCalculator() {
  const [creditUsage, setCreditUsage] = useState('');
  const [paymentHistory, setPaymentHistory] = useState('');
  const [creditAge, setCreditAge] = useState('');
  const [newCredit, setNewCredit] = useState('');
  const [creditScore, setCreditScore] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState('');

  const calculateCreditScore = async (event) => {
    event.preventDefault();
    // Placeholder for credit score calculation logic
    // In a real app, this would be more complex and potentially use a backend API
    const score = 700; // Example score
    setCreditScore(score);

    // Gemini integration
    try {
      const response = await fetch('http://localhost:5001/api/gemini-credit-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creditUsage, paymentHistory, creditAge, newCredit }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeminiResponse(data.advice);
      } else {
        const errorData = await response.json();
        console.error('Gemini integration failed:', errorData.error);
        setGeminiResponse('Could not get advice from Gemini.');
      }
    } catch (error) {
      console.error('Error during Gemini integration:', error);
      setGeminiResponse('An error occurred while contacting Gemini.');
    }
  };

  return (
    <div className="credit-score-calculator-container">
      <h2>credit score calculator</h2>
      <form onSubmit={calculateCreditScore}>
        <label>
          credit usage (%):
          <input
            type="number"
            value={creditUsage}
            onChange={(e) => setCreditUsage(e.target.value)}
            required
          />
        </label>
        <label>
          payment history (good/fair/poor):
          <input
            type="text"
            value={paymentHistory}
            onChange={(e) => setPaymentHistory(e.target.value)}
            required
          />
        </label>
        <label>
          credit age (years):
          <input
            type="number"
            value={creditAge}
            onChange={(e) => setCreditAge(e.target.value)}
            required
          />
        </label>
        <label>
          new credit (recent applications):
          <input
            type="number"
            value={newCredit}
            onChange={(e) => setNewCredit(e.target.value)}
            required
          />
        </label>
        <button type="submit">calculate score & get advice</button>
      </form>

      {creditScore && (
        <div className="credit-score-result">
          <h3>estimated credit score: {creditScore}</h3>
          <h4>gemini's advice:</h4>
          <p>{geminiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default CreditScoreCalculator;

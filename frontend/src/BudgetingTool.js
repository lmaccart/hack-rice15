import React, { useState, useEffect } from 'react';
import './Components.css';

function BudgetingTool({ onClose }) {
  const [expenses, setExpenses] = useState([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const userId = localStorage.getItem('user_uid');

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5001/api/budget/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        } else {
          console.error('failed to fetch expenses:', response.statusText);
        }
      } catch (error) {
        console.error('error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, [userId]);

  const handleAddExpense = async (event) => {
    event.preventDefault();
    if (newExpenseName && newExpenseAmount && userId) {
      try {
        const response = await fetch('http://localhost:5001/api/budget', {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ userId, name: newExpenseName, amount: parseFloat(newExpenseAmount) }),
        });

        if (response.ok) {
          console.log('budget entry added successfully!');
          setExpenses([...expenses, { name: newExpenseName, amount: parseFloat(newExpenseAmount) }]);
          setNewExpenseName('');
          setNewExpenseAmount('');
          // refetch expenses to get timestamp and id
          const updatedResponse = await fetch(`http://localhost:5001/api/budget/${userId}`);
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json();
            setExpenses(updatedData);
          }
        } else {
          const errorData = await response.json();
          console.error('failed to add budget entry:', errorData.error);
        }
      } catch (error) {
        console.error('error adding budget entry:', error);
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="budgeting-tool-container">
      <button onClick={onClose} className="close-button">x</button>
      <h2>budgeting tool</h2>
      <form onSubmit={handleAddExpense}>
        <label>
          expense name:
          <input
            type="text"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            required
          />
        </label>
        <label>
          amount:
          <input
            type="number"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            required
          />
        </label>
        <button type="submit">add expense</button>
      </form>

      <h3>your expenses:</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={expense.id || index}>{expense.name}: ${expense.amount.toFixed(2)}</li>
        ))}
      </ul>

      <h3>total monthly expenses: ${totalExpenses.toFixed(2)}</h3>
    </div>
  );
}

export default BudgetingTool;

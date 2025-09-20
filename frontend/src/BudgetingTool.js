import React, { useState } from 'react';
import './Components.css';

function BudgetingTool() {
  const [expenses, setExpenses] = useState([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const handleAddExpense = (event) => {
    event.preventDefault();
    if (newExpenseName && newExpenseAmount) {
      setExpenses([...expenses, { name: newExpenseName, amount: parseFloat(newExpenseAmount) }]);
      setNewExpenseName('');
      setNewExpenseAmount('');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="budgeting-tool-container">
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
          <li key={index}>{expense.name}: ${expense.amount.toFixed(2)}</li>
        ))}
      </ul>

      <h3>total monthly expenses: ${totalExpenses.toFixed(2)}</h3>
    </div>
  );
}

export default BudgetingTool;

import React, { useState } from 'react';
import './Onboarding.css';

function Onboarding({ onOnboardingComplete }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // new state for password
  const [name, setName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [isLogin, setIsLogin] = useState(false); // new state to toggle between login and register

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = isLogin ? 'http://localhost:5001/api/login' : 'http://localhost:5001/api/register';
    const body = isLogin ? { email, password } : { email, password, name, monthlyIncome: parseInt(monthlyIncome) };

    try {
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(isLogin ? 'user logged in successfully!' : 'user registered successfully!', data.uid);
        localStorage.setItem('user_uid', data.uid);
        onOnboardingComplete();
      } else {
        const errorData = await response.json();
        console.error(isLogin ? 'login failed:' : 'registration failed:', errorData.error);
        alert(`${isLogin ? 'login failed:' : 'registration failed:'} ${errorData.error}`);
      }
    } catch (error) {
      console.error(isLogin ? 'error during login:' : 'error during registration:', error);
      alert(`an error occurred during ${isLogin ? 'login' : 'registration'}.`);
    }
  };

  return (
    <div className="onboarding-container">
      <h1>welcome to creditro!</h1>
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
          password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {!isLogin && (
          <>
            <label>
              name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            {/* <label>
              monthly income:
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
              />
            </label> */}
          </>
        )}
        <button type="submit">{isLogin ? 'login' : 'start game'}</button>
      </form>
      <p>
        {isLogin ? 'new player? ' : 'already have an account? '}
        <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? 'register' : 'login'}
        </span>
      </p>
    </div>
  );
}

export default Onboarding;

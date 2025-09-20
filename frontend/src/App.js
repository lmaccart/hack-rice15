import React, { useState } from 'react';
import './App.css';
import Onboarding from './Onboarding';
import Game from './Game';

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  return (
    <div className="App">
      {onboardingComplete ? (
        <Game />
      ) : (
        <Onboarding onOnboardingComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}

export default App;

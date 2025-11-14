'use client';

import { useState } from 'react';
import { useGameState } from '@/contexts/GameStateContext';

interface Scenario {
  id: number;
  title: string;
  description: string;
  isScam: boolean;
  explanation: string;
  redFlags?: string[];
}

interface SpotTheScamProps {
  onClose: () => void;
}

export default function SpotTheScam({ onClose }: SpotTheScamProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({});
  const [showResults, setShowResults] = useState(false);
  const { addCoins, addXP } = useGameState();

  const scenarios: Scenario[] = [
    {
      id: 1,
      title: 'Email from Bank',
      description: 'You receive an email claiming to be from your bank asking you to click a link to verify your account information due to "suspicious activity".',
      isScam: true,
      explanation: 'This is a phishing scam. Banks never ask for account information via email. Always contact your bank directly using official phone numbers or visit a branch.',
      redFlags: ['Urgency tactics', 'Asking for sensitive info via email', 'Suspicious links']
    },
    {
      id: 2,
      title: 'Credit Card Statement',
      description: 'You receive your monthly credit card statement in the mail showing your recent purchases and minimum payment due.',
      isScam: false,
      explanation: 'This is legitimate. Regular billing statements from your credit card company are normal and expected.',
    },
    {
      id: 3,
      title: 'IRS Phone Call',
      description: 'You get a call from someone claiming to be from the IRS saying you owe back taxes and threatening arrest if you don\'t pay immediately via gift cards.',
      isScam: true,
      explanation: 'This is a scam! The IRS never calls to demand immediate payment, threatens arrest, or requests payment via gift cards. They communicate through official mail.',
      redFlags: ['Threatening arrest', 'Immediate payment demand', 'Payment via gift cards']
    },
    {
      id: 4,
      title: 'Savings Account Interest',
      description: 'Your bank automatically deposits monthly interest into your savings account based on your balance.',
      isScam: false,
      explanation: 'This is legitimate. Banks regularly pay interest on savings accounts as stated in your account agreement.',
    },
    {
      id: 5,
      title: 'Investment Opportunity',
      description: 'A stranger on social media messages you about a "guaranteed" investment opportunity that will "triple your money" in 30 days with "zero risk".',
      isScam: true,
      explanation: 'Classic investment scam! No legitimate investment is guaranteed or risk-free. Be extremely wary of unsolicited investment offers, especially on social media.',
      redFlags: ['Guaranteed returns', 'No risk claims', 'Unsolicited contact', 'Too good to be true']
    },
    {
      id: 6,
      title: 'Credit Score Monitoring',
      description: 'You use AnnualCreditReport.com (the official free site) to check your credit report once per year.',
      isScam: false,
      explanation: 'This is legitimate! AnnualCreditReport.com is the official government-authorized site for free credit reports.',
    },
  ];

  const handleAnswer = (isScam: boolean) => {
    setAnswers({ ...answers, [currentScenario]: isScam });
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      // Calculate results
      const correctAnswers = scenarios.filter((scenario, index) =>
        answers[index] === scenario.isScam
      ).length;

      setShowResults(true);

      // Award based on performance
      const percentage = (correctAnswers / scenarios.length) * 100;
      if (percentage === 100) {
        addXP(100);
        addCoins(50);
      } else if (percentage >= 80) {
        addXP(75);
        addCoins(35);
      } else if (percentage >= 60) {
        addXP(50);
        addCoins(25);
      } else {
        addXP(25);
        addCoins(15);
      }
    }
  };

  const calculateScore = () => {
    return scenarios.filter((scenario, index) =>
      answers[index] === scenario.isScam
    ).length;
  };

  const currentAnswer = answers[currentScenario];
  const scenario = scenarios[currentScenario];
  const hasAnswered = currentAnswer !== null && currentAnswer !== undefined;

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / scenarios.length) * 100);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Results</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className={`p-6 rounded-lg border-2 ${
              percentage === 100
                ? 'bg-green-50 border-green-300'
                : percentage >= 80
                ? 'bg-blue-50 border-blue-300'
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <h3 className="text-3xl font-bold mb-4">
                {percentage === 100
                  ? '🛡️ Scam Detection Expert!'
                  : percentage >= 80
                  ? '👍 Well Done!'
                  : '📚 Keep Learning!'}
              </h3>

              <p className="text-2xl font-bold text-gray-800 mb-4">
                Score: {score} / {scenarios.length} ({percentage}%)
              </p>

              <div className="p-4 bg-white rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">Rewards:</p>
                <p className="text-green-600">
                  {percentage === 100
                    ? '+100 XP and +50 coins!'
                    : percentage >= 80
                    ? '+75 XP and +35 coins!'
                    : percentage >= 60
                    ? '+50 XP and +25 coins!'
                    : '+25 XP and +15 coins!'}
                </p>
              </div>
            </div>

            {/* Review Answers */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 text-lg">Review:</h4>
              {scenarios.map((s, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === s.isScam;

                return (
                  <div
                    key={s.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{s.title}</p>
                        <p className="text-sm text-gray-700 mt-1">{s.explanation}</p>
                        {s.redFlags && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-red-700">Red Flags:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {s.redFlags.map((flag, i) => (
                                <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Spot the Scam</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">
              Scenario {currentScenario + 1} of {scenarios.length}
            </span>
            <div className="flex gap-1">
              {scenarios.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < currentScenario
                      ? 'bg-green-500'
                      : index === currentScenario
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Scenario */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-3">{scenario.title}</h3>
            <p className="text-gray-700 leading-relaxed">{scenario.description}</p>
          </div>

          {/* Question */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Is this a scam or legitimate?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className={`py-6 px-6 rounded-lg border-2 font-semibold transition-all ${
                  currentAnswer === true
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50'
                }`}
              >
                <div className="text-3xl mb-2">🚨</div>
                <div>SCAM</div>
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className={`py-6 px-6 rounded-lg border-2 font-semibold transition-all ${
                  currentAnswer === false
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="text-3xl mb-2">✅</div>
                <div>LEGITIMATE</div>
              </button>
            </div>
          </div>

          {/* Feedback */}
          {hasAnswered && (
            <div className={`p-4 rounded-lg ${
              currentAnswer === scenario.isScam
                ? 'bg-green-50 border-2 border-green-300'
                : 'bg-red-50 border-2 border-red-300'
            }`}>
              <p className="font-semibold mb-2">
                {currentAnswer === scenario.isScam ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="text-sm text-gray-700">{scenario.explanation}</p>
              {scenario.redFlags && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Red Flags:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {scenario.redFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={`w-full font-semibold py-3 px-6 rounded-lg shadow-lg transition-all ${
              hasAnswered
                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'See Results'}
          </button>
        </div>
      </div>
    </div>
  );
}

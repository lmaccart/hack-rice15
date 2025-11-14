'use client';

import { useState } from 'react';
import { useGameState } from '@/contexts/GameStateContext';

interface BudgetChallengeProps {
  onClose: () => void;
}

export default function BudgetChallenge({ onClose }: BudgetChallengeProps) {
  const [income, setIncome] = useState(3000);
  const [needs, setNeeds] = useState(1500);
  const [wants, setWants] = useState(900);
  const [savings, setSavings] = useState(600);
  const [showResults, setShowResults] = useState(false);
  const { addCoins, addXP } = useGameState();

  const calculatePercentages = () => {
    const needsPercent = Math.round((needs / income) * 100);
    const wantsPercent = Math.round((wants / income) * 100);
    const savingsPercent = Math.round((savings / income) * 100);
    const total = needs + wants + savings;

    return {
      needsPercent,
      wantsPercent,
      savingsPercent,
      total,
      remaining: income - total
    };
  };

  const handleSubmit = () => {
    const percentages = calculatePercentages();
    const { needsPercent, wantsPercent, savingsPercent, remaining } = percentages;

    // Check how close they are to the 50/30/20 rule
    const needsDiff = Math.abs(needsPercent - 50);
    const wantsDiff = Math.abs(wantsPercent - 30);
    const savingsDiff = Math.abs(savingsPercent - 20);
    const totalDiff = needsDiff + wantsDiff + savingsDiff;

    setShowResults(true);

    // Award based on accuracy
    if (totalDiff <= 5 && remaining >= 0) {
      // Excellent - within 5% total deviation
      addXP(100);
      addCoins(50);
    } else if (totalDiff <= 15 && remaining >= 0) {
      // Good - within 15% total deviation
      addXP(75);
      addCoins(35);
    } else if (remaining >= 0) {
      // Acceptable - at least balanced
      addXP(50);
      addCoins(25);
    } else {
      // Over budget
      addXP(25);
      addCoins(10);
    }
  };

  const percentages = calculatePercentages();
  const { needsPercent, wantsPercent, savingsPercent, total, remaining } = percentages;

  const isBalanced = remaining >= 0;
  const isIdeal =
    Math.abs(needsPercent - 50) <= 5 &&
    Math.abs(wantsPercent - 30) <= 5 &&
    Math.abs(savingsPercent - 20) <= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">50/30/20 Budget Challenge</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!showResults ? (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="font-semibold text-gray-800 mb-2">The 50/30/20 Rule:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>50% Needs:</strong> Rent, utilities, groceries, insurance</li>
                  <li>• <strong>30% Wants:</strong> Entertainment, dining out, hobbies</li>
                  <li>• <strong>20% Savings:</strong> Emergency fund, retirement, debt repayment</li>
                </ul>
              </div>

              {/* Income */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Income: ${income}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="100"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Needs - 50% */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Needs: ${needs}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      Math.abs(needsPercent - 50) <= 5 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {needsPercent}%
                    </span>
                    <span className="text-xs text-gray-500">(Target: 50%)</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={income}
                  step="50"
                  value={needs}
                  onChange={(e) => setNeeds(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${needsPercent}%` }}
                  />
                </div>
              </div>

              {/* Wants - 30% */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Wants: ${wants}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      Math.abs(wantsPercent - 30) <= 5 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {wantsPercent}%
                    </span>
                    <span className="text-xs text-gray-500">(Target: 30%)</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={income}
                  step="50"
                  value={wants}
                  onChange={(e) => setWants(Number(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: `${wantsPercent}%` }}
                  />
                </div>
              </div>

              {/* Savings - 20% */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Savings & Debt: ${savings}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      Math.abs(savingsPercent - 20) <= 5 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {savingsPercent}%
                    </span>
                    <span className="text-xs text-gray-500">(Target: 20%)</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={income}
                  step="50"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${savingsPercent}%` }}
                  />
                </div>
              </div>

              {/* Budget Summary */}
              <div className={`p-4 rounded-lg border-2 ${
                !isBalanced
                  ? 'bg-red-50 border-red-300'
                  : isIdeal
                  ? 'bg-green-50 border-green-300'
                  : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">Total Allocated:</span>
                  <span className="text-lg font-bold">${total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Remaining:</span>
                  <span className={`text-lg font-bold ${
                    remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${remaining}
                  </span>
                </div>
                {isIdeal && isBalanced && (
                  <p className="mt-2 text-sm text-green-700 font-semibold">
                    ✓ Perfect 50/30/20 split!
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isBalanced}
                className={`w-full font-semibold py-3 px-6 rounded-lg shadow-lg transition-all ${
                  isBalanced
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isBalanced ? 'Submit Budget' : 'Balance your budget first!'}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${
                isIdeal
                  ? 'bg-green-50 border-2 border-green-300'
                  : isBalanced
                  ? 'bg-blue-50 border-2 border-blue-300'
                  : 'bg-yellow-50 border-2 border-yellow-300'
              }`}>
                <h3 className="text-2xl font-bold mb-4">
                  {isIdeal
                    ? '🎉 Perfect Budget!'
                    : isBalanced
                    ? '👍 Good Job!'
                    : '💡 Keep Practicing!'}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Needs: {needsPercent}%</span>
                    <span className={Math.abs(needsPercent - 50) <= 5 ? 'text-green-600' : 'text-orange-600'}>
                      Target: 50%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wants: {wantsPercent}%</span>
                    <span className={Math.abs(wantsPercent - 30) <= 5 ? 'text-green-600' : 'text-orange-600'}>
                      Target: 30%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Savings: {savingsPercent}%</span>
                    <span className={Math.abs(savingsPercent - 20) <= 5 ? 'text-green-600' : 'text-orange-600'}>
                      Target: 20%
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Rewards:</p>
                  <p className="text-green-600">
                    {isIdeal
                      ? '+100 XP and +50 coins!'
                      : isBalanced
                      ? `+${Math.abs(needsPercent - 50) + Math.abs(wantsPercent - 30) + Math.abs(savingsPercent - 20) <= 15 ? '75' : '50'} XP and +${Math.abs(needsPercent - 50) + Math.abs(wantsPercent - 30) + Math.abs(savingsPercent - 20) <= 15 ? '35' : '25'} coins`
                      : '+25 XP and +10 coins'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Tips for Success:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• The 50/30/20 rule is a guideline - adjust for your situation</li>
                  <li>• If needs exceed 50%, look for ways to reduce expenses</li>
                  <li>• Always prioritize saving at least 20% when possible</li>
                  <li>• Review and adjust your budget monthly</li>
                </ul>
              </div>

              <button
                onClick={() => setShowResults(false)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

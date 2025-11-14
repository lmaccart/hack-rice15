'use client';

import { useState } from 'react';
import { useGameState } from '@/contexts/GameStateContext';

interface SavingsCalculatorProps {
  onClose: () => void;
}

export default function SavingsCalculator({ onClose }: SavingsCalculatorProps) {
  const [monthlyDeposit, setMonthlyDeposit] = useState(100);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const { addCoins, addXP } = useGameState();

  const calculateSavings = () => {
    const monthlyRate = interestRate / 100 / 12;
    const months = years * 12;

    // Future value of annuity formula
    const futureValue = monthlyDeposit * (
      (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
    );

    const totalDeposited = monthlyDeposit * months;
    const interestEarned = futureValue - totalDeposited;

    return {
      futureValue: Math.round(futureValue),
      totalDeposited: Math.round(totalDeposited),
      interestEarned: Math.round(interestEarned)
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
    // Reward user for using the calculator
    addXP(50);
    addCoins(25);
  };

  const results = showResults ? calculateSavings() : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Savings Calculator</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-700">
            See how your savings can grow over time with compound interest!
          </p>

          {/* Input Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Deposit: ${monthlyDeposit}
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$10</span>
                <span>$1,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Annual Interest Rate: {interestRate}%
              </label>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5%</span>
                <span>15%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Period: {years} years
              </label>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span>40 years</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            Calculate Savings
          </button>

          {/* Results */}
          {results && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Savings Projection</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-semibold text-gray-700">Total Deposited:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${results.totalDeposited.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-semibold text-gray-700">Interest Earned:</span>
                  <span className="text-lg font-bold text-green-600">
                    +${results.interestEarned.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                  <span className="font-semibold text-white">Future Value:</span>
                  <span className="text-2xl font-bold text-white">
                    ${results.futureValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Key Insight:</strong> By saving ${monthlyDeposit} per month for {years} years,
                  you'll earn ${results.interestEarned.toLocaleString()} in interest! That's{' '}
                  {Math.round((results.interestEarned / results.totalDeposited) * 100)}% more than you deposited.
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-green-600 font-semibold">
                  +50 XP and +25 coins for exploring savings!
                </p>
              </div>
            </div>
          )}

          {/* Educational Tips */}
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-gray-800 mb-2">Savings Tips:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Start saving early - compound interest works best over time</li>
              <li>• Even small monthly deposits add up significantly</li>
              <li>• Higher interest rates mean faster growth</li>
              <li>• Make saving automatic with direct deposit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

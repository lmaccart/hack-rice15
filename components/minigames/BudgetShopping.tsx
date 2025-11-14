'use client';

import { useState } from 'react';
import { useGameState } from '@/contexts/GameStateContext';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  isNeed: boolean;
}

interface BudgetShoppingProps {
  onClose: () => void;
}

export default function BudgetShopping({ onClose }: BudgetShoppingProps) {
  const [budget] = useState(200);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [gameComplete, setGameComplete] = useState(false);
  const { addCoins, addXP } = useGameState();

  const items: ShopItem[] = [
    { id: '1', name: 'Groceries (1 week)', price: 80, isNeed: true },
    { id: '2', name: 'Designer Sneakers', price: 150, isNeed: false },
    { id: '3', name: 'Electricity Bill', price: 60, isNeed: true },
    { id: '4', name: 'Video Game', price: 60, isNeed: false },
    { id: '5', name: 'Phone Bill', price: 50, isNeed: true },
    { id: '6', name: 'Movie Tickets', price: 30, isNeed: false },
    { id: '7', name: 'Toiletries', price: 25, isNeed: true },
    { id: '8', name: 'Coffee Shop', price: 20, isNeed: false },
    { id: '9', name: 'Bus Pass', price: 40, isNeed: true },
    { id: '10', name: 'Streaming Subscription', price: 15, isNeed: false },
  ];

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const calculateTotal = () => {
    return items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.price, 0);
  };

  const getSelectedNeeds = () => {
    return items.filter(item => item.isNeed && selectedItems.has(item.id));
  };

  const getAllNeeds = () => {
    return items.filter(item => item.isNeed);
  };

  const handleSubmit = () => {
    const total = calculateTotal();
    const selectedNeeds = getSelectedNeeds();
    const allNeeds = getAllNeeds();

    const isUnderBudget = total <= budget;
    const hasAllNeeds = selectedNeeds.length === allNeeds.length;

    setGameComplete(true);

    if (isUnderBudget && hasAllNeeds) {
      // Perfect score - covered all needs and stayed under budget
      addXP(100);
      addCoins(50);
    } else if (isUnderBudget) {
      // Under budget but missing needs
      addXP(50);
      addCoins(25);
    } else if (hasAllNeeds) {
      // Has all needs but over budget
      addXP(30);
      addCoins(15);
    } else {
      // Tried but needs improvement
      addXP(20);
      addCoins(10);
    }
  };

  const total = calculateTotal();
  const selectedNeeds = getSelectedNeeds();
  const allNeeds = getAllNeeds();
  const isUnderBudget = total <= budget;
  const hasAllNeeds = selectedNeeds.length === allNeeds.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Budget Shopping Challenge</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!gameComplete ? (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="font-semibold text-gray-800 mb-2">Challenge:</p>
                <p className="text-gray-700">
                  You have <strong>${budget}</strong> to spend. Select items that cover all your <strong>needs</strong> first,
                  then add wants if you have money left over. Stay within budget!
                </p>
              </div>

              {/* Budget Display */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-xl font-bold text-gray-900">${budget}</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${total > budget ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className={`text-xl font-bold ${total > budget ? 'text-red-600' : 'text-green-600'}`}>
                    ${total}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className={`text-xl font-bold ${budget - total < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    ${budget - total}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-800">Select Items:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedItems.has(item.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{item.name}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.isNeed
                                ? 'bg-red-100 text-red-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {item.isNeed ? 'Need' : 'Want'}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">${item.price}</p>
                        </div>
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selectedItems.has(item.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedItems.has(item.id) && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Needs Covered:</strong> {selectedNeeds.length} / {allNeeds.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {allNeeds.map(need => (
                    <span
                      key={need.id}
                      className={`text-xs px-2 py-1 rounded ${
                        selectedItems.has(need.id)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {need.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
              >
                Submit Shopping List
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Results */}
              <div className={`p-6 rounded-lg ${
                isUnderBudget && hasAllNeeds
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-yellow-50 border-2 border-yellow-300'
              }`}>
                <h3 className="text-2xl font-bold mb-4">
                  {isUnderBudget && hasAllNeeds
                    ? '🎉 Excellent Budgeting!'
                    : '💡 Good Try!'}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={isUnderBudget ? 'text-green-600' : 'text-red-600'}>
                      {isUnderBudget ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-700">
                      {isUnderBudget
                        ? `Stayed under budget ($${total} / $${budget})`
                        : `Went over budget by $${total - budget}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={hasAllNeeds ? 'text-green-600' : 'text-red-600'}>
                      {hasAllNeeds ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-700">
                      {hasAllNeeds
                        ? 'Covered all essential needs'
                        : `Missing ${allNeeds.length - selectedNeeds.length} essential need(s)`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Rewards:</p>
                  <p className="text-green-600">
                    {isUnderBudget && hasAllNeeds
                      ? '+100 XP and +50 coins!'
                      : isUnderBudget
                      ? '+50 XP and +25 coins'
                      : hasAllNeeds
                      ? '+30 XP and +15 coins'
                      : '+20 XP and +10 coins'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Key Lessons:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Always prioritize needs over wants</li>
                  <li>• Track your spending to stay within budget</li>
                  <li>• Plan purchases before shopping to avoid impulse buys</li>
                  <li>• Save remaining money for emergencies or future goals</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedItems(new Set());
                  setGameComplete(false);
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
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

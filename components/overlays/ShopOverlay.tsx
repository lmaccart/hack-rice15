'use client';

import { useState } from 'react';
import OverlayWrapper from './OverlayWrapper';
import QuizModal from '@/components/QuizModal';
import { quizzes } from '@/lib/quizData';

interface ShopOverlayProps {
  onClose: () => void;
}

export default function ShopOverlay({ onClose }: ShopOverlayProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const quiz = quizzes.shop;

  if (showQuiz) {
    return <QuizModal quiz={quiz} buildingName="shop" onClose={() => setShowQuiz(false)} />;
  }

  return (
    <OverlayWrapper title="Smart Shopping" onClose={onClose}>
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Shopping Habits</h3>
          <p className="text-gray-700 leading-relaxed">
            Learning to shop wisely helps you save money and avoid debt. Good shopping habits
            are essential for financial health.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Needs vs. Wants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Needs</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Food and water</li>
                <li>• Shelter and utilities</li>
                <li>• Basic clothing</li>
                <li>• Healthcare</li>
                <li>• Transportation to work</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Wants</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Entertainment subscriptions</li>
                <li>• Dining out frequently</li>
                <li>• Designer clothes</li>
                <li>• Latest gadgets</li>
                <li>• Luxury items</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Shopping Tips</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Make a shopping list and stick to it</li>
              <li>Compare prices before buying</li>
              <li>Use coupons and look for sales</li>
              <li>Wait 24 hours before impulse purchases</li>
              <li>Buy generic brands when quality is similar</li>
              <li>Avoid shopping when emotional or hungry</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Credit Card Caution</h3>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="text-gray-700 font-medium mb-2">
              Only use credit cards if you can pay the full balance each month!
            </p>
            <p className="text-sm text-gray-600">
              Credit card interest can turn a $100 purchase into much more. If you can't pay cash,
              you probably can't afford it on credit either.
            </p>
          </div>
        </section>

        {/* Quiz Button */}
        <button
          onClick={() => setShowQuiz(true)}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          Test Your Knowledge
        </button>
      </div>
    </OverlayWrapper>
  );
}

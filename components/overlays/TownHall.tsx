'use client';

import { useState } from 'react';
import OverlayWrapper from './OverlayWrapper';
import QuizModal from '@/components/QuizModal';
import { quizzes } from '@/lib/quizData';

interface TownHallProps {
  onClose: () => void;
}

export default function TownHall({ onClose }: TownHallProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const quiz = quizzes.townhall;

  if (showQuiz) {
    return <QuizModal quiz={quiz} buildingName="townhall" onClose={() => setShowQuiz(false)} />;
  }

  return (
    <OverlayWrapper title="Town Hall - Financial Resources" onClose={onClose}>
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Government Financial Programs</h3>
          <p className="text-gray-700 leading-relaxed">
            The government offers various programs to help citizens build financial stability
            and access credit-building services.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Available Resources</h3>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Individual Development Accounts (IDAs)</h4>
              <p className="text-sm text-gray-700">
                Matched savings programs that help low-income individuals save for education,
                home purchase, or starting a business.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">Financial Education Programs</h4>
              <p className="text-sm text-gray-700">
                Free workshops and counseling on budgeting, credit building, and financial planning.
              </p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-800 mb-2">Alternative Credit Reporting</h4>
              <p className="text-sm text-gray-700">
                Programs that help you build credit using rent, utility, and phone payments.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">How to Apply</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-3">
              Contact your local community development office or visit these websites:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Consumer Financial Protection Bureau (CFPB.gov)</li>
              <li>MyMoney.gov</li>
              <li>USA.gov - Financial Assistance</li>
            </ul>
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

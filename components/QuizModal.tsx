'use client';

import { useState } from 'react';
import type { Quiz } from '@/types/userProgress';
import { useGameState } from '@/contexts/GameStateContext';

interface QuizModalProps {
  quiz: Quiz;
  buildingName: string;
  onClose: () => void;
}

export default function QuizModal({ quiz, buildingName, onClose }: QuizModalProps) {
  const { completeQuiz } = useGameState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCompleted(true);
      completeQuiz(buildingName, score + (selectedAnswer === question.correctAnswer ? 1 : 0), quiz.questions.length);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (completed) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const isPerfect = percentage === 100;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{isPerfect ? '🏆' : percentage >= 70 ? '🎉' : '📚'}</div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <div className="text-4xl font-bold text-purple-600 mb-4">{percentage}%</div>
            <p className="text-gray-600 mb-4">
              You got {score} out of {quiz.questions.length} questions correct!
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4">
              <div className="text-sm text-gray-600">Rewards Earned:</div>
              <div className="flex justify-around mt-2">
                <div className="text-center">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-sm font-bold">{Math.floor(percentage * 2)} XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-sm font-bold">{Math.floor(percentage / 10)} Coins</div>
                </div>
              </div>
            </div>

            {isPerfect && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <div className="text-yellow-800 font-semibold">🎯 Perfect Score!</div>
                <div className="text-sm text-yellow-700">You've mastered this topic!</div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{quiz.buildingName} Quiz</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-light leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>Score: {score}/{quiz.questions.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.question}</h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showExplanation && isCorrect;
              const showWrong = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? 'bg-green-50 border-green-500 text-green-900'
                      : showWrong
                      ? 'bg-red-50 border-red-500 text-red-900'
                      : isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showCorrect && <span className="text-2xl ml-2">✓</span>}
                    {showWrong && <span className="text-2xl ml-2">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-2xl mr-2">💡</span>
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Explanation</div>
                  <div className="text-blue-800">{question.explanation}</div>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

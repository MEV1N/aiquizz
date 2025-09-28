import React, { useState } from 'react';
import { Quiz, Question } from '../types/quiz';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizTakingProps {
  quiz: Quiz;
  onSubmit: (answers: Record<string, 'a' | 'b' | 'c' | 'd'>) => void;
  onBack: () => void;
}

export const QuizTaking: React.FC<QuizTakingProps> = ({ quiz, onSubmit, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'a' | 'b' | 'c' | 'd'>>({});

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (questionId: number, answer: 'a' | 'b' | 'c' | 'd') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => prev - 1);
  };

  const canProceed = answers[currentQuestion.id] !== undefined;
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Selection
            </button>
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4 mb-8">
            {Object.entries(currentQuestion.options).map(([key, option]) => (
              <label
                key={key}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  answers[currentQuestion.id] === key
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={key}
                  checked={answers[currentQuestion.id] === key}
                  onChange={() => handleAnswerSelect(currentQuestion.id, key as 'a' | 'b' | 'c' | 'd')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                  answers[currentQuestion.id] === key
                    ? 'border-indigo-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion.id] === key && (
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  )}
                </div>
                <span className="text-gray-900 font-medium">{key.toUpperCase()}.</span>
                <span className="text-gray-700 ml-2">{option}</span>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                canProceed
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastQuestion ? 'Submit Quiz' : 'Next'}
              {!isLastQuestion && <ChevronRight className="h-5 w-5 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
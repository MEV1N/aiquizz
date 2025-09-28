import React from 'react';
import { QuizResult } from '../types/quiz';
import { CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';

interface QuizResultsProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
  onBackToSelection: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ 
  result, 
  onRetakeQuiz, 
  onBackToSelection 
}) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${getScoreGradient(result.percentage)} text-white mb-4`}>
            {result.percentage >= 60 ? (
              <CheckCircle className="h-12 w-12" />
            ) : (
              <XCircle className="h-12 w-12" />
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h1>
          
          <p className="text-xl text-gray-600 mb-4">
            {result.quiz.title}
          </p>

          <div className={`text-5xl font-bold ${getScoreColor(result.percentage)} mb-2`}>
            {result.score} / {result.quiz.questions.length}
          </div>
          
          <div className={`text-2xl font-semibold ${getScoreColor(result.percentage)}`}>
            {result.percentage.toFixed(1)}%
          </div>
        </div>

        {/* Score Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {result.score}
              </div>
              <div className="text-sm text-green-600 font-medium">Correct</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-red-50">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {result.quiz.questions.length - result.score}
              </div>
              <div className="text-sm text-red-600 font-medium">Incorrect</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {result.percentage.toFixed(0)}%
              </div>
              <div className="text-sm text-blue-600 font-medium">Score</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
          
          <div className="space-y-6">
            {result.quiz.questions.map((question, index) => {
              const userAnswer = result.userAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Question {index + 1}: {question.question}
                      </h3>
                      
                      <div className="space-y-2 mb-3">
                        <div className={`p-3 rounded-lg ${
                          userAnswer === question.correctAnswer 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <span className="font-medium">Your answer: </span>
                          <span className="font-semibold">
                            {userAnswer?.toUpperCase()}. {question.options[userAnswer]}
                          </span>
                        </div>
                        
                        {userAnswer !== question.correctAnswer && (
                          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                            <span className="font-medium">Correct answer: </span>
                            <span className="font-semibold">
                              {question.correctAnswer.toUpperCase()}. {question.options[question.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {question.explanation && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <span className="font-medium">Explanation: </span>
                          <span>{question.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeQuiz}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Retake Quiz
          </button>
          
          <button
            onClick={onBackToSelection}
            className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Try Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
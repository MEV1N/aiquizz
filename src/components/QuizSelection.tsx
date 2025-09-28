import React from 'react';
import { Quiz } from '../types/quiz';
import { Brain } from 'lucide-react';

interface QuizSelectionProps {
  quizzes: Quiz[];
  onSelectQuiz: (quiz: Quiz) => void;
  userName: string;
}

export const QuizSelection: React.FC<QuizSelectionProps> = ({ quizzes, onSelectQuiz, userName }) => {
  const quiz = quizzes[0]; // Single mixed quiz

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {userName}!
          </h1>
          <p className="text-xl text-gray-600">
            Ready to test your AI & Machine Learning knowledge?
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-6">
            <Brain className="h-12 w-12" />
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {quiz.title}
          </h3>
          
          <p className="text-gray-600 mb-6 text-lg">
            {quiz.questions.length} comprehensive questions covering AI, Machine Learning, Deep Learning, and Neural Networks
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-800">Format:</span> Multiple choice
              </div>
              <div>
                <span className="font-semibold text-gray-800">Time:</span> No time limit
              </div>
              <div>
                <span className="font-semibold text-gray-800">Questions:</span> {quiz.questions.length} total
              </div>
              <div>
                <span className="font-semibold text-gray-800">Grading:</span> Immediate results
              </div>
            </div>
          </div>

          <button 
            onClick={() => onSelectQuiz(quiz)}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Begin Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { UserForm } from './components/UserForm';
import { QuizSelection } from './components/QuizSelection';
import { QuizTaking } from './components/QuizTaking';
import { QuizResults } from './components/QuizResults';
import { quizzes } from './data/quizzes';
import { UserInfo, Quiz, QuizResult, WebhookPayload } from './types/quiz';
import { sendQuizResult } from './services/googleSheets';

type AppState = 'user-form' | 'quiz-selection' | 'quiz-taking' | 'quiz-results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('user-form');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleUserSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentState('quiz-selection');
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentState('quiz-taking');
  };

  const handleQuizSubmit = async (userAnswers: Record<string, 'a' | 'b' | 'c' | 'd'>) => {
    if (!selectedQuiz || !userInfo) return;

    // Calculate score
    let score = 0;
    selectedQuiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / selectedQuiz.questions.length) * 100;
    const timestamp = new Date().toISOString();

    const result: QuizResult = {
      quiz: selectedQuiz,
      userAnswers,
      score,
      percentage,
      timestamp
    };

    setQuizResult(result);
    setCurrentState('quiz-results');

    // Prepare data for Google Sheets
    const correctAnswers: Record<string, string> = {};
    selectedQuiz.questions.forEach(question => {
      correctAnswers[question.id] = question.correctAnswer;
    });

    const payload: WebhookPayload = {
      timestamp,
      name: userInfo.name,
      quiz: selectedQuiz.title,
      score,
      total: selectedQuiz.questions.length,
      percentage,
      selectedAnswers: Object.fromEntries(
        Object.entries(userAnswers).map(([key, value]) => [key, value])
      ),
      correctAnswers
    };

    // Send to Google Sheets (non-blocking)
    sendQuizResult(payload).catch(error => {
      console.error('Failed to save quiz result:', error);
    });
  };

  const handleRetakeQuiz = () => {
    setCurrentState('quiz-taking');
  };

  const handleBackToSelection = () => {
    setSelectedQuiz(null);
    setQuizResult(null);
    setCurrentState('quiz-selection');
  };

  const handleBackToQuizSelection = () => {
    setSelectedQuiz(null);
    setCurrentState('quiz-selection');
  };

  switch (currentState) {
    case 'user-form':
      return <UserForm onSubmit={handleUserSubmit} />;
    
    case 'quiz-selection':
      return (
        <QuizSelection 
          quizzes={quizzes} 
          onSelectQuiz={handleQuizSelect}
          userName={userInfo?.name || ''}
        />
      );
    
    case 'quiz-taking':
      return selectedQuiz ? (
        <QuizTaking 
          quiz={selectedQuiz}
          onSubmit={handleQuizSubmit}
          onBack={handleBackToQuizSelection}
        />
      ) : null;
    
    case 'quiz-results':
      return quizResult ? (
        <QuizResults 
          result={quizResult}
          onRetakeQuiz={handleRetakeQuiz}
          onBackToSelection={handleBackToSelection}
        />
      ) : null;
    
    default:
      return <UserForm onSubmit={handleUserSubmit} />;
  }
}

export default App;
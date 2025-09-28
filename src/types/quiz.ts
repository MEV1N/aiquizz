export interface Question {
  id: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface UserInfo {
  name: string;
}

export interface QuizResult {
  quiz: Quiz;
  userAnswers: Record<string, 'a' | 'b' | 'c' | 'd'>;
  score: number;
  percentage: number;
  timestamp: string;
}

export interface WebhookPayload {
  timestamp: string;
  name: string;
  quiz: string;
  score: number;
  total: number;
  percentage: number;
  selectedAnswers: Record<string, string>;
  correctAnswers: Record<string, string>;
}
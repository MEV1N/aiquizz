import { Quiz } from '../types/quiz';

export const quizzes: Quiz[] = [
  {
    id: 'mixed',
    title: 'AI & Machine Learning Knowledge Test',
    questions: [
      // AI Questions
      {
        id: 1,
        question: 'Which of the following is the best definition of Artificial Intelligence?',
        options: {
          a: 'A program that can solve all problems',
          b: 'Machines designed to mimic human intelligence',
          c: 'A database storing human knowledge',
          d: 'Robots that look like humans'
        },
        correctAnswer: 'b',
        explanation: 'AI is about creating machines that can perform tasks requiring human-like intelligence.'
      },
      {
        id: 2,
        question: 'Which is an example of AI in everyday life?',
        options: {
          a: 'A bicycle',
          b: 'Google Maps navigation',
          c: 'A notebook',
          d: 'A hammer'
        },
        correctAnswer: 'b',
        explanation: 'Google Maps uses AI algorithms to calculate optimal routes and predict traffic patterns.'
      },
      {
        id: 3,
        question: 'Which of these fields is not part of AI?',
        options: {
          a: 'Natural Language Processing',
          b: 'Computer Vision',
          c: 'Web Development',
          d: 'Robotics'
        },
        correctAnswer: 'c',
        explanation: 'While web development may use AI tools, it is not inherently an AI field like the others.'
      },
      // ML Questions
      {
        id: 4,
        question: 'What is the main goal of Machine Learning?',
        options: {
          a: 'To hardcode rules into a system',
          b: 'To allow machines to learn from data',
          c: 'To make computers faster',
          d: 'To store large amounts of data'
        },
        correctAnswer: 'b',
        explanation: 'Machine Learning enables systems to automatically learn and improve from experience without being explicitly programmed.'
      },
      {
        id: 5,
        question: 'In supervised learning, the dataset includes:',
        options: {
          a: 'Only inputs',
          b: 'Only outputs',
          c: 'Both inputs and labeled outputs',
          d: 'No labels at all'
        },
        correctAnswer: 'c',
        explanation: 'Supervised learning requires both input data and corresponding labeled outputs to train the model.'
      },
      {
        id: 6,
        question: 'Which of the following is a Machine Learning application?',
        options: {
          a: 'Predicting house prices',
          b: 'Writing HTML code',
          c: 'Sending an email manually',
          d: 'Typing in Word'
        },
        correctAnswer: 'a',
        explanation: 'Predicting house prices involves learning from historical data to make predictions, which is a classic ML application.'
      },
      // Deep Learning Questions
      {
        id: 7,
        question: 'Deep Learning is a subset of:',
        options: {
          a: 'Robotics',
          b: 'Artificial Intelligence',
          c: 'Cloud Computing',
          d: 'Cybersecurity'
        },
        correctAnswer: 'b',
        explanation: 'Deep Learning is a specialized branch of Machine Learning, which is itself a subset of AI.'
      },
      {
        id: 8,
        question: 'What makes Deep Learning "deep"?',
        options: {
          a: 'Use of deep oceans of data',
          b: 'Use of multiple layers in neural networks',
          c: 'Use of deep programming languages',
          d: 'Use of large storage devices'
        },
        correctAnswer: 'b',
        explanation: 'The "deep" in Deep Learning refers to neural networks with many hidden layers (typically 3 or more).'
      },
      {
        id: 9,
        question: 'Which tool/library is widely used for Deep Learning?',
        options: {
          a: 'MS Excel',
          b: 'TensorFlow',
          c: 'Photoshop',
          d: 'Blender'
        },
        correctAnswer: 'b',
        explanation: 'TensorFlow is a popular open-source library developed by Google for machine learning and deep learning applications.'
      },
      // Neural Networks Questions
      {
        id: 10,
        question: 'The basic unit of a neural network is called:',
        options: {
          a: 'Cell',
          b: 'Neuron',
          c: 'Pixel',
          d: 'Chip'
        },
        correctAnswer: 'b',
        explanation: 'A neuron (or perceptron) is the fundamental processing unit in a neural network, inspired by biological neurons.'
      },
      {
        id: 11,
        question: 'In a neural network, the function that decides if a neuron should "fire" or not is called:',
        options: {
          a: 'Loss function',
          b: 'Activation function',
          c: 'Cost function',
          d: 'Transfer protocol'
        },
        correctAnswer: 'b',
        explanation: 'The activation function determines the output of a neuron based on its inputs, controlling when it should activate.'
      },
      {
        id: 12,
        question: 'Which type of neural network is mainly used for image recognition?',
        options: {
          a: 'Convolutional Neural Network (CNN)',
          b: 'Recurrent Neural Network (RNN)',
          c: 'Feed-forward Network',
          d: 'Decision Tree'
        },
        correctAnswer: 'a',
        explanation: 'CNNs are specifically designed for processing grid-like data such as images, making them ideal for image recognition tasks.'
      }
    ]
  }
];
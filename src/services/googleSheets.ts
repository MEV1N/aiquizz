import { WebhookPayload } from '../types/quiz';

export const sendQuizResult = async (payload: WebhookPayload): Promise<boolean> => {
  try {
    // Use our serverless endpoint
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to save quiz result:', response.status, errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Quiz result saved successfully:', result);
    return result.success;
    
  } catch (error) {
    console.error('Error sending quiz result:', error);
    
    // Log the payload for debugging
    console.log('Quiz result payload:', payload);
    
    return false;
  }
};


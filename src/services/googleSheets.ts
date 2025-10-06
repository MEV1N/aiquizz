import { WebhookPayload } from '../types/quiz';

export const sendQuizResult = async (payload: WebhookPayload): Promise<boolean> => {
  try {
    // Save to Supabase database via our API
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
    if (result.success) {
      console.log('Quiz result saved successfully to database:', result);
      return true;
    } else {
      console.error('Quiz result save failed:', result);
      return false;
    }
    
  } catch (error) {
    console.error('Error sending quiz result:', error);
    console.log('Quiz result payload that failed:', payload);
    return false;
  }
};


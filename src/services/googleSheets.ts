import { WebhookPayload } from '../types/quiz';

// Configuration - Replace these placeholders before deployment
const WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Replace with your Apps Script URL
const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your Google Sheet ID (only needed for direct API access)

export const sendQuizResult = async (payload: WebhookPayload): Promise<boolean> => {
  try {
    // Option 1: Google Apps Script Webhook (Recommended)
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return true;
    
  } catch (error) {
    // For development/testing: show alert with the payload
    if (WEBHOOK_URL.includes('YOUR_SCRIPT_ID')) {
      console.log('Quiz result ready to send:', payload);
      console.log('Please configure WEBHOOK_URL in src/services/googleSheets.ts');
    }
    
    return false;
  }
};

// Alternative: Direct Google Sheets API (requires backend)
export const sendViaAPI = async (payload: WebhookPayload): Promise<boolean> => {
  try {
    // This should be called from your backend, not directly from the client
    // to avoid exposing service account credentials
    const response = await fetch('/api/submit-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send via API:', error);
    return false;
  }
};
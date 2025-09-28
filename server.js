/**
 * Node.js Backend for Quiz App - Google Sheets API Integration
 * 
 * This is an alternative to Google Apps Script for production environments
 * where you need more control over the backend logic.
 * 
 * Setup:
 * 1. npm install express google-spreadsheet google-auth-library cors dotenv
 * 2. Create a service account in Google Cloud Console
 * 3. Download the service account JSON file
 * 4. Share your Google Sheet with the service account email
 * 5. Set environment variables (see .env.example)
 */

const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Google Sheets Authentication
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

// Quiz submission endpoint
app.post('/api/submit-quiz', async (req, res) => {
  try {
    console.log('Received quiz submission:', req.body);
    
    // Validate request data
    const { 
      timestamp, 
      name, 
      quiz, 
      score, 
      total, 
      percentage, 
      selectedAnswers, 
      correctAnswers 
    } = req.body;
    
    if (!name || !quiz || typeof score !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    // Initialize Google Sheets document
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log('Connected to Google Sheet:', doc.title);
    
    // Get the first sheet (or create if it doesn't exist)
    let sheet = doc.sheetsByIndex[0];
    
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: 'Quiz Results',
        headerValues: [
          'Timestamp', 
          'Name', 
          'Email', 
          'Quiz Title', 
          'Score', 
          'Total Questions', 
          'Percentage', 
          'Selected Answers', 
          'Correct Answers'
        ]
      });
    }
    
    // Add the quiz result as a new row
    await sheet.addRow([
      timestamp || new Date().toISOString(),
      name,
      quiz,
      score,
      total,
      percentage,
      JSON.stringify(selectedAnswers || {}),
      JSON.stringify(correctAnswers || {})
    ]);
    
    console.log('Successfully added quiz result to Google Sheet');
    
    res.json({ 
      success: true, 
      message: 'Quiz result saved successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error saving quiz result:', error);
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint for Google Sheets connection
app.get('/api/test-sheets', async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    res.json({
      success: true,
      sheetTitle: doc.title,
      sheetId: doc.spreadsheetId,
      sheetsCount: doc.sheetCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Google Sheet ID:', process.env.GOOGLE_SHEET_ID ? 'Configured' : 'Missing');
  console.log('Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Configured' : 'Missing');
});
/**
 * Google Apps Script for Quiz Results Webhook
 * 
 * Setup Instructions:
 * 1. Create a Google Sheet with these column headers in row 1:
 *    Timestamp | Name | Email | Quiz Title | Score | Total Questions | Percentage | Selected Answers | Correct Answers
 * 
 * 2. Replace YOUR_SHEET_ID below with your actual Google Sheet ID
 * 3. In Apps Script: Deploy > New Deployment > Web app
 * 4. Execute as: Me, Access: Anyone even anonymous
 * 5. Copy the web app URL to your React app's googleSheets.ts file
 */

function doPost(e) {
  try {
    // Replace with your actual Google Sheet ID
    const SHEET_ID = 'YOUR_SHEET_ID';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    console.log('Received quiz data:', data);
    
    // Validate required fields
    if (!data.name || !data.quiz || typeof data.score !== 'number') {
      throw new Error('Missing required fields');
    }
    
    // Prepare row data in the exact order expected by the sheet
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name,
      data.quiz,
      data.score,
      data.total,
      data.percentage,
      JSON.stringify(data.selectedAnswers || {}),
      JSON.stringify(data.correctAnswers || {})
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    console.log('Successfully added row to sheet');
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Quiz result saved successfully',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('Error processing quiz result:', error);
    
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function doGet(e) {
  // Handle CORS preflight requests and test endpoint
  return ContentService
    .createTextOutput('Quiz Results Webhook is working! Ready to receive POST requests.')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

function doOptions(e) {
  // Handle CORS preflight OPTIONS requests
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}
# Quiz Web App with Google Sheets Integration

A responsive, single-page quiz application built with React, TypeScript, and Tailwind CSS. Features a comprehensive mixed quiz covering AI, Machine Learning, Deep Learning, and Neural Networks with automatic Google Sheets result logging.

## Features

- 🧠 **Comprehensive Mixed Quiz**: 12 questions covering AI, Machine Learning, Deep Learning, Neural Networks
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ✅ **Immediate Grading**: Instant results with detailed explanations
- 📊 **Google Sheets Integration**: Automatic result logging via webhook or API
- 🎯 **Progress Tracking**: Visual progress indicators during quiz
- 🔐 **Input Validation**: Name required
- ♿ **Accessible**: Semantic HTML and keyboard navigation support

## Quick Start

### 1. Local Development

```bash
# Clone the repository
git clone <repository-url>
cd quiz-web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 2. Google Sheets Setup

#### Option A: Google Apps Script (Recommended)

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Add these column headers in row 1:
     ```
     Timestamp | Name | Quiz Title | Score | Total Questions | Percentage | Selected Answers | Correct Answers
     ```

2. **Setup Apps Script**:
   - In your Google Sheet, go to `Extensions > Apps Script`
   - Replace the default code with the script from `google-apps-script.js` (see below)
   - Replace `YOUR_SHEET_ID` with your actual Sheet ID (found in the URL)
   - Save the project

3. **Deploy as Web App**:
   - Click `Deploy > New Deployment`
   - Choose type: `Web app`
   - Execute as: `Me`
   - Who has access: `Anyone, even anonymous`
   - Click `Deploy`
   - Copy the Web App URL

4. **Configure the App**:
   - Open `src/services/googleSheets.ts`
   - Replace `YOUR_SCRIPT_ID` in `WEBHOOK_URL` with your Web App URL

#### Option B: Google Sheets API with Backend

1. **Setup Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create service account credentials
   - Download the JSON key file

2. **Configure Backend**:
   - Use the provided `server.js` example
   - Place your service account JSON file in the project
   - Update environment variables

3. **Share Sheet with Service Account**:
   - Open your Google Sheet
   - Share with the service account email (from JSON file)
   - Give "Editor" permissions

### 3. Configuration Files

#### Update Google Sheets Service (`src/services/googleSheets.ts`):
```typescript
const WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec';
const SHEET_ID = 'YOUR_ACTUAL_SHEET_ID';
```

## Deployment Options

### GitHub Pages
```bash
# Build the app
npm run build

# Deploy to GitHub Pages
npm install -g gh-pages
gh-pages -d dist
```

### Netlify
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Google Apps Script Code

Create this script in Google Apps Script (replace `YOUR_SHEET_ID`):

```javascript
function doPost(e) {
  try {
    const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your actual Sheet ID
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    const data = JSON.parse(e.postData.contents);
    
    // Prepare row data matching the expected format
    const rowData = [
      data.timestamp,
      data.name,
      data.email,
      data.quiz,
      data.score,
      data.total,
      data.percentage,
      JSON.stringify(data.selectedAnswers),
      JSON.stringify(data.correctAnswers)
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Quiz webhook endpoint is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## Backend Example (server.js)

For production use with Google Sheets API:

```javascript
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configure these environment variables
const SHEET_ID = process.env.SHEET_ID;
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/api/submit-quiz', async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    const { 
      timestamp, name, email, quiz, score, total, percentage, 
      selectedAnswers, correctAnswers 
    } = req.body;
    
    await sheet.addRow([
      timestamp,
      name,
      email,
      quiz,
      score,
      total,
      percentage,
      JSON.stringify(selectedAnswers),
      JSON.stringify(correctAnswers)
    ]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never expose service account private keys in client-side code**
2. **Use the Google Apps Script webhook method for simpler, secure deployment**
3. **For production with direct API access, always use a backend server**
4. **Validate and sanitize all inputs on the server side**

## Data Format

### Webhook Payload
```json
{
  "timestamp": "2025-01-23T12:34:56Z",
  "name": "John Doe",
  "quiz": "AI & Machine Learning Knowledge Test",
  "score": 2,
  "total": 12,
  "percentage": 16.67,
  "selectedAnswers": {"1":"b","2":"c","3":"a"},
  "correctAnswers": {"1":"b","2":"c","3":"a"}
}
```

### Google Sheet Columns
```
Timestamp | Name | Quiz Title | Score | Total Questions | Percentage | Selected Answers | Correct Answers
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Google Apps Script is deployed with "Anyone, even anonymous" access
2. **Webhook Not Working**: Check that the URL in `googleSheets.ts` matches your deployed Apps Script URL
3. **Sheet Not Updating**: Verify the Sheet ID and that the script has permission to edit

### Development Mode
When `WEBHOOK_URL` contains `YOUR_SCRIPT_ID`, the app will show an alert with the payload instead of sending to Google Sheets.

## Quiz Content

The app includes one comprehensive mixed quiz with 12 questions covering:
- **Artificial Intelligence**: Basic AI concepts and applications (3 questions)
- **Machine Learning**: ML fundamentals and supervised learning (3 questions)
- **Deep Learning**: Neural networks and deep learning frameworks (3 questions)
- **Neural Networks**: Network architecture and components (3 questions)

All questions include detailed explanations for learning purposes.

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend Options**: Google Apps Script or Node.js + Express

## License

MIT License - feel free to use for educational or commercial purposes.
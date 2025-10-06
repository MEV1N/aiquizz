# Quiz Web App with Admin Panel

A responsive, single-page quiz application built with React, TypeScript, and Tailwind CSS. Features a comprehensive mixed quiz covering AI, Machine Learning, Deep Learning, and Neural Networks with automatic result logging and admin leaderboard.

## Features

- 🧠 **Comprehensive Mixed Quiz**: 12 questions covering AI, Machine Learning, Deep Learning, Neural Networks
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ✅ **Immediate Grading**: Instant results with detailed explanations
- 📊 **File-Based Storage**: Automatic result logging to JSON files
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

**Quiz results are automatically saved to local JSON files and displayed in the admin panel!**

### 2. Storage System

**Simple File-Based Storage** - No external services required!

- Quiz results are automatically saved to `/data/quiz-results.json`
- No setup needed - works out of the box
- Results persist between deployments on platforms that support file storage
- Admin panel reads directly from the JSON file

**How it works:**
- When someone completes a quiz, results are saved to `data/quiz-results.json`
- Admin panel fetches data from `/api/leaderboard` which reads the JSON file
- No external APIs, databases, or third-party services required

## Deployment Options

### Vercel (Recommended - supports serverless functions)
1. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel --prod
   ```

2. **No Environment Variables Needed!**:
   - The app uses file-based storage
   - No external service configuration required

3. **Test the Integration**:
   - Take a quiz on your deployed app
   - Check the admin panel - results should appear automatically!

### Netlify (with serverless functions)
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. No environment variables needed!

### GitHub Pages (frontend only - no data persistence)
```bash
# Build the app
npm run build

# Deploy to GitHub Pages
npm install -g gh-pages
gh-pages -d dist
```
Note: GitHub Pages doesn't support serverless functions, so quiz results won't persist.

## File-Based Storage

The app now uses simple JSON file storage:

- **`/data/quiz-results.json`** - Stores all quiz submissions
- **Automatic creation** - File and directory created automatically on first submission
- **No setup required** - Works immediately after deployment
- **Persistent storage** - Results saved permanently (on platforms that support file persistence)

**Example quiz result entry:**
```json
{
  "id": 1634567890123.456,
  "timestamp": "2025-01-23T12:34:56Z",
  "name": "John Doe",
  "email": "john@example.com",
  "quiz": "AI & Machine Learning Knowledge Test",
  "score": 8,
  "total": 12,
  "percentage": 66.67,
  "selectedAnswers": {"1":"b","2":"c"},
  "correctAnswers": {"1":"b","2":"c"},
  "createdAt": "2025-01-23T12:34:56Z"
}
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **Admin panel is password-protected** - Change the default password in `/admin/login.html`
2. **File-based storage is secure** - Quiz results are stored server-side, not client-side
3. **Input validation** - All inputs are validated and sanitized on the server side
4. **No external dependencies** - No third-party services or APIs required

## Data Storage

### File Structure
```
data/
└── quiz-results.json    # All quiz submissions stored here
```

### Data Format
Each quiz result is stored as a JSON object:
```json
{
  "id": 1634567890123.456,
  "timestamp": "2025-01-23T12:34:56Z",
  "name": "John Doe",
  "email": "john@example.com", 
  "quiz": "AI & Machine Learning Knowledge Test",
  "score": 8,
  "total": 12,
  "percentage": 66.67,
  "selectedAnswers": {"1":"b","2":"c"},
  "correctAnswers": {"1":"b","2":"c"},
  "createdAt": "2025-01-23T12:34:56Z"
}
```

## Troubleshooting

### Common Issues

1. **Admin Panel Access**: Make sure you're using the correct password set in `/admin/login.html`
2. **Results Not Saving**: Check that the `/data/` directory has write permissions
3. **Leaderboard Empty**: Ensure at least one quiz has been completed

### Development Mode
Run locally with `npm run dev` and test the complete flow: take a quiz → check admin panel for results.

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
- **Backend**: Serverless functions (Vercel/Netlify compatible)
- **Storage**: File-based JSON storage
- **Admin Panel**: HTML + JavaScript with password protection

## License

MIT License - feel free to use for educational or commercial purposes.

## Admin Panel - Leaderboard

This repo includes a complete **admin panel** at `/admin/` that displays quiz results in a beautiful leaderboard format, separate from the public quiz interface.

### Admin Panel Features

- 🏆 **Leaderboard Display**: Names, quiz titles, scores sorted highest to lowest
- 📊 **Statistics Dashboard**: Total submissions, unique participants, average scores
- 🔍 **Advanced Filtering**: Filter by quiz type, sort by score/date/name, search by name
- 🔐 **Password Protection**: Simple login system to keep results private
- 📱 **Responsive Design**: Works on all devices
- 🔄 **Real-time Data**: Fetches latest results from local storage

### Admin Panel Setup

1. **Files included**:
   - `/admin/login.html` - Password-protected login page
   - `/admin/index.html` - Main leaderboard interface
   - `/admin/admin.js` - Frontend JavaScript
   - `/api/leaderboard.js` - Serverless API to fetch data from JSON files

2. **Change the admin password**:
   - Open `/admin/login.html`
   - Find line: `const ADMIN_PASSWORD = 'quiz_admin_2025';`
   - Change to your secure password

3. **Deploy and access**:
   - Deploy to Vercel/Netlify (same as main quiz)
   - Access at: `https://yourdomain.com/admin/`
   - Login with your password to view leaderboard

### Admin Panel Usage

- **Access**: `https://yourdomain.com/admin/` (password-protected)
- **View Rankings**: See all participants ranked by score
- **Filter Results**: Filter by specific quiz or search by name
- **Sort Options**: Sort by highest score, percentage, date, or name
- **Statistics**: View total submissions, unique participants, average scores
- **Session**: 24-hour login sessions with logout option

## Serverless Endpoints

### `/api/submit.js` - Save Quiz Results

Accepts POST JSON payloads from the quiz app and saves to local JSON file.

**No environment variables required!**

**Example payload:**
```json
{
  "timestamp": "2025-01-23T12:34:56Z",
  "name": "John Doe",
  "email": "john@example.com",
  "quiz": "AI & Machine Learning Knowledge Test",
  "score": 8,
  "total": 12,
  "percentage": 66.67,
  "selectedAnswers": {"1":"b","2":"c"},
  "correctAnswers": {"1":"b","2":"c"}
}
```

### `/api/leaderboard.js` - Fetch Leaderboard Data

Returns JSON with all quiz results sorted by score, plus statistics. Reads from local JSON file.

**Response format:**
```json
{
  "success": true,
  "data": [
    {
      "name": "John Doe",
      "quiz": "AI Quiz",
      "score": 10,
      "total": 12,
      "percentage": 83.33,
      "timestamp": "2025-01-23T12:34:56Z"
    }
  ],
  "stats": {
    "totalSubmissions": 150,
    "uniqueParticipants": 75,
    "averageScore": 72.5,
    "highestScore": 100
  }
}
```
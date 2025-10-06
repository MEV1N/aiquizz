const fs = require('fs').promises;
const path = require('path');

// Helper to ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  return dataDir;
};

// Helper to read quiz results from JSON file
const readQuizResults = async () => {
  try {
    const dataDir = await ensureDataDir();
    const filePath = path.join(dataDir, 'quiz-results.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
};

module.exports = async (req, res) => {
  try {
    // Set CORS headers for admin panel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Read quiz results from JSON file
    const results = await readQuizResults();
    
    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        stats: {
          totalSubmissions: 0,
          uniqueParticipants: 0,
          averageScore: 0,
          highestScore: 0
        }
      });
    }

    // Clean and format the data
    const formattedResults = results.map((result) => {
      return {
        id: result.id,
        timestamp: result.timestamp,
        name: result.name || 'Unknown',
        email: result.email || '',
        quiz: result.quiz || 'Unknown Quiz',
        score: parseInt(result.score) || 0,
        total: parseInt(result.total) || 0,
        percentage: parseFloat(result.percentage) || 0,
        selectedAnswers: result.selectedAnswers || {},
        correctAnswers: result.correctAnswers || {},
        date: result.timestamp ? new Date(result.timestamp).toISOString().split('T')[0] : 'Unknown'
      };
    }).filter(result => result.name && result.name !== 'Unknown');

    // Calculate statistics
    const stats = {
      totalSubmissions: formattedResults.length,
      uniqueParticipants: new Set(formattedResults.map(r => r.name.toLowerCase())).size,
      averageScore: formattedResults.length > 0 ? 
        Math.round((formattedResults.reduce((sum, r) => sum + r.percentage, 0) / formattedResults.length) * 100) / 100 : 0,
      highestScore: formattedResults.length > 0 ? 
        Math.max(...formattedResults.map(r => r.percentage)) : 0
    };

    // Sort by score (highest first) by default
    formattedResults.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      // If same percentage, sort by raw score
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If same score, sort by date (most recent first)
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return res.status(200).json({
      success: true,
      data: formattedResults,
      stats: stats,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard data',
      details: error.message
    });
  }
};
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured. Using fallback data.');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

// Helper to read quiz results from Supabase
const readQuizResults = async () => {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    // Return sample data if Supabase is not configured
    return [
      {
        id: 1,
        name: "Demo User",
        email: "demo@example.com",
        quiz: "AI & Machine Learning Knowledge Test",
        score: 9,
        total: 12,
        percentage: 75,
        selected_answers: {},
        correct_answers: {},
        created_at: new Date().toISOString()
      }
    ];
  }
  
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    // Transform Supabase data to match our format
    return data.map(row => ({
      id: row.id,
      timestamp: row.created_at,
      name: row.name,
      email: row.email || '',
      quiz: row.quiz,
      score: row.score,
      total: row.total,
      percentage: row.percentage,
      selectedAnswers: row.selected_answers || {},
      correctAnswers: row.correct_answers || {},
      date: new Date(row.created_at).toISOString().split('T')[0]
    }));
    
  } catch (error) {
    console.error('Error reading quiz results:', error);
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
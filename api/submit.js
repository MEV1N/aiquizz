const { createClient } = require('@supabase/supabase-js');

// Helper to read raw body when req.body is not populated by the platform
const getRawBody = (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => resolve(data));
  req.on('error', reject);
});

// Initialize Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured. Using fallback storage.');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

// Helper to save quiz result to Supabase
const saveQuizResult = async (result) => {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    console.log('Supabase not available, result saved to logs:', result);
    return { success: true, id: result.id };
  }
  
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([{
        name: result.name,
        email: result.email || '',
        quiz: result.quiz,
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        selected_answers: result.selectedAnswers || {},
        correct_answers: result.correctAnswers || {},
        created_at: result.timestamp || new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    console.log('Quiz result saved to Supabase:', data[0]);
    return { success: true, id: data[0].id };
    
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    return { success: false, error: error.message };
  }
};

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Parse JSON body (platforms like Vercel/Netlify usually parse this for you)
    let payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      const raw = await getRawBody(req);
      if (raw) {
        try {
          payload = JSON.parse(raw);
        } catch (e) {
          // fall through
        }
      }
    }

    if (!payload) {
      return res.status(400).json({ success: false, error: 'Missing JSON body' });
    }

    const {
      timestamp,
      name,
      email,
      quiz,
      score,
      total,
      percentage,
      selectedAnswers,
      correctAnswers,
    } = payload;

    if (!name || !quiz || typeof score !== 'number') {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, quiz, score' });
    }

    // Create new result entry
    const newResult = {
      id: Date.now() + Math.random(), // Simple unique ID
      timestamp: timestamp || new Date().toISOString(),
      name: name,
      email: email || '',
      quiz: quiz,
      score: score,
      total: total || 0,
      percentage: percentage || 0,
      selectedAnswers: selectedAnswers || {},
      correctAnswers: correctAnswers || {},
      createdAt: new Date().toISOString()
    };

    // Save to Supabase
    const result = await saveQuizResult(newResult);

    if (result.success) {
      console.log(`Quiz result saved for ${name}: ${score}/${total} (${percentage}%)`);
      return res.status(200).json({ 
        success: true, 
        message: 'Quiz result saved successfully',
        id: result.id
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to save quiz result',
        details: result.error
      });
    }

  } catch (error) {
    console.error('Error in /api/submit:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save quiz result',
      details: error.message 
    });
  }
};

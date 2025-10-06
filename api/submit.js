const fs = require('fs').promises;
const path = require('path');

// Helper to read raw body when req.body is not populated by the platform
const getRawBody = (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => resolve(data));
  req.on('error', reject);
});

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

// Helper to write quiz results to JSON file
const writeQuizResults = async (results) => {
  const dataDir = await ensureDataDir();
  const filePath = path.join(dataDir, 'quiz-results.json');
  await fs.writeFile(filePath, JSON.stringify(results, null, 2), 'utf8');
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

    // Read existing results
    const results = await readQuizResults();

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

    // Add new result to the array
    results.push(newResult);

    // Write back to file
    await writeQuizResults(results);

    console.log(`Quiz result saved for ${name}: ${score}/${total} (${percentage}%)`);

    return res.status(200).json({ 
      success: true, 
      message: 'Quiz result saved successfully',
      id: newResult.id
    });

  } catch (error) {
    console.error('Error in /api/submit:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save quiz result',
      details: error.message 
    });
  }
};

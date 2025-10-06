// Simple test endpoint to check if API is working
module.exports = async (req, res) => {
  try {
    console.log('Test API called:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });

    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'POST') {
      return res.status(200).json({
        success: true,
        message: 'POST received',
        receivedData: req.body,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Error in test API:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
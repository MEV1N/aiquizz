// Test data initialization endpoint - for demo purposes
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Create some sample quiz results for testing
    const sampleResults = [
      {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        name: "John Doe",
        email: "john@example.com",
        quiz: "AI & Machine Learning Knowledge Test",
        score: 10,
        total: 12,
        percentage: 83.33,
        selectedAnswers: {"1":"b","2":"c","3":"a","4":"b"},
        correctAnswers: {"1":"b","2":"c","3":"a","4":"b"},
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + Math.random() + 1,
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        name: "Jane Smith",
        email: "jane@example.com",
        quiz: "AI & Machine Learning Knowledge Test",
        score: 8,
        total: 12,
        percentage: 66.67,
        selectedAnswers: {"1":"a","2":"c","3":"b","4":"a"},
        correctAnswers: {"1":"b","2":"c","3":"a","4":"b"},
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: Date.now() + Math.random() + 2,
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        name: "Mike Johnson",
        email: "mike@example.com",
        quiz: "AI & Machine Learning Knowledge Test",
        score: 11,
        total: 12,
        percentage: 91.67,
        selectedAnswers: {"1":"b","2":"c","3":"a","4":"b"},
        correctAnswers: {"1":"b","2":"c","3":"a","4":"b"},
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    // You can expand this to actually save the data when you have a database
    console.log('Sample quiz results created:', sampleResults.length);

    return res.status(200).json({
      success: true,
      message: 'Test data created',
      data: sampleResults
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
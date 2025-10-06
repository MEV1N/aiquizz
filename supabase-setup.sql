-- Create quiz_results table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE quiz_results (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  quiz TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  selected_answers JSONB DEFAULT '{}',
  correct_answers JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access" ON quiz_results
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON quiz_results
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_quiz_results_created_at ON quiz_results(created_at DESC);
CREATE INDEX idx_quiz_results_percentage ON quiz_results(percentage DESC);
CREATE INDEX idx_quiz_results_name ON quiz_results(name);

-- Insert some sample data (optional)
INSERT INTO quiz_results (name, email, quiz, score, total, percentage, selected_answers, correct_answers) VALUES
('John Doe', 'john@example.com', 'AI & Machine Learning Knowledge Test', 10, 12, 83.33, '{"1":"b","2":"c","3":"a"}', '{"1":"b","2":"c","3":"a"}'),
('Jane Smith', 'jane@example.com', 'AI & Machine Learning Knowledge Test', 8, 12, 66.67, '{"1":"a","2":"c","3":"b"}', '{"1":"b","2":"c","3":"a"}'),
('Mike Johnson', 'mike@example.com', 'AI & Machine Learning Knowledge Test', 11, 12, 91.67, '{"1":"b","2":"c","3":"a"}', '{"1":"b","2":"c","3":"a"}');
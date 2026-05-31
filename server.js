import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables from a .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS so your frontend application can communicate with this backend
app.use(cors({
  origin: '*' // In production, replace with your specific frontend domain
}));

// Enable JSON parsing for incoming request bodies
app.use(express.json());

// Initialize the official Anthropic client
// It automatically looks for process.env.ANTHROPIC_API_KEY
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/generate
 * Handles prompt routing to the Anthropic API securely
 */
app.post('/api/generate', async (req, res) => {
  const { systemPrompt, userPrompt } = req.body;

  // Basic validation
  if (!userPrompt) {
    return res.status(400).json({ error: 'User prompt is required.' });
  }

  try {
    // Call the Anthropic Messages API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Standard production model
      max_tokens: 1500,
      system: systemPrompt || "You are a helpful coding assistant.",
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });

    // Extract text blocks from the API response layout
    const textOutput = response.content
      .map(block => block.text || '')
      .join('');
    
    // Send the compiled response text back to the browser client
    res.json({ text: textOutput });

  } catch (error) {
    console.error('Anthropic API Error:', error);
    
    // Graceful error responses to pass back to your frontend UI
    res.status(500).json({ 
      error: 'Failed to communicate with AI service.',
      details: error.message 
    });
  }
});

// Start the local development server
app.listen(port, () => {
  console.log(`=================================================`);
  console.log(`  Backend Server running on http://localhost:${port}`);
  console.log(`=================================================`);
});

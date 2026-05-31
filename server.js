import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic Client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Generation Endpoint
app.post('/api/generate', async (req, res) => {
  const { systemPrompt, userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: 'User prompt is required' });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Updated to standard Anthropic production model name
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Extract the text content from the blocks
    const textOutput = response.content.map(block => block.text || '').join('');
    
    res.json({ text: textOutput });
  } catch (error) {
    console.error('Anthropic API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI service.' });
  }
});

app.listen(port, () => {
  console.log(`Server running smoothly on http://localhost:${port}`);
});


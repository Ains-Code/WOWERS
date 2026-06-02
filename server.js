import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ PUT YOUR ACTUAL OPENROUTER KEY INSIDE THESE SINGLE QUOTES:
const OPENROUTER_KEY = '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';

app.post('/api/generate', async (req, res) => {
  try {
    const { systemPrompt, userMessage } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4.6", 
	max_tokens: 100,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenRouter failed connection");
    }

    const textOutput = data.choices[0].message.content;
    res.json({
      content: [{ type: "text", text: textOutput }]
    });

  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with AI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OpenRouter Proxy running on port ${PORT}`));

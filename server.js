import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-1-8b-instruct:free';
const MAX_TOKENS = Number.parseInt(process.env.OPENROUTER_MAX_TOKENS || '1500', 10);

function getOpenRouterKey(req) {
  const headerKey = req.get('x-openrouter-key');
  return (process.env.OPENROUTER_KEY || headerKey || '').trim();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/config', (_req, res) => {
  res.json({ hasServerKey: Boolean(process.env.OPENROUTER_KEY?.trim()) });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { systemPrompt, userMessage, model } = req.body ?? {};
    const openRouterKey = getOpenRouterKey(req);

    if (!openRouterKey) {
      return res.status(401).json({ error: 'Missing OpenRouter key. Set OPENROUTER_KEY on the server or provide one in the app.' });
    }

    if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
      return res.status(400).json({ error: 'systemPrompt is required.' });
    }

    if (typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({ error: 'userMessage is required.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'WOWERS Web Helper Studio'
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        max_tokens: Number.isFinite(MAX_TOKENS) ? MAX_TOKENS : 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        response_format: { type: 'json_object' }
      })
    }).finally(() => clearTimeout(timeout));

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.error?.message || data?.message || 'OpenRouter request failed.';
      return res.status(response.status).json({ error: message });
    }

    const textOutput = data?.choices?.[0]?.message?.content;
    if (typeof textOutput !== 'string' || !textOutput.trim()) {
      return res.status(502).json({ error: 'OpenRouter returned an empty response.' });
    }

    res.json({ content: [{ type: 'text', text: textOutput }] });
  } catch (error) {
    const isAbort = error?.name === 'AbortError';
    console.error('API Proxy Error:', error);
    res.status(isAbort ? 504 : 500).json({ error: isAbort ? 'OpenRouter request timed out.' : error.message || 'Failed to communicate with AI.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WOWERS server running at http://localhost:${PORT}`));

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
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/auto';
const MAX_TOKENS = Number.parseInt(process.env.OPENROUTER_MAX_TOKENS || '1500', 10);

function normalizeOpenRouterKey(value) {
  return String(value || '').trim().replace(/^Bearer\s+/i, '');
}

function getOpenRouterKey(req) {
  const envKey = normalizeOpenRouterKey(process.env.OPENROUTER_KEY);
  const forwardedKey = normalizeOpenRouterKey(req.get('x-openrouter-key'));
  const authorizationKey = normalizeOpenRouterKey(req.get('authorization'));

  return envKey || forwardedKey || authorizationKey;
}

function shouldRetryWithoutJsonMode(status, data) {
  if (status !== 400 && status !== 422) return false;
  const message = String(data?.error?.message || data?.message || '').toLowerCase();
  return message.includes('response_format') || message.includes('json') || message.includes('structured');
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/config', (_req, res) => {
  res.json({ hasServerKey: Boolean(process.env.OPENROUTER_KEY?.trim()) });
});

app.post('/api/generate', async (req, res) => {
  let timeout;

  try {
    const { systemPrompt, userMessage, model } = req.body ?? {};
    const openRouterKey = getOpenRouterKey(req);

    if (!openRouterKey) {
      return res.status(401).json({ error: 'Missing authentication header. Set OPENROUTER_KEY on the server, or provide an OpenRouter key in the app so it can be forwarded as Authorization.' });
    }

    if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
      return res.status(400).json({ error: 'systemPrompt is required.' });
    }

    if (typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({ error: 'userMessage is required.' });
    }

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 45000);

    const requestPayload = {
      model: model || DEFAULT_MODEL,
      max_tokens: Number.isFinite(MAX_TOKENS) ? MAX_TOKENS : 1500,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      response_format: { type: 'json_object' }
    };

    const openRouterHeaders = {
      Authorization: `Bearer ${openRouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'WOWERS Web Helper Studio'
    };

    let response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: openRouterHeaders,
      body: JSON.stringify(requestPayload)
    });

    let data = await response.json().catch(() => ({}));

    if (!response.ok && shouldRetryWithoutJsonMode(response.status, data)) {
      const fallbackPayload = { ...requestPayload };
      delete fallbackPayload.response_format;
      response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: openRouterHeaders,
        body: JSON.stringify(fallbackPayload)
      });
      data = await response.json().catch(() => ({}));
    }

    if (timeout) clearTimeout(timeout);

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
    if (timeout) clearTimeout(timeout);
    const isAbort = error?.name === 'AbortError';
    console.error('API Proxy Error:', error);
    res.status(isAbort ? 504 : 500).json({ error: isAbort ? 'OpenRouter request timed out.' : error.message || 'Failed to communicate with AI.' });
  }
});

const PORT = process.env.PORT || 3000;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => console.log(`WOWERS server running at http://localhost:${PORT}`));
}

export { app, getOpenRouterKey, normalizeOpenRouterKey };

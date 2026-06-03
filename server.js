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

// ✅ API routes BEFORE static middleware so they are never shadowed
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

function getOpenRouterErrorMessage(data, fallback = 'OpenRouter request failed.') {
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.error?.message === 'string') return data.error.message;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.rawText === 'string' && data.rawText.trim()) return data.rawText.trim();
  return fallback;
}

async function readOpenRouterBody(response) {
  const rawText = await response.text().catch(() => '');
  if (!rawText) return {};
  try {
    return JSON.parse(rawText);
  } catch (_parseError) {
    return { rawText };
  }
}

function shouldRetryWithoutJsonMode(status, data) {
  if (status !== 400 && status !== 422) return false;
  const message = getOpenRouterErrorMessage(data, '').toLowerCase();
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
      return res.status(401).json({ error: 'Missing authentication header. Set OPENROUTER_KEY on the server, or provide an OpenRouter key in the app.' });
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

    let data = await readOpenRouterBody(response);

    if (!response.ok && shouldRetryWithoutJsonMode(response.status, data)) {
      console.log('Retrying without JSON mode due to response format error');
      const fallbackPayload = { ...requestPayload };
      delete fallbackPayload.response_format;
      response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: openRouterHeaders,
        body: JSON.stringify(fallbackPayload)
      });
      data = await readOpenRouterBody(response);
    }

    if (timeout) clearTimeout(timeout);

    if (!response.ok) {
      const errorMsg = getOpenRouterErrorMessage(data);
      console.error('OpenRouter API Error:', {
        status: response.status,
        error: errorMsg,
        rawData: data
      });
      return res.status(response.status).json({ error: errorMsg });
    }

    const rawOutput = data?.choices?.[0]?.message?.content;
    
    // Handle both string and array responses
    let textOutput = '';
    if (typeof rawOutput === 'string') {
      textOutput = rawOutput;
    } else if (Array.isArray(rawOutput)) {
      textOutput = rawOutput
        .map(item => (typeof item === 'string' ? item : item?.text || ''))
        .join('');
    }

    if (typeof textOutput !== 'string' || !textOutput.trim()) {
      console.error('Empty OpenRouter response:', data);
      return res.status(502).json({ error: 'OpenRouter returned an empty response.' });
    }

    // Validate JSON response before sending
    try {
      // Try to parse to ensure it's valid JSON
      JSON.parse(textOutput.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim());
    } catch (parseErr) {
      console.warn('OpenRouter response is not valid JSON:', {
        error: parseErr.message,
        responseLength: textOutput.length,
        preview: textOutput.slice(0, 200)
      });
      // Still send it, let the client handle the error
    }

    res.json({ 
      content: [{ 
        type: 'text', 
        text: textOutput 
      }] 
    });
  } catch (error) {
    if (timeout) clearTimeout(timeout);
    const isAbort = error?.name === 'AbortError';
    console.error('API Proxy Error:', error);
    res.status(isAbort ? 504 : 500).json({
      error: isAbort 
        ? 'OpenRouter request timed out (45 seconds). Try a shorter prompt or check API status.' 
        : error.message || 'Failed to communicate with AI.'
    });
  }
});

// ✅ Static files AFTER API routes — prevents Express from shadowing POST /api/generate
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => console.log(`WOWERS server running at http://localhost:${PORT}`));
}

export { app, getOpenRouterErrorMessage, getOpenRouterKey, normalizeOpenRouterKey, readOpenRouterBody };

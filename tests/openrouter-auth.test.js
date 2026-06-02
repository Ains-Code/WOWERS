import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { getOpenRouterErrorMessage, getOpenRouterKey, normalizeOpenRouterKey, readOpenRouterBody } from '../server.js';

const originalOpenRouterKey = process.env.OPENROUTER_KEY;

afterEach(() => {
  if (originalOpenRouterKey === undefined) {
    delete process.env.OPENROUTER_KEY;
  } else {
    process.env.OPENROUTER_KEY = originalOpenRouterKey;
  }
});

function requestWithHeaders(headers = {}) {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
  );

  return {
    get(name) {
      return normalizedHeaders[name.toLowerCase()];
    }
  };
}

test('normalizeOpenRouterKey accepts raw and Bearer-prefixed keys', () => {
  assert.equal(normalizeOpenRouterKey('sk-or-v1-test'), 'sk-or-v1-test');
  assert.equal(normalizeOpenRouterKey('Bearer sk-or-v1-test'), 'sk-or-v1-test');
  assert.equal(normalizeOpenRouterKey('  Bearer sk-or-v1-test  '), 'sk-or-v1-test');
});

test('getOpenRouterKey accepts the standard Authorization header', () => {
  delete process.env.OPENROUTER_KEY;
  const req = requestWithHeaders({ Authorization: 'Bearer sk-or-v1-from-auth' });

  assert.equal(getOpenRouterKey(req), 'sk-or-v1-from-auth');
});

test('getOpenRouterKey accepts x-openrouter-key for existing clients', () => {
  delete process.env.OPENROUTER_KEY;
  const req = requestWithHeaders({ 'x-openrouter-key': 'sk-or-v1-forwarded' });

  assert.equal(getOpenRouterKey(req), 'sk-or-v1-forwarded');
});

test('getOpenRouterKey prefers the server environment key', () => {
  process.env.OPENROUTER_KEY = 'sk-or-v1-env';
  const req = requestWithHeaders({ Authorization: 'Bearer sk-or-v1-from-auth' });

  assert.equal(getOpenRouterKey(req), 'sk-or-v1-env');
});


test('getOpenRouterErrorMessage preserves plain text upstream errors', () => {
  assert.equal(getOpenRouterErrorMessage({ rawText: 'upstream exploded' }), 'upstream exploded');
  assert.equal(getOpenRouterErrorMessage({ error: { message: 'bad auth' } }), 'bad auth');
});

test('readOpenRouterBody handles json and non-json responses', async () => {
  const jsonBody = await readOpenRouterBody(new Response(JSON.stringify({ error: 'bad request' })));
  const textBody = await readOpenRouterBody(new Response('proxy unavailable'));

  assert.deepEqual(jsonBody, { error: 'bad request' });
  assert.deepEqual(textBody, { rawText: 'proxy unavailable' });
});

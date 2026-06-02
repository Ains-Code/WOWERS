import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { getOpenRouterKey, normalizeOpenRouterKey } from '../server.js';

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

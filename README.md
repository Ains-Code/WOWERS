# WOWERS

WOWERS is a browser-based HTML/CSS/JavaScript generation workspace with built-in starter templates and a small Express proxy for OpenRouter chat completions.

## Setup

```bash
npm install
cp .env.example .env
```

Add your OpenRouter API key to `.env`:

```bash
OPENROUTER_KEY=sk-or-v1-your-key
```

If `OPENROUTER_KEY` is configured on the server, the app unlocks automatically. You can also paste an OpenRouter key into the app's sign-in screen; the browser forwards it to the backend with an `Authorization: Bearer ...` header and the backend also accepts the legacy `x-openrouter-key` header. The server key always takes priority when present.

## Run

```bash
npm start
```

Open <http://localhost:3000>. Pick any quick template to load working code instantly, or enter your own prompt and click **Generate with AI** to customize it with OpenRouter. If a static host rejects `/api/generate` with HTTP 404/405/5xx and you pasted a browser key, the app retries OpenRouter directly instead of showing a generic transmission error.

## Checks

```bash
npm test
```

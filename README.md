# WOWERS

WOWERS is a browser-based HTML/CSS/JavaScript generation workspace with a small Express proxy for OpenRouter chat completions.

## Setup

```bash
npm install
cp .env.example .env
```

Add your OpenRouter API key to `.env`:

```bash
OPENROUTER_KEY=sk-or-v1-your-key
```

If `OPENROUTER_KEY` is configured on the server, the app unlocks automatically. You can also paste an OpenRouter key into the app's sign-in screen; the backend will use the server key first and fall back to the key supplied by the browser for that request.

## Run

```bash
npm start
```

Open <http://localhost:3000>.

## Checks

```bash
npm test
```

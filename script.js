// System Local Cache State
const appState = {
  html: {
    activeCode: '',
    placeholderHtml: '<div style="padding: 24px; text-align:center; background:#10131f; border: 2px solid #7c4dff; color:white; border-radius:8px; font-family:sans-serif;">\n  <h2>AI Active Development Environment</h2>\n  <p>Input text instructions or pick quick templates to fire true real-time generation arrays.</p>\n</div>'
  },
  css: {
    activeCode: '',
    placeholderHtml: '/* CSS Placeholder Initial Setup Sheets */\nbody { font-family: sans-serif; }'
  },
  js: {
    activeCode: '',
    placeholderHtml: '// JavaScript active test canvas scripts\nconsole.log("Workspace engine active.");'
  }
};

const starterTemplates = [
  {
    lang: 'css', match: 'glass card',
    html: '<section class="glass-card">\n  <p class="eyebrow">Premium dashboard</p>\n  <h2>Crystal analytics panel</h2>\n  <p>Layered glass, soft borders, and balanced spacing for a modern UI card.</p>\n  <button>Open report</button>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at top left, #7c3aed, transparent 32%), #07111f; }\n.glass-card { width: min(420px, 92vw); padding: 32px; color: #f8fafc; border: 1px solid rgba(255,255,255,.24); border-radius: 28px; background: linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.07)); box-shadow: 0 24px 80px rgba(0,0,0,.38); backdrop-filter: blur(18px); }\n.glass-card .eyebrow { margin: 0 0 10px; color: #67e8f9; text-transform: uppercase; letter-spacing: .16em; font: 700 12px system-ui; }\n.glass-card h2 { margin: 0 0 12px; font: 800 34px/1.05 system-ui; }\n.glass-card p { color: #cbd5e1; line-height: 1.7; }\n.glass-card button { margin-top: 12px; border: 0; border-radius: 999px; padding: 12px 18px; font-weight: 800; color: #07111f; background: #67e8f9; cursor: pointer; }',
    js: 'document.querySelector(".glass-card button")?.addEventListener("click", () => {\n  alert("Report opened from the glass card template.");\n});',
    explanation: 'Starter template applied: responsive glass card with matching HTML, CSS, and a clickable button script.'
  },
  {
    lang: 'css', match: 'neon button',
    html: '<main class="neon-stage">\n  <button class="neon-button">Launch sequence</button>\n</main>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #050816; }\n.neon-stage { display: grid; place-items: center; }\n.neon-button { position: relative; padding: 18px 34px; border: 2px solid #00e5ff; border-radius: 16px; color: #e0fbff; background: transparent; font: 900 18px/1 system-ui; letter-spacing: .08em; text-transform: uppercase; box-shadow: 0 0 18px rgba(0,229,255,.55), inset 0 0 18px rgba(0,229,255,.18); cursor: pointer; overflow: hidden; }\n.neon-button::before { content: ""; position: absolute; inset: 0; transform: translateX(-110%) skewX(-20deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent); transition: transform .55s ease; }\n.neon-button:hover::before { transform: translateX(110%) skewX(-20deg); }\n.neon-button:hover { color: #00151a; background: #00e5ff; box-shadow: 0 0 34px #00e5ff; }',
    js: 'document.querySelector(".neon-button")?.addEventListener("click", event => {\n  event.currentTarget.textContent = "Sequence active";\n});',
    explanation: 'Starter template applied: neon button with hover shine and click feedback.'
  },
  {
    lang: 'css', match: 'animated loader',
    html: '<div class="loader-card">\n  <div class="orbit-loader"><span></span><span></span><span></span></div>\n  <strong>Loading assets</strong>\n</div>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: white; }\n.loader-card { display: grid; gap: 18px; justify-items: center; padding: 30px; border-radius: 24px; background: #111c33; box-shadow: 0 20px 70px rgba(0,0,0,.35); font-family: system-ui; }\n.orbit-loader { position: relative; width: 88px; height: 88px; animation: spin 1.3s linear infinite; }\n.orbit-loader span { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 22px #38bdf8; }\n.orbit-loader span:nth-child(1) { top: 0; left: 35px; }\n.orbit-loader span:nth-child(2) { right: 6px; bottom: 12px; background: #a78bfa; }\n.orbit-loader span:nth-child(3) { left: 6px; bottom: 12px; background: #34d399; }\n@keyframes spin { to { transform: rotate(360deg); } }',
    js: 'console.log("Animated loader template mounted.");',
    explanation: 'Starter template applied: animated loader with three orbiting dots.'
  },
  {
    lang: 'js', match: 'interactive button',
    html: '<section class="counter-widget">\n  <h2>Interactive counter</h2>\n  <p id="count-output">0</p>\n  <button id="count-button">Add one</button>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #101827; color: #f8fafc; font-family: system-ui; }\n.counter-widget { text-align: center; padding: 34px; border-radius: 24px; background: #1e293b; box-shadow: 0 22px 70px rgba(0,0,0,.3); }\n#count-output { font-size: 64px; font-weight: 900; margin: 12px 0; color: #22d3ee; }\n#count-button { border: 0; border-radius: 12px; padding: 12px 18px; font-weight: 800; background: #22d3ee; color: #08111f; cursor: pointer; }',
    js: 'let count = 0;\nconst output = document.getElementById("count-output");\ndocument.getElementById("count-button")?.addEventListener("click", () => {\n  count += 1;\n  output.textContent = count;\n});',
    explanation: 'Starter template applied: JavaScript counter button that updates the DOM on every click.'
  },
  {
    lang: 'js', match: 'game logic',
    html: '<section class="game-card">\n  <h2>Guess the number</h2>\n  <p>Pick a number from 1 to 5.</p>\n  <div id="guess-buttons"></div>\n  <strong id="game-result">Waiting for your guess...</strong>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #111827, #312e81); color: white; font-family: system-ui; }\n.game-card { width: min(430px, 92vw); text-align: center; padding: 32px; border-radius: 26px; background: rgba(15,23,42,.82); box-shadow: 0 22px 80px rgba(0,0,0,.38); }\n#guess-buttons { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 22px 0; }\n#guess-buttons button { width: 48px; height: 48px; border: 0; border-radius: 14px; font-weight: 900; background: #fbbf24; color: #111827; cursor: pointer; }',
    js: 'const targetNumber = Math.ceil(Math.random() * 5);\nconst result = document.getElementById("game-result");\nconst buttonWrap = document.getElementById("guess-buttons");\n[1, 2, 3, 4, 5].forEach(number => {\n  const button = document.createElement("button");\n  button.textContent = number;\n  button.addEventListener("click", () => {\n    result.textContent = number === targetNumber ? "Correct! You found it." : `Nope, ${number} was not it.`;\n  });\n  buttonWrap.appendChild(button);\n});',
    explanation: 'Starter template applied: number guessing game with DOM-created buttons and stateful win logic.'
  },
  {
    lang: 'js', match: 'api fetcher',
    html: '<section class="fetch-card">\n  <h2>API Fetcher</h2>\n  <button id="load-post">Load sample post</button>\n  <pre id="api-output">Click the button to fetch data.</pre>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #0b1120; color: #dbeafe; font-family: system-ui; }\n.fetch-card { width: min(620px, 94vw); padding: 28px; border-radius: 24px; background: #111827; box-shadow: 0 20px 70px rgba(0,0,0,.36); }\n#load-post { padding: 12px 16px; border: 0; border-radius: 12px; background: #60a5fa; color: #08111f; font-weight: 900; cursor: pointer; }\n#api-output { margin-top: 18px; padding: 18px; border-radius: 16px; background: #020617; white-space: pre-wrap; }',
    js: 'document.getElementById("load-post")?.addEventListener("click", async () => {\n  const output = document.getElementById("api-output");\n  output.textContent = "Loading...";\n  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");\n  const post = await response.json();\n  output.textContent = JSON.stringify(post, null, 2);\n});',
    explanation: 'Starter template applied: fetch button that loads sample JSON into the preview.'
  },
  {
    lang: 'html', match: 'hero section',
    html: '<header class="hero-section">\n  <nav><strong>WOWERS</strong><a href="#features">Features</a><a href="#start">Start</a></nav>\n  <div class="hero-copy">\n    <p class="eyebrow">Build faster</p>\n    <h1>Generate polished frontend blocks in seconds.</h1>\n    <p>Create HTML, CSS, and JavaScript layers with live previews and editable code.</p>\n    <button id="hero-action">Start building</button>\n  </div>\n</header>',
    css: 'body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #08111f; color: white; }\n.hero-section { min-height: 100vh; padding: 28px; display: grid; align-content: center; gap: 80px; background: radial-gradient(circle at 85% 20%, rgba(34,211,238,.36), transparent 28%), linear-gradient(135deg, #08111f, #172554); }\n.hero-section nav { display: flex; gap: 22px; align-items: center; }\n.hero-section nav strong { margin-right: auto; font-size: 20px; }\n.hero-section nav a { color: #cbd5e1; text-decoration: none; font-weight: 700; }\n.hero-copy { max-width: 760px; }\n.eyebrow { color: #22d3ee; text-transform: uppercase; letter-spacing: .18em; font-weight: 900; }\n.hero-copy h1 { font-size: clamp(44px, 8vw, 90px); line-height: .92; margin: 0 0 20px; }\n.hero-copy p { color: #cbd5e1; font-size: 20px; line-height: 1.7; }\n#hero-action { margin-top: 18px; border: 0; border-radius: 999px; padding: 16px 24px; background: #22d3ee; color: #08111f; font-weight: 900; cursor: pointer; }',
    js: 'document.getElementById("hero-action")?.addEventListener("click", () => {\n  alert("Hero CTA clicked!");\n});',
    explanation: 'Starter template applied: complete hero section with navigation, CTA, responsive typography, and click behavior.'
  },
  {
    lang: 'html', match: 'contact input form',
    html: '<form class="contact-form">\n  <h2>Contact us</h2>\n  <label>Name<input name="name" placeholder="Ada Lovelace" required></label>\n  <label>Email<input type="email" name="email" placeholder="ada@example.com" required></label>\n  <label>Message<textarea name="message" placeholder="Tell us what you need..."></textarea></label>\n  <button type="submit">Send message</button>\n  <p id="form-status"></p>\n</form>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; margin: 0; background: #ecfeff; font-family: system-ui; color: #0f172a; }\n.contact-form { width: min(460px, 92vw); display: grid; gap: 16px; padding: 30px; border-radius: 24px; background: white; box-shadow: 0 24px 70px rgba(8,47,73,.18); }\n.contact-form h2 { margin: 0 0 4px; font-size: 34px; }\n.contact-form label { display: grid; gap: 8px; font-weight: 800; }\n.contact-form input, .contact-form textarea { width: 100%; box-sizing: border-box; border: 1px solid #bae6fd; border-radius: 12px; padding: 12px; font: inherit; }\n.contact-form textarea { min-height: 110px; resize: vertical; }\n.contact-form button { border: 0; border-radius: 12px; padding: 13px 16px; font-weight: 900; background: #0891b2; color: white; cursor: pointer; }\n#form-status { min-height: 24px; color: #047857; font-weight: 800; }',
    js: 'document.querySelector(".contact-form")?.addEventListener("submit", event => {\n  event.preventDefault();\n  document.getElementById("form-status").textContent = "Thanks! Your message is ready to send.";\n});',
    explanation: 'Starter template applied: accessible contact form with validation-friendly markup and submit feedback.'
  },
  {
    lang: 'html', match: 'pricing grid',
    html: '<section class="pricing" id="start">\n  <div class="pricing-header"><p>Plans</p><h2>Choose your workspace</h2></div>\n  <article><h3>Starter</h3><strong>$9</strong><p>Personal experiments.</p><button>Pick Starter</button></article>\n  <article class="featured"><h3>Pro</h3><strong>$29</strong><p>Production-ready teams.</p><button>Pick Pro</button></article>\n  <article><h3>Scale</h3><strong>$79</strong><p>Advanced automation.</p><button>Pick Scale</button></article>\n</section>',
    css: 'body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: white; font-family: system-ui; }\n.pricing { width: min(1100px, 94vw); display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }\n.pricing-header { grid-column: 1 / -1; text-align: center; margin-bottom: 10px; }\n.pricing-header p { color: #38bdf8; text-transform: uppercase; letter-spacing: .18em; font-weight: 900; }\n.pricing-header h2 { margin: 0; font-size: clamp(34px, 5vw, 58px); }\n.pricing article { padding: 28px; border-radius: 24px; background: #172033; border: 1px solid #26364f; box-shadow: 0 18px 60px rgba(0,0,0,.28); }\n.pricing article.featured { transform: translateY(-12px); border-color: #38bdf8; box-shadow: 0 26px 80px rgba(56,189,248,.22); }\n.pricing strong { display: block; font-size: 48px; margin: 14px 0; }\n.pricing button { width: 100%; border: 0; border-radius: 14px; padding: 13px; font-weight: 900; background: #38bdf8; color: #07111f; cursor: pointer; }\n@media (max-width: 760px) { .pricing { grid-template-columns: 1fr; } .pricing article.featured { transform: none; } }',
    js: 'document.querySelectorAll(".pricing button").forEach(button => {\n  button.addEventListener("click", () => alert(`${button.textContent} selected`));\n});',
    explanation: 'Starter template applied: responsive three-card pricing grid with selectable plan buttons.'
  }
];

// ---------------------------------------------------------------------------
// getActiveTab — defined here so script.js works standalone.
// The inline script in index.html may override this, which is fine.
// ---------------------------------------------------------------------------
function getActiveTab() {
  if (document.getElementById('css-panel')?.classList.contains('active'))  return 'css';
  if (document.getElementById('js-panel')?.classList.contains('active'))   return 'js';
  return 'html';
}

window.addEventListener('DOMContentLoaded', () => {
  initializeEditors();

  const storedApiKey = sessionStorage.getItem('openrouter_key');
  if (storedApiKey) {
    const inp = document.getElementById('apikey-input');
    if (inp) inp.value = storedApiKey;
    unlockWorkspace();
    return;
  }

  fetch('/api/config')
    .then(r => r.ok ? r.json() : null)
    .then(config => { if (config?.hasServerKey) unlockWorkspace(); })
    .catch(() => {});
});

function initializeEditors() {
  ['html', 'css', 'js'].forEach(lang => {
    appState[lang].activeCode = appState[lang].placeholderHtml;
    const editor = document.getElementById(`${lang}-preview-editor`);
    if (editor) editor.value = appState[lang].placeholderHtml;
  });
}

function normalizeOpenRouterKey(value) {
  return String(value || '').trim().replace(/^Bearer\s+/i, '');
}

function unlockWorkspace() {
  document.getElementById('app-body')?.classList.remove('auth-mode');
  syncAllSandboxes();
}

function saveApiKey() {
  const keyInput = document.getElementById('apikey-input');
  if (!keyInput) return;
  const keyVal = normalizeOpenRouterKey(keyInput.value);
  if (keyVal) {
    sessionStorage.setItem('openrouter_key', keyVal);
    showGlobalToast('OpenRouter Engine connected successfully!');
    unlockWorkspace();
  } else {
    alert('Please insert a valid OpenRouter token key.');
  }
}

function switchMainTab(targetLang) {
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(pane => pane.classList.remove('active'));
  document.querySelector(`.${targetLang}-nav`)?.classList.add('active');
  document.getElementById(`${targetLang}-panel`)?.classList.add('active');
  syncRuntimeSandbox(targetLang);
}

function switchOutputTab(lang, viewMode) {
  const panel = document.getElementById(`${lang}-panel`);
  if (!panel) return;
  ['code', 'preview'].forEach(mode => {
    panel.querySelector(`#${lang}-btn-${mode}`)?.classList.remove('active');
    panel.querySelector(`#${lang}-pane-${mode}`)?.classList.remove('active');
  });
  panel.querySelector(`#${lang}-btn-${viewMode}`)?.classList.add('active');
  panel.querySelector(`#${lang}-pane-${viewMode}`)?.classList.add('active');
  if (viewMode === 'preview') syncRuntimeSandbox(lang);
}

function setTemplatePrompt(lang, sentence) {
  const promptInput = document.getElementById(`${lang}-prompt-input`);
  if (promptInput) { promptInput.value = sentence; promptInput.focus(); }
  const template = findStarterTemplate(lang, sentence);
  if (template) {
    applyGeneratedCode(template, lang);
    switchMainTab(lang);
    switchOutputTab(lang, 'code');
    showGlobalToast('Template code loaded. Use Generate with AI to customize it.');
  }
}

function triggerLiveAiGeneration() {
  const lang = getActiveTab();
  const val  = document.getElementById(`${lang}-prompt-input`)?.value.trim();
  if (val) generateAiCode(lang);
}

// ---------------------------------------------------------------------------
// buildSystemPrompt — tight constraints to prevent preamble / prose leakage
// ---------------------------------------------------------------------------
function buildSystemPrompt(lang, rawPrompt, formatOpt, depthOpt) {
  return `You are a frontend code generator. Your ENTIRE response must be a single JSON object.
Start your response with { and end with }. No text before or after. No markdown fences. No prose.

Required JSON shape (all four keys required, all values must be strings):
{"html":"...","css":"...","js":"...","explanation":"..."}

Rules:
- "html": inner <body> markup only — no <html>, <head>, or <body> wrapper.
- "css": plain CSS rules only — no <style> tags.
- "js": plain JavaScript only — no <script> tags, no import/export.
- "explanation": 1-2 sentences describing what was built.
- Style preference: ${formatOpt === 'separate' ? 'keep styles in the css field, not inline' : 'inline styles are fine'}.
- Depth: ${depthOpt === 'clean' ? 'minimal, clean output' : 'full, detailed implementation'}.
- All three fields must work together in a single browser iframe.
- Inside JSON string values, escape double-quotes as \\" and newlines as \\n.
- Do NOT truncate the output. Output the complete, valid JSON.

User request: ${rawPrompt}`;
}

async function generateAiCode(lang) {
  const apiKey    = normalizeOpenRouterKey(sessionStorage.getItem('openrouter_key'));
  const promptEl  = document.getElementById(`${lang}-prompt-input`);
  if (!promptEl) return;
  const rawPrompt = promptEl.value.trim();
  if (!rawPrompt) { alert('Please describe what you want to generate first.'); return; }

  const formatOpt = document.getElementById(`${lang}-format-select`)?.value ?? 'inline';
  const depthOpt  = document.getElementById(`${lang}-depth-select`)?.value  ?? 'full';

  setGeneratingState(lang, true);
  showGlobalToast('🤖 Contacting AI workspace nodes...');

  try {
    let apiResponse;
    try {
      apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}`, 'x-openrouter-key': apiKey } : {})
        },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(lang, rawPrompt, formatOpt, depthOpt),
          userMessage:  `Generate a ${lang.toUpperCase()} component: ${rawPrompt}`
        })
      });
    } catch (_net) {
      throw new Error('Cannot reach the WOWERS server. Make sure npm start is running.');
    }

    const responseData = await apiResponse.json().catch(async () => {
      return { error: 'Server returned non-JSON', rawText: await apiResponse.text() };
    });

    if (!apiResponse.ok) throw new Error(responseData.error || `API error ${apiResponse.status}`);

    if (responseData.finish_reason === 'length') {
      console.warn('[WOWERS] Model hit token limit — response may be truncated.');
      showGlobalToast('⚠️ Response may be truncated (token limit hit)');
    }

    const rawText = extractTextPayload(responseData).trim();
    console.debug(`[WOWERS] Raw response (${rawText.length} chars):`, rawText.slice(0, 400));

    if (!rawText || rawText.length < 30) {
      throw new Error('API returned an empty response. Check your API key and try again.');
    }

    const codeData = parseGeneratedJson(rawText);
    applyGeneratedCode(codeData, lang);
    switchOutputTab(lang, 'code');
    showGlobalToast('✅ AI Component compiled!');

  } catch (err) {
    console.error('[WOWERS] Generation error:', err.message);
    const template = findStarterTemplate(lang, rawPrompt);
    if (template) {
      applyGeneratedCode(template, lang);
      switchOutputTab(lang, 'code');
      showGlobalToast('⚠️ Used template (API issue)');
      alert('API issue: ' + err.message + '\n\nLoaded a matching template instead.\nTry a shorter prompt or check your API key.');
    } else {
      showGlobalToast('❌ Generation failed');
      alert('Error: ' + err.message);
    }
  } finally {
    setGeneratingState(lang, false);
  }
}

function findStarterTemplate(lang, sentence) {
  const s = String(sentence || '').toLowerCase();
  return starterTemplates.find(t => t.lang === lang && s.includes(t.match));
}

function applyGeneratedCode(codeMatrix, activeLang) {
  const normalized = normalizeGeneratedCode(codeMatrix, activeLang);

  ['html', 'css', 'js'].forEach(lang => {
    if (typeof normalized[lang] === 'string') {
      appState[lang].activeCode = normalized[lang];
      const editor = document.getElementById(`${lang}-preview-editor`);
      if (editor) editor.value = normalized[lang];
    }
  });

  // Update all panels' code display + explanation
  document.querySelectorAll('.panel').forEach(panel => {
    const pLang       = panel.id.split('-')[0];
    const codeTarget  = document.getElementById(`${pLang}-code-target`);
    const emptyState  = document.getElementById(`${pLang}-empty-view`);
    const explBox     = document.getElementById(`${pLang}-explanation-box`);

    if (emptyState)  emptyState.style.display = 'none';
    if (codeTarget) { codeTarget.style.display = 'block'; codeTarget.textContent = appState[pLang].activeCode || ''; }
    if (explBox && normalized.explanation) {
      explBox.replaceChildren();
      const p = document.createElement('p');
      p.textContent = normalized.explanation;
      explBox.appendChild(p);
    }
  });

  syncAllSandboxes();
}

function normalizeGeneratedCode(raw, requestedLang) {
  const m = (raw && typeof raw === 'object') ? raw : {};
  const fallback = typeof m.code === 'string' ? m.code : '';
  return {
    html:        str(m.html)                                   || (requestedLang === 'html' ? fallback : appState.html.activeCode),
    css:         str(m.css)                                    || (requestedLang === 'css'  ? fallback : appState.css.activeCode),
    js:          str(m.js || m.javascript)                     || (requestedLang === 'js'   ? fallback : appState.js.activeCode),
    explanation: str(m.explanation || m.notes || m.description)|| 'Generated code is ready.'
  };
}

function str(v) {
  if (typeof v === 'string')          return v;
  if (Array.isArray(v))               return v.join('\n');
  if (v && typeof v === 'object')     return JSON.stringify(v, null, 2);
  return '';
}

// ---------------------------------------------------------------------------
// extractTextPayload — handles all server response shapes
// ---------------------------------------------------------------------------
function extractTextPayload(apiResponse) {
  const content = apiResponse?.content;
  if (Array.isArray(content)) {
    const joined = content.map(item => (typeof item === 'string' ? item : (item?.text ?? ''))).join('');
    if (joined.trim()) return joined;
  }
  if (typeof apiResponse?.text    === 'string' && apiResponse.text.trim())    return apiResponse.text;
  if (typeof apiResponse?.content === 'string' && apiResponse.content.trim()) return apiResponse.content;
  if (typeof apiResponse          === 'string')                                return apiResponse;
  return '';
}

// ---------------------------------------------------------------------------
// parseGeneratedJson — 3-attempt parser with repair
// ---------------------------------------------------------------------------
function parseGeneratedJson(rawText) {
  if (!rawText || rawText.length < 10) throw new Error('Response too short to parse');

  // Strip markdown fences
  let cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  // Attempt 1: direct parse
  try { return JSON.parse(cleaned); } catch (_) { /* fall through */ }

  // Attempt 2: extract first { … last }
  const fi = cleaned.indexOf('{');
  const li = cleaned.lastIndexOf('}');
  if (fi >= 0 && li > fi) {
    const slice = cleaned.slice(fi, li + 1);
    try { return JSON.parse(slice); } catch (_) { /* fall through */ }

    // Attempt 3: repair then parse
    try { return JSON.parse(repairJson(slice)); } catch (e3) {
      console.error('[WOWERS] JSON parse failed (3 attempts):', e3.message, '\nPreview:', rawText.slice(0, 400));
      throw new Error('AI response had malformed JSON. Try a shorter or simpler prompt.');
    }
  }

  console.error('[WOWERS] No JSON braces found in response:', rawText.slice(0, 300));
  throw new Error('AI response did not contain a JSON object. Try again.');
}

// ---------------------------------------------------------------------------
// repairJson — targeted fixes for common AI output defects
// ---------------------------------------------------------------------------
function repairJson(str) {
  let s = str;

  // Collapse unescaped literal newlines that appear OUTSIDE quoted strings.
  // Strategy: walk char by char tracking whether we're inside a string.
  let inStr = false, escaped = false, result = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escaped)           { escaped = false; result += ch; continue; }
    if (ch === '\\')       { escaped = true;  result += ch; continue; }
    if (ch === '"')        { inStr = !inStr;  result += ch; continue; }
    if (!inStr && ch === '\n') { result += ' '; continue; }  // collapse bare newlines between tokens
    if (!inStr && ch === '\r') { continue; }                  // strip bare CR
    result += ch;
  }
  s = result;

  // Fix single-quoted string values
  s = s.replace(/:\s*'([^']*)'/g, ': "$1"');
  // Remove trailing commas before ] or }
  s = s.replace(/,(\s*[}\]])/g, '$1');
  // Close unclosed braces
  const open  = (s.match(/{/g) || []).length;
  const close = (s.match(/}/g) || []).length;
  if (open > close) s += '}'.repeat(open - close);

  return s;
}

// ---------------------------------------------------------------------------
// Sandbox
// ---------------------------------------------------------------------------
function sanitizeRunnableScript(src) {
  return String(src || '')
    .replace(/^\s*import\s+[^;]+;?\s*$/gm, '')
    .replace(/\bexport\s+default\s+/g, '')
    .replace(/\bexport\s+(?=(async\s+)?function|class|const|let|var)/g, '');
}

function buildSandboxDoc(html, css, js) {
  const script = sanitizeRunnableScript(js);
  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>body{background:#fff;color:#121620;padding:20px;font-family:sans-serif;margin:0}${css}</style>
</head><body>${html}
<script>try{new Function(${JSON.stringify(script)})()}catch(e){console.error("Sandbox error:",e)}<\/script>
</body></html>`;
}

function syncAllSandboxes() {
  ['html', 'css', 'js'].forEach(lang => syncRuntimeSandbox(lang));
}

// FIX: read editors from document (not activePanel) — each editor is unique in the DOM
function syncRuntimeSandbox(lang) {
  const liveHtml = document.getElementById('html-preview-editor')?.value ?? appState.html.activeCode;
  const liveCss  = document.getElementById('css-preview-editor')?.value  ?? appState.css.activeCode;
  const liveJs   = document.getElementById('js-preview-editor')?.value   ?? appState.js.activeCode;

  appState.html.activeCode = liveHtml;
  appState.css.activeCode  = liveCss;
  appState.js.activeCode   = liveJs;

  const doc = buildSandboxDoc(liveHtml, liveCss, liveJs);

  const sidebarFrame = document.getElementById(`${lang}-sandbox-frame`);
  if (sidebarFrame) sidebarFrame.srcdoc = doc;

  const mobileFrame = document.getElementById(`${lang}-mobile-sandbox-frame`);
  if (mobileFrame) mobileFrame.srcdoc = doc;
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function setGeneratingState(lang, loading) {
  const btn = document.querySelector(`#${lang}-panel .generate-btn`);
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle('is-loading', loading);
  btn.innerHTML = loading
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Generating...'
    : '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate with AI';
}

function copyWorkspaceOutput(lang) {
  const val = document.getElementById(`${lang}-preview-editor`)?.value ?? appState[lang].activeCode;
  navigator.clipboard.writeText(val || '').then(() => showGlobalToast('📋 Copied!'));
}

function downloadWorkspaceOutput(lang, ext) {
  const val = document.getElementById(`${lang}-preview-editor`)?.value ?? appState[lang].activeCode;
  if (!val) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([val], { type: 'text/plain;charset=utf-8' }));
  a.download = `ai_output_${lang}.${ext}`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(a.href);
}

function showGlobalToast(msg) {
  const toast = document.getElementById('global-toast');
  const text  = document.getElementById('toast-text');
  if (!toast || !text) return;
  text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
      }

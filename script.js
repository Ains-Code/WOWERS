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

const OPENROUTER_CHAT_COMPLETIONS_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_OPENROUTER_MODEL = 'openrouter/auto';

const starterTemplates = [
  {
    lang: 'css',
    match: 'glass card',
    html: '<section class="glass-card">\n  <p class="eyebrow">Premium dashboard</p>\n  <h2>Crystal analytics panel</h2>\n  <p>Layered glass, soft borders, and balanced spacing for a modern UI card.</p>\n  <button>Open report</button>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at top left, #7c3aed, transparent 32%), #07111f; }\n.glass-card { width: min(420px, 92vw); padding: 32px; color: #f8fafc; border: 1px solid rgba(255,255,255,.24); border-radius: 28px; background: linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.07)); box-shadow: 0 24px 80px rgba(0,0,0,.38); backdrop-filter: blur(18px); }\n.glass-card .eyebrow { margin: 0 0 10px; color: #67e8f9; text-transform: uppercase; letter-spacing: .16em; font: 700 12px system-ui; }\n.glass-card h2 { margin: 0 0 12px; font: 800 34px/1.05 system-ui; }\n.glass-card p { color: #cbd5e1; line-height: 1.7; }\n.glass-card button { margin-top: 12px; border: 0; border-radius: 999px; padding: 12px 18px; font-weight: 800; color: #07111f; background: #67e8f9; cursor: pointer; }',
    js: 'document.querySelector(".glass-card button")?.addEventListener("click", () => {\n  alert("Report opened from the glass card template.");\n});',
    explanation: 'Starter template applied: responsive glass card with matching HTML, CSS, and a clickable button script.'
  },
  {
    lang: 'css',
    match: 'neon button',
    html: '<main class="neon-stage">\n  <button class="neon-button">Launch sequence</button>\n</main>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #050816; }\n.neon-stage { display: grid; place-items: center; }\n.neon-button { position: relative; padding: 18px 34px; border: 2px solid #00e5ff; border-radius: 16px; color: #e0fbff; background: transparent; font: 900 18px/1 system-ui; letter-spacing: .08em; text-transform: uppercase; box-shadow: 0 0 18px rgba(0,229,255,.55), inset 0 0 18px rgba(0,229,255,.18); cursor: pointer; overflow: hidden; }\n.neon-button::before { content: ""; position: absolute; inset: 0; transform: translateX(-110%) skewX(-20deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent); transition: transform .55s ease; }\n.neon-button:hover::before { transform: translateX(110%) skewX(-20deg); }\n.neon-button:hover { color: #00151a; background: #00e5ff; box-shadow: 0 0 34px #00e5ff; }',
    js: 'document.querySelector(".neon-button")?.addEventListener("click", event => {\n  event.currentTarget.textContent = "Sequence active";\n});',
    explanation: 'Starter template applied: neon button with hover shine and click feedback.'
  },
  {
    lang: 'css',
    match: 'animated loader',
    html: '<div class="loader-card">\n  <div class="orbit-loader"><span></span><span></span><span></span></div>\n  <strong>Loading assets</strong>\n</div>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: white; }\n.loader-card { display: grid; gap: 18px; justify-items: center; padding: 30px; border-radius: 24px; background: #111c33; box-shadow: 0 20px 70px rgba(0,0,0,.35); font-family: system-ui; }\n.orbit-loader { position: relative; width: 88px; height: 88px; animation: spin 1.3s linear infinite; }\n.orbit-loader span { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 22px #38bdf8; }\n.orbit-loader span:nth-child(1) { top: 0; left: 35px; }\n.orbit-loader span:nth-child(2) { right: 6px; bottom: 12px; background: #a78bfa; }\n.orbit-loader span:nth-child(3) { left: 6px; bottom: 12px; background: #34d399; }\n@keyframes spin { to { transform: rotate(360deg); } }',
    js: 'console.log("Animated loader template mounted.");',
    explanation: 'Starter template applied: animated loader with three orbiting dots.'
  },
  {
    lang: 'js',
    match: 'interactive button',
    html: '<section class="counter-widget">\n  <h2>Interactive counter</h2>\n  <p id="count-output">0</p>\n  <button id="count-button">Add one</button>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #101827; color: #f8fafc; font-family: system-ui; }\n.counter-widget { text-align: center; padding: 34px; border-radius: 24px; background: #1e293b; box-shadow: 0 22px 70px rgba(0,0,0,.3); }\n#count-output { font-size: 64px; font-weight: 900; margin: 12px 0; color: #22d3ee; }\n#count-button { border: 0; border-radius: 12px; padding: 12px 18px; font-weight: 800; background: #22d3ee; color: #08111f; cursor: pointer; }',
    js: 'let count = 0;\nconst output = document.getElementById("count-output");\ndocument.getElementById("count-button")?.addEventListener("click", () => {\n  count += 1;\n  output.textContent = count;\n});',
    explanation: 'Starter template applied: JavaScript counter button that updates the DOM on every click.'
  },
  {
    lang: 'js',
    match: 'game logic',
    html: '<section class="game-card">\n  <h2>Guess the number</h2>\n  <p>Pick a number from 1 to 5.</p>\n  <div id="guess-buttons"></div>\n  <strong id="game-result">Waiting for your guess...</strong>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #111827, #312e81); color: white; font-family: system-ui; }\n.game-card { width: min(430px, 92vw); text-align: center; padding: 32px; border-radius: 26px; background: rgba(15,23,42,.82); box-shadow: 0 22px 80px rgba(0,0,0,.38); }\n#guess-buttons { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 22px 0; }\n#guess-buttons button { width: 48px; height: 48px; border: 0; border-radius: 14px; font-weight: 900; background: #fbbf24; color: #111827; cursor: pointer; }',
    js: 'const targetNumber = Math.ceil(Math.random() * 5);\nconst result = document.getElementById("game-result");\nconst buttonWrap = document.getElementById("guess-buttons");\n[1, 2, 3, 4, 5].forEach(number => {\n  const button = document.createElement("button");\n  button.textContent = number;\n  button.addEventListener("click", () => {\n    result.textContent = number === targetNumber ? "Correct! You found it." : `Nope, ${number} was not it.`;\n  });\n  buttonWrap.appendChild(button);\n});',
    explanation: 'Starter template applied: number guessing game with DOM-created buttons and stateful win logic.'
  },
  {
    lang: 'js',
    match: 'api fetcher',
    html: '<section class="fetch-card">\n  <h2>API Fetcher</h2>\n  <button id="load-post">Load sample post</button>\n  <pre id="api-output">Click the button to fetch data.</pre>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #0b1120; color: #dbeafe; font-family: system-ui; }\n.fetch-card { width: min(620px, 94vw); padding: 28px; border-radius: 24px; background: #111827; box-shadow: 0 20px 70px rgba(0,0,0,.36); }\n#load-post { padding: 12px 16px; border: 0; border-radius: 12px; background: #60a5fa; color: #08111f; font-weight: 900; cursor: pointer; }\n#api-output { margin-top: 18px; padding: 18px; border-radius: 16px; background: #020617; white-space: pre-wrap; }',
    js: 'document.getElementById("load-post")?.addEventListener("click", async () => {\n  const output = document.getElementById("api-output");\n  output.textContent = "Loading...";\n  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");\n  const post = await response.json();\n  output.textContent = JSON.stringify(post, null, 2);\n});',
    explanation: 'Starter template applied: fetch button that loads sample JSON into the preview.'
  },
  {
    lang: 'html',
    match: 'hero section',
    html: '<header class="hero-section">\n  <nav><strong>WOWERS</strong><a href="#features">Features</a><a href="#start">Start</a></nav>\n  <div class="hero-copy">\n    <p class="eyebrow">Build faster</p>\n    <h1>Generate polished frontend blocks in seconds.</h1>\n    <p>Create HTML, CSS, and JavaScript layers with live previews and editable code.</p>\n    <button id="hero-action">Start building</button>\n  </div>\n</header>',
    css: 'body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #08111f; color: white; }\n.hero-section { min-height: 100vh; padding: 28px; display: grid; align-content: center; gap: 80px; background: radial-gradient(circle at 85% 20%, rgba(34,211,238,.36), transparent 28%), linear-gradient(135deg, #08111f, #172554); }\n.hero-section nav { display: flex; gap: 22px; align-items: center; }\n.hero-section nav strong { margin-right: auto; font-size: 20px; }\n.hero-section nav a { color: #cbd5e1; text-decoration: none; font-weight: 700; }\n.hero-copy { max-width: 760px; }\n.eyebrow { color: #22d3ee; text-transform: uppercase; letter-spacing: .18em; font-weight: 900; }\n.hero-copy h1 { font-size: clamp(44px, 8vw, 90px); line-height: .92; margin: 0 0 20px; }\n.hero-copy p { color: #cbd5e1; font-size: 20px; line-height: 1.7; }\n#hero-action { margin-top: 18px; border: 0; border-radius: 999px; padding: 16px 24px; background: #22d3ee; color: #08111f; font-weight: 900; cursor: pointer; }',
    js: 'document.getElementById("hero-action")?.addEventListener("click", () => {\n  alert("Hero CTA clicked!");\n});',
    explanation: 'Starter template applied: complete hero section with navigation, CTA, responsive typography, and click behavior.'
  },
  {
    lang: 'html',
    match: 'contact input form',
    html: '<form class="contact-form">\n  <h2>Contact us</h2>\n  <label>Name<input name="name" placeholder="Ada Lovelace" required></label>\n  <label>Email<input type="email" name="email" placeholder="ada@example.com" required></label>\n  <label>Message<textarea name="message" placeholder="Tell us what you need..."></textarea></label>\n  <button type="submit">Send message</button>\n  <p id="form-status"></p>\n</form>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; margin: 0; background: #ecfeff; font-family: system-ui; color: #0f172a; }\n.contact-form { width: min(460px, 92vw); display: grid; gap: 16px; padding: 30px; border-radius: 24px; background: white; box-shadow: 0 24px 70px rgba(8,47,73,.18); }\n.contact-form h2 { margin: 0 0 4px; font-size: 34px; }\n.contact-form label { display: grid; gap: 8px; font-weight: 800; }\n.contact-form input, .contact-form textarea { width: 100%; box-sizing: border-box; border: 1px solid #bae6fd; border-radius: 12px; padding: 12px; font: inherit; }\n.contact-form textarea { min-height: 110px; resize: vertical; }\n.contact-form button { border: 0; border-radius: 12px; padding: 13px 16px; font-weight: 900; background: #0891b2; color: white; cursor: pointer; }\n#form-status { min-height: 24px; color: #047857; font-weight: 800; }',
    js: 'document.querySelector(".contact-form")?.addEventListener("submit", event => {\n  event.preventDefault();\n  document.getElementById("form-status").textContent = "Thanks! Your message is ready to send.";\n});',
    explanation: 'Starter template applied: accessible contact form with validation-friendly markup and submit feedback.'
  },
  {
    lang: 'html',
    match: 'pricing grid',
    html: '<section class="pricing" id="start">\n  <div class="pricing-header"><p>Plans</p><h2>Choose your workspace</h2></div>\n  <article><h3>Starter</h3><strong>$9</strong><p>Personal experiments.</p><button>Pick Starter</button></article>\n  <article class="featured"><h3>Pro</h3><strong>$29</strong><p>Production-ready teams.</p><button>Pick Pro</button></article>\n  <article><h3>Scale</h3><strong>$79</strong><p>Advanced automation.</p><button>Pick Scale</button></article>\n</section>',
    css: 'body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: white; font-family: system-ui; }\n.pricing { width: min(1100px, 94vw); display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }\n.pricing-header { grid-column: 1 / -1; text-align: center; margin-bottom: 10px; }\n.pricing-header p { color: #38bdf8; text-transform: uppercase; letter-spacing: .18em; font-weight: 900; }\n.pricing-header h2 { margin: 0; font-size: clamp(34px, 5vw, 58px); }\n.pricing article { padding: 28px; border-radius: 24px; background: #172033; border: 1px solid #26364f; box-shadow: 0 18px 60px rgba(0,0,0,.28); }\n.pricing article.featured { transform: translateY(-12px); border-color: #38bdf8; box-shadow: 0 26px 80px rgba(56,189,248,.22); }\n.pricing strong { display: block; font-size: 48px; margin: 14px 0; }\n.pricing button { width: 100%; border: 0; border-radius: 14px; padding: 13px; font-weight: 900; background: #38bdf8; color: #07111f; cursor: pointer; }\n@media (max-width: 760px) { .pricing { grid-template-columns: 1fr; } .pricing article.featured { transform: none; } }',
    js: 'document.querySelectorAll(".pricing button").forEach(button => {\n  button.addEventListener("click", () => alert(`${button.textContent} selected`));\n});',
    explanation: 'Starter template applied: responsive three-card pricing grid with selectable plan buttons.'
  }
];

// Check for existing API key immediately upon loading page
window.addEventListener('DOMContentLoaded', () => {
  initializeEditors();

  const storedApiKey = sessionStorage.getItem('openrouter_key');
  if (storedApiKey) {
    if(document.getElementById('apikey-input')) document.getElementById('apikey-input').value = storedApiKey;
    unlockWorkspace();
    return;
  }

  fetch('/api/config')
    .then(response => response.ok ? response.json() : null)
    .then(config => {
      if(config?.hasServerKey) unlockWorkspace();
    })
    .catch(() => {
      // Keep auth mode active when the static page is opened without the backend server.
    });
});

function initializeEditors() {
  ['html', 'css', 'js'].forEach(lang => {
    appState[lang].activeCode = appState[lang].placeholderHtml;
    const editor = document.getElementById(`${lang}-preview-editor`);
    if(editor) editor.value = appState[lang].placeholderHtml;
  });
}

function normalizeOpenRouterKey(value) {
  return String(value || '').trim().replace(/^Bearer\s+/i, '');
}

function unlockWorkspace() {
  if(document.getElementById('app-body')) document.getElementById('app-body').classList.remove('auth-mode');
  syncAllSandboxes();
}

function saveApiKey() {
  const keyInput = document.getElementById('apikey-input');
  if(!keyInput) return;
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

  const targetTab = document.querySelector(`.${targetLang}-nav`);
  const targetPanel = document.getElementById(`${targetLang}-panel`);

  if(targetTab) targetTab.classList.add('active');
  if(targetPanel) targetPanel.classList.add('active');
  syncRuntimeSandbox(targetLang);
}

function switchOutputTab(lang, viewMode) {
  const targetPanel = document.getElementById(`${lang}-panel`);
  if(!targetPanel) return;

  const btnCode = targetPanel.querySelector('#' + lang + '-btn-code');
  const btnPreview = targetPanel.querySelector('#' + lang + '-btn-preview');
  const paneCode = targetPanel.querySelector('#' + lang + '-pane-code');
  const panePreview = targetPanel.querySelector('#' + lang + '-pane-preview');

  if(btnCode) btnCode.classList.remove('active');
  if(btnPreview) btnPreview.classList.remove('active');
  if(paneCode) paneCode.classList.remove('active');
  if(panePreview) panePreview.classList.remove('active');

  const activeBtn = targetPanel.querySelector(`#${lang}-btn-${viewMode}`);
  const activePane = targetPanel.querySelector(`#${lang}-pane-${viewMode}`);

  if(activeBtn) activeBtn.classList.add('active');
  if(activePane) activePane.classList.add('active');

  if(viewMode === 'preview') syncRuntimeSandbox(lang);
}

function setTemplatePrompt(lang, sentence) {
  const promptInput = document.getElementById(`${lang}-prompt-input`);
  if(promptInput) {
    promptInput.value = sentence;
    promptInput.focus();
  }

  const template = findStarterTemplate(lang, sentence);
  if(template) {
    applyGeneratedCode(template, lang);
    switchMainTab(lang);
    switchOutputTab(lang, 'code');
    showGlobalToast('Template code loaded. Use Generate with AI to customize it.');
  }
}

function triggerLiveAiGeneration() {
  const activeLanguageTab = getActiveTab();
  const currentPromptEl = document.getElementById(`${activeLanguageTab}-prompt-input`);
  const currentPromptVal = currentPromptEl ? currentPromptEl.value.trim() : '';

  if(currentPromptVal) {
    generateAiCode(activeLanguageTab);
  }
}

// REAL LIVE OPENROUTER INTERFACE ROUTINE
async function generateAiCode(lang) {
  const apiKey = normalizeOpenRouterKey(sessionStorage.getItem('openrouter_key'));

  const promptInput = document.getElementById(`${lang}-prompt-input`);
  if(!promptInput) return;
  const rawPrompt = promptInput.value.trim();
  if(!rawPrompt) {
    alert('Please provide asset style design guidelines description attributes first.');
    return;
  }

  const formatOpt = document.getElementById(`${lang}-format-select`) ? document.getElementById(`${lang}-format-select`).value : 'inline';
  const depthOpt = document.getElementById(`${lang}-depth-select`) ? document.getElementById(`${lang}-depth-select`).value : 'full';

  setGeneratingState(lang, true);
  showGlobalToast('Contacting AI workspace nodes...');

  const structuralSystemBlueprintPrompt = `
    You are an expert Frontend Component Code Generator. Return valid JSON only, with no markdown fences.
    The JSON object must use this exact shape:
    {
      "html": "complete HTML body markup for the component",
      "css": "complete CSS rules for the component",
      "js": "plain browser JavaScript for the component",
      "explanation": "short explanation of how the code works"
    }

    Requirements:
    - Current workspace panel: ${lang.toUpperCase()}.
    - User request: ${rawPrompt}.
    - Format option: ${formatOpt}.
    - Output depth option: ${depthOpt}.
    - Always include useful code for all three fields: html, css, and js.
    - The three code fields must work together in one browser iframe.
    - Do not include import statements, export statements, markdown, or prose outside JSON.
  `;

  try {
    const generationPayload = {
      systemPrompt: structuralSystemBlueprintPrompt,
      userMessage: `Generate a polished ${lang.toUpperCase()} focused frontend component from this request: ${rawPrompt}`
    };
    const operationalDataResult = await requestAiGeneration(generationPayload, apiKey);
    const cleanContentString = extractTextPayload(operationalDataResult).trim();
    const structuralCodeMatrix = normalizeGeneratedCode(parseGeneratedJson(cleanContentString), lang);
    applyGeneratedCode(structuralCodeMatrix, lang);
    switchOutputTab(lang, 'code');
    showGlobalToast('AI Component assets compiled successfully!');
  } catch (error) {
    console.error('AI Generation processing fault details: ', error);
    const fallbackTemplate = findStarterTemplate(lang, rawPrompt);
    if(fallbackTemplate) {
      applyGeneratedCode(fallbackTemplate, lang);
      switchOutputTab(lang, 'code');
      showGlobalToast('AI failed, so the matching template code was loaded.');
    }
    alert(error.message || 'AI compilation module error encountered. Please check your OpenRouter Key settings.');
  } finally {
    setGeneratingState(lang, false);
  }
}

function findStarterTemplate(lang, sentence) {
  const normalizedSentence = String(sentence || '').toLowerCase();
  return starterTemplates.find(template => template.lang === lang && normalizedSentence.includes(template.match));
}

function applyGeneratedCode(codeMatrix, activeLang) {
  const normalizedMatrix = normalizeGeneratedCode(codeMatrix, activeLang);
  ['html', 'css', 'js'].forEach(lang => {
    const nextCode = normalizedMatrix[lang];
    if(typeof nextCode === 'string') {
      appState[lang].activeCode = nextCode;
      const editor = document.getElementById(`${lang}-preview-editor`);
      if(editor) editor.value = nextCode;
    }
  });

  document.querySelectorAll('.panel').forEach(panel => {
    const panelLang = panel.id.split('-')[0];
    const codeTarget = panel.querySelector(`#${panelLang}-code-target`);
    const emptyState = panel.querySelector(`#${panelLang}-empty-view`);
    const explanationContainer = panel.querySelector(`#${panelLang}-explanation-box`);

    if(emptyState) emptyState.style.display = 'none';
    if(codeTarget) {
      codeTarget.style.display = 'block';
      codeTarget.textContent = appState[panelLang].activeCode || '';
    }
    if(explanationContainer && normalizedMatrix.explanation) {
      explanationContainer.replaceChildren();
      const explanationParagraph = document.createElement('p');
      explanationParagraph.textContent = normalizedMatrix.explanation;
      explanationContainer.appendChild(explanationParagraph);
    }
  });

  syncAllSandboxes();
}

function normalizeGeneratedCode(rawMatrix, requestedLang) {
  const matrix = rawMatrix && typeof rawMatrix === 'object' ? rawMatrix : {};
  const fallbackCode = typeof matrix.code === 'string' ? matrix.code : '';

  return {
    html: stringifyCode(matrix.html) || (requestedLang === 'html' ? fallbackCode : appState.html.activeCode),
    css: stringifyCode(matrix.css) || (requestedLang === 'css' ? fallbackCode : appState.css.activeCode),
    js: stringifyCode(matrix.js || matrix.javascript) || (requestedLang === 'js' ? fallbackCode : appState.js.activeCode),
    explanation: stringifyCode(matrix.explanation || matrix.notes || matrix.description) || 'Generated code is ready to edit and preview.'
  };
}

function stringifyCode(value) {
  if(typeof value === 'string') return value;
  if(Array.isArray(value)) return value.join('\n');
  if(value && typeof value === 'object') return JSON.stringify(value, null, 2);
  return '';
}


async function requestAiGeneration(payload, apiKey) {
  let apiServerResponse;

  try {
    apiServerResponse = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? {
          Authorization: `Bearer ${apiKey}`,
          'x-openrouter-key': apiKey
        } : {})
      },
      body: JSON.stringify(payload)
    });
  } catch (_networkError) {
    return requestDirectOpenRouter(payload, apiKey, 'Cannot reach the WOWERS API server.');
  }

  const apiResponseBody = await readApiResponse(apiServerResponse);
  if(apiServerResponse.ok) return apiResponseBody;

  if(shouldTryDirectOpenRouter(apiServerResponse.status)) {
    return requestDirectOpenRouter(payload, apiKey, getApiErrorMessage(apiServerResponse, apiResponseBody));
  }

  throw new Error(getApiErrorMessage(apiServerResponse, apiResponseBody));
}

function shouldTryDirectOpenRouter(status) {
  return [404, 405, 501, 502, 503, 504].includes(status);
}

async function requestDirectOpenRouter(payload, apiKey, proxyFailureMessage) {
  if(!apiKey) {
    throw new Error(`${proxyFailureMessage} Run npm start and open http://localhost:3000, or paste an OpenRouter key so the app can retry directly.`);
  }

  showGlobalToast('Proxy unavailable; retrying OpenRouter directly...');
  const directPayload = {
    model: DEFAULT_OPENROUTER_MODEL,
    max_tokens: 1500,
    messages: [
      { role: 'system', content: payload.systemPrompt },
      { role: 'user', content: payload.userMessage }
    ],
    response_format: { type: 'json_object' }
  };

  let directResponse = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: getDirectOpenRouterHeaders(apiKey),
    body: JSON.stringify(directPayload)
  });
  let directBody = await readApiResponse(directResponse);

  if(!directResponse.ok && shouldRetryDirectWithoutJsonMode(directResponse.status, directBody)) {
    const fallbackPayload = { ...directPayload };
    delete fallbackPayload.response_format;
    directResponse = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: getDirectOpenRouterHeaders(apiKey),
      body: JSON.stringify(fallbackPayload)
    });
    directBody = await readApiResponse(directResponse);
  }

  if(!directResponse.ok) {
    throw new Error(getApiErrorMessage(directResponse, directBody));
  }

  return normalizeOpenRouterChatResponse(directBody);
}

function getDirectOpenRouterHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.href,
    'X-Title': 'WOWERS Web Helper Studio'
  };
}

function shouldRetryDirectWithoutJsonMode(status, responseBody) {
  if(status !== 400 && status !== 422) return false;
  const message = stringifyCode(responseBody?.error?.message || responseBody?.error || responseBody?.message).toLowerCase();
  return message.includes('response_format') || message.includes('json') || message.includes('structured');
}

function normalizeOpenRouterChatResponse(responseBody) {
  const rawOutput = responseBody?.choices?.[0]?.message?.content;
  const textOutput = Array.isArray(rawOutput)
    ? rawOutput.map(item => (typeof item === 'string' ? item : item?.text || '')).join('')
    : rawOutput;

  if(typeof textOutput !== 'string' || !textOutput.trim()) {
    throw new Error('OpenRouter returned an empty response.');
  }

  return { content: [{ type: 'text', text: textOutput }] };
}

async function readApiResponse(response) {
  const rawText = await response.text().catch(() => '');
  if(!rawText) return {};

  try {
    return JSON.parse(rawText);
  } catch (_parseError) {
    return { error: rawText, rawText };
  }
}

function getApiErrorMessage(response, apiResponse) {
  const rawError = stringifyCode(apiResponse?.error?.message || apiResponse?.error || apiResponse?.message || apiResponse?.rawText).trim();
  if(response.status === 404) {
    return 'WOWERS API route /api/generate was not found. Run npm start and open http://localhost:3000 so the backend proxy is available.';
  }

  if(response.status === 405) {
    return rawError || 'The current host rejected POST requests to /api/generate (HTTP 405). Run npm start locally or deploy the Express API with the frontend.';
  }

  if(rawError) {
    const compactError = rawError.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return compactError || `API request failed with HTTP ${response.status}.`;
  }

  return `API request failed with HTTP ${response.status}. Check the server console for details.`;
}

function extractTextPayload(apiResponse) {
  const content = apiResponse?.content;
  if (Array.isArray(content)) {
    return content
      .map(item => (typeof item === 'string' ? item : item?.text || ''))
      .join('');
  }

  if (typeof apiResponse?.text === 'string') return apiResponse.text;
  if (typeof apiResponse?.content === 'string') return apiResponse.content;
  return '';
}

function parseGeneratedJson(rawText) {
  if (!rawText) throw new Error('AI returned an empty response.');

  const withoutFence = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch (_initialError) {
    const firstBrace = withoutFence.indexOf('{');
    const lastBrace = withoutFence.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('AI response was not valid JSON.');
  }
}

function sanitizeRunnableScript(sourceCode) {
  return String(sourceCode || '')
    .replace(/^\s*import\s+[^;]+;?\s*$/gm, '')
    .replace(/\bexport\s+default\s+/g, '')
    .replace(/\bexport\s+(?=(async\s+)?function|class|const|let|var)/g, '');
}

function syncAllSandboxes() {
  syncRuntimeSandbox('html');
  syncRuntimeSandbox('css');
  syncRuntimeSandbox('js');
}

function syncRuntimeSandbox(lang) {
  const frameElement = document.getElementById(`${lang}-sandbox-frame`);
  if(!frameElement) return;

  const liveHtml = document.getElementById('html-preview-editor') ? document.getElementById('html-preview-editor').value : appState.html.activeCode;
  const liveCss = document.getElementById('css-preview-editor') ? document.getElementById('css-preview-editor').value : appState.css.activeCode;
  const liveJs = document.getElementById('js-preview-editor') ? document.getElementById('js-preview-editor').value : appState.js.activeCode;

  appState.html.activeCode = liveHtml;
  appState.css.activeCode = liveCss;
  appState.js.activeCode = liveJs;

  const runnableScript = sanitizeRunnableScript(liveJs);

  let runtimeBlobContext = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { background: #ffffff; color: #121620; padding: 20px; font-family: sans-serif; margin:0; }
        ${liveCss}
      </style>
    </head>
    <body>
      ${liveHtml}
      <script>
        try {
          const userScript = ${JSON.stringify(runnableScript)};
          new Function(userScript)();
        } catch(e) { console.error("Sandbox Execution Error:", e); }
      </script>
    </body>
    </html>
  `;

  frameElement.srcdoc = runtimeBlobContext;
}

function setGeneratingState(lang, isGenerating) {
  const button = document.querySelector(`#${lang}-panel .generate-btn`);
  if(!button) return;
  button.disabled = isGenerating;
  button.classList.toggle('is-loading', isGenerating);
  button.innerHTML = isGenerating
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Generating...'
    : '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate with AI';
}

function copyWorkspaceOutput(lang) {
  const editorElement = document.getElementById(`${lang}-preview-editor`);
  const liveContent = editorElement ? editorElement.value : appState[lang].activeCode;
  navigator.clipboard.writeText(liveContent || '').then(() => {
    showGlobalToast('Copied code context payload cleanly!');
  });
}

function downloadWorkspaceOutput(lang, extension) {
  const editorElement = document.getElementById(`${lang}-preview-editor`);
  const liveContent = editorElement ? editorElement.value : appState[lang].activeCode;
  if(!liveContent) return;
  const dataBlob = new Blob([liveContent], { type: 'text/plain;charset=utf-8' });
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = URL.createObjectURL(dataBlob);
  downloadAnchor.download = `ai_output_${lang}.${extension}`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(downloadAnchor.href);
}

function showGlobalToast(msg) {
  const toastElement = document.getElementById('global-toast');
  const toastText = document.getElementById('toast-text');
  if(toastElement && toastText) {
    toastText.textContent = msg;
    toastElement.classList.add('show');
    setTimeout(() => { toastElement.classList.remove('show'); }, 2500);
  }
}

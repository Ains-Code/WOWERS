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
    lang: 'css',
    match: 'glass card',
    html: '<section class="glass-card">\n  <p class="eyebrow">Premium dashboard</p>\n  <h2>Crystal analytics panel</h2>\n  <p>Layered glass, soft borders, and balanced spacing for a modern UI card.</p>\n  <button>Open report</button>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at top left, #7c3aed, transparent 32%), #07111f; }\n.glass-card { width: min(420px, 92vw); padding: 32px; border: 1px solid rgba(255,255,255,0.08); background: rgba(16,19,31,0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); font-family: sans-serif; }\n.glass-card .eyebrow { color: #00d4ff; text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; font-weight: 700; margin-bottom: 8px; }\n.glass-card h2 { color: #fff; font-size: 24px; font-weight: 800; margin-bottom: 12px; font-family: sans-serif; }\n.glass-card p { color: #7a8baa; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }\n.glass-card button { background: #7c4dff; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }\n.glass-card button:hover { background: #651fff; }',
    js: 'document.querySelector(".glass-card button")?.addEventListener("click", () => { alert("Analytical pipeline connected."); });',
    explanation: 'Starter template applied: high contrast architectural glass template.'
  },
  {
    lang: 'css',
    match: 'neon button',
    html: '<main class="neon-stage">\n  <button class="neon-button">LAUNCH INSTANCE</button>\n</main>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #030308; }\n.neon-button { background: transparent; padding: 16px 32px; border: 1px solid #00e5ff; color: #fff; font-family: monospace; font-weight: bold; letter-spacing: 0.1em; box-shadow: 0 0 15px rgba(0,229,255,0.3); cursor: pointer; transition: all 0.2s ease; }\n.neon-button:hover { box-shadow: 0 0 30px #00e5ff; background: #00e5ff; color: #000; }',
    js: 'document.querySelector(".neon-button")?.addEventListener("click", e => { e.currentTarget.textContent = "SEQUENCE ACTIVE"; });',
    explanation: 'Starter template applied: reactive peripheral glow neon button.'
  },
  {
    lang: 'css',
    match: 'animated loader',
    html: '<div class="loader-card">\n  <div class="quantum-orbit"></div>\n  <strong>SYNAPSE STREAMING</strong>\n</div>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #030308; color: #fff; font-family: monospace; }\n.loader-card { text-align: center; display: grid; gap: 20px; }\n.quantum-orbit { width: 50px; height: 50px; border: 3px solid rgba(0,229,255,0.1); border-top-color: #00e5ff; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }\n@keyframes spin { to { transform: rotate(360deg); } }',
    js: 'console.log("Loader loop initiated.");',
    explanation: 'Starter template applied: smooth quantum spinning asset.'
  }
];

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const viewMode = urlParams.get('view');
  const targetLang = urlParams.get('lang') || 'html';

  // Listen for the physical 'Enter' key inside the login field
  const loginInput = document.getElementById('apikey-input');
  if (loginInput) {
    loginInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveApiKey();
      }
    });
  }

  if (viewMode === 'editor' || viewMode === 'preview') {
    document.getElementById('main-application-container').style.display = 'none';
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('app-body').classList.remove('auth-mode');
    
    if (viewMode === 'editor') {
      const view = document.getElementById('standalone-editor-view');
      view.style.display = 'flex';
      document.getElementById('editor-tab-indicator').textContent = `${targetLang.toUpperCase()} ENGINE REPOSITORY`;
      const txt = document.getElementById('standalone-textarea');
      txt.value = localStorage.getItem(`wowers_cross_${targetLang}`) || appState[targetLang].placeholderHtml;
    } else {
      document.getElementById('standalone-preview-view').style.display = 'flex';
      renderStandalonePreview();
    }

    window.addEventListener('storage', (e) => {
      if (e.key === `wowers_cross_${targetLang}` && viewMode === 'editor') {
        document.getElementById('standalone-textarea').value = e.newValue;
      }
      if (e.key.startsWith('wowers_cross_') && viewMode === 'preview') {
        renderStandalonePreview();
      }
    });
    return;
  }

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

function renderStandalonePreview() {
  const h = localStorage.getItem('wowers_cross_html') || '';
  const c = localStorage.getItem('wowers_cross_css') || '';
  const j = localStorage.getItem('wowers_cross_js') || '';
  const frame = document.getElementById('standalone-iframe');
  if (frame) frame.srcdoc = buildSandboxDoc(h, c, j);
}

function initializeEditors() {
  ['html', 'css', 'js'].forEach(lang => {
    appState[lang].activeCode = appState[lang].placeholderHtml;
    const editor = document.getElementById(`${lang}-preview-editor`);
    if (editor) editor.value = appState[lang].placeholderHtml;
    localStorage.setItem(`wowers_cross_${lang}`, appState[lang].placeholderHtml);
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
    showGlobalToast('Workspace grid link connected!');
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
    showGlobalToast('Template architectural matrix mounted.');
  }
}

function triggerLiveAiGeneration() {
  const lang = getActiveTab();
  const val = document.getElementById(`${lang}-prompt-input`)?.value.trim();
  if (val) generateAiCode(lang);
}

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
- Inside JSON string values, escape double-quotes as \\" and newlines as \\n.

User request: ${rawPrompt}`;
}

async function generateAiCode(lang) {
  const apiKey = normalizeOpenRouterKey(sessionStorage.getItem('openrouter_key'));
  const promptEl = document.getElementById(`${lang}-prompt-input`);
  if (!promptEl) return;
  const rawPrompt = promptEl.value.trim();
  if (!rawPrompt) { alert('Specify system configuration requirements.'); return; }

  const formatOpt = document.getElementById(`${lang}-format-select`)?.value ?? 'inline';
  const depthOpt = document.getElementById(`${lang}-depth-select`)?.value ?? 'full';

  setGeneratingState(lang, true);
  showGlobalToast('⚡ Contacting decentralized core network nodes...');

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
          userMessage: `Generate a ${lang.toUpperCase()} component: ${rawPrompt}`
        })
      });
    } catch (_net) {
      throw new Error('Cannot reach server nodes. Check environment instances.');
    }

    const responseData = await apiResponse.json().catch(async () => {
      return { error: 'Non-JSON Stream Data Exception', rawText: await apiResponse.text() };
    });

    if (!apiResponse.ok) throw new Error(responseData.error || `API error ${apiResponse.status}`);

    const rawText = extractTextPayload(responseData).trim();
    const codeData = parseGeneratedJson(rawText);
    applyGeneratedCode(codeData, lang);
    switchOutputTab(lang, 'code');
    showGlobalToast('✓ AI Framework compiled cleanly.');

  } catch (err) {
    console.error('[WOWERS] Compilation failure:', err.message);
    const template = findStarterTemplate(lang, rawPrompt);
    if (template) {
      applyGeneratedCode(template, lang);
      switchOutputTab(lang, 'code');
      showGlobalToast('Loaded safe local fallback matrix template.');
    } else {
      showGlobalToast('❌ Stream connection failed.');
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
      localStorage.setItem(`wowers_cross_${lang}`, normalized[lang]);
    }
  });

  document.querySelectorAll('.panel').forEach(panel => {
    const pLang = panel.id.split('-')[0];
    const codeTarget = document.getElementById(`${pLang}-code-target`);
    const emptyState = document.getElementById(`${pLang}-empty-view`);
    const explBox = document.getElementById(`${pLang}-explanation-box`);

    if (emptyState) emptyState.style.display = 'none';
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
    html: str(m.html) || (requestedLang === 'html' ? fallback : appState.html.activeCode),
    css: str(m.css) || (requestedLang === 'css' ? fallback : appState.css.activeCode),
    js: str(m.js || m.javascript) || (requestedLang === 'js' ? fallback : appState.js.activeCode),
    explanation: str(m.explanation || m.notes || m.description) || 'Compiled matrix module active.'
  };
}

function str(v) {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.join('\n');
  if (v && typeof v === 'object') return JSON.stringify(v, null, 2);
  return '';
}

function extractTextPayload(apiResponse) {
  const content = apiResponse?.content;
  if (Array.isArray(content)) {
    return content.map(item => (typeof item === 'string' ? item : (item?.text ?? ''))).join('');
  }
  return apiResponse?.text || apiResponse?.content || apiResponse || '';
}

function parseGeneratedJson(rawText) {
  let cleaned = rawText.replace(/^```(json)?\s*/i, '').replace(/
```\s*$/i, '').trim();
  try { return JSON.parse(cleaned); } catch (_) {}
  const fi = cleaned.indexOf('{'), li = cleaned.lastIndexOf('}');
  if (fi >= 0 && li > fi) {
    try { return JSON.parse(cleaned.slice(fi, li + 1)); } catch (_) {}
  }
  throw new Error('Malformed node formatting expression stream.');
}

function sanitizeRunnableScript(src) {
  return String(src || '').replace(/^\s*import\s+[^;]+;?\s*$/gm, '').replace(/\bexport\s+(default\s+)?/g, '');
}

function buildSandboxDoc(html, css, js) {
  const script = sanitizeRunnableScript(js);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{background:#fff;color:#121620;padding:20px;font-family:sans-serif;margin:0}${css}</style></head><body>${html}<script>try{new Function(${JSON.stringify(script)})()}catch(e){console.error("Sandbox error:",e)}<\/script></body></html>`;
}

function syncAllSandboxes() {
  ['html', 'css', 'js'].forEach(lang => syncRuntimeSandbox(lang));
}

function syncRuntimeSandbox(lang) {
  const liveHtml = document.getElementById('html-preview-editor')?.value ?? appState.html.activeCode;
  const liveCss = document.getElementById('css-preview-editor')?.value ?? appState.css.activeCode;
  const liveJs = document.getElementById('js-preview-editor')?.value ?? appState.js.activeCode;

  appState.html.activeCode = liveHtml;
  appState.css.activeCode = liveCss;
  appState.js.activeCode = liveJs;

  localStorage.setItem('wowers_cross_html', liveHtml);
  localStorage.setItem('wowers_cross_css', liveCss);
  localStorage.setItem('wowers_cross_js', liveJs);

  const doc = buildSandboxDoc(liveHtml, liveCss, liveJs);
  const sidebarFrame = document.getElementById(`${lang}-sandbox-frame`);
  if (sidebarFrame) sidebarFrame.srcdoc = doc;
}

function setGeneratingState(lang, loading) {
  const btn = document.querySelector(`#${lang}-panel .generate-btn`);
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading ? '<i class="fa-solid fa-spinner fa-spin"></i> GENERATING...' : '<i class="fa-solid fa-wand-magic-sparkles"></i> GENERATE CORE';
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

function getActiveTab() {
  const activeTabBtn = document.querySelector('.nav-tab.active');
  if (activeTabBtn) {
    if (activeTabBtn.classList.contains('html-nav')) return 'html';
    if (activeTabBtn.classList.contains('css-nav')) return 'css';
    if (activeTabBtn.classList.contains('js-nav')) return 'js';
  }
  return 'html';
}

function openStandaloneView(viewType) {
  const activeLang = getActiveTab();
  
  if (viewType === 'editor') {
    const editorView = document.getElementById('standalone-editor-view');
    const textarea = document.getElementById('standalone-textarea');
    const tabIndicator = document.getElementById('editor-tab-indicator');
    const sourceTextEditor = document.getElementById(`${activeLang}-preview-editor`);
    
    if (editorView && textarea) {
      textarea.value = sourceTextEditor ? sourceTextEditor.value : appState[activeLang].activeCode;
      if (tabIndicator) tabIndicator.textContent = `${activeLang.toUpperCase()} LAYER ACTIVE`;
      editorView.style.display = 'flex';
    }
  } else if (viewType === 'preview') {
    const previewView = document.getElementById('standalone-preview-view');
    const standaloneIframe = document.getElementById('standalone-iframe');
    
    if (previewView && standaloneIframe) {
      const liveHtml = document.getElementById('html-preview-editor') ? document.getElementById('html-preview-editor').value : appState.html.activeCode;
      const liveCss = document.getElementById('css-preview-editor') ? document.getElementById('css-preview-editor').value : appState.css.activeCode;
      const liveJs = document.getElementById('js-preview-editor') ? document.getElementById('js-preview-editor').value : appState.js.activeCode;
      const runnableScript = sanitizeRunnableScript(liveJs);

      standaloneIframe.srcdoc = `
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
          <\/script>
        </body>
        </html>
      `;
      previewView.style.display = 'flex';
    }
  }
}

function closeStandaloneViews() {
  const editorView = document.getElementById('standalone-editor-view');
  const previewView = document.getElementById('standalone-preview-view');
  if (editorView) editorView.style.display = 'none';
  if (previewView) previewView.style.display = 'none';
}

function syncStandaloneToStorage() {
  const textarea = document.getElementById('standalone-textarea');
  if (!textarea) return;
  
  const activeLang = getActiveTab();
  const currentCodeVal = textarea.value;
  
  appState[activeLang].activeCode = currentCodeVal;
  
  const targetMainEditor = document.getElementById(`${activeLang}-preview-editor`);
  if (targetMainEditor) targetMainEditor.value = currentCodeVal;
  
  const targetCodeViewDisplay = document.querySelector(`#${activeLang}-panel #${activeLang}-code-target`);
  if (targetCodeViewDisplay) targetCodeViewDisplay.textContent = currentCodeVal;
  
  syncRuntimeSandbox(activeLang);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStandaloneViews();
  }
});

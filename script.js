// System Local Cache State
const appState = {
  html: {
    activeCode: '',
    placeholderHtml: '<div style="padding: 24px; text-align:center; background:#05050a; border: 2px solid #bd00ff; color:white; border-radius:0px; font-family:monospace;">\n  <h2>// AI ACTIVE DEVELOPMENT ENVIRONMENT</h2>\n  <p>Input instructions or pick scrolling matrix nodes below.</p>\n</div>'
  },
  css: {
    activeCode: '',
    placeholderHtml: '/* Space Sheet Matrix Initial Canvas */\nbody { font-family: monospace; background: #030308; color: #fff; }'
  },
  js: {
    activeCode: '',
    placeholderHtml: '// Core workspace behavioral loops\nconsole.log("Deep space engine active.");'
  }
};

const starterTemplates = [
  {
    lang: 'css', match: 'glass card',
    html: '<section class="glass-card">\n  <p class="eyebrow">PREMIUM MATRIX</p>\n  <h2>CRYSTAL PANEL</h2>\n  <p>Layered frosted space with clear crisp neon borders.</p>\n  <button>EXECUTE REPORT</button>\n</section>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #030308; color: #fff; }\n.glass-card { width: 380px; padding: 32px; border: 1px solid rgba(0,229,255,0.3); background: rgba(12,11,26,0.6); backdrop-filter: blur(12px); box-shadow: 0 0 30px rgba(0,229,255,0.1); font-family: monospace; }\n.glass-card .eyebrow { color: #ff0055; letter-spacing: .15em; font-size: 11px; margin: 0 0 8px; }\n.glass-card h2 { margin: 0 0 12px; font-size: 24px; font-weight: 900; }\n.glass-card button { background: transparent; border: 1px solid #00e5ff; color: #fff; padding: 10px 16px; cursor: pointer; font-family: monospace; }',
    js: 'document.querySelector(".glass-card button")?.addEventListener("click", () => { alert("Matrix stream connected."); });',
    explanation: 'Starter template applied: high contrast architectural glass template.'
  },
  {
    lang: 'css', match: 'neon button',
    html: '<main class="neon-stage">\n  <button class="neon-button">LAUNCH INSTANCE</button>\n</main>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #030308; }\n.neon-button { background: transparent; padding: 16px 32px; border: 1px solid #00e5ff; color: #fff; font-family: monospace; font-weight: bold; letter-spacing: 0.1em; box-shadow: 0 0 15px rgba(0,229,255,0.3); cursor: pointer; transition: all 0.2s ease; }\n.neon-button:hover { box-shadow: 0 0 30px #00e5ff; background: #00e5ff; color: #000; }',
    js: 'document.querySelector(".neon-button")?.addEventListener("click", e => { e.currentTarget.textContent = "SEQUENCE ACTIVE"; });',
    explanation: 'Starter template applied: reactive peripheral glow neon button.'
  },
  {
    lang: 'css', match: 'animated loader',
    html: '<div class="loader-card">\n  <div class="quantum-orbit"></div>\n  <strong>SYNAPSE STREAMING</strong>\n</div>',
    css: 'body { min-height: 100vh; display: grid; place-items: center; background: #030308; color: #fff; font-family: monospace; }\n.loader-card { text-align: center; display: grid; gap: 20px; }\n.quantum-orbit { width: 50px; height: 50px; border: 3px solid rgba(0,229,255,0.1); border-top-color: #00e5ff; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }\n@keyframes spin { to { transform: rotate(360deg); } }',
    js: 'console.log("Loader loop initiated.");',
    explanation: 'Starter template applied: smooth quantum spinning asset.'
  }
];

function getActiveTab() {
  if (document.getElementById('css-panel')?.classList.contains('active')) return 'css';
  if (document.getElementById('js-panel')?.classList.contains('active')) return 'js';
  return 'html';
}

window.addEventListener('DOMContentLoaded', () => {
  // Check Router Parameters for Standalone New Tab behavior
  const urlParams = new URLSearchParams(window.location.search);
  const viewMode = urlParams.get('view');
  const targetLang = urlParams.get('lang') || 'html';

  if (viewMode === 'editor' || viewMode === 'preview') {
    // Override layout immediately to prevent core UI element clutter
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

    // Connect real-time synchronization listeners between windows
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

  // Fallback normal loading process for master page workspace
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

// Sync data back to storage from standalone sub-tabs
function syncStandaloneToStorage() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetLang = urlParams.get('lang') || 'html';
  const val = document.getElementById('standalone-textarea').value;
  localStorage.setItem(`wowers_cross_${targetLang}`, val);
}

function renderStandalonePreview() {
  const h = localStorage.getItem('wowers_cross_html') || '';
  const c = localStorage.getItem('wowers_cross_css') || '';
  const j = localStorage.getItem('wowers_cross_js') || '';
  const frame = document.getElementById('standalone-iframe');
  if (frame) frame.srcdoc = buildSandboxDoc(h, c, j);
}

function openStandaloneView(mode) {
  const currentLang = getActiveTab();
  localStorage.setItem('wowers_cross_html', document.getElementById('html-preview-editor')?.value || appState.html.activeCode);
  localStorage.setItem('wowers_cross_css', document.getElementById('css-preview-editor')?.value || appState.css.activeCode);
  localStorage.setItem('wowers_cross_js', document.getElementById('js-preview-editor')?.value || appState.js.activeCode);
  
  window.open(`${window.location.pathname}?view=${mode}&lang=${currentLang}`, '_blank');
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

// Event handler for user auth submittal
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
  let cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/
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
  const toast = document.getElementById('global-toast');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;
  text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
      }    return;
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

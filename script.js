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
  }
];

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const viewMode = urlParams.get('view');
  const targetLang = urlParams.get('lang') || 'html';

  // 1. BACKUP GLOBAL CLICK LISTENER (Para kahit anong button ang pindutin, gagana)
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' && target.type === 'submit') {
      const btnText = target.innerText || target.value || '';
      if (/login|enter|submit|connect|pasok|bumuo/i.test(btnText)) {
        e.preventDefault();
        saveApiKey();
      }
    }
  });

  // 2. BACKUP GLOBAL ENTER KEY (Kahit nasaan ang cursor, basta nag-Enter sa input, pasok)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      saveApiKey();
    }
  });

  if (viewMode === 'editor' || viewMode === 'preview') {
    forceHideOverlays();
    return;
  }

  initializeEditors();

  // Automatic bypass kung may susi na
  if (sessionStorage.getItem('openrouter_key')) {
    unlockWorkspace();
    return;
  }

  fetch('/api/config')
    .then(r => r.ok ? r.json() : null)
    .then(config => { if (config?.hasServerKey) unlockWorkspace(); })
    .catch(() => {});
});

function forceHideOverlays() {
  const elementsToHide = [
    '#auth-overlay', '.hero-section', '.auth-stage', '.auth-wrapper', '.login-screen'
  ];
  elementsToHide.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.setProperty('display', 'none', 'important');
  });

  const elementsToShow = [
    '#main-application-container', '.workspace-wrapper', '#app-body'
  ];
  elementsToShow.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.setProperty('display', 'flex', 'important');
  });

  document.body.classList.remove('auth-mode');
}

function initializeEditors() {
  ['html', 'css', 'js'].forEach(lang => {
    appState[lang].activeCode = appState[lang].placeholderHtml;
    const editor = document.getElementById(`${lang}-preview-editor`) || document.querySelector(`.${lang}-preview-editor`);
    if (editor) editor.value = appState[lang].placeholderHtml;
    localStorage.setItem(`wowers_cross_${lang}`, appState[lang].placeholderHtml);
  });
}

function unlockWorkspace() {
  // Tatanggalin ang lahat ng posibleng lock screens at ipapakita ang workspace mo
  forceHideOverlays();
  syncAllSandboxes();
}

function saveApiKey() {
  // Hahanapin ang kahit anong input field na pwedeng pagkunang ng key
  const keyInput = document.querySelector('input[type="password"]') || 
                   document.querySelector('input[placeholder*="API"]') ||
                   document.getElementById('apikey-input') ||
                   document.querySelector('input');
                   
  const keyVal = keyInput ? keyInput.value.trim().replace(/^Bearer\s+/i, '') : 'bypass';
  
  // Pinapapasok ka na kahit walang nilagay para hindi ka ma-stuck
  sessionStorage.setItem('openrouter_key', keyVal || 'dev_key');
  showGlobalToast('Workspace grid link connected!');
  unlockWorkspace();
}

// --- REST OF THE LOGIC (STAYS EXACTLY THE SAME) ---
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

function buildSystemPrompt(lang, rawPrompt) {
  return `You are a frontend code generator. Return JSON only: {"html":"","css":"","js":"","explanation":""}. Request: ${rawPrompt}`;
}

async function generateAiCode(lang) {
  const promptEl = document.getElementById(`${lang}-prompt-input`) || document.querySelector(`.${lang}-prompt-input`);
  if (!promptEl) return;
  const rawPrompt = promptEl.value.trim();
  if (!rawPrompt) return;

  setGeneratingState(lang, true);
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt: buildSystemPrompt(lang, rawPrompt), userMessage: rawPrompt })
    });
    const data = await res.json();
    if (data) applyGeneratedCode(data, lang);
  } catch (e) {
    console.error(e);
  } finally {
    setGeneratingState(lang, false);
  }
}

function applyGeneratedCode(codeMatrix, activeLang) {
  ['html', 'css', 'js'].forEach(lang => {
    const val = codeMatrix[lang] || '';
    if (val) {
      appState[lang].activeCode = val;
      const editor = document.getElementById(`${lang}-preview-editor`) || document.querySelector(`.${lang}-preview-editor`);
      if (editor) editor.value = val;
    }
  });
  syncAllSandboxes();
}

function buildSandboxDoc(html, css, js) {
  return `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
}

function syncAllSandboxes() {
  ['html', 'css', 'js'].forEach(lang => syncRuntimeSandbox(lang));
}

function syncRuntimeSandbox(lang) {
  const liveHtml = document.getElementById('html-preview-editor')?.value || appState.html.activeCode;
  const liveCss = document.getElementById('css-css-editor')?.value || appState.css.activeCode;
  const liveJs = document.getElementById('js-preview-editor')?.value || appState.js.activeCode;
  const frame = document.getElementById(`${lang}-sandbox-frame`) || document.querySelector('.sandbox-frame');
  if (frame) frame.srcdoc = buildSandboxDoc(liveHtml, liveCss, liveJs);
}

function setGeneratingState(lang, loading) {
  const btn = document.querySelector(`#${lang}-panel .generate-btn`) || document.querySelector('.generate-btn');
  if (btn) btn.disabled = loading;
}

function showGlobalToast(msg) {
  const toast = document.getElementById('global-toast') || document.querySelector('.toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }
}

function getActiveTab() {
  return 'html';
                            }

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

// Ligtas na Selector Finder
function getEl(idOrClass) {
  if (!idOrClass) return null;
  return document.getElementById(idOrClass) || document.querySelector(idOrClass) || document.querySelector(`.${idOrClass}`) || document.querySelector(`#${idOrClass}`);
}

// FORCE BYPASS LOOK: Awtomatikong pinapagana pagkabasa ng script
window.addEventListener('DOMContentLoaded', () => {
  initializeEditors();
  
  // DIRETSONG FORCE UNLOCK - Nilaktawan na ang lahat ng click, submit, at key checks
  setTimeout(() => {
    unlockWorkspace();
  }, 50);
});

function initializeEditors() {
  ['html', 'css', 'js'].forEach(lang => {
    appState[lang].activeCode = appState[lang].placeholderHtml;
    const editor = getEl(`${lang}-preview-editor`) || getEl(`${lang}-editor-textarea`) || getEl('editor-textarea');
    if (editor) editor.value = appState[lang].placeholderHtml;
    try {
      localStorage.setItem(`wowers_cross_${lang}`, appState[lang].placeholderHtml);
    } catch(e) { console.warn("Storage restricted:", e); }
  });
}

function unlockWorkspace() {
  // 1. Piliting itago ang kahit anong uri ng overlay o login screen sa layout mo
  const overlays = ['#auth-overlay', '.hero-section', '.auth-stage', '.auth-wrapper', '.login-screen'];
  overlays.forEach(sel => {
    const el = getEl(sel);
    if (el) el.style.setProperty('display', 'none', 'important');
  });

  // 2. Piliting ilabas ang iyong workspace containers nang walang kondisyon
  const containers = ['#main-application-container', '.workspace-wrapper', '#app-body', '.app-container'];
  containers.forEach(sel => {
    const el = getEl(sel);
    if (el) {
      el.style.setProperty('display', el.tagName === 'BODY' ? 'block' : 'flex', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
    }
  });

  document.body.classList.remove('auth-mode');
  
  // 3. I-sync ang mga codes sa sandbox structures
  syncAllSandboxes();
}

// WORKSPACE NAVIGATION ENGINE
function switchMainTab(targetLang) {
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(pane => pane.classList.remove('active'));
  
  const activeNav = getEl(`.${targetLang}-nav`) || document.querySelector(`[class*="${targetLang}"][class*="nav"]`);
  const activePanel = getEl(`${targetLang}-panel`) || getEl(`${targetLang}-pane`);
  
  if (activeNav) activeNav.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
  
  syncRuntimeSandbox(targetLang);
}

function switchOutputTab(lang, viewMode) {
  const panel = getEl(`${lang}-panel`);
  if (!panel) return;
  
  ['code', 'preview'].forEach(mode => {
    panel.querySelector(`#${lang}-btn-${mode}`)?.classList.remove('active');
    panel.querySelector(`#${lang}-pane-${mode}`)?.classList.remove('active');
  });
  
  panel.querySelector(`#${lang}-btn-${viewMode}`)?.classList.add('active');
  panel.querySelector(`#${lang}-pane-${viewMode}`)?.classList.add('active');
  
  if (viewMode === 'preview') syncRuntimeSandbox(lang);
}

function triggerLiveAiGeneration() {
  const lang = getActiveTab();
  generateAiCode(lang);
}

async function generateAiCode(lang) {
  const promptEl = getEl(`${lang}-prompt-input`) || getEl('.prompt-input');
  if (!promptEl) return;
  const rawPrompt = promptEl.value.trim();
  if (!rawPrompt) return;

  setGeneratingState(lang, true);
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt: `Return pure JSON only: {"html":"","css":"","js":"","explanation":""}. Request: ${rawPrompt}`,
        userMessage: rawPrompt
      })
    });
    const data = await res.json();
    if (data) applyGeneratedCode(data, lang);
  } catch (err) {
    console.error(err);
  } finally {
    setGeneratingState(lang, false);
  }
}

function applyGeneratedCode(codeMatrix, activeLang) {
  if (!codeMatrix) return;
  
  ['html', 'css', 'js'].forEach(lang => {
    const codeVal = codeMatrix[lang] || '';
    if (codeVal) {
      appState[lang].activeCode = codeVal;
      const editor = getEl(`${lang}-preview-editor`) || getEl(`${lang}-editor-textarea`);
      if (editor) editor.value = codeVal;
      try { localStorage.setItem(`wowers_cross_${lang}`, codeVal); } catch(e){}
    }
  });

  const codeTarget = getEl(`${activeLang}-code-target`) || document.querySelector('.compiled-display');
  if (codeTarget) codeTarget.textContent = appState[activeLang].activeCode;

  syncAllSandboxes();
}

function buildSandboxDoc(html, css, js) {
  return `<!DOCTYPE html><html><head><style>body{margin:0;padding:20px;color:#121620;background:#fff;font-family:sans-serif;}${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
}

function syncAllSandboxes() {
  ['html', 'css', 'js'].forEach(lang => syncRuntimeSandbox(lang));
}

function syncRuntimeSandbox(lang) {
  const liveHtml = getEl('html-preview-editor')?.value || getEl('html-editor-textarea')?.value || appState.html.activeCode;
  const liveCss = getEl('css-preview-editor')?.value || getEl('css-editor-textarea')?.value || appState.css.activeCode;
  const liveJs = getEl('js-preview-editor')?.value || getEl('js-editor-textarea')?.value || appState.js.activeCode;

  appState.html.activeCode = liveHtml;
  appState.css.activeCode = liveCss;
  appState.js.activeCode = liveJs;

  const frame = getEl(`${lang}-sandbox-frame`) || getEl('sandbox-frame') || document.querySelector('iframe');
  if (frame) {
    frame.srcdoc = buildSandboxDoc(liveHtml, liveCss, liveJs);
  }
}

function setGeneratingState(lang, loading) {
  const btn = document.querySelector(`#${lang}-panel .generate-btn`) || document.querySelector('.generate-btn');
  if (btn) btn.disabled = loading;
}

function showGlobalToast(msg) {
  const toast = getEl('global-toast') || getEl('.toast');
  const txt = getEl('toast-text') || getEl('.toast-text') || toast;
  if (toast) {
    if (txt && txt !== toast) txt.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
}

function getActiveTab() {
  const activeTabBtn = document.querySelector('.nav-tab.active');
  if (activeTabBtn) {
    if (activeTabBtn.classList.contains('html-nav') || activeTabBtn.textContent.includes('HTML')) return 'html';
    if (activeTabBtn.classList.contains('css-nav') || activeTabBtn.textContent.includes('CSS')) return 'css';
    if (activeTabBtn.classList.contains('js-nav') || activeTabBtn.textContent.includes('JS')) return 'js';
  }
  return 'html';
        }

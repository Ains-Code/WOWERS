// System Local Cache State
const appState = {
  html: { activeCode: '', placeholderHtml: '<div style="padding: 24px; text-align:center; background:#10131f; border: 2px solid #7c4dff; color:white; border-radius:8px; font-family:sans-serif;">\n  <h2>AI Active Development Environment</h2>\n  <p>Input text instructions or pick quick templates to fire true real-time generation arrays.</p>\n</div>' },
  css: { activeCode: '/* CSS Placeholder Initial Setup Sheets */\nbody { font-family: sans-serif; }', placeholderHtml: '/* initial default stylesheet setup values */' },
  js: { activeCode: '// JavaScript active test canvas scripts\nconsole.log("Workspace engine active.");', placeholderHtml: '// listener template arrays' }
};

// Check for existing API key immediately upon loading page
window.addEventListener('DOMContentLoaded', () => {
  appState.html.activeCode = appState.html.placeholderHtml;
  appState.css.activeCode = appState.css.placeholderHtml;
  appState.js.activeCode = appState.js.placeholderHtml;

  if(document.getElementById('html-preview-editor')) document.getElementById('html-preview-editor').value = appState.html.placeholderHtml;
  if(document.getElementById('css-preview-editor')) document.getElementById('css-preview-editor').value = appState.css.placeholderHtml;
  if(document.getElementById('js-preview-editor')) document.getElementById('js-preview-editor').value = appState.js.placeholderHtml;

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

function unlockWorkspace() {
  if(document.getElementById('app-body')) document.getElementById('app-body').classList.remove('auth-mode');
  syncRuntimeSandbox('html');
  syncRuntimeSandbox('css');
  syncRuntimeSandbox('js');
}

function saveApiKey() {
  const keyInput = document.getElementById('apikey-input');
  if(!keyInput) return;
  const keyVal = keyInput.value.trim();
  if (keyVal) {
    sessionStorage.setItem('openrouter_key', keyVal);
    showGlobalToast("OpenRouter Engine connected successfully!");
    unlockWorkspace();
  } else {
    alert("Please insert a valid OpenRouter token key.");
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
    generateAiCode(lang); 
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
  const apiKey = sessionStorage.getItem('openrouter_key') || '';

  const promptInput = document.getElementById(`${lang}-prompt-input`);
  if(!promptInput) return;
  const rawPrompt = promptInput.value.trim();
  if(!rawPrompt) {
    alert("Please provide asset style design guidelines description attributes first.");
    return;
  }

  const formatOpt = document.getElementById(`${lang}-format-select`) ? document.getElementById(`${lang}-format-select`).value : 'inline';
  const depthOpt = document.getElementById(`${lang}-depth-select`) ? document.getElementById(`${lang}-depth-select`).value : 'full';

  showGlobalToast("Contacting AI workspace nodes...");
  
  const structuralSystemBlueprintPrompt = `
    You are an expert Frontend Component Code Generator. You output valid JSON data formats ONLY.
    Your response must match this schema layout map precisely without any markdown block formatting code wrappers (\`\`\`json etc):
    {
      "html": "Pure layout markup block content here",
      "css": "Clean workspace style definitions sheets rules here",
      "js": "Functional execution event script codes here",
      "explanation": "Detailed breakdown documentation lines string analysis"
    }

    User requirements context parameters:
    - Current Workspace panel: "${lang.toUpperCase()}".
    - Design Intent Request prompt: "${rawPrompt}".
    - Style configuration option applied: "${formatOpt}".
    - Content output depth option applied: "${depthOpt}".
    
    CRITICAL Instruction:
    Provide interactive code blocks inside all JSON parameters (html, css, js) so they link up seamlessly and completely fill the preview sandbox runtime canvas simultaneously. Do not wrap anything inside markdown.
  `;

  try {
    const apiServerResponse = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-openrouter-key': apiKey } : {})
      },
      body: JSON.stringify({
        systemPrompt: structuralSystemBlueprintPrompt,
        userMessage: 'Process component code layers generation formatting following target instructions.'
      })
    });

    const operationalDataResult = await apiServerResponse.json().catch(() => ({}));

    if(!apiServerResponse.ok) {
      throw new Error(operationalDataResult.error || 'API call transmission processing error.');
    }

    const cleanContentString = extractTextPayload(operationalDataResult).trim();
    const structuralCodeMatrix = parseGeneratedJson(cleanContentString);

    const htmlEditor = document.getElementById('html-preview-editor');
    const cssEditor = document.getElementById('css-preview-editor');
    const jsEditor = document.getElementById('js-preview-editor');

    if(structuralCodeMatrix.html) {
      appState.html.activeCode = structuralCodeMatrix.html;
      if(htmlEditor) htmlEditor.value = structuralCodeMatrix.html;
    }
    if(structuralCodeMatrix.css) {
      appState.css.activeCode = structuralCodeMatrix.css;
      if(cssEditor) cssEditor.value = structuralCodeMatrix.css;
    }
    if(structuralCodeMatrix.js) {
      appState.js.activeCode = structuralCodeMatrix.js;
      if(jsEditor) jsEditor.value = structuralCodeMatrix.js;
    }

    // Populate display output containers and hide empty archive screen states cleanly!
    document.querySelectorAll('.panel').forEach(p => {
      const pLang = p.id.split('-')[0];
      const codeTarget = p.querySelector(`#${pLang}-code-target`);
      const emptyState = p.querySelector(`#${pLang}-empty-view`);
      const explanationContainer = p.querySelector(`#${pLang}-explanation-box`);

      if(emptyState) emptyState.style.display = 'none';
      if(codeTarget) {
        codeTarget.style.display = 'block';
        codeTarget.textContent = structuralCodeMatrix[pLang] || '';
      }
      if(explanationContainer && structuralCodeMatrix.explanation) {
        explanationContainer.replaceChildren();
        const explanationParagraph = document.createElement('p');
        explanationParagraph.textContent = structuralCodeMatrix.explanation;
        explanationContainer.appendChild(explanationParagraph);
      }
    });

    // Recompile sandbox states concurrently
    syncRuntimeSandbox('html');
    syncRuntimeSandbox('css');
    syncRuntimeSandbox('js');
    showGlobalToast("AI Component assets compiled successfully!");

  } catch (error) {
    console.error("AI Generation processing fault details: ", error);
    alert(error.message || "AI compilation module error encountered. Please check your OpenRouter Key settings.");
  }
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

function syncRuntimeSandbox(lang) {
  const frameElement = document.getElementById(`${lang}-sandbox-frame`);
  if(!frameElement) return;

  const liveHtml = document.getElementById('html-preview-editor') ? document.getElementById('html-preview-editor').value : appState.html.activeCode;
  const liveCss = document.getElementById('css-preview-editor') ? document.getElementById('css-preview-editor').value : appState.css.activeCode;
  const liveJs = document.getElementById('js-preview-editor') ? document.getElementById('js-preview-editor').value : appState.js.activeCode;

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

function copyWorkspaceOutput(lang) {
  const editorElement = document.getElementById(`${lang}-preview-editor`);
  const liveContent = editorElement ? editorElement.value : appState[lang].activeCode;
  navigator.clipboard.writeText(liveContent || '').then(() => {
    showGlobalToast("Copied code context payload cleanly!");
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

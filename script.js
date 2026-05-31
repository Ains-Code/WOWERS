var state = { css: { code: '' }, js: { code: '' }, html: { code: '' } };
var previewBg = '#ffffff';

function switchTab(tab) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById(tab + '-panel').classList.add('active');
  document.querySelector('.' + tab + '-tab').classList.add('active');
}

function switchOut(lang, tab, btn) {
  var panel = document.getElementById(lang + '-panel');
  panel.querySelectorAll('.output-pane').forEach(function(p) { p.classList.remove('active'); });
  panel.querySelectorAll('.out-tab').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById(lang + '-' + tab + '-pane').classList.add('active');
  btn.classList.add('active');
  if (lang !== 'html' && tab === 'preview') refreshPreview(lang);
}

function setTpl(lang, text) {
  document.getElementById(lang + '-input').value = text;
  document.getElementById(lang + '-input').focus();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCSS(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, function(m) { return '<span class="tk-comment">' + m + '</span>'; })
    .replace(/([.#\w][^{]*)\{/g, function(m, sel) { return '<span class="tk-selector">' + sel + '</span>{'; })
    .replace(/([\w-]+)\s*:/g, function(m, p) { return '<span class="tk-property">' + p + '</span>:'; })
    .replace(/:\s*([^;{}\n]+)/g, function(m, v) { return ': <span class="tk-value">' + v + '</span>'; })
    .replace(/[{}]/g, function(m) { return '<span class="tk-brace">' + m + '</span>'; });
}

function highlightJS(code) {
  var kw = /\b(const|let|var|function|return|if|else|for|while|class|new|this|typeof|import|export|default|async|await|try|catch|finally|switch|case|break|continue|null|undefined|true|false|of|in)\b/g;
  return code
    .replace(/\/\/.*/g, function(m) { return '<span class="tk-comment">' + m + '</span>'; })
    .replace(/\/\*[\s\S]*?\*\//g, function(m) { return '<span class="tk-comment">' + m + '</span>'; })
    .replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/g, function(m) { return '<span class="tk-string">' + m + '</span>'; })
    .replace(kw, function(m) { return '<span class="tk-keyword">' + m + '</span>'; })
    .replace(/\b(\d+\.?\d*)\b/g, function(m) { return '<span class="tk-number">' + m + '</span>'; })
    .replace(/\b([A-Za-z_$][\w$]*)\s*(?=\()/g, function(m, n) { return '<span class="tk-function">' + n + '</span>('; });
}

function highlightHTML(code) {
  var e = escapeHtml(code);
  return e
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, function(m) { return '<span class="tk-comment">' + m + '</span>'; })
    .replace(/(&lt;\/?)([\w-]+)/g, function(m, s, t) { return '<span class="tk-brace">' + s + '</span><span class="tk-selector">' + t + '</span>'; })
    .replace(/([\w-]+)=(&quot;)/g, function(m, a, q) { return '<span class="tk-property">' + a + '</span>=' + q; })
    .replace(/(&gt;)/g, function(m) { return '<span class="tk-brace">' + m + '</span>'; });
}

function handleTab(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    var ta = e.target, s = ta.selectionStart, end = ta.selectionEnd;
    ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = s + 2;
    liveRefresh();
  }
}

function liveRefresh() {
  var html = document.getElementById('html-live-editor').value;
  var iframe = document.getElementById('html-live-iframe');
  var doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;background:' + previewBg + ';}</style></head><body>' + html + '</body></html>';
  iframe.srcdoc = doc;
}

function resetLiveEditor() {
  document.getElementById('html-live-editor').value = state.html.code;
  liveRefresh();
}

function setPreviewBg(color) {
  previewBg = color;
  liveRefresh();
}

function refreshPreview(lang) {
  var code = state[lang].code;
  if (!code) return;
  var htmlInput = document.getElementById(lang + '-html-input').value;
  var iframe = document.getElementById(lang + '-iframe');
  var doc;
  if (lang === 'css') {
    doc = '<!DOCTYPE html><html><head><style>body{margin:0;padding:20px;font-family:sans-serif;background:#fff;}' + code + '</style></head><body>' + (htmlInput || '<p style="color:#999;font-size:13px">Add HTML above to preview with your CSS</p>') + '</body></html>';
  } else {
    doc = '<!DOCTYPE html><html><head><style>body{margin:0;padding:20px;font-family:sans-serif;background:#fff;}</style></head><body>' + (htmlInput || '<p style="color:#999;font-size:13px">Add HTML above to preview with your JS</p>') + '<scr' + 'ipt>' + code + '</scr' + 'ipt></body></html>';
  }
  iframe.srcdoc = doc;
}

async function generate(lang) {
  var input = document.getElementById(lang + '-input').value.trim();
  if (!input) { showErr(lang, 'Please describe what you want first.'); return; }
  hideErr(lang);

  var btn = document.getElementById(lang + '-gen-btn');
  btn.disabled = true;
  btn.classList.add('loading');

  var styleType     = (document.getElementById(lang + '-style-type')  || {}).value || '';
  var detailLevel   = (document.getElementById(lang + '-detail-level') || {}).value || 'clean';
  var styleMode     = (document.getElementById('html-style-mode')     || {}).value || 'inline';
  var htmlDetail    = (document.getElementById('html-detail-level')   || {}).value || 'clean';

  var sys = '';
  if (lang === 'css') {
    var ct = styleType === 'variables' ? 'CSS with custom properties' : styleType === 'tailwind' ? 'Tailwind CSS class names with example HTML' : styleType === 'scss' ? 'SCSS/Sass' : 'vanilla CSS';
    var cc = detailLevel === 'commented' ? 'Add comments explaining each section.' : detailLevel === 'full' ? 'Add comments and append EXPLAIN_START then a plain-English explanation then EXPLAIN_END at the very end.' : 'No comments.';
    sys = 'You are an expert CSS generator. Output only ' + ct + '. ' + cc + ' No markdown fences, no preamble.';
  } else if (lang === 'js') {
    var jt = styleType === 'jquery' ? 'jQuery' : styleType === 'async' ? 'async/await JavaScript' : styleType === 'es6' ? 'ES6+ JavaScript' : 'vanilla JavaScript';
    var jc = detailLevel === 'commented' ? 'Add comments explaining each section.' : detailLevel === 'full' ? 'Add comments and append EXPLAIN_START then a plain-English explanation then EXPLAIN_END at the very end.' : 'No comments.';
    sys = 'You are an expert JavaScript generator. Output only ' + jt + '. ' + jc + ' No markdown fences, no preamble.';
  } else {
    var hs = styleMode === 'separate' ? 'Put all CSS in a style block in the head.' : styleMode === 'tailwind' ? 'Use Tailwind CSS. Add the Tailwind CDN script in the head.' : styleMode === 'bare' ? 'No styling whatsoever.' : 'Use inline style attributes — fully self-contained.';
    var hc = htmlDetail === 'commented' ? 'Add HTML comments.' : htmlDetail === 'full' ? 'Add comments and append EXPLAIN_START then a plain-English explanation then EXPLAIN_END at the very end.' : '';
    sys = 'You are an expert HTML generator. Output complete ready-to-use HTML. ' + hs + ' ' + hc + ' No markdown fences, no preamble.';
  }

  try {
    // Points directly to our Node.js middleware server setup
    var resp = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt: sys, userPrompt: input })
    });
    
    if(!resp.ok) throw new Error('Backend failed connection');
    
    var data = await resp.json();
    var code = data.text || '';

    var explanation = '';
    var em = code.match(/EXPLAIN_START([\s\S]*?)EXPLAIN_END/);
    if (em) { explanation = em[1].trim(); code = code.replace(/EXPLAIN_START[\s\S]*?EXPLAIN_END/, '').trim(); }
    code = code.replace(/^```[\w]*\n?/gm, '').replace(/^```\s*$/gm, '').trim();

    state[lang].code = code;

    var codeEl = document.getElementById(lang + '-code-out');
    document.getElementById(lang + '-empty').style.display = 'none';
    codeEl.style.display = 'block';
    codeEl.innerHTML = lang === 'css' ? highlightCSS(escapeHtml(code)) : lang === 'js' ? highlightJS(escapeHtml(code)) : highlightHTML(code);

    if (lang === 'html') {
      document.getElementById('html-live-editor').value = code;
      liveRefresh();
      var previewBtn = document.querySelector('#html-panel .out-tab:nth-child(2)');
      if (previewBtn) switchOut('html', 'preview', previewBtn);
    }

    var explainEl = document.getElementById(lang + '-explain-content');
    if (explanation) {
      var lines = explanation.split('\n').filter(function(l) { return l.trim(); });
      explainEl.innerHTML = lines.map(function(line) {
        if (/^#+\s/.test(line)) return '<h3>' + line.replace(/^#+\s*/, '') + '</h3>';
        if (/^[-•]\s/.test(line)) return '<li>' + line.replace(/^[-•]\s*/, '') + '</li>';
        return '<p>' + line + '</p>';
      }).join('');
    } else {
      explainEl.innerHTML = '<p>No explanation generated. Select <strong>Full breakdown</strong> to get one.</p>';
    }

  } catch(err) {
    showErr(lang, 'Failed to generate. Check your local server connection and try again.');
    console.error(err);
  }

  btn.disabled = false;
  btn.classList.remove('loading');
}

function copyOut(lang) {
  if (!state[lang].code) return;
  navigator.clipboard.writeText(state[lang].code).then(function() { showToast('Copied!'); });
}

function dlOut(lang) {
  if (!state[lang].code) return;
  var ext = lang === 'css' ? 'css' : lang === 'js' ? 'js' : 'html';
  var blob = new Blob([state[lang].code], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'generated.' + ext;
  a.click();
  showToast('Downloaded as generated.' + ext);
}

function showToast(msg) {
  var t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2500);
}

function showErr(lang, msg) {
  var el = document.getElementById(lang + '-error');
  document.getElementById(lang + '-error-msg').textContent = msg;
  el.classList.add('show');
}

function hideErr(lang) {
  document.getElementById(lang + '-error').classList.remove('show');
}

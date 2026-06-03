/* ============================================================
   WOWERS — space.js
   Starfield canvas renderer + new-tab helper functions.
   Loaded BEFORE script.js in index.html.
   ============================================================ */

/* ─────────────────────────────────────────────────
   STARFIELD + NEBULA CANVAS
───────────────────────────────────────────────── */
(function initSpaceCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const stars   = [];
  const nebulae = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Stars */
  for (let i = 0; i < 280; i++) {
    stars.push({
      x:       Math.random(),
      y:       Math.random(),
      r:       Math.random() * 1.2 + 0.2,
      alpha:   Math.random() * 0.6 + 0.1,
      speed:   Math.random() * 0.0003 + 0.0001,
      twinkle: Math.random() * Math.PI * 2
    });
  }

  /* Nebula blobs */
  const nebulaColors = [
    'rgba(0,128,255,0.03)',
    'rgba(128,0,255,0.025)',
    'rgba(0,245,255,0.02)',
    'rgba(255,0,170,0.015)',
    'rgba(0,255,136,0.015)',
    'rgba(0,64,128,0.03)',
  ];
  for (let i = 0; i < 6; i++) {
    nebulae.push({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     200 + Math.random() * 300,
      color: nebulaColors[i % nebulaColors.length]
    });
  }

  /* Shooting stars */
  const shoots = [];
  function spawnShoot() {
    shoots.push({
      x:  Math.random() * W,
      y:  Math.random() * H * 0.5,
      vx: 6 + Math.random() * 6,
      vy: 2 + Math.random() * 3,
      len: 80 + Math.random() * 80,
      alpha: 1
    });
  }
  setInterval(spawnShoot, 3200);

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Nebulae */
    nebulae.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
    });

    /* Stars */
    t += 0.012;
    stars.forEach(s => {
      const tw = Math.sin(t * 0.8 + s.twinkle) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${s.alpha * tw})`;
      ctx.fill();
      s.x += s.speed;
      if (s.x > 1) s.x = 0;
    });

    /* Shooting stars */
    for (let i = shoots.length - 1; i >= 0; i--) {
      const s = shoots[i];
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.4);
      grad.addColorStop(0, `rgba(0,245,255,${s.alpha * 0.9})`);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y - s.len * 0.4);
      ctx.stroke();
      s.x     += s.vx;
      s.y     += s.vy;
      s.alpha -= 0.018;
      if (s.alpha <= 0 || s.x > W + 50 || s.y > H + 50) shoots.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ─────────────────────────────────────────────────
   ACTIVE TAB HELPER
   (index.html has its own inline version that runs
    later and may override this — that's intentional)
───────────────────────────────────────────────── */
function getActiveTab() {
  if (document.getElementById('css-panel')?.classList.contains('active'))  return 'css';
  if (document.getElementById('js-panel')?.classList.contains('active'))   return 'js';
  return 'html';
}


/* ─────────────────────────────────────────────────
   NEW-TAB HELPERS
───────────────────────────────────────────────── */

/**
 * Opens the raw source code for `lang` in a clean, styled new tab.
 * Reads from the editor textarea first, falls back to appState.
 */
function openCodeInNewTab(lang) {
  const code = document.getElementById(`${lang}-preview-editor`)?.value
            || (window.appState && window.appState[lang]?.activeCode)
            || '';

  const w = window.open('', '_blank');
  if (!w) return;

  w.document.write(
    `<!DOCTYPE html><html><head>` +
    `<meta charset="UTF-8">` +
    `<title>${lang.toUpperCase()} — WOWERS Code Editor</title>` +
    `<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">` +
    `<style>` +
    `*{margin:0;padding:0;box-sizing:border-box}` +
    `body{background:#000308;color:#6a8aaa;` +
    `font-family:'Share Tech Mono',monospace;` +
    `font-size:13px;line-height:1.8;padding:32px;` +
    `min-height:100vh;}` +
    `pre{white-space:pre-wrap;word-break:break-word;}` +
    `/* neon top bar */` +
    `#top{position:fixed;top:0;left:0;right:0;height:3px;` +
    `background:linear-gradient(90deg,#00f5ff,#8000ff,#ff00aa);` +
    `z-index:9;}` +
    `#label{position:fixed;top:10px;right:20px;` +
    `font-size:9px;letter-spacing:.15em;color:#2a3a55;` +
    `font-family:'Share Tech Mono',monospace;text-transform:uppercase;}` +
    `</style></head><body>` +
    `<div id="top"></div>` +
    `<div id="label">WOWERS // ${lang.toUpperCase()} SOURCE</div>` +
    `<pre>${escHtml(code)}</pre>` +
    `</body></html>`
  );
  w.document.close();
}

/**
 * Opens the fully-composed live preview (HTML + CSS + JS) in a
 * clean new tab with zero UI chrome.
 */
function openPreviewInNewTab() {
  const liveHtml = document.getElementById('html-preview-editor')?.value || '';
  const liveCss  = document.getElementById('css-preview-editor')?.value  || '';
  const liveJs   = document.getElementById('js-preview-editor')?.value   || '';

  /* Strip ES-module syntax that would break in a plain script context */
  const safeJs = liveJs
    .replace(/^\s*import\s+[^;]+;?\s*$/gm, '')
    .replace(/\bexport\s+default\s+/g, '')
    .replace(/\bexport\s+(?=(async\s+)?function|class|const|let|var)/g, '');

  const doc =
    `<!DOCTYPE html><html><head>` +
    `<meta charset="UTF-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1.0">` +
    `<title>Live Preview — WOWERS</title>` +
    `<style>${liveCss}</style>` +
    `</head><body>` +
    `${liveHtml}` +
    `<script>try{(function(){${safeJs}})()}catch(e){console.error('[WOWERS preview]',e)}<\/script>` +
    `</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(doc);
  w.document.close();
}

/**
 * HTML-escape helper used by openCodeInNewTab.
 */
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

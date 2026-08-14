/* ════════════════════════════════════
   SAND ART STUDIO
════════════════════════════════════ */
let sa = { canvas:null, ctx:null, color:'#F28B82', grains:[], drawing:false, rafId:null, init:false };

function saStart() {
  sa.canvas = document.getElementById('sandCanvas');
  if (!sa.canvas) return;
  const area = sa.canvas.parentElement;
  sa.canvas.width = Math.max(200, area.clientWidth);
  sa.canvas.height = 380;
  sa.ctx = sa.canvas.getContext('2d');

  if (!sa.init) {
    sa.canvas.addEventListener('mousedown', e => { sa.drawing = true; saPour(saPos(e)); });
    sa.canvas.addEventListener('mousemove', e => { if (sa.drawing) saPour(saPos(e)); });
    sa.canvas.addEventListener('mouseup', () => sa.drawing = false);
    sa.canvas.addEventListener('mouseleave', () => sa.drawing = false);
    sa.canvas.addEventListener('touchstart', e => { e.preventDefault(); sa.drawing = true; saPour(saTouchPos(e)); }, {passive:false});
    sa.canvas.addEventListener('touchmove', e => { e.preventDefault(); if (sa.drawing) saPour(saTouchPos(e)); }, {passive:false});
    sa.canvas.addEventListener('touchend', () => sa.drawing = false);
    sa.init = true;
  }
  if (sa.rafId) cancelAnimationFrame(sa.rafId);
  sa.rafId = requestAnimationFrame(saLoop);
}
function saPos(e) {
  const r = sa.canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (sa.canvas.width / r.width), y: (e.clientY - r.top) * (sa.canvas.height / r.height) };
}
function saTouchPos(e) {
  const r = sa.canvas.getBoundingClientRect(), t = e.touches[0];
  return { x: (t.clientX - r.left) * (sa.canvas.width / r.width), y: (t.clientY - r.top) * (sa.canvas.height / r.height) };
}
function saPour(p) {
  for (let i = 0; i < 4; i++) {
    sa.grains.push({
      x: p.x + (Math.random()-0.5)*14, y: Math.max(0, p.y - 10),
      vy: 0.5 + Math.random()*0.8, vx: (Math.random()-0.5)*0.3,
      settled: false, color: sa.color, size: 2 + Math.random()*1.5
    });
  }
  if (sa.grains.length > 3500) sa.grains.splice(0, sa.grains.length - 3500);
}
function saSetColor(el, color) {
  document.querySelectorAll('.sa-color').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  sa.color = color;
}
function saClear() {
  sa.grains = [];
  toast2('🏖️ Bottle emptied');
}
function saLoop() {
  if (!sa.canvas || !document.getElementById('cz-sand')?.classList.contains('visible')) return;
  const c = sa.ctx, W = sa.canvas.width, H = sa.canvas.height;
  c.fillStyle = '#FFFFFF';
  c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(45,55,72,0.08)';
  c.lineWidth = 2;
  c.strokeRect(1, 1, W-2, H-2);

  const cellSize = 3;
  for (const g of sa.grains) {
    if (!g.settled) {
      g.y += g.vy; g.x += g.vx;
      g.vy = Math.min(g.vy + 0.05, 3);
      // Check floor or pile collision (simple heuristic: settle near bottom or near other settled grains below)
      const below = sa.grains.find(o => o !== g && o.settled && Math.abs(o.x - g.x) < cellSize*1.5 && o.y - g.y < cellSize*1.8 && o.y > g.y);
      if (g.y >= H - g.size - 2 || below) {
        g.y = below ? below.y - cellSize*1.7 : H - g.size - 2;
        g.settled = true;
        g.x += (Math.random()-0.5)*2; // slight settle jitter for natural pile look
      }
      if (g.x < g.size) g.x = g.size;
      if (g.x > W - g.size) g.x = W - g.size;
    }
    c.beginPath();
    c.arc(g.x, g.y, g.size, 0, Math.PI*2);
    c.fillStyle = g.color;
    c.globalAlpha = 0.85;
    c.fill();
    c.globalAlpha = 1;
  }
  sa.rafId = requestAnimationFrame(saLoop);
}

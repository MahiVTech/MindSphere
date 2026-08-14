/* ════════════════════════════════════
   GRAVITY SANDBOX
════════════════════════════════════ */
let gv = { canvas:null, ctx:null, bodies:[], tool:'star', dragging:null, dragStart:null, rafId:null, init:false };
const GV_PRESETS = {
  star:      { r:5,  mass:8,   color:'#6FA8FF' },
  planet:    { r:11, mass:30,  color:'#9FD3A8' },
  sun:       { r:20, mass:140, color:'#F6C453' },
  blackhole: { r:14, mass:400, color:'#2D3748' }
};

function gvStart() {
  gv.canvas = document.getElementById('gravityCanvas');
  if (!gv.canvas) return;
  const area = gv.canvas.parentElement;
  gv.canvas.width = Math.max(200, area.clientWidth);
  gv.canvas.height = 380;
  gv.ctx = gv.canvas.getContext('2d');

  if (!gv.init) {
    gv.canvas.addEventListener('mousedown', gvMouseDown);
    gv.canvas.addEventListener('mousemove', gvMouseMove);
    gv.canvas.addEventListener('mouseup', gvMouseUp);
    gv.canvas.addEventListener('touchstart', e => { e.preventDefault(); gvMouseDown(gvTouchToMouse(e)); }, {passive:false});
    gv.canvas.addEventListener('touchmove', e => { e.preventDefault(); gvMouseMove(gvTouchToMouse(e)); }, {passive:false});
    gv.canvas.addEventListener('touchend', () => { gvMouseUp(); }, {passive:false});
    gv.init = true;
  }
  if (gv.rafId) cancelAnimationFrame(gv.rafId);
  gv.rafId = requestAnimationFrame(gvLoop);
}

function gvTouchToMouse(e) {
  const t = e.touches[0] || e.changedTouches[0];
  return { clientX: t.clientX, clientY: t.clientY };
}
function gvPos(e) {
  const r = gv.canvas.getBoundingClientRect();
  const sx = gv.canvas.width / r.width, sy = gv.canvas.height / r.height;
  return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
}
function gvMouseDown(e) {
  const p = gvPos(e);
  gv.dragging = { x: p.x, y: p.y };
  gv.dragStart = { x: p.x, y: p.y };
}
function gvMouseMove(e) {
  if (gv.dragging) { const p = gvPos(e); gv.dragging.x = p.x; gv.dragging.y = p.y; }
}
function gvMouseUp() {
  if (!gv.dragging || !gv.dragStart) return;
  const preset = GV_PRESETS[gv.tool];
  const vx = (gv.dragStart.x - gv.dragging.x) * -0.04;
  const vy = (gv.dragStart.y - gv.dragging.y) * -0.04;
  gv.bodies.push({
    x: gv.dragStart.x, y: gv.dragStart.y,
    vx, vy, r: preset.r, mass: preset.mass, color: preset.color,
    trail: [], isBlackHole: gv.tool === 'blackhole'
  });
  const cntEl = document.getElementById('gv-count');
  if (cntEl) cntEl.textContent = gv.bodies.length;
  gv.dragging = null; gv.dragStart = null;
}
function gvSetTool(el, tool) {
  document.querySelectorAll('.gv-tool').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  gv.tool = tool;
}
function gvClear() {
  gv.bodies = [];
  const cntEl = document.getElementById('gv-count');
  if (cntEl) cntEl.textContent = 0;
  toast2('🌌 Space cleared');
}

function gvLoop() {
  if (!gv.canvas || !document.getElementById('cz-gravity').classList.contains('visible')) return;
  const c = gv.ctx, W = gv.canvas.width, H = gv.canvas.height;
  c.fillStyle = '#0B0F1E';
  c.fillRect(0, 0, W, H);

  c.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 60; i++) {
    const sx = (i * 137.5) % W, sy = (i * 219.3) % H;
    c.globalAlpha = 0.15 + (Math.sin(i + Date.now()*0.0005) * 0.5 + 0.5) * 0.25;
    c.fillRect(sx, sy, 1.2, 1.2);
  }
  c.globalAlpha = 1;

  const G = 0.4;
  for (let i = 0; i < gv.bodies.length; i++) {
    const a = gv.bodies[i];
    for (let j = 0; j < gv.bodies.length; j++) {
      if (i === j) continue;
      const b = gv.bodies[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const distSq = dx*dx + dy*dy;
      const dist = Math.sqrt(distSq) || 1;
      if (dist < a.r + b.r) continue;
      const force = (G * a.mass * b.mass) / distSq;
      a.vx += (force * dx / dist) / a.mass;
      a.vy += (force * dy / dist) / a.mass;
    }
  }

  for (const b of gv.bodies) {
    b.x += b.vx; b.y += b.vy;
    if (b.x < -40) b.x = W + 40; if (b.x > W + 40) b.x = -40;
    if (b.y < -40) b.y = H + 40; if (b.y > H + 40) b.y = -40;
    b.trail.push({x:b.x, y:b.y});
    if (b.trail.length > 40) b.trail.shift();
  }

  for (const b of gv.bodies) {
    for (let t = 0; t < b.trail.length - 1; t++) {
      const alpha = (t / b.trail.length) * 0.35;
      c.beginPath();
      c.moveTo(b.trail[t].x, b.trail[t].y);
      c.lineTo(b.trail[t+1].x, b.trail[t+1].y);
      c.strokeStyle = b.color + Math.floor(alpha*255).toString(16).padStart(2,'0');
      c.lineWidth = 1.5;
      c.stroke();
    }
  }

  for (const b of gv.bodies) {
    const glow = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 3);
    glow.addColorStop(0, b.color + '55'); glow.addColorStop(1, 'transparent');
    c.fillStyle = glow;
    c.beginPath(); c.arc(b.x, b.y, b.r * 3, 0, Math.PI*2); c.fill();

    c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI*2);
    c.fillStyle = b.color; c.fill();
    if (b.isBlackHole) {
      c.beginPath(); c.arc(b.x, b.y, b.r * 0.5, 0, Math.PI*2);
      c.fillStyle = '#0B0F1E'; c.fill();
    }
  }

  if (gv.dragging && gv.dragStart) {
    c.beginPath();
    c.moveTo(gv.dragStart.x, gv.dragStart.y);
    c.lineTo(gv.dragging.x, gv.dragging.y);
    c.strokeStyle = 'rgba(111,168,255,0.5)';
    c.lineWidth = 1.5; c.setLineDash([4,4]); c.stroke(); c.setLineDash([]);
    const preset = GV_PRESETS[gv.tool];
    c.beginPath(); c.arc(gv.dragStart.x, gv.dragStart.y, preset.r, 0, Math.PI*2);
    c.fillStyle = preset.color + '99'; c.fill();
  }

  gv.rafId = requestAnimationFrame(gvLoop);
}

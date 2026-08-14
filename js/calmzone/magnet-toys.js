/* ════════════════════════════════════
   MAGNETIC BALLS
════════════════════════════════════ */
let mb = { canvas:null, ctx:null, balls:[], mode:'attract', mouse:{x:-999,y:-999,active:false}, rafId:null, init:false };
const MB_COLORS = ['#6FA8FF','#9FD3A8','#CDB4DB','#F6C453','#F28B82'];

function mbStart() {
  mb.canvas = document.getElementById('magnetCanvas');
  if (!mb.canvas) return;
  const area = mb.canvas.parentElement;
  mb.canvas.width = Math.max(200, area.clientWidth);
  mb.canvas.height = 380;
  mb.ctx = mb.canvas.getContext('2d');

  if (mb.balls.length === 0) mbSeed();
  if (!mb.init) {
    mb.canvas.addEventListener('mousemove', e => { const p = mbPos(e); mb.mouse.x = p.x; mb.mouse.y = p.y; mb.mouse.active = true; });
    mb.canvas.addEventListener('mouseleave', () => mb.mouse.active = false);
    mb.canvas.addEventListener('touchmove', e => { e.preventDefault(); const p = mbTouchPos(e); mb.mouse.x = p.x; mb.mouse.y = p.y; mb.mouse.active = true; }, {passive:false});
    mb.canvas.addEventListener('touchend', () => mb.mouse.active = false);
    mb.init = true;
  }
  if (mb.rafId) cancelAnimationFrame(mb.rafId);
  mb.rafId = requestAnimationFrame(mbLoop);
}
function mbPos(e) {
  const r = mb.canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (mb.canvas.width / r.width), y: (e.clientY - r.top) * (mb.canvas.height / r.height) };
}
function mbTouchPos(e) {
  const r = mb.canvas.getBoundingClientRect(), t = e.touches[0];
  return { x: (t.clientX - r.left) * (mb.canvas.width / r.width), y: (t.clientY - r.top) * (mb.canvas.height / r.height) };
}
function mbSeed() {
  mb.balls = [];
  for (let i = 0; i < 60; i++) {
    mb.balls.push({
      x: Math.random() * (mb.canvas.width||600), y: Math.random() * (mb.canvas.height||380),
      vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
      r: 4 + Math.random()*5, color: MB_COLORS[Math.floor(Math.random()*MB_COLORS.length)]
    });
  }
}
function mbSetMode(el, mode) {
  document.querySelectorAll('.mb-mode').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  mb.mode = mode;
}
function mbScatter() {
  for (const b of mb.balls) {
    const a = Math.random()*Math.PI*2;
    b.vx += Math.cos(a)*3; b.vy += Math.sin(a)*3;
  }
  toast2('🧲 Scattered!');
}
function mbLoop() {
  if (!mb.canvas || !document.getElementById('cz-magnet')?.classList.contains('visible')) return;
  const c = mb.ctx, W = mb.canvas.width, H = mb.canvas.height;
  c.fillStyle = '#F8FBFD';
  c.fillRect(0, 0, W, H);

  for (const b of mb.balls) {
    if (mb.mouse.active) {
      const dx = mb.mouse.x - b.x, dy = mb.mouse.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      if (dist < 180) {
        if (mb.mode === 'attract') {
          b.vx += (dx/dist) * 0.18; b.vy += (dy/dist) * 0.18;
        } else if (mb.mode === 'repel') {
          b.vx -= (dx/dist) * 0.22; b.vy -= (dy/dist) * 0.22;
        } else if (mb.mode === 'swirl') {
          b.vx += (-dy/dist) * 0.22; b.vy += (dx/dist) * 0.22;
        }
      }
    }
    b.vx *= 0.96; b.vy *= 0.96;
    b.x += b.vx; b.y += b.vy;
    if (b.x < b.r) { b.x = b.r; b.vx *= -0.5; }
    if (b.x > W - b.r) { b.x = W - b.r; b.vx *= -0.5; }
    if (b.y < b.r) { b.y = b.r; b.vy *= -0.5; }
    if (b.y > H - b.r) { b.y = H - b.r; b.vy *= -0.5; }

    const glow = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r*2.5);
    glow.addColorStop(0, b.color+'66'); glow.addColorStop(1, 'transparent');
    c.fillStyle = glow;
    c.beginPath(); c.arc(b.x, b.y, b.r*2.5, 0, Math.PI*2); c.fill();

    c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI*2);
    c.fillStyle = b.color; c.fill();
  }
  mb.rafId = requestAnimationFrame(mbLoop);
}

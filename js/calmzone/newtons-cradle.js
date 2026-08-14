// ═══════════════════════════ NEWTON'S CRADLE ═══════════════════════════
let nc = { canvas:null, ctx:null, balls:[], rafId:null, dragging:-1 };
function ncInitBalls() {
  const n = 5, spacing = 34;
  nc.balls = Array.from({length:n}, (_,i)=>({ homeX: i*spacing, angle:0, vel:0, len: 130 }));
}
function ncStart() {
  nc.canvas = document.getElementById('newtonCanvas'); if (!nc.canvas) return;
  const area = nc.canvas.parentElement;
  nc.canvas.width = Math.max(200, area.clientWidth); nc.canvas.height = 300;
  nc.ctx = nc.canvas.getContext('2d');
  if (!nc.balls.length) ncInitBalls();
  if (!nc.init) {
    const pos = e => { const r = nc.canvas.getBoundingClientRect(); return { x:(e.clientX-r.left)*(nc.canvas.width/r.width), y:(e.clientY-r.top)*(nc.canvas.height/r.height) }; };
    nc.canvas.addEventListener('mousedown', e => { const p=pos(e); ncPickBall(p); });
    nc.canvas.addEventListener('mousemove', e => { if (nc.dragging<0) return; const p=pos(e); ncDrag(p); });
    window.addEventListener('mouseup', () => { nc.dragging=-1; });
    nc.canvas.addEventListener('touchstart', e=>{const p=pos(e.touches[0]); ncPickBall(p);},{passive:true});
    nc.canvas.addEventListener('touchmove', e=>{if(nc.dragging<0)return; const p=pos(e.touches[0]); ncDrag(p);},{passive:true});
    window.addEventListener('touchend', ()=>{nc.dragging=-1;});
    nc.init = true;
  }
  if (nc.rafId) cancelAnimationFrame(nc.rafId);
  nc.rafId = requestAnimationFrame(ncLoop);
}
function ncOriginX() { return nc.canvas.width/2 - (nc.balls.length-1)*17; }
function ncPickBall(p) {
  if (nc.balls.length !== 5) ncInitBalls();
  const originX = ncOriginX();
  for (let i=0;i<nc.balls.length;i++) {
    if (i>0 && i<nc.balls.length-1) continue;
    const b = nc.balls[i];
    const bx = originX + b.homeX + Math.sin(b.angle)*b.len, by = 30+b.len*Math.cos(b.angle);
    if (Math.hypot(p.x-bx, p.y-by) < 24) { nc.dragging = i; return; }
  }
}
function ncDrag(p) {
  const b = nc.balls[nc.dragging]; if (!b) return;
  const originX = ncOriginX();
  const bx = originX + b.homeX;
  b.angle = Math.max(-1.1, Math.min(1.1, Math.atan2(p.x-bx, p.y-30)));
  b.vel = 0;
}
function ncLoop() {
  if (!nc.canvas || !document.getElementById('cz-newton')?.classList.contains('visible')) return;
  const c = nc.ctx, W = nc.canvas.width, H = nc.canvas.height;
  c.clearRect(0,0,W,H);
  const originX = ncOriginX(), top = 30;
  const g = 0.012;
  nc.balls.forEach((b,i) => {
    if (nc.dragging === i) return;
    const accel = -g * Math.sin(b.angle);
    b.vel += accel; b.vel *= 0.999; b.angle += b.vel;
  });
  // simple collision transfer between adjacent near-vertical balls
  for (let i=0;i<nc.balls.length-1;i++) {
    const a = nc.balls[i], bN = nc.balls[i+1];
    if (Math.abs(a.angle) < 0.02 && Math.abs(bN.angle) < 0.02) {
      if (a.vel > 0.0005 && bN.vel < a.vel) { bN.vel = a.vel; a.vel = 0; playClick(500); }
      if (bN.vel < -0.0005 && a.vel > bN.vel) { a.vel = bN.vel; bN.vel = 0; playClick(500); }
    }
  }
  c.strokeStyle='rgba(45,55,72,.15)'; c.lineWidth=1;
  c.beginPath(); c.moveTo(originX-20,top); c.lineTo(originX+nc.balls.length*34,top); c.stroke();
  nc.balls.forEach(b => {
    const bx = originX + b.homeX + Math.sin(b.angle)*b.len, by = top + b.len*Math.cos(b.angle);
    c.beginPath(); c.moveTo(originX+b.homeX, top); c.lineTo(bx,by); c.strokeStyle='rgba(45,55,72,.25)'; c.stroke();
    const grad = c.createRadialGradient(bx-6,by-6,2,bx,by,15);
    grad.addColorStop(0,'#4A5568'); grad.addColorStop(1,'#1A202C');
    c.beginPath(); c.arc(bx,by,15,0,Math.PI*2); c.fillStyle=grad; c.fill();
  });
  nc.rafId = requestAnimationFrame(ncLoop);
}
function ncReset() { ncInitBalls(); nc.balls[0].angle = -0.9; }

// ═══════════════════════════ FIDGET SPINNER ═══════════════════════════
let sp = { canvas:null, ctx:null, angle:0, vel:0, dragging:false, lastAngle:0, lastTime:0, rafId:null };
function spStart() {
  sp.canvas = document.getElementById('spinnerCanvas'); if (!sp.canvas) return;
  const area = sp.canvas.parentElement;
  sp.canvas.width = Math.max(200, area.clientWidth); sp.canvas.height = 320;
  sp.ctx = sp.canvas.getContext('2d');
  if (!sp.init) {
    const down = e => { sp.dragging = true; sp.lastAngle = spAngleAt(e); sp.lastTime = performance.now(); };
    const move = e => { if (!sp.dragging) return; const a = spAngleAt(e); const t = performance.now();
      let d = a - sp.lastAngle; if (d>Math.PI) d-=2*Math.PI; if (d<-Math.PI) d+=2*Math.PI;
      const dt = Math.max(1,t-sp.lastTime); sp.vel = d/dt*16; sp.angle += d; sp.lastAngle = a; sp.lastTime = t; };
    const up = () => { sp.dragging = false; };
    sp.canvas.addEventListener('mousedown', down); sp.canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    sp.canvas.addEventListener('touchstart', e=>{down(e.touches[0]);}, {passive:true});
    sp.canvas.addEventListener('touchmove', e=>{move(e.touches[0]);}, {passive:true});
    window.addEventListener('touchend', up);
    sp.init = true;
  }
  if (sp.rafId) cancelAnimationFrame(sp.rafId);
  sp.rafId = requestAnimationFrame(spLoop);
}
function spAngleAt(e) {
  const r = sp.canvas.getBoundingClientRect();
  const cx = r.left + r.width/2, cy = r.top + sp.canvas.height/2 * (r.width/sp.canvas.width);
  return Math.atan2(e.clientY-cy, e.clientX-cx);
}
function spLoop() {
  if (!sp.canvas || !document.getElementById('cz-spinner')?.classList.contains('visible')) return;
  const c = sp.ctx, W = sp.canvas.width, H = sp.canvas.height;
  c.clearRect(0,0,W,H);
  if (!sp.dragging) { sp.angle += sp.vel; sp.vel *= 0.985; if (Math.abs(sp.vel)<0.0005) sp.vel=0; }
  const cx=W/2, cy=H/2, R=70;
  c.save(); c.translate(cx,cy); c.rotate(sp.angle);
  c.beginPath(); c.arc(0,0,26,0,Math.PI*2); c.fillStyle='#6FA8FF'; c.fill();
  for (let i=0;i<3;i++) {
    const a = i*(Math.PI*2/3);
    c.save(); c.rotate(a);
    c.beginPath(); c.ellipse(R,0,44,30,0,0,Math.PI*2);
    c.fillStyle = ['#9FD3A8','#CDB4DB','#F6C453'][i]; c.fill();
    c.beginPath(); c.arc(R,0,16,0,Math.PI*2); c.fillStyle='#fff'; c.fill();
    c.restore();
  }
  c.beginPath(); c.arc(0,0,12,0,Math.PI*2); c.fillStyle='#fff'; c.fill();
  c.restore();
  c.fillStyle='rgba(45,55,72,.35)'; c.font='12px Inter'; c.textAlign='center';
  c.fillText(sp.dragging?'flick and release':(Math.abs(sp.vel)>0.01?'spinning...':'drag to spin'), W/2, H-14);
  sp.rafId = requestAnimationFrame(spLoop);
}

// ═══════════════════════════ ZEN RAKE GARDEN ═══════════════════════════
let zr = { canvas:null, ctx:null, stones:[], drawing:false, last:null, rafId:null };
function zrStart() {
  zr.canvas = document.getElementById('rakeCanvas'); if (!zr.canvas) return;
  const area = zr.canvas.parentElement;
  const w = Math.max(200, area.clientWidth), h = 320;
  const needsRedraw = zr.canvas.width !== w;
  zr.canvas.width = w; zr.canvas.height = h;
  zr.ctx = zr.canvas.getContext('2d');
  if (!zr.stones.length) zr.stones = [{x:w*0.28,y:h*0.4,r:22},{x:w*0.32,y:h*0.55,r:14},{x:w*0.72,y:h*0.65,r:26}];
  zrRedraw();
  if (!zr.init) {
    const pos = e => { const r = zr.canvas.getBoundingClientRect(); return { x:(e.clientX-r.left)*(zr.canvas.width/r.width), y:(e.clientY-r.top)*(zr.canvas.height/r.height) }; };
    const start = e => { zr.drawing = true; zr.last = pos(e); };
    const move = e => { if (!zr.drawing) return; const p = pos(e); zrRakeLine(zr.last, p); zr.last = p; };
    const end = () => { zr.drawing = false; zr.last = null; };
    zr.canvas.addEventListener('mousedown', start); zr.canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
    zr.canvas.addEventListener('touchstart', e=>{e.preventDefault(); start(e.touches[0]);}, {passive:false});
    zr.canvas.addEventListener('touchmove', e=>{e.preventDefault(); move(e.touches[0]);}, {passive:false});
    window.addEventListener('touchend', end);
    zr.init = true;
  }
}
function zrRedraw() {
  const c = zr.ctx, W = zr.canvas.width, H = zr.canvas.height;
  const g = c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#EFE6D6'); g.addColorStop(1,'#E6D9C2');
  c.fillStyle = g; c.fillRect(0,0,W,H);
  zr.stones.forEach(s => {
    c.beginPath(); c.arc(s.x,s.y,s.r,0,Math.PI*2);
    const sg = c.createRadialGradient(s.x-s.r*0.3,s.y-s.r*0.3,2,s.x,s.y,s.r);
    sg.addColorStop(0,'#8A96A3'); sg.addColorStop(1,'#5A6472');
    c.fillStyle = sg; c.fill();
  });
}
function zrRakeLine(a,b) {
  if (!a||!b) return;
  const c = zr.ctx;
  const dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy)||1;
  const nx=-dy/len, ny=dx/len;
  c.strokeStyle='rgba(154,130,94,.35)'; c.lineWidth=2; c.lineCap='round';
  for (let o=-9;o<=9;o+=6) {
    c.beginPath(); c.moveTo(a.x+nx*o, a.y+ny*o); c.lineTo(b.x+nx*o, b.y+ny*o); c.stroke();
  }
}
function zrClear() { zrRedraw(); }

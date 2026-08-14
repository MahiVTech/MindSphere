// ═══════════════════════════ BALLOON FLOAT ═══════════════════════════
let bl = { canvas:null, ctx:null, balloons:[], popped:0, rafId:null };
function blSpawn(W,H) {
  const colors=['#F28B82','#6FA8FF','#9FD3A8','#F6C453','#CDB4DB'];
  bl.balloons.push({ x: 20+Math.random()*(W-40), y: H+30, vy: -(0.4+Math.random()*0.5), vx:(Math.random()-0.5)*0.2, r: 24+Math.random()*10, color: colors[Math.floor(Math.random()*colors.length)], sway: Math.random()*Math.PI*2 });
}
function blStart() {
  bl.canvas = document.getElementById('balloonCanvas'); if (!bl.canvas) return;
  const area = bl.canvas.parentElement;
  bl.canvas.width = Math.max(200, area.clientWidth); bl.canvas.height = 340;
  bl.ctx = bl.canvas.getContext('2d');
  if (!bl.init) {
    const pos = e => { const r = bl.canvas.getBoundingClientRect(); return { x:(e.clientX-r.left)*(bl.canvas.width/r.width), y:(e.clientY-r.top)*(bl.canvas.height/r.height) }; };
    const tap = p => {
      for (let i=bl.balloons.length-1;i>=0;i--) {
        const b = bl.balloons[i];
        if (Math.hypot(p.x-b.x,p.y-b.y) < b.r+6) { bl.balloons.splice(i,1); bl.popped++; playPop(0.9+Math.random()*0.5);
          document.getElementById('bl-popped').textContent = bl.popped; break; }
      }
    };
    bl.canvas.addEventListener('click', e=>tap(pos(e)));
    bl.canvas.addEventListener('touchstart', e=>{e.preventDefault(); tap(pos(e.touches[0]));},{passive:false});
    bl.init = true;
  }
  if (bl.rafId) cancelAnimationFrame(bl.rafId);
  bl.rafId = requestAnimationFrame(blLoop);
}
function blLoop() {
  if (!bl.canvas || !document.getElementById('cz-balloons')?.classList.contains('visible')) return;
  const c = bl.ctx, W = bl.canvas.width, H = bl.canvas.height;
  c.clearRect(0,0,W,H);
  const sky = c.createLinearGradient(0,0,0,H); sky.addColorStop(0,'#EAF4FB'); sky.addColorStop(1,'#F8FBFD');
  c.fillStyle = sky; c.fillRect(0,0,W,H);
  if (Math.random() < 0.02 && bl.balloons.length < 9) blSpawn(W,H);
  for (let i=bl.balloons.length-1;i>=0;i--) {
    const b = bl.balloons[i];
    b.sway += 0.03; b.y += b.vy; b.x += b.vx + Math.sin(b.sway)*0.3;
    if (b.y < -40) { bl.balloons.splice(i,1); continue; }
    c.beginPath(); c.moveTo(b.x,b.y+b.r); c.lineTo(b.x,b.y+b.r+20); c.strokeStyle='rgba(45,55,72,.25)'; c.stroke();
    c.beginPath(); c.ellipse(b.x,b.y,b.r*0.8,b.r,0,0,Math.PI*2);
    c.fillStyle = b.color; c.fill();
    c.beginPath(); c.ellipse(b.x-b.r*0.25,b.y-b.r*0.35,b.r*0.22,b.r*0.32,0,0,Math.PI*2);
    c.fillStyle='rgba(255,255,255,.35)'; c.fill();
  }
  c.fillStyle='rgba(45,55,72,.35)'; c.font='12px Inter'; c.textAlign='center';
  c.fillText('tap a balloon to pop it', W/2, H-14);
  bl.rafId = requestAnimationFrame(blLoop);
}

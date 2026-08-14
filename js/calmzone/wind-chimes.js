// ═══════════════════════════ WIND CHIMES ═══════════════════════════
let ch = { canvas:null, ctx:null, rods:[], t:0, rafId:null };
function chStart() {
  ch.canvas = document.getElementById('chimesCanvas'); if (!ch.canvas) return;
  const area = ch.canvas.parentElement;
  ch.canvas.width = Math.max(200, area.clientWidth); ch.canvas.height = 320;
  ch.ctx = ch.canvas.getContext('2d');
  const notes = [392,440,493.9,523.3,587.3,659.3];
  const n = 6, gap = ch.canvas.width/(n+1);
  ch.rods = Array.from({length:n},(_,i)=>({ x: gap*(i+1), swing:0, vel:0, freq: notes[i], len: 90+((i%3)*18) }));
  if (!ch.init) {
    const pos = e => { const r = ch.canvas.getBoundingClientRect(); return { x:(e.clientX-r.left)*(ch.canvas.width/r.width), y:(e.clientY-r.top)*(ch.canvas.height/r.height) }; };
    const hit = p => { ch.rods.forEach(rd => { if (Math.abs(p.x-rd.x) < 26) { rd.vel += (p.x>rd.x?1:-1)*0.05; playChimeTone(rd.freq); } }); };
    ch.canvas.addEventListener('mousedown', e=>hit(pos(e)));
    ch.canvas.addEventListener('mousemove', e=>{ if (e.buttons===1) hit(pos(e)); });
    ch.canvas.addEventListener('touchstart', e=>{hit(pos(e.touches[0]));},{passive:true});
    ch.canvas.addEventListener('touchmove', e=>{hit(pos(e.touches[0]));},{passive:true});
    ch.init = true;
  }
  if (ch.rafId) cancelAnimationFrame(ch.rafId);
  ch.rafId = requestAnimationFrame(chLoop);
}
function chLoop() {
  if (!ch.canvas || !document.getElementById('cz-chimes')?.classList.contains('visible')) return;
  const c = ch.ctx, W = ch.canvas.width, H = ch.canvas.height;
  c.clearRect(0,0,W,H);
  ch.t += 0.02;
  c.strokeStyle='rgba(45,55,72,.15)'; c.beginPath(); c.moveTo(20,26); c.lineTo(W-20,26); c.stroke();
  ch.rods.forEach((r,i) => {
    r.vel += -r.swing*0.02 - r.vel*0.03 + Math.sin(ch.t+i)*0.0006;
    r.swing += r.vel;
    const tipX = r.x + Math.sin(r.swing)*r.len, tipY = 26 + Math.cos(r.swing)*r.len;
    c.beginPath(); c.moveTo(r.x,26); c.lineTo(tipX,tipY);
    c.strokeStyle='rgba(246,196,83,.5)'; c.lineWidth=2; c.stroke();
    c.beginPath(); c.roundRect ? c.roundRect(tipX-4,tipY,8,26,3) : c.rect(tipX-4,tipY,8,26);
    c.fillStyle='#F6C453'; c.fill();
  });
  c.fillStyle='rgba(45,55,72,.35)'; c.font='12px Inter'; c.textAlign='center';
  c.fillText('brush across the chimes', W/2, H-14);
  ch.rafId = requestAnimationFrame(chLoop);
}

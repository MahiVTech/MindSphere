// ═══════════════════════════ STRESS BALL ═══════════════════════════
let sb = { canvas:null, ctx:null, squish:0, target:0, count:0, pressing:false, rafId:null };
function sbStart() {
  sb.canvas = document.getElementById('stressballCanvas'); if (!sb.canvas) return;
  const area = sb.canvas.parentElement;
  sb.canvas.width = Math.max(200, area.clientWidth); sb.canvas.height = 320;
  sb.ctx = sb.canvas.getContext('2d');
  if (!sb.init) {
    const down = () => { sb.pressing = true; sb.target = 1; sb.count++; document.getElementById('sb-count').textContent = sb.count; playClick(180); };
    const up = () => { sb.pressing = false; sb.target = 0; };
    sb.canvas.addEventListener('mousedown', down); window.addEventListener('mouseup', up);
    sb.canvas.addEventListener('touchstart', e=>{e.preventDefault();down();}, {passive:false});
    window.addEventListener('touchend', up);
    sb.init = true;
  }
  if (sb.rafId) cancelAnimationFrame(sb.rafId);
  sb.rafId = requestAnimationFrame(sbLoop);
}
function sbLoop() {
  if (!sb.canvas || !document.getElementById('cz-stressball')?.classList.contains('visible')) return;
  const c = sb.ctx, W = sb.canvas.width, H = sb.canvas.height;
  c.clearRect(0,0,W,H);
  sb.squish += (sb.target - sb.squish) * 0.18;
  const cx=W/2, cy=H/2, R=76;
  const sx = 1 + sb.squish*0.35, sy = 1 - sb.squish*0.3;
  c.save(); c.translate(cx,cy); c.scale(sx,sy);
  const grad = c.createRadialGradient(-R*0.3,-R*0.3,10,0,0,R);
  grad.addColorStop(0,'#CDB4DB'); grad.addColorStop(1,'#8A6BA0');
  c.beginPath(); c.arc(0,0,R,0,Math.PI*2); c.fillStyle=grad; c.fill();
  c.restore();
  c.fillStyle='rgba(45,55,72,.35)'; c.font='12px Inter'; c.textAlign='center';
  c.fillText('press and hold', W/2, H-14);
  sb.rafId = requestAnimationFrame(sbLoop);
}

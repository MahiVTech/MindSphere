/* ════════════════════════════════════
   LIGHT PAINTER
════════════════════════════════════ */
let lp = { canvas:null, ctx:null, drawing:false, mode:'aurora', lastX:0, lastY:0, particles:[], rafId:null, init:false, t:0 };

function lpStart() {
  lp.canvas = document.getElementById('lpCanvas');
  if (!lp.canvas) return;
  const area = lp.canvas.parentElement;
  const w = Math.max(200, area.clientWidth);
  const h = 380;
  if (lp.canvas.width !== w || lp.canvas.height !== h) {
    lp.canvas.width = w; lp.canvas.height = h;
  }
  lp.ctx = lp.canvas.getContext('2d');
  lp.ctx.fillStyle = '#0A0E1A';
  lp.ctx.fillRect(0,0,lp.canvas.width,lp.canvas.height);

  if (!lp.init) {
    lp.canvas.addEventListener('mousedown', e => { lp.drawing = true; const p = lpPos(e); lp.lastX=p.x; lp.lastY=p.y; });
    lp.canvas.addEventListener('mousemove', e => { if(lp.drawing){ const p=lpPos(e); lpStroke(p.x,p.y); lp.lastX=p.x; lp.lastY=p.y; } });
    lp.canvas.addEventListener('mouseup', ()=>{ lp.drawing=false; });
    lp.canvas.addEventListener('mouseleave', ()=>{ lp.drawing=false; });
    lp.canvas.addEventListener('touchstart', e=>{ e.preventDefault(); lp.drawing=true; const p=lpTouchPos(e); lp.lastX=p.x; lp.lastY=p.y; },{passive:false});
    lp.canvas.addEventListener('touchmove', e=>{ e.preventDefault(); if(lp.drawing){ const p=lpTouchPos(e); lpStroke(p.x,p.y); lp.lastX=p.x; lp.lastY=p.y; } },{passive:false});
    lp.canvas.addEventListener('touchend', ()=>{ lp.drawing=false; });
    lp.init = true;
  }
  if (lp.rafId) cancelAnimationFrame(lp.rafId);
  lp.rafId = requestAnimationFrame(lpLoop);
}

function lpPos(e) {
  const r = lp.canvas.getBoundingClientRect();
  const sx = lp.canvas.width/r.width, sy = lp.canvas.height/r.height;
  return { x:(e.clientX-r.left)*sx, y:(e.clientY-r.top)*sy };
}
function lpTouchPos(e) {
  const r = lp.canvas.getBoundingClientRect(), t = e.touches[0];
  const sx = lp.canvas.width/r.width, sy = lp.canvas.height/r.height;
  return { x:(t.clientX-r.left)*sx, y:(t.clientY-r.top)*sy };
}
function lpStroke(x, y) {
  const dx = x - lp.lastX, dy = y - lp.lastY;
  const dist = Math.sqrt(dx*dx+dy*dy);
  if (dist < 0.5) return;
  const steps = Math.max(1, Math.floor(dist / 3));
  for (let i = 0; i <= steps; i++) {
    const ix = lp.lastX + dx*(i/steps), iy = lp.lastY + dy*(i/steps);
    lpEmit(ix, iy);
  }
}
function lpEmit(x, y) {
  lp.t += 0.05;
  if (lp.mode === 'aurora') {
    const hue = 190 + Math.sin(lp.t)*60;
    lp.particles.push({ x, y, life:1, vx:(Math.random()-0.5)*0.3, vy:-0.3-Math.random()*0.3, size:8+Math.random()*6, color:`hsl(${hue},80%,65%)` });
  } else if (lp.mode === 'galaxy') {
    for (let i=0;i<2;i++) {
      const a = Math.random()*Math.PI*2, sp = 0.5+Math.random()*1.5;
      lp.particles.push({ x, y, life:1, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, size:2+Math.random()*3, color:`hsl(${260+Math.random()*60},70%,70%)` });
    }
  } else if (lp.mode === 'ribbon') {
    const hue = (lp.t*30) % 360;
    lp.particles.push({ x, y, life:1, vx:0, vy:0, size:10, color:`hsl(${hue},75%,68%)`, ribbon:true });
  } else if (lp.mode === 'sparkle') {
    for (let i=0;i<3;i++) {
      lp.particles.push({ x:x+(Math.random()-0.5)*10, y:y+(Math.random()-0.5)*10, life:1, vx:(Math.random()-0.5)*0.6, vy:(Math.random()-0.5)*0.6, size:1.5+Math.random()*2.5, color:'#FFFFFF', twinkle:true });
    }
  }
  if (lp.particles.length > 900) lp.particles.splice(0, lp.particles.length - 900);
}
function lpLoop() {
  if (!lp.canvas || !document.getElementById('cz-light').classList.contains('visible')) return;
  const c = lp.ctx;
  c.fillStyle = 'rgba(10,14,26,0.06)';
  c.fillRect(0, 0, lp.canvas.width, lp.canvas.height);

  lp.particles = lp.particles.filter(p => p.life > 0);
  for (const p of lp.particles) {
    p.x += p.vx; p.y += p.vy;
    p.life -= p.ribbon ? 0.012 : 0.018;
    const alpha = Math.max(0, p.life);
    c.beginPath();
    c.arc(p.x, p.y, p.size * alpha, 0, Math.PI*2);
    if (p.twinkle) {
      c.fillStyle = `rgba(255,255,255,${alpha * (0.5 + Math.sin(Date.now()*0.01 + p.x)*0.5)})`;
    } else {
      c.fillStyle = p.color;
      c.globalAlpha = alpha;
    }
    c.fill();
    c.globalAlpha = 1;
  }
  lp.rafId = requestAnimationFrame(lpLoop);
}
function lpClear() {
  if (!lp.ctx) return;
  lp.particles = [];
  lp.ctx.fillStyle = '#0A0E1A';
  lp.ctx.fillRect(0,0,lp.canvas.width,lp.canvas.height);
  toast2('✨ Clear sky');
}
function lpSetMode(el, mode) {
  document.querySelectorAll('.lp-tool').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  lp.mode = mode;
}

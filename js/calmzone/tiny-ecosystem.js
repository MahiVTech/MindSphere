/* ════════════════════════════════════
   TINY ECOSYSTEM
════════════════════════════════════ */
let eco = { canvas:null, ctx:null, items:[], tool:'tree', rafId:null, init:false, t:0 };

function ecoStart() {
  eco.canvas = document.getElementById('ecoCanvas');
  if (!eco.canvas) return;
  const area = eco.canvas.parentElement;
  eco.canvas.width = Math.max(200, area.clientWidth);
  eco.canvas.height = 380;
  eco.ctx = eco.canvas.getContext('2d');

  if (!eco.init) {
    eco.canvas.addEventListener('click', ecoPlace);
    eco.canvas.addEventListener('touchstart', e => { e.preventDefault(); ecoPlace(ecoTouchToClick(e)); }, {passive:false});
    eco.init = true;
  }
  if (eco.rafId) cancelAnimationFrame(eco.rafId);
  eco.rafId = requestAnimationFrame(ecoLoop);
}
function ecoTouchToClick(e) {
  const t = e.touches[0];
  return { clientX: t.clientX, clientY: t.clientY };
}
function ecoPos(e) {
  const r = eco.canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (eco.canvas.width / r.width), y: (e.clientY - r.top) * (eco.canvas.height / r.height) };
}
function ecoSetTool(el, tool) {
  document.querySelectorAll('.eco-tool').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  eco.tool = tool;
}
function ecoPlace(e) {
  const p = ecoPos(e);
  if (eco.tool === 'water') {
    eco.items.push({ type:'water', x:p.x, y:p.y, w: 60+Math.random()*40, phase: Math.random()*Math.PI*2 });
  } else if (eco.tool === 'tree') {
    eco.items.push({ type:'tree', x:p.x, y:p.y, scale:0, target: 0.7+Math.random()*0.6, sway: Math.random()*Math.PI*2 });
  } else if (eco.tool === 'flower') {
    eco.items.push({ type:'flower', x:p.x, y:p.y, scale:0, target: 0.6+Math.random()*0.5, hue: Math.random()*60+280 });
  } else if (eco.tool === 'creature') {
    eco.items.push({ type:'creature', x:p.x, y:p.y, vx:(Math.random()-0.5)*0.6, vy:(Math.random()-0.5)*0.6, wing:0, emoji: ['🦋','🐝','🐞'][Math.floor(Math.random()*3)] });
  }
  const cnt = document.getElementById('eco-count');
  if (cnt) cnt.textContent = eco.items.length;
}
function ecoClear() {
  eco.items = [];
  const cnt = document.getElementById('eco-count');
  if (cnt) cnt.textContent = 0;
  toast2('🌱 New world planted');
}
function ecoLoop() {
  if (!eco.canvas || !document.getElementById('cz-eco')?.classList.contains('visible')) return;
  const c = eco.ctx, W = eco.canvas.width, H = eco.canvas.height;
  eco.t += 0.02;

  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#EAF4FB'); sky.addColorStop(1, '#F8FBFD');
  c.fillStyle = sky; c.fillRect(0, 0, W, H);

  // Ground
  c.fillStyle = '#E4EDF5';
  c.fillRect(0, H*0.78, W, H*0.22);

  for (const it of eco.items) {
    if (it.type === 'water') {
      it.phase += 0.03;
      c.save();
      c.beginPath();
      c.ellipse(it.x, it.y, it.w, 14, 0, 0, Math.PI*2);
      c.fillStyle = 'rgba(111,168,255,0.35)';
      c.fill();
      c.strokeStyle = 'rgba(111,168,255,0.5)';
      c.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.ellipse(it.x, it.y, it.w*(0.4+i*0.25)+Math.sin(it.phase+i)*4, 6+i*2, 0, 0, Math.PI*2);
        c.globalAlpha = 0.3 - i*0.08;
        c.stroke();
      }
      c.globalAlpha = 1;
      c.restore();
    } else if (it.type === 'tree') {
      if (it.scale < it.target) it.scale += 0.01;
      it.sway += 0.015;
      const s = it.scale, sw = Math.sin(it.sway)*3*s;
      c.save();
      c.translate(it.x, it.y);
      c.fillStyle = '#A9784F';
      c.fillRect(-3*s, -28*s, 6*s, 28*s);
      c.beginPath();
      c.ellipse(sw, -38*s, 22*s, 20*s, 0, 0, Math.PI*2);
      c.fillStyle = '#9FD3A8'; c.fill();
      c.beginPath();
      c.ellipse(sw*0.6, -48*s, 15*s, 13*s, 0, 0, Math.PI*2);
      c.fillStyle = '#7EC48A'; c.fill();
      c.restore();
    } else if (it.type === 'flower') {
      if (it.scale < it.target) it.scale += 0.015;
      const s = it.scale;
      c.save();
      c.translate(it.x, it.y);
      c.strokeStyle = '#7EC48A'; c.lineWidth = 2*s;
      c.beginPath(); c.moveTo(0,0); c.lineTo(0,-16*s); c.stroke();
      for (let p = 0; p < 5; p++) {
        const a = (p/5)*Math.PI*2;
        c.beginPath(); c.arc(Math.cos(a)*5*s, -16*s+Math.sin(a)*5*s, 4*s, 0, Math.PI*2);
        c.fillStyle = `hsl(${it.hue},65%,72%)`; c.fill();
      }
      c.beginPath(); c.arc(0,-16*s,3*s,0,Math.PI*2);
      c.fillStyle = '#F6C453'; c.fill();
      c.restore();
    } else if (it.type === 'creature') {
      it.x += it.vx; it.y += it.vy; it.wing += 0.3;
      if (it.x < 10 || it.x > W-10) it.vx *= -1;
      if (it.y < H*0.1 || it.y > H*0.7) it.vy *= -1;
      c.save();
      c.translate(it.x, it.y);
      c.scale(1, 0.6+Math.abs(Math.sin(it.wing))*0.4);
      c.font = '18px serif'; c.textAlign='center'; c.textBaseline='middle';
      c.fillText(it.emoji, 0, 0);
      c.restore();
    }
  }

  if (eco.items.length === 0) {
    c.fillStyle = 'rgba(45,55,72,0.25)';
    c.font = '13px Inter'; c.textAlign='center';
    c.fillText('tap anywhere to plant your first life', W/2, H/2);
  }

  eco.rafId = requestAnimationFrame(ecoLoop);
}

function toast2(msg) {
  if (typeof showToast === 'function') { showToast(msg); return; }
  console.log(msg);
}

window.addEventListener('resize', () => {
  if (document.getElementById('cz-bubble')?.classList.contains('visible')) bwStart();
  if (document.getElementById('cz-gravity')?.classList.contains('visible')) gvStart();
  if (document.getElementById('cz-light')?.classList.contains('visible')) lpStart();
  if (document.getElementById('cz-sand')?.classList.contains('visible')) saStart();
  if (document.getElementById('cz-magnet')?.classList.contains('visible')) mbStart();
  if (document.getElementById('cz-eco')?.classList.contains('visible')) ecoStart();
  if (document.getElementById('cz-spinner')?.classList.contains('visible')) spStart();
  if (document.getElementById('cz-stressball')?.classList.contains('visible')) sbStart();
  if (document.getElementById('cz-newton')?.classList.contains('visible')) ncStart();
  if (document.getElementById('cz-rake')?.classList.contains('visible')) zrStart();
  if (document.getElementById('cz-chimes')?.classList.contains('visible')) chStart();
  if (document.getElementById('cz-balloons')?.classList.contains('visible')) blStart();
});

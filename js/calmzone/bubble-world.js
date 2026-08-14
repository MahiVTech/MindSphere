/* ════════════════════════════════════
   BUBBLE WORLD
════════════════════════════════════ */
let bw = { canvas:null, ctx:null, bubbles:[], butterflies:[], sparkles:[], popped:0, butterflyCount:0, rafId:null, init:false };

function bwStart() {
  bw.canvas = document.getElementById('bubbleCanvas');
  if (!bw.canvas) return;
  const area = bw.canvas.parentElement;
  bw.canvas.width = Math.max(200, area.clientWidth);
  bw.canvas.height = 380;
  bw.ctx = bw.canvas.getContext('2d');

  if (bw.bubbles.length === 0) bwSeed();
  if (!bw.init) {
    bw.canvas.addEventListener('click', bwClick);
    bw.init = true;
  }
  if (bw.rafId) cancelAnimationFrame(bw.rafId);
  bw.rafId = requestAnimationFrame(bwLoop);
}

function bwSeed() {
  bw.bubbles = [];
  for (let i = 0; i < 24; i++) bwSpawnOne();
}

function bwSpawnOne() {
  const r = Math.random();
  let type = 'normal', color = ['#6FA8FF','#9FD3A8','#CDB4DB'][Math.floor(Math.random()*3)];
  if (r > 0.93) { type = 'rainbow'; }
  else if (r > 0.82) { type = 'golden'; color = '#F6C453'; }
  bw.bubbles.push({
    x: Math.random() * bw.canvas.width,
    y: Math.random() * bw.canvas.height,
    r: 20 + Math.random() * 26,
    vx: (Math.random()-0.5)*0.35,
    vy: -(0.15 + Math.random()*0.3),
    color, type,
    wob: Math.random()*Math.PI*2
  });
}

function bwClear() {
  bw.bubbles = []; bw.butterflies = []; bw.sparkles = [];
  bwSeed();
  toast2('🫧 Fresh bubbles');
}

function bwClick(e) {
  const rect = bw.canvas.getBoundingClientRect();
  const sx = bw.canvas.width / rect.width, sy = bw.canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * sx, my = (e.clientY - rect.top) * sy;
  for (let i = bw.bubbles.length - 1; i >= 0; i--) {
    const b = bw.bubbles[i];
    const dx = mx - b.x, dy = my - b.y;
    if (Math.sqrt(dx*dx+dy*dy) < b.r) {
      bwPop(b);
      bw.bubbles.splice(i, 1);
      bwSpawnOne();
      break;
    }
  }
}

function bwPop(b) {
  bw.popped++;
  const popEl = document.getElementById('bw-popped');
  if (popEl) popEl.textContent = bw.popped;
  if (b.type === 'golden') {
    playChimeTone(660);
    bw.butterflyCount++;
    const bfEl = document.getElementById('bw-butterflies');
    if (bfEl) bfEl.textContent = bw.butterflyCount;
    bw.butterflies.push({ x:b.x, y:b.y, vy:-0.6-Math.random()*0.4, vx:(Math.random()-0.5)*0.6, life:1, wing:0 });
  } else if (b.type === 'rainbow') {
    playPop(1.6);
    for (let i = 0; i < 18; i++) {
      const a = (i/18)*Math.PI*2;
      bw.sparkles.push({ x:b.x, y:b.y, vx:Math.cos(a)*(1.5+Math.random()), vy:Math.sin(a)*(1.5+Math.random()), life:1, hue: i*20 });
    }
  } else {
    playPop(0.8 + Math.random()*0.5);
    for (let i = 0; i < 6; i++) {
      bw.sparkles.push({ x:b.x, y:b.y, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, life:1, hue: 210 });
    }
  }
}

function bwLoop() {
  if (!bw.canvas || !document.getElementById('cz-bubble').classList.contains('visible')) return;
  const c = bw.ctx, W = bw.canvas.width, H = bw.canvas.height;
  c.clearRect(0,0,W,H);
  const g = c.createLinearGradient(0,0,0,H);
  g.addColorStop(0, '#F8FBFD'); g.addColorStop(1, '#EEF4F9');
  c.fillStyle = g; c.fillRect(0,0,W,H);

  for (const b of bw.bubbles) {
    b.wob += 0.02;
    b.x += b.vx + Math.sin(b.wob)*0.15;
    b.y += b.vy;
    if (b.y < -b.r) { b.y = H + b.r; b.x = Math.random()*W; }
    if (b.x < -b.r) b.x = W + b.r;
    if (b.x > W + b.r) b.x = -b.r;

    c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI*2);
    if (b.type === 'rainbow') {
      const grad = c.createLinearGradient(b.x-b.r,b.y-b.r,b.x+b.r,b.y+b.r);
      grad.addColorStop(0,'#F28B82'); grad.addColorStop(0.25,'#F6C453');
      grad.addColorStop(0.5,'#9FD3A8'); grad.addColorStop(0.75,'#6FA8FF'); grad.addColorStop(1,'#CDB4DB');
      c.strokeStyle = grad; c.lineWidth = 3;
      c.fillStyle = grad; c.globalAlpha = 0.12; c.fill(); c.globalAlpha = 1;
      c.stroke();
    } else {
      c.fillStyle = b.color + '18'; c.fill();
      c.strokeStyle = b.color; c.lineWidth = b.type === 'golden' ? 3 : 2; c.stroke();
    }
    c.beginPath(); c.arc(b.x - b.r*0.3, b.y - b.r*0.3, b.r*0.22, 0, Math.PI*2);
    c.fillStyle = 'rgba(255,255,255,0.6)'; c.fill();

    if (b.type === 'golden') {
      c.font = (b.r*0.7)+'px serif'; c.textAlign='center'; c.textBaseline='middle';
      c.fillText('🦋', b.x, b.y);
    }
  }

  bw.butterflies = bw.butterflies.filter(bf => bf.life > 0 && bf.y > -60);
  for (const bf of bw.butterflies) {
    bf.x += bf.vx; bf.y += bf.vy; bf.wing += 0.25;
    bf.vy *= 0.998;
    if (bf.y < H*0.1) bf.life -= 0.012;
    c.save();
    c.translate(bf.x, bf.y);
    c.globalAlpha = bf.life;
    c.font = '22px serif'; c.textAlign='center'; c.textBaseline='middle';
    c.scale(1, 0.6 + Math.abs(Math.sin(bf.wing))*0.4);
    c.fillText('🦋', 0, 0);
    c.restore(); c.globalAlpha = 1;
  }

  bw.sparkles = bw.sparkles.filter(s => s.life > 0);
  for (const s of bw.sparkles) {
    s.x += s.vx; s.y += s.vy; s.vx *= 0.96; s.vy *= 0.96; s.life -= 0.025;
    c.beginPath(); c.arc(s.x, s.y, 3*s.life, 0, Math.PI*2);
    c.fillStyle = `hsla(${s.hue},75%,68%,${s.life})`;
    c.fill();
  }

  bw.rafId = requestAnimationFrame(bwLoop);
}

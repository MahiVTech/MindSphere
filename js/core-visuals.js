// ═══════════════════════════ BRAIN CANVAS ═══════════════════════════
const canvas = document.getElementById('brainCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = canvas.parentElement.offsetWidth; }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);
let t = 0;
function drawBrain() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const w=canvas.width, h=canvas.height;
  const waves=[
    {color:'#6FA8FF',alpha:.8,freq:.022,amp:20,speed:1},
    {color:'#9FD3A8',alpha:.45,freq:.032,amp:11,speed:1.5},
    {color:'#CDB4DB',alpha:.25,freq:.014,amp:26,speed:.7},
  ];
  waves.forEach(w2=>{
    ctx.beginPath(); ctx.strokeStyle=w2.color; ctx.globalAlpha=w2.alpha; ctx.lineWidth=1.5;
    for(let x=0;x<w;x++){
      const y=h/2+w2.amp*Math.sin(x*w2.freq+t*w2.speed)*Math.cos(x*.009+t*.3);
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  });
  ctx.globalAlpha=1;
  const sx=(t*55)%w;
  ctx.beginPath(); ctx.strokeStyle='#6FA8FF'; ctx.lineWidth=2; ctx.globalAlpha=.85;
  ctx.moveTo(sx-28,h/2); ctx.lineTo(sx-14,h/2-32); ctx.lineTo(sx,h/2+30);
  ctx.lineTo(sx+14,h/2-16); ctx.lineTo(sx+28,h/2);
  ctx.stroke(); ctx.globalAlpha=1;
  t+=.03; requestAnimationFrame(drawBrain);
}
drawBrain();

// ═══════════════════════════ HEATMAP ═══════════════════════════
const hm = document.getElementById('heatmap');
[.1,.3,.7,.9,.4,.2,.1,.2,.5,.8,.6,.3,.15,.1,.3,.9,.7,.5,.2,.1,.2,.4,.6,.8,.5,.3,.2,.15].forEach((v,i)=>{
  const d=document.createElement('div'); d.className='heatmap-day';
  const r=Math.round(v*242+(1-v)*92), g=Math.round(v*139+(1-v)*184), b=Math.round(v*130+(1-v)*92);
  d.style.background=`rgba(${r},${g},${b},${.1+v*.65})`;
  d.title=`Day ${i+1}: Stress ${Math.round(v*100)}%`; d.textContent=i+1;
  hm.appendChild(d);
});

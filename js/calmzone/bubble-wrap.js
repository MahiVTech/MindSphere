// ═══════════════════════════ BUBBLE WRAP ═══════════════════════════
let bwr = { popped: new Set(), total: 80 };
function bwrStart() {
  const grid = document.getElementById('bwr-grid'); if (!grid) return;
  if (grid.children.length) return;
  for (let i = 0; i < bwr.total; i++) {
    const d = document.createElement('div');
    d.style.cssText='aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 38% 32%,rgba(255,255,255,.9),rgba(159,211,168,.35) 60%,rgba(159,211,168,.15));border:1px solid rgba(159,211,168,.4);cursor:pointer;transition:transform .12s';
    d.onclick = () => bwrPop(i, d);
    grid.appendChild(d);
  }
  document.getElementById('bwr-left').textContent = bwr.total - bwr.popped.size;
}
function bwrPop(i, el) {
  if (bwr.popped.has(i)) return;
  bwr.popped.add(i); playPop(1.3 + Math.random()*0.4);
  el.style.background='transparent'; el.style.border='1px dashed rgba(148,163,184,.3)'; el.style.transform='scale(.7)';
  document.getElementById('bwr-left').textContent = bwr.total - bwr.popped.size;
  if (bwr.popped.size >= bwr.total) setTimeout(bwrReset, 500);
}
function bwrReset() {
  bwr.popped.clear();
  document.getElementById('bwr-grid').innerHTML='';
  bwrStart();
}

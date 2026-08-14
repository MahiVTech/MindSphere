// ═══════════════════════════ POP IT ═══════════════════════════
let pi = { popped: new Set(), total: 96 };
function piStart() {
  const grid = document.getElementById('pi-grid'); if (!grid) return;
  if (grid.children.length) return;
  for (let i = 0; i < pi.total; i++) {
    const d = document.createElement('div');
    d.style.cssText='aspect-ratio:1;border-radius:50%;background:linear-gradient(145deg,#EAF2FB,#D8E8F7);box-shadow:inset 0 3px 5px rgba(45,55,72,.15),0 1px 0 rgba(255,255,255,.6);cursor:pointer;transition:transform .1s';
    d.onclick = () => piPop(i, d);
    d.dataset.i = i;
    grid.appendChild(d);
  }
  document.getElementById('pi-total').textContent = pi.total;
}
function piPop(i, el) {
  if (pi.popped.has(i)) return;
  pi.popped.add(i); playPop(1 + Math.random()*0.3);
  el.style.background='radial-gradient(circle at 35% 30%,#F8FBFD,#C7D6E5)';
  el.style.boxShadow='inset 0 -2px 4px rgba(45,55,72,.12)';
  el.style.transform='scale(.88)';
  document.getElementById('pi-popped').textContent = pi.popped.size;
  if (pi.popped.size >= pi.total) setTimeout(piReset, 500);
}
function piReset() {
  pi.popped.clear();
  document.getElementById('pi-grid').innerHTML='';
  piStart();
  document.getElementById('pi-popped').textContent = 0;
}

// ═══════════════════════════ CALM ZONE — TAB SWITCHER ═══════════════════════════
const CZ_PANELS = ['bubble','gravity','light','sand','magnet','eco','popit','bubblewrap','spinner','stressball','newton','rake','chimes','balloons'];
function czShow(which) {
  const hub = document.getElementById('cz-hub-grid');
  hub.style.display = which === 'hub' ? 'grid' : 'none';

  CZ_PANELS.forEach(name => {
    const el = document.getElementById('cz-' + name);
    if (!el) return;
    if (name === which) {
      el.classList.add('visible');
      requestAnimationFrame(() => el.classList.add('show'));
    } else {
      el.classList.remove('show');
      el.classList.remove('visible');
    }
  });

  if (which === 'bubble') setTimeout(bwStart, 60);
  if (which === 'gravity') setTimeout(gvStart, 60);
  if (which === 'light') setTimeout(lpStart, 60);
  if (which === 'sand') setTimeout(saStart, 60);
  if (which === 'magnet') setTimeout(mbStart, 60);
  if (which === 'eco') setTimeout(ecoStart, 60);
  if (which === 'popit') setTimeout(piStart, 60);
  if (which === 'bubblewrap') setTimeout(bwrStart, 60);
  if (which === 'spinner') setTimeout(spStart, 60);
  if (which === 'stressball') setTimeout(sbStart, 60);
  if (which === 'newton') setTimeout(ncStart, 60);
  if (which === 'rake') setTimeout(zrStart, 60);
  if (which === 'chimes') setTimeout(chStart, 60);
  if (which === 'balloons') setTimeout(blStart, 60);
}

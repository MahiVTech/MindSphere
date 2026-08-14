// ═══════════════════════════ NAV ═══════════════════════════
const PAGE_TITLES = {
  dashboard:'Dashboard', fearmap:'FearMap', situation:'Situation Assessment',
  emotion:'Emotion Detection', facial:'Facial Analysis', simulator:'Exposure Simulator',
  music:'Emotion Music', reco:'Recommendations', journal:'Mood Journal',
  goals:'Daily Goals', analytics:'My Progress', support:'Get Support',
  calmzone:'Calm Zone', vent:'Vent Space', emergency:'Emergency & SOS'
};

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.getElementById('topbar-title').textContent = PAGE_TITLES[page];
  // match nav item
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.textContent.trim().includes(PAGE_TITLES[page].split(' ')[0])) n.classList.add('active');
  });
  // special init
  if (page==='goals') renderGoals();
  if (page==='calmzone') czShow('hub');
  if (page==='vent') { ventInit(); renderVentFeed(); }
  if (page==='emergency') renderEmergencyContacts();
  closeSidebarOnMobile();
}

function toggleSidebar() {
  document.getElementById('appSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}
function closeSidebarOnMobile() {
  if (window.innerWidth <= 860) {
    document.getElementById('appSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  }
}

// ═══════════════════════════ ANONYMOUS VENT SPACE ═══════════════════════════
const VENT_ADJ = ['Quiet','Moon','Sky','Gentle','Lone','Foggy','Calm','Wandering','Silent','Golden','Winter','Amber','Hidden','Soft','Drifting'];
const VENT_NOUN = ['Soul','Walker','River','Cloud','Ember','Whisper','Wolf','Sparrow','Echo','Harbor','Lantern','Comet','Willow','Fox'];
let ventMyId = '';
let ventCurrentFilter = 'All';
let ventPosts = [];
function generateAnonName() {
  return VENT_ADJ[Math.floor(Math.random()*VENT_ADJ.length)] + '_' + VENT_NOUN[Math.floor(Math.random()*VENT_NOUN.length)] + Math.floor(10+Math.random()*89);
}
function ventInit() {
  if (ventMyId) return;
  ventMyId = generateAnonName();
  document.getElementById('vent-my-id').textContent = ventMyId;
  ventPosts = [
    { id:1, example:true, author: generateAnonName(), category:'Studies', text:'Third all-nighter this week before the exam and I still feel behind everyone else. Anyone else spiral like this before finals?', sensitive:false, time:'2h ago', reactions:{heart:14,hands:6,star:3}, myReacts:{}, comments:[{author:generateAnonName(),text:'You are so not alone in this, same boat here.'}], reports:0 },
    { id:2, example:true, author: generateAnonName(), category:'Family', text:'My parents keep comparing me to my cousin and I am so tired of never being enough for them.', sensitive:false, time:'5h ago', reactions:{heart:22,hands:11,star:2}, myReacts:{}, comments:[], reports:0 },
    { id:3, example:true, author: generateAnonName(), category:'Anxiety', text:'Had a panic attack in the middle of class today and had to pretend it was nothing. My chest still feels tight.', sensitive:true, time:'1d ago', reactions:{heart:31,hands:18,star:5}, myReacts:{}, comments:[{author:generateAnonName(),text:'Sending you so much strength. Box breathing helps me in the moment.'}], reports:0 },
  ];
}
function ventFilter(el, cat) {
  document.querySelectorAll('.vent-filter').forEach(e=>e.classList.remove('active'));
  el.classList.add('active'); ventCurrentFilter = cat;
  renderVentFeed();
}
const VENT_CRISIS_WORDS = ['suicide','kill myself','end my life','want to die','self harm','hurt myself','ending it'];
function checkVentCrisis(text) {
  const lower = text.toLowerCase();
  const note = document.getElementById('vent-crisis-note');
  if (VENT_CRISIS_WORDS.some(w => lower.includes(w))) {
    note.style.display = 'block';
    note.innerHTML = `<div style="padding:16px 18px;border-radius:12px;background:rgba(242,139,130,.08);border:1px solid rgba(242,139,130,.28)">
      <div style="font-weight:600;color:var(--red);margin-bottom:6px">💛 It sounds like you're carrying a lot right now</div>
      <div style="font-size:12.5px;line-height:1.6">You deserve real support, not just an anonymous post. iCall: <strong>9152987821</strong> · Vandrevala Foundation: <strong>1860-2662-345</strong> (24/7). <a href="#" onclick="navigate('support');return false;" style="color:var(--violet2)">See all support options →</a></div>
    </div>`;
  } else { note.style.display = 'none'; }
}
document.getElementById('vent-text')?.addEventListener('input', e => checkVentCrisis(e.target.value));
function postVent() {
  const text = document.getElementById('vent-text').value.trim();
  const category = document.getElementById('vent-category').value;
  const sensitive = document.getElementById('vent-sensitive').checked;
  if (!text) { alert('Write something first'); return; }
  ventPosts.unshift({ id: Date.now(), author: ventMyId, category, text, sensitive, time:'Just now', reactions:{heart:0,hands:0,star:0}, myReacts:{}, comments:[], reports:0 });
  document.getElementById('vent-text').value=''; document.getElementById('vent-sensitive').checked=false;
  checkVentCrisis('');
  renderVentFeed();
  logActivity('Vent Space post shared', 'var(--lavender-text)');
}
function ventReact(id, type) {
  const p = ventPosts.find(p=>p.id===id); if (!p) return;
  if (p.myReacts[type]) { p.reactions[type]--; p.myReacts[type]=false; } else { p.reactions[type]++; p.myReacts[type]=true; }
  renderVentFeed();
}
function ventReport(id) {
  const p = ventPosts.find(p=>p.id===id); if (!p) return;
  p.reports++;
  renderVentFeed();
}
function ventUnhide(id) {
  const p = ventPosts.find(p=>p.id===id); if (!p) return;
  p._forceShow = true; renderVentFeed();
}
function ventAddComment(id) {
  const input = document.getElementById('vent-comment-'+id);
  const text = input.value.trim(); if (!text) return;
  const p = ventPosts.find(p=>p.id===id); if (!p) return;
  p.comments.push({ author: ventMyId, text });
  input.value=''; renderVentFeed();
}
function renderVentFeed() {
  const feed = document.getElementById('vent-feed'); if (!feed) return;
  const list = ventPosts.filter(p => ventCurrentFilter==='All' || p.category===ventCurrentFilter);
  if (list.length === 0) { feed.innerHTML = '<div class="empty-state"><span class="empty-icon">💭</span><div class="empty-title">No posts in this category yet</div><div class="empty-sub">Be the first to share.</div></div>'; return; }
  const catColor = { Stress:'chip-orange', Anxiety:'chip-red', Relationships:'chip-pink', Career:'chip-cyan', Studies:'chip-green', Family:'chip-gray' };
  feed.innerHTML = list.map(p => {
    const hidden = p.reports >= 3 && !p._forceShow;
    if (hidden) return `<div class="journal-entry" style="text-align:center;color:var(--muted);font-size:12.5px">🚩 This post was reported multiple times and is hidden pending review. <a href="#" onclick="ventUnhide(${p.id});return false;" style="color:var(--violet2)">Show anyway</a></div>`;
    return `<div class="journal-entry">
      <div class="journal-entry-header">
        <div style="display:flex;align-items:center;gap:8px"><strong style="font-size:12.5px">${p.author}</strong><span class="chip ${catColor[p.category]||'chip-gray'}">${p.category}</span>${p.example?'<span class="chip chip-gray">Example</span>':''}</div>
        <span class="journal-entry-date">${p.time}</span>
      </div>
      ${p.sensitive ? `<div style="font-size:11px;color:var(--red);margin:4px 0 8px;font-weight:500">⚠️ Sensitive content warning</div>` : ''}
      <div class="journal-entry-text" style="margin-bottom:10px">${p.text}</div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <button class="btn btn-outline" style="padding:4px 10px;font-size:11.5px;${p.myReacts.heart?'background:rgba(242,139,130,.15);border-color:var(--red)':''}" onclick="ventReact(${p.id},'heart')">❤️ ${p.reactions.heart}</button>
        <button class="btn btn-outline" style="padding:4px 10px;font-size:11.5px;${p.myReacts.hands?'background:rgba(111,168,255,.15);border-color:var(--violet)':''}" onclick="ventReact(${p.id},'hands')">🤝 ${p.reactions.hands}</button>
        <button class="btn btn-outline" style="padding:4px 10px;font-size:11.5px;${p.myReacts.star?'background:rgba(246,196,83,.18);border-color:var(--orange)':''}" onclick="ventReact(${p.id},'star')">🌟 ${p.reactions.star}</button>
        <button class="btn btn-outline" style="padding:4px 10px;font-size:11.5px;margin-left:auto;color:var(--muted)" onclick="ventReport(${p.id})">🚩 Report</button>
      </div>
      ${p.comments.map(cm=>`<div style="font-size:12px;padding:7px 10px;border-radius:7px;background:rgba(45,55,72,.03);margin-bottom:5px"><strong>${cm.author}:</strong> ${cm.text}</div>`).join('')}
      <div style="display:flex;gap:6px;margin-top:6px">
        <input type="text" id="vent-comment-${p.id}" class="ai-input" placeholder="Reply anonymously..." style="flex:1;padding:7px 10px;font-size:12px" onkeydown="if(event.key==='Enter'){ventAddComment(${p.id})}">
        <button class="btn btn-outline" style="padding:6px 10px;font-size:11.5px" onclick="ventAddComment(${p.id})">Reply</button>
      </div>
    </div>`;
  }).join('');
}

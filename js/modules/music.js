// ═══════════════════════════ MUSIC ENGINE (original, generated audio — no licensed tracks) ═══════════════════════════
let musicAudioCtx = null;
let musicPlaying = { nodes: [], index: -1, gain: null };
let musicTracks = [];

function ensureAudioCtx() {
  if (!musicAudioCtx) musicAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (musicAudioCtx.state === 'suspended') musicAudioCtx.resume();
  return musicAudioCtx;
}
function stopMusic() {
  musicPlaying.nodes.forEach(n => { try { n.stop ? n.stop() : null; n.disconnect && n.disconnect(); } catch(e){} });
  musicPlaying.nodes = [];
  if (musicPlaying.gain) { try { musicPlaying.gain.disconnect(); } catch(e){} musicPlaying.gain = null; }
  musicPlaying.index = -1;
  document.querySelectorAll('.music-card').forEach(c => c.classList.remove('playing'));
}
function noiseBuffer(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
function playGenerated(kind) {
  const ctx = ensureAudioCtx();
  const master = ctx.createGain(); master.gain.value = 0.0001; master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.2);
  musicPlaying.gain = master;
  const nodes = [master];

  if (kind === 'lofi') {
    const notes = [220, 261.6, 196, 246.9];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.05;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08 + i*0.01;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      o.connect(g); g.connect(master); o.start(); lfo.start();
      nodes.push(o, lfo, g, lfoGain);
    });
  } else if (kind === 'piano') {
    const seq = [523.3,659.3,784,659.3,523.3,392,440,523.3];
    let step = 0;
    const play = () => {
      if (musicPlaying.gain !== master) return;
      const f = seq[step % seq.length]; step++;
      const o = ctx.createOscillator(); o.type='triangle'; o.frequency.value=f;
      const g = ctx.createGain(); g.gain.value=0.001;
      o.connect(g); g.connect(master); o.start();
      g.gain.linearRampToValueAtTime(0.16, ctx.currentTime+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+1.1);
      o.stop(ctx.currentTime+1.15);
      if (musicPlaying.gain === master) musicPlaying._timer = setTimeout(play, 900);
    };
    play();
  } else if (kind === 'nature') {
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(ctx); src.loop = true;
    const filt = ctx.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=500; filt.Q.value=0.6;
    const g = ctx.createGain(); g.gain.value = 0.35;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain); lfoGain.connect(g.gain);
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(); lfo.start();
    nodes.push(src, filt, g, lfo, lfoGain);
  } else if (kind === 'binaural') {
    const base = 220;
    const l = ctx.createOscillator(); l.type='sine'; l.frequency.value = base;
    const r = ctx.createOscillator(); r.type='sine'; r.frequency.value = base + 8;
    const pl = ctx.createStereoPanner(); pl.pan.value=-1;
    const pr = ctx.createStereoPanner(); pr.pan.value=1;
    const gl = ctx.createGain(); gl.gain.value=0.1;
    const gr = ctx.createGain(); gr.gain.value=0.1;
    l.connect(gl); gl.connect(pl); pl.connect(master);
    r.connect(gr); gr.connect(pr); pr.connect(master);
    l.start(); r.start();
    nodes.push(l,r,pl,pr,gl,gr);
  }
  musicPlaying.nodes = nodes;
}
function kindFor(track) {
  const s = ((track.type||'')+' '+(track.title||'')).toLowerCase();
  if (s.includes('binaural') || s.includes('therapeutic') || s.includes('beat')) return 'binaural';
  if (s.includes('piano') || s.includes('classical')) return 'piano';
  if (s.includes('nature') || s.includes('ambient') || s.includes('rain') || s.includes('white noise') || s.includes('wind')) return 'nature';
  return 'lofi';
}
function toggleTrack(i) {
  if (musicPlaying.index === i) { stopMusic(); return; }
  stopMusic();
  const tr = musicTracks[i]; if (!tr) return;
  playGenerated(kindFor(tr));
  musicPlaying.index = i;
  document.querySelectorAll('.music-card').forEach((c,idx) => c.classList.toggle('playing', idx===i));
}
function renderPlaylist() {
  const pl=document.getElementById('music-playlist'); pl.innerHTML='';
  const colors=['rgba(111,168,255,.2)','rgba(159,211,168,.2)','rgba(92,184,92,.2)','rgba(246,196,83,.2)'];
  musicTracks.forEach((tr,i)=>{
    const playing = musicPlaying.index === i;
    pl.innerHTML+=`<div class="music-card ${playing?'playing':''}" onclick="toggleTrack(${i})"><div class="music-thumb" style="background:${colors[i%4]}">${tr.emoji||'🎵'}</div><div class="music-info"><div class="music-title">${tr.title}</div><div class="music-type">${tr.type} · ${tr.why}</div></div>${playing?'<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>':'<div style="font-size:14px;color:var(--muted)">▶</div>'}</div>`;
  });
}
async function getMusic(){
  const stress=document.getElementById('music-stress').value;
  const energy=document.getElementById('music-energy').value;
  const focus=document.getElementById('music-focus').value;
  const ctx2=document.getElementById('music-context').value||'general study';
  setLoading('music-response');
  document.getElementById('music-mood-label').textContent=`Stress: ${stress}% · Energy: ${energy}% · Focus: ${focus}%`;
  stopMusic();
  let data;
  try {
    const result=await callClaude(`Student: Stress=${stress}%, Energy=${energy}%, Focus=${focus}%, Activity:"${ctx2}". Respond ONLY in valid JSON (no markdown): {"mood_label":"3-word description","tracks":[{"title":"genre or type name","emoji":"one emoji","type":"one of: Lo-fi, Classical, Ambient, Therapeutic","why":"one sentence neurological/psychological reason"}],"summary":"2 sentences linking this playlist specifically to the stress and focus levels provided"}. 4 tracks.`);
    data=JSON.parse(result.replace(/```json|```/g,'').trim());
  } catch(e){
    data={mood_label:'Focused & Calm',tracks:[
      {title:'Lo-fi Chill Loop',emoji:'🎵',type:'Lo-fi',why:'60-80 BPM beats match resting heart rate, reducing cortisol'},
      {title:'Piano Instrumentals',emoji:'🎹',type:'Classical',why:'Simple melodic patterns activate spatial reasoning pathways'},
      {title:'Nature Wind & Rain',emoji:'🌿',type:'Ambient',why:'Masks distracting noise while keeping arousal low'},
      {title:'Binaural Focus Tone',emoji:'🌊',type:'Therapeutic',why:'Gentle L/R frequency offset supports sustained attention'}
    ],summary:'AI playlist generation had a hiccup, so here\'s a reliable default mix — each track is generated live in your browser, tap any card to play or pause it.'};
  }
  musicTracks = data.tracks || [];
  document.getElementById('music-mood-label').textContent=data.mood_label||'Your Playlist';
  renderPlaylist();
  setResponse('music-response',data.summary||'');
  logActivity('Emotion Music playlist generated', 'var(--cyan)');
}

// ═══════════════════════════ SHARED SFX (WebAudio, generated) ═══════════════════════════
let sfxCtx = null;
function sfx() { if (!sfxCtx) sfxCtx = new (window.AudioContext||window.webkitAudioContext)(); if (sfxCtx.state==='suspended') sfxCtx.resume(); return sfxCtx; }
function playPop(pitch=1) {
  const ctx = sfx(); const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type='sine'; o.frequency.setValueAtTime(420*pitch, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(120*pitch, ctx.currentTime+0.09);
  g.gain.setValueAtTime(0.22, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.11);
  o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.12);
}
function playChimeTone(freq) {
  const ctx = sfx(); const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type='sine'; o.frequency.value=freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.18, ctx.currentTime+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+2.2);
  o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+2.3);
}
function playClick(freq=300) {
  const ctx = sfx(); const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type='square'; o.frequency.value=freq; g.gain.value=0.05;
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.04);
  o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.05);
}

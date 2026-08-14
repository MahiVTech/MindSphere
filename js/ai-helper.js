// ═══════════════════════════ AI HELPER ═══════════════════════════
async function callClaude(prompt, system='', maxTokens=1000) {
  const sys = system || "You are MindSphere, an empathetic mental wellness assistant for students. Sound like a caring, down-to-earth older student or friend — not a clinical report. Keep it SHORT (2-5 sentences unless the task clearly needs more) and specific to what they actually said, not generic advice. No disclaimers about being an AI. Plain text, no markdown lists unless truly necessary.";
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:maxTokens,system:sys,messages:[{role:'user',content:prompt}]}),
      signal: ctrl.signal
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message || 'API error');
    const text = d.content?.map(b=>b.text||'').join('') || '';
    if (!text) throw new Error('Empty response');
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function setLoading(id) {
  const el = document.getElementById(id);
  el.className='ai-response loading';
  el.style.display='';
  el.innerHTML='<div class="spinner"></div><div>Analyzing<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>';
}
function setResponse(id, text) {
  const el = document.getElementById(id);
  el.className='ai-response'; el.style.display=''; el.textContent=text;
}

function logActivity(msg, color='var(--violet)') {
  appState.analysisCount++;
  document.getElementById('ring-sessions-val').textContent = appState.analysisCount;
  const offset = Math.max(0, 339 - (appState.analysisCount / 10) * 339);
  document.getElementById('ring-sessions-circle').setAttribute('stroke-dashoffset', offset);
  const list = document.getElementById('activity-list');
  if (list.querySelector('.empty-state')) list.innerHTML = '';
  const now = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  list.insertAdjacentHTML('afterbegin', `<div class="timeline-item"><div class="timeline-dot" style="background:${color}"></div><div><div class="timeline-title">${msg}</div><div class="timeline-time">Just now · ${now}</div></div></div>`);
}

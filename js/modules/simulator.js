// ═══════════════════════════ SIMULATOR ═══════════════════════════
let simMode='', simHistory=[], simStarted=false;
function selectSimMode(el,mode){
  document.querySelectorAll('#sim-mode-wrap .env-option').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected'); simMode=mode;
}
function addChat(html,type){
  const chat=document.getElementById('sim-chat');
  if(chat.querySelector('.empty-state')) chat.innerHTML='';
  const d=document.createElement('div');
  d.className=type==='ai'?'sim-bubble':'sim-response'; d.innerHTML=html;
  chat.appendChild(d); chat.scrollTop=chat.scrollHeight;
}
async function startSim(){
  if(!simMode){alert('Choose a scenario first');return;}
  simHistory=[]; document.getElementById('sim-chat').innerHTML=''; simStarted=true;
  const labels={interview:'💼 Placement Interview',presentation:'🎤 Presentation Mode',gd:'💬 Group Discussion',viva:'📋 Viva / Oral Exam'};
  document.getElementById('sim-sub').textContent=labels[simMode];
  const prompts={
    interview:'You are a placement interviewer for a tech company. Start with "Good morning! Please introduce yourself." After each answer, ask exactly one follow-up question. After 4-5 exchanges, give a confidence score /100, 2 strengths you noticed, and 2 improvements.',
    presentation:'You are a virtual audience of 30 students watching a presentation. Start: "The audience is ready. Please begin your presentation on any topic you\'re comfortable with." After each response, give 1-2 lines of realistic audience feedback and prompt them to continue.',
    gd:'You are moderating a group discussion on "Should AI replace human teachers?" Start by introducing the topic and asking for the student\'s opening stance. After each reply, add a counterpoint from another group member and invite their response.',
    viva:'You are an examiner conducting an oral exam on Computer Science / Class XII topics. Start with an easy question, then increase difficulty. After 4 questions give feedback on their performance.'
  };
  addChat('<div class="spinner" style="display:inline-block;margin-right:7px;vertical-align:middle"></div>Starting session...','ai');
  try {
    const intro=await callClaude(prompts[simMode],'You are running a realistic student practice simulation. Be genuinely helpful, professional, and give specific actionable feedback. No AI disclaimers.');
    document.getElementById('sim-chat').innerHTML=''; addChat(intro,'ai');
    simHistory.push({role:'assistant',content:intro});
  } catch(e){
    document.getElementById('sim-chat').innerHTML='';
    addChat('⚠️ Could not start the session — check your connection and tap Start Session again.','ai');
    simStarted=false;
  }
  logActivity(`Simulator: ${labels[simMode]} started`, 'var(--cyan)');
}
async function sendSimResponse(){
  const input=document.getElementById('sim-input');
  const text=input.value.trim();
  if(!text||!simStarted)return; input.value='';
  addChat(text,'user'); simHistory.push({role:'user',content:text});
  addChat('<div class="spinner" style="display:inline-block;margin-right:7px;vertical-align:middle"></div>Responding...','ai');
  try {
    const sys=`You are running a ${simMode} simulation for a student. Be realistic, encouraging, give specific coaching. No AI disclaimers.`;
    const ctrl=new AbortController(); const timeout=setTimeout(()=>ctrl.abort(),25000);
    let reply;
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:600,system:sys,messages:simHistory.slice(-8)}),signal:ctrl.signal});
      const d=await r.json();
      if (d.error) throw new Error(d.error.message||'API error');
      reply = d.content?.map(b=>b.text||'').join('') || '';
      if (!reply) throw new Error('Empty response');
    } finally { clearTimeout(timeout); }
    const chat=document.getElementById('sim-chat'); chat.removeChild(chat.lastChild);
    addChat(reply,'ai'); simHistory.push({role:'assistant',content:reply});
  } catch(e){
    const chat=document.getElementById('sim-chat'); if(chat.lastChild)chat.removeChild(chat.lastChild);
    addChat('⚠️ Connection hiccup — check your network and try sending that again.','ai');
    simHistory.pop();
  }
}
document.getElementById('sim-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendSimResponse();}});

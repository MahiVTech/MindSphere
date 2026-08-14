// ═══════════════════════════ MOOD JOURNAL ═══════════════════════════
let selectedMoodEmoji='', selectedMoodLabel='';
function selectMood(el,emoji,label){
  document.querySelectorAll('#mood-selector .btn').forEach(b=>{b.style.background='';b.style.borderColor='';});
  el.style.background='rgba(111,168,255,.15)'; el.style.borderColor='var(--violet)';
  selectedMoodEmoji=emoji; selectedMoodLabel=label;
}
function saveJournal(){
  const text=document.getElementById('journal-input').value.trim();
  if(!text){alert('Write something first');return;}
  const entry={text,mood:selectedMoodEmoji||'😐',moodLabel:selectedMoodLabel||'Neutral',time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),date:new Date().toLocaleDateString()};
  appState.journalEntries.unshift(entry);
  renderJournal();
  document.getElementById('journal-input').value='';
  document.getElementById('dash-journal-count').textContent=appState.journalEntries.length;
  logActivity('Journal entry saved: '+entry.moodLabel, 'var(--green)');
  // Mark goal 5 done
  const g=appState.goals.find(g=>g.id===5);
  if(g&&!g.done){g.done=true;renderGoals();}
}
function renderJournal(){
  const list=document.getElementById('journal-list');
  if(appState.journalEntries.length===0){
    list.innerHTML='<div class="empty-state"><span class="empty-icon">📓</span><div class="empty-title">No entries yet</div><div class="empty-sub">Write your first mood entry to start tracking.</div></div>';
    return;
  }
  list.innerHTML=appState.journalEntries.map(e=>`
    <div class="journal-entry">
      <div class="journal-entry-header">
        <div style="display:flex;align-items:center;gap:8px"><span class="journal-entry-mood">${e.mood}</span><span style="font-size:12.5px;font-weight:500">${e.moodLabel}</span></div>
        <span class="journal-entry-date">${e.date} · ${e.time}</span>
      </div>
      <div class="journal-entry-text">${e.text}</div>
    </div>`).join('');
}
async function journalAI(){
  const text=document.getElementById('journal-input').value.trim();
  if(!text){alert('Write your entry first');return;}
  const el=document.getElementById('journal-ai');
  el.style.display='block'; setLoading('journal-ai');
  try {
    const r=await callClaude(`A student wrote this journal entry: "${text}" (Mood: ${selectedMoodLabel||'unspecified'}). In 2-3 sentences: reflect back what you hear emotionally, then offer one gentle observation or reframe that might help them see their situation differently. Be warm, not clinical.`);
    setResponse('journal-ai',r);
  } catch(e){setResponse('journal-ai','⚠️ Connection hiccup getting a reflection — your entry is still saved, tap AI Reflection to retry.');}
}

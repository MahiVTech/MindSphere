// ═══════════════════════════ GOALS ═══════════════════════════
function renderGoals(){
  const list=document.getElementById('goals-list');
  list.innerHTML=appState.goals.map(g=>`
    <div class="goal-item ${g.done?'done':''}" onclick="toggleGoal(${g.id})">
      <div class="goal-check">${g.done?'✓':''}</div>
      <span style="font-size:18px">${g.icon}</span>
      <div style="flex:1"><div class="goal-label">${g.label}</div>${g.streak>0?`<div class="goal-streak">🔥 ${g.streak} day streak</div>`:''}</div>
    </div>`).join('');
  const done=appState.goals.filter(g=>g.done).length;
  document.getElementById('goals-progress-text').textContent=`${done} of ${appState.goals.length} completed`;
}
function toggleGoal(id){
  const g=appState.goals.find(g=>g.id===id);
  if(g){g.done=!g.done; if(g.done) g.streak++; renderGoals();}
}
function addCustomGoal(){
  const input=document.getElementById('custom-goal-input');
  const text=input.value.trim();
  if(!text)return;
  appState.goals.push({id:Date.now(),label:text,streak:0,done:false,icon:'⭐'});
  renderGoals(); input.value='';
}
function resetGoals(){ appState.goals.forEach(g=>{g.done=false;}); renderGoals(); }
async function suggestGoal(){
  setLoading('goal-suggestion');
  const ctx2 = appState.fearScore!==null ? `Fear score: ${appState.fearScore}%, Stress: ${appState.stressScore}%.` : 'No analysis run yet.';
  try {
    const text=await callClaude(`Student wellness context: ${ctx2} Journal entries today: ${appState.journalEntries.length}. Suggest ONE specific, achievable wellness goal for today that would most help reduce their stress or build confidence. Make it concrete, timed (e.g. "Do 5 min of box breathing at 9pm tonight"). Under 50 words.`);
    setResponse('goal-suggestion',text);
  } catch(e){setResponse('goal-suggestion','⚠️ Connection hiccup — tap the button again in a moment.');}
}
renderGoals();

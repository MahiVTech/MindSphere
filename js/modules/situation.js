// ═══════════════════════════ SITUATION ASSESSMENT ═══════════════════════════
let selectedEnv='';
function selectEnv(el, name){
  document.querySelectorAll('#env-grid .env-option').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected'); selectedEnv=name;
}

async function runSituation(){
  if(!selectedEnv){alert('Please select a situation first');return;}
  const ctx2=document.getElementById('sit-context').value;
  const envData={
    'Exam Hall':[85,72,18],'Classroom':[35,42,68],'Interview Room':[80,86,14],
    'Seminar / Stage':[68,62,30],'Large Crowd':[82,28,12],'Library':[12,18,88],
    'Group Discussion':[58,62,36],'Cafeteria':[42,22,55],'Home / Alone':[8,8,92]
  };
  const [social,perf,comfort]=envData[selectedEnv]||[50,50,50];
  document.getElementById('sit-empty').style.display='none';
  document.getElementById('sit-result').style.display='block';
  setTimeout(()=>{
    document.getElementById('social-risk-bar').style.width=social+'%';
    document.getElementById('social-risk-pct').textContent=social+'%';
    document.getElementById('perf-bar').style.width=perf+'%';
    document.getElementById('perf-pct').textContent=perf+'%';
    document.getElementById('comfort-bar').style.width=comfort+'%';
    document.getElementById('comfort-pct').textContent=comfort+'%';
  },100);
  setLoading('sit-response');
  try {
    const text = await callClaude(`Environment: "${selectedEnv}" (social anxiety risk: ${social}%, performance pressure: ${perf}%, comfort: ${comfort}%). Additional context: "${ctx2||'none'}". Give 2 paragraphs: (1) Which specific psychological triggers are active in this environment and why they cause anxiety, (2) Three micro-techniques someone can use RIGHT NOW in this environment to stay calm and confident.`);
    setResponse('sit-response', text);
  } catch(e){setResponse('sit-response','Analysis failed.');}
  logActivity(`Situation: ${selectedEnv} assessed`, 'var(--cyan)');
}

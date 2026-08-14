// ═══════════════════════════ FEARMAP ═══════════════════════════
async function runFearMap() {
  const sleep=+document.getElementById('sleep-range').value;
  const screen=+document.getElementById('screen-range').value;
  const study=+document.getElementById('study-range').value;
  const social=+document.getElementById('social-range').value;
  const stressor=document.getElementById('stressor-input').value.trim();

  // Formula-based fear score
  const sleepPenalty = Math.max(0, (7-sleep)/5*40);
  const screenPenalty = Math.min(30, screen/16*30);
  const studyPenalty = Math.max(0, (6-study)/6*20);
  const socialPenalty = (100-social)/100*15;
  const stressorPenalty = stressor.length > 10 ? 20 : stressor.length > 2 ? 10 : 0;
  const fearScore = Math.min(98, Math.round(sleepPenalty+screenPenalty+studyPenalty+socialPenalty+stressorPenalty));
  const confScore = Math.max(5, 100 - fearScore - Math.round(Math.random()*8));
  const stressScore = Math.round((fearScore + (screen/16*40)) / 2);

  // Fear sub-categories
  const examFear = Math.min(95, Math.round(fearScore * 1.1 + (stressor.toLowerCase().includes('exam')||stressor.toLowerCase().includes('test')||stressor.toLowerCase().includes('viva') ? 15 : 0)));
  const socialFear = Math.min(90, Math.round((100-social)*0.7 + screen*2));
  const perfFear = Math.min(92, Math.round(fearScore * 0.9 + (stressor.toLowerCase().includes('interview')||stressor.toLowerCase().includes('present') ? 15 : 0)));

  // Store globally
  appState.fearScore = fearScore;
  appState.stressScore = stressScore;
  appState.confScore = confScore;

  // Show result
  document.getElementById('fear-empty').style.display='none';
  document.getElementById('fear-result').style.display='block';
  const scoreEl = document.getElementById('fear-score-display');
  scoreEl.textContent = fearScore+'%';
  scoreEl.style.color = fearScore>70?'var(--red)':fearScore>45?'var(--orange)':'var(--green)';
  document.getElementById('fear-level-display').textContent = fearScore>70?'HIGH RISK':fearScore>45?'MODERATE':'LOW';

  setTimeout(()=>{
    [['fm-exam','fm-exam-bar',Math.min(95,examFear)],['fm-social','fm-social-bar',Math.min(90,socialFear)],['fm-perf','fm-perf-bar',Math.min(92,perfFear)]].forEach(([id,bar,val])=>{
      document.getElementById(id).textContent=val+'%';
      document.getElementById(bar).style.width=val+'%';
    });
  },100);

  const tags = document.getElementById('fear-tags');
  tags.innerHTML='';
  if(sleep<6) tags.innerHTML+='<span class="chip chip-red" style="margin:3px">😴 Sleep deprived</span>';
  if(screen>6) tags.innerHTML+='<span class="chip chip-orange" style="margin:3px">📱 High screen time</span>';
  if(stressor.length>5) tags.innerHTML+='<span class="chip chip-violet" style="margin:3px">⚡ Active stressor</span>';
  if(social<40) tags.innerHTML+='<span class="chip chip-cyan" style="margin:3px">👥 Low social</span>';
  if(study<2) tags.innerHTML+='<span class="chip chip-orange" style="margin:3px">📚 Low study time</span>';

  // Update dashboard
  updateDashStats();

  setLoading('fearmap-response');
  try {
    const text = await callClaude(`Student FearMap data — Sleep: ${sleep}h (optimal 7h), Screen time: ${screen}h, Study: ${study}h, Social interaction: ${social}%, Stressors: "${stressor||'none'}". Calculated scores: Fear=${fearScore}%, Exam fear=${examFear}%, Social fear=${socialFear}%, Performance fear=${perfFear}%, Confidence=${confScore}%, Stress=${stressScore}%. Write 3 short paragraphs: (1) which inputs are driving the fear score highest and why, (2) which specific fear category is most active right now, (3) exactly 3 actions for TODAY to reduce the highest-scoring trigger. Be specific to the actual numbers.`);
    setResponse('fearmap-response', text);
  } catch(e){ setResponse('fearmap-response','⚠️ Could not reach the AI for the written breakdown — your scores above are still accurate. Try again in a moment.'); }

  // Update music module source info
  document.getElementById('music-source-label').textContent = `Pre-filled from FearMap: Stress ${stressScore}%, Confidence ${confScore}%.`;
  document.getElementById('music-stress').value = stressScore;
  document.getElementById('music-stress-val').textContent = stressScore+'%';

  // Update dashboard triggers
  updateDashTriggers(sleep, screen, study, social, stressor, fearScore);
  logActivity(`FearMap: Fear ${fearScore}% · Confidence ${confScore}%`, 'var(--violet)');
  document.getElementById('current-mood-pill').textContent = fearScore>70?'😰 High fear':fearScore>45?'😟 Moderate stress':'😌 Relatively calm';
}

function updateDashStats() {
  if (appState.confScore === null) return;
  const c = appState.confScore, s = appState.stressScore, f = appState.fearScore;
  document.getElementById('dash-conf').textContent = c+'%';
  document.getElementById('dash-conf').style.fontSize = '28px';
  document.getElementById('dash-conf').style.color = c>70?'var(--violet)':c>50?'var(--cyan)':'var(--orange)';
  document.getElementById('dash-conf-sub').textContent = 'From latest FearMap';
  document.getElementById('dash-stress').textContent = s+'%';
  document.getElementById('dash-stress').style.fontSize = '28px';
  document.getElementById('dash-stress').style.color = s>60?'var(--red)':s>35?'var(--orange)':'var(--green)';
  document.getElementById('dash-stress-sub').textContent = 'From latest FearMap';
  document.getElementById('dash-fear').textContent = f+'%';
  document.getElementById('dash-fear').style.fontSize = '28px';
  document.getElementById('dash-fear').style.color = f>70?'var(--red)':f>45?'var(--orange)':'var(--green)';
  // Update analytics rings
  const confOffset = 339 - (c/100)*339;
  document.getElementById('ring-conf-circle').setAttribute('stroke-dashoffset', confOffset);
  document.getElementById('ring-conf-val').textContent = c+'%';
  document.getElementById('ring-conf-note').textContent = c>70?'Strong':'Needs work';
  const stressOffset = 339 - (s/100)*339;
  document.getElementById('ring-stress-circle').setAttribute('stroke-dashoffset', stressOffset);
  document.getElementById('ring-stress-val').textContent = s+'%';
  document.getElementById('ring-stress-note').textContent = s>60?'High':'Manageable';
}

function updateDashTriggers(sleep, screen, study, social, stressor, fearScore) {
  const triggers = document.getElementById('dash-triggers');
  triggers.innerHTML = '';
  const items = [];
  if(sleep<6) items.push(['😴 Sleep: '+sleep+'hrs (need 7+)', 'var(--red)', 'Critical']);
  if(screen>6) items.push(['📱 Screen time: '+screen+'hrs', 'var(--orange)', 'High']);
  if(stressor.length>5) items.push(['⚡ Active stressor detected', 'var(--violet)', 'Active']);
  if(social<40) items.push(['👥 Low social interaction', 'var(--cyan)', 'Watch']);
  if(study<2) items.push(['📚 Study time low: '+study+'h', 'var(--orange)', 'Moderate']);
  if(items.length===0) items.push(['✅ No major triggers detected', 'var(--green)', 'Good']);
  items.forEach(([label, color, badge]) => {
    triggers.innerHTML += `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:8px;background:${color}11;border:1px solid ${color}33;margin-bottom:8px;font-size:12.5px"><span>${label}</span><span style="font-size:11px;background:${color}22;color:${color};padding:2px 8px;border-radius:6px">${badge}</span></div>`;
  });
}

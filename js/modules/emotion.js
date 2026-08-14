// ═══════════════════════════ EMOTION DETECTION ═══════════════════════════
async function analyzeEmotion(){
  const text=document.getElementById('voice-input').value;
  if(!text.trim()){alert('Please write something first');return;}
  document.getElementById('emotion-empty').style.display='none';
  document.getElementById('emotion-result').style.display='block';
  setLoading('voice-response');
  try {
    const result=await callClaude(`Analyze this text from a student for emotional content: "${text}". Return ONLY valid JSON (no markdown): {"fear":0-100,"stress":0-100,"confidence":0-100,"calm":0-100,"analysis":"2 sentences about what emotional state this reveals and what's driving it","advice":"2 specific, actionable sentences tailored to this exact situation"}`);
    let data;
    try { data=JSON.parse(result.replace(/```json|```/g,'').trim()); }
    catch { data={fear:60,stress:50,confidence:25,calm:20,analysis:result,advice:'Take a moment to breathe and focus on one step at a time.'}; }
    ['fear','stress','confidence','calm'].forEach(k=>{
      const val=data[k]||0;
      const ids={fear:['v-fear','v-fear-bar','var(--red)'],stress:['v-stress','v-stress-bar','var(--orange)'],confidence:['v-conf','v-conf-bar','var(--violet)'],calm:['v-calm','v-calm-bar','var(--green)']}[k];
      document.getElementById(ids[0]).textContent=val+'%';
      setTimeout(()=>{document.getElementById(ids[1]).style.width=val+'%';},100);
    });
    setResponse('voice-response',(data.analysis||'')+'\n\n'+(data.advice||''));
    // Update mood pill
    const dom = data.fear>60?'😰 High fear':data.stress>60?'😟 Stressed':data.calm>60?'😌 Calm':'😐 Neutral';
    document.getElementById('current-mood-pill').textContent=dom;
  } catch(e){setResponse('voice-response','Analysis failed.');}
  logActivity('Emotion detection completed', 'var(--violet)');
}

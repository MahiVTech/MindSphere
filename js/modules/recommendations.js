// ═══════════════════════════ RECOMMENDATIONS ═══════════════════════════
async function getReco(){
  const input=document.getElementById('reco-input').value;
  if(!input.trim()){alert('Describe your challenge first');return;}
  setLoading('reco-response');
  const fearCtx = appState.fearScore!==null ? `(FearMap score: ${appState.fearScore}%, Stress: ${appState.stressScore}%)` : '';
  try {
    const text=await callClaude(`Student challenge: "${input}" ${fearCtx}. Create a specific 4-part action plan: (1) Next 30 minutes: one concrete action to take right now, (2) Rest of today: one strategy, (3) A confidence-building exercise specifically for this situation, (4) A mindset reframe that changes how they see this challenge. Be very specific to their exact situation. Under 220 words.`);
    setResponse('reco-response',text);
  } catch(e){setResponse('reco-response','⚠️ Connection hiccup generating your plan — tap the button again.');}
  logActivity('Action plan generated', 'var(--green)');
}

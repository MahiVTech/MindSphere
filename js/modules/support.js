// ═══════════════════════════ SUPPORT CHAT ═══════════════════════════
async function supportChat(){
  const text=document.getElementById('support-input').value.trim();
  if(!text)return;
  const el=document.getElementById('support-response');
  el.style.display='block'; setLoading('support-response');
  try {
    const r=await callClaude(`A student reached out on a mental wellness platform: "${text}". Respond with genuine empathy and warmth. Acknowledge what they shared. Offer one practical suggestion. Gently remind them that professional support (like iCall: 9152987821) is available if things feel overwhelming. Keep it under 100 words and human in tone.`);
    setResponse('support-response',r);
  } catch(e){setResponse('support-response','Could not connect. Please try calling iCall: 9152987821.');}
}

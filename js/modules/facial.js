// ═══════════════════════════ FACIAL ANALYSIS ═══════════════════════════
let webcamStream=null, selectedFaceEmoji='', selectedFaceName='', capturedImageData=null;

function selectFace(el,emoji,name){
  document.querySelectorAll('#face-grid .env-option').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected'); selectedFaceEmoji=emoji; selectedFaceName=name;
  capturedImageData=null;
}

async function startWebcam(){
  try {
    webcamStream=await navigator.mediaDevices.getUserMedia({video:true});
    const video=document.getElementById('webcam-video');
    video.srcObject=webcamStream; video.style.display='block';
    document.getElementById('webcam-placeholder').style.display='none';
    document.getElementById('snap-btn').disabled=false;
    document.getElementById('webcam-btn').textContent='🔴 Stop Camera';
    document.getElementById('webcam-btn').onclick=stopWebcam;
  } catch(e){
    alert('Camera access denied. Please enable camera permission or select an expression manually.');
  }
}

function stopWebcam(){
  if(webcamStream){webcamStream.getTracks().forEach(t=>t.stop());webcamStream=null;}
  document.getElementById('webcam-video').style.display='none';
  document.getElementById('webcam-canvas').style.display='none';
  document.getElementById('webcam-placeholder').style.display='flex';
  document.getElementById('snap-btn').disabled=true;
  document.getElementById('webcam-btn').textContent='📷 Start Camera';
  document.getElementById('webcam-btn').onclick=startWebcam;
}

function snapPhoto(){
  const video=document.getElementById('webcam-video');
  const canvas=document.getElementById('webcam-canvas');
  canvas.width=video.videoWidth; canvas.height=video.videoHeight;
  canvas.getContext('2d').drawImage(video,0,0);
  capturedImageData=canvas.toDataURL('image/jpeg',0.8).split(',')[1];
  canvas.style.display='block'; video.style.display='none';
  selectedFaceName=''; selectedFaceEmoji='';
  document.querySelectorAll('#face-grid .env-option').forEach(e=>e.classList.remove('selected'));
}

async function analyzeFace(){
  if(!selectedFaceName && !capturedImageData){alert('Select an expression or snap a photo first');return;}
  document.getElementById('face-empty').style.display='none';
  document.getElementById('face-result').style.display='block';

  let emoji=selectedFaceEmoji||'📷', name=selectedFaceName||'Photo';
  document.getElementById('face-emoji-display').textContent=emoji;

  // Fake CNN confidence scores for prototype
  const emoMap={Happy:[82,5,3,2,5,3],Neutral:[10,74,5,4,4,3],Fearful:[5,8,79,3,3,2],Sad:[4,6,8,75,4,3],Stressed:[3,5,10,6,73,3],Angry:[4,3,5,5,5,78]};
  const scores=emoMap[name]||[16,16,17,17,17,17];
  const labels=['Happy','Neutral','Fearful','Sad','Stressed','Angry'];
  const chips=document.getElementById('face-chip-row');
  chips.innerHTML='';
  labels.forEach((l,i)=>{ chips.innerHTML+=`<span class="chip ${scores[i]>50?'chip-violet':'chip-gray'}" style="margin:2px">${l} ${scores[i]}%</span>`; });

  setLoading('face-response');
  try {
    let prompt;
    if(capturedImageData) {
      const ctrl=new AbortController(); const timeout=setTimeout(()=>ctrl.abort(),25000);
      let text;
      try {
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:400,system:"You are a warm, relatable mental wellness assistant for students. Keep responses short (3-5 sentences) and specific, not clinical.",messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:capturedImageData}},{type:'text',text:"What emotion does this facial expression show? Give one practical wellness tip for that state. Keep it under 80 words, warm and relatable."}]}]}),signal:ctrl.signal});
        const d=await r.json();
        if (d.error) throw new Error(d.error.message||'API error');
        text = d.content?.map(b=>b.text||'').join('') || '';
        if (!text) throw new Error('Empty response');
      } finally { clearTimeout(timeout); }
      setResponse('face-response',text);
    } else {
      const text=await callClaude(`Student's face shows: ${name} (${emoji}). In 3-4 short, relatable sentences: what this expression suggests about how they're feeling right now, and one concrete technique to shift toward calm in the next 5 minutes. Not clinical, sound like a supportive friend.`);
      setResponse('face-response',text);
    }
  } catch(e){setResponse('face-response','⚠️ Analysis hit a connection issue — give it another try in a moment.');}
  logActivity(`Facial analysis: ${name}`, 'var(--green)');
}

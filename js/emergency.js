// ═══════════════════════════ EMERGENCY & SOS ═══════════════════════════
function updateSOSNumber(num) {
  num = (num || '112').replace(/[^\d+]/g,'');
  const b1 = document.getElementById('sos-primary-call-btn'); if (b1) b1.href = 'tel:' + num;
  const b2 = document.getElementById('sos-modal-call-btn'); if (b2) b2.href = 'tel:' + num;
  const label = document.getElementById('sos-modal-number'); if (label) label.textContent = num;
}
function callNumber(num) {
  if (!num) { alert('Enter a number first'); return; }
  const clean = num.toString().replace(/[^\d+]/g,'');
  let worked = false;
  try {
    const a = document.createElement('a');
    a.href = 'tel:' + clean; a.rel = 'noopener'; a.target = '_top';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    worked = true;
  } catch(e) {}
  try { window.top.location.href = 'tel:' + clean; } catch(e) { try { window.location.href = 'tel:' + clean; } catch(e2){} }
  copyNumberFallback(clean);
}
function smsNumber(num, body) {
  const clean = num.toString().replace(/[^\d+]/g,'');
  try {
    const a = document.createElement('a');
    a.href = 'sms:' + clean + '?body=' + encodeURIComponent(body); a.rel='noopener'; a.target='_top';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } catch(e) {}
  try { window.top.location.href = 'sms:' + clean + '?body=' + encodeURIComponent(body); } catch(e){ try { window.location.href = 'sms:' + clean + '?body=' + encodeURIComponent(body); } catch(e2){} }
  copyNumberFallback(clean);
}
function copyNumberFallback(clean) {
  // If the tap above didn't open your dialer (common inside an embedded preview), the number is copied so you can dial it manually.
  if (navigator.clipboard) { navigator.clipboard.writeText(clean).catch(()=>{}); }
  const bar = document.getElementById('call-fallback-bar');
  if (bar) {
    bar.style.display = 'flex';
    bar.querySelector('span').textContent = `If your dialer didn't open, ${clean} was copied — paste it into your phone app.`;
    clearTimeout(bar._t); bar._t = setTimeout(()=>{ bar.style.display='none'; }, 6000);
  }
}
function addEmergencyContact() {
  const name = document.getElementById('ec-name').value.trim();
  const rel = document.getElementById('ec-relation').value.trim() || 'Contact';
  const phone = document.getElementById('ec-phone').value.trim();
  if (!name || !phone) { alert('Add a name and phone number'); return; }
  appState.emergencyContacts.push({ id: Date.now(), name, rel, phone });
  document.getElementById('ec-name').value=''; document.getElementById('ec-relation').value=''; document.getElementById('ec-phone').value='';
  renderEmergencyContacts();
  logActivity('Emergency contact added: '+name, 'var(--red)');
}
function deleteEmergencyContact(id) {
  appState.emergencyContacts = appState.emergencyContacts.filter(c => c.id !== id);
  renderEmergencyContacts();
}
function renderEmergencyContacts() {
  const list = document.getElementById('emergency-contacts-list'); if (!list) return;
  if (appState.emergencyContacts.length === 0) {
    list.innerHTML = '<div class="empty-state"><span class="empty-icon">👪</span><div class="empty-title">No contacts saved yet</div><div class="empty-sub">Add a parent, guardian, or trusted friend above for one-tap access during SOS.</div></div>';
    return;
  }
  list.innerHTML = appState.emergencyContacts.map(c => `
    <div class="sos-contact-row">
      <div><div class="name">${c.name}</div><div class="rel">${c.rel} · ${c.phone}</div></div>
      <a class="btn btn-cyan" style="padding:6px 10px;font-size:11px;text-decoration:none" href="tel:${c.phone.replace(/[^\d+]/g,'')}" onclick="copyNumberFallback('${c.phone.replace(/[^\d+]/g,'')}')">📞</a>
      <a class="btn btn-outline" style="padding:6px 10px;font-size:11px;text-decoration:none" href="sms:${c.phone.replace(/[^\d+]/g,'')}?body=${encodeURIComponent('I need help — this is my current location.')}">💬</a>
      <button class="btn btn-red" style="padding:6px 10px;font-size:11px" onclick="deleteEmergencyContact(${c.id})">✕</button>
    </div>`).join('');
}
function fetchLocation(inModal) {
  const resultEl = document.getElementById(inModal ? 'sos-modal-location' : 'loc-result');
  if (!navigator.geolocation) { if(resultEl) resultEl.textContent = 'Geolocation not supported on this device.'; return; }
  if (resultEl) resultEl.textContent = '📡 Getting your live location...';
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude, accuracy } = pos.coords;
    appState.location = { lat: latitude, lng: longitude, accuracy, time: new Date() };
    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    let addr = '';
    try {
      const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const d = await r.json();
      addr = [d.locality, d.principalSubdivision, d.countryName].filter(Boolean).join(', ');
    } catch(e) {}
    const html = `📍 ${addr ? addr+'<br>' : ''}<span style="color:var(--muted)">${latitude.toFixed(5)}, ${longitude.toFixed(5)} · ±${Math.round(accuracy)}m</span><br><a href="${mapsLink}" target="_blank" style="color:var(--violet2)">Open in Google Maps →</a>`;
    if (resultEl) resultEl.innerHTML = html;
    if (inModal) {
      appState.emergencyContacts.forEach(c => {
        // Location fetched — contacts can now be texted with a live link via the 💬 buttons above.
      });
    }
    logActivity('Live location fetched', 'var(--red)');
  }, err => {
    if (resultEl) resultEl.textContent = '⚠️ Could not get location — check that location permission is allowed for this page. (' + err.message + ')';
  }, { enableHighAccuracy: true, timeout: 12000 });
}
function openSOS() {
  const overlay = document.getElementById('sosOverlay');
  const num = document.getElementById('sos-primary-number')?.value || '112';
  updateSOSNumber(num);
  const contactsEl = document.getElementById('sos-modal-contacts');
  contactsEl.innerHTML = appState.emergencyContacts.length === 0
    ? '<div style="font-size:11.5px;color:var(--muted);margin-bottom:8px">No family contacts saved — add them in Emergency & SOS.</div>'
    : appState.emergencyContacts.map(c => `
      <div class="sos-contact-row">
        <div><div class="name">${c.name}</div><div class="rel">${c.rel}</div></div>
        <a class="btn btn-cyan" style="padding:6px 10px;font-size:11px;text-decoration:none" href="tel:${c.phone.replace(/[^\d+]/g,'')}" onclick="copyNumberFallback('${c.phone.replace(/[^\d+]/g,'')}')">📞 Call</a>
        <a class="btn btn-outline" style="padding:6px 10px;font-size:11px;text-decoration:none" href="sms:${c.phone.replace(/[^\d+]/g,'')}?body=${encodeURIComponent('I need help — this is my current location: '+(appState.location?('https://maps.google.com/?q='+appState.location.lat+','+appState.location.lng):'(tap Get Location first)'))}">💬 Text</a>
      </div>`).join('');
  overlay.classList.add('show');
}
function closeSOS() { document.getElementById('sosOverlay').classList.remove('show'); }

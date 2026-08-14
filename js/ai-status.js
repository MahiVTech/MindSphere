// ═══════════════════════════ AI CONNECTIVITY CHECK ═══════════════════════════
window.AI_OK = null;
async function checkAIStatus() {
  const dot = document.getElementById('aiStatusDot');
  const banner = document.getElementById('ai-status-banner');
  try {
    await callClaude('Reply with just the word: ok', 'Reply with exactly one word.', 5);
    window.AI_OK = true;
    if (dot) { dot.style.background = 'var(--green)'; dot.title = 'AI features connected'; }
    if (banner) banner.style.display = 'none';
  } catch (e) {
    window.AI_OK = false;
    if (dot) { dot.style.background = 'var(--red)'; dot.style.animation = 'none'; dot.title = 'AI features unreachable right now'; }
    if (banner) {
      banner.style.display = 'block';
      banner.style.background = 'rgba(242,139,130,.08)';
      banner.style.border = '1px solid rgba(242,139,130,.28)';
      banner.style.color = 'var(--muted)';
      banner.innerHTML = `⚠️ <strong style="color:var(--red)">AI features can't connect right now.</strong> This happens when the app is opened outside Claude.ai (e.g. downloaded and opened directly, or hosted elsewhere) — the AI calls only work while this page is viewed inside a Claude.ai chat. Everything else — Calm Zone games, Journal, Goals, Vent Space, tracking, and Emergency & SOS — works fully either way. <a href="#" onclick="checkAIStatus();return false;" style="color:var(--violet2)">Tap to recheck →</a>`;
    }
  }
}
window.addEventListener('DOMContentLoaded', () => setTimeout(checkAIStatus, 300));
if (document.readyState !== 'loading') setTimeout(checkAIStatus, 300);

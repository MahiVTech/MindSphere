# MindSphere

An AI-powered mental wellness platform for students — fear/stress analysis, an exposure-therapy simulator, mood journaling, goal tracking, an anonymous peer support space, one-tap emergency SOS, and 14 original relaxation mini-games. Built as a dependency-free static site (plain HTML/CSS/JS — no build step, no framework, no external game/audio assets).

See **[docs/PROJECT.md](docs/PROJECT.md)** for the full write-up (problem statement, architecture, module-by-module explanation, AI integration details, known limitations, and future scope) — this is the document to read before a project demo or viva.

## Running it

This is a static site with no build step. Two ways to run it:

**Option A — just open it**
Double-click `index.html`. Everything works *except* the AI-powered features (FearMap, Emotion/Facial Analysis, Simulator, Music, Recommendations, Journal Reflection, Goal Suggestion) — those require Anthropic's API, which needs a real backend to call securely and isn't wired up in this static version. All non-AI features (Calm Zone games, Journal, Goals, Analytics, Vent Space, Emergency & SOS, tracking) work fully offline.

**Option B — local server (recommended for development)**
```bash
cd mindsphere
python3 -m http.server 8080
# then open http://localhost:8080
```
Serving over HTTP (rather than `file://`) avoids some browsers' stricter security rules around local files and geolocation.

## Project Structure

```
mindsphere/
├── index.html                  # All page markup (single page app, JS shows/hides sections)
├── css/
│   └── style.css               # Full design system: colors, layout, components, responsive rules
├── js/
│   ├── core-state.js           # Global app state (scores, goals, contacts, location)
│   ├── core-nav.js             # navigate() — switches between page sections
│   ├── core-visuals.js         # Dashboard emotion-pulse canvas + activity heatmap
│   ├── ai-helper.js            # callClaude() — shared wrapper around the Anthropic API
│   ├── ai-status.js            # Connectivity self-check + honest status banner
│   ├── emergency.js            # SOS modal, family contacts, tel:/sms: links, live location
│   ├── vent-space.js           # Anonymous community feed, reactions, comments, moderation
│   ├── modules/
│   │   ├── fearmap.js          # AI stress/fear/confidence scoring from free text
│   │   ├── situation.js        # Situation assessment module
│   │   ├── emotion.js          # Text-based emotion detection
│   │   ├── facial.js           # Camera capture + AI vision analysis
│   │   ├── simulator.js        # Multi-turn exposure-therapy chat simulator
│   │   ├── music.js            # AI mood playlist + real-time generated audio (Web Audio API)
│   │   ├── recommendations.js  # AI personalized action plan
│   │   ├── journal.js          # Mood journal + AI reflection
│   │   ├── goals.js            # Daily goals/streaks + AI goal suggestion
│   │   └── support.js          # Crisis resources + support chat
│   └── calmzone/
│       ├── switcher.js         # Tab/panel switching logic for all mini-games
│       ├── sfx.js              # Shared generated sound effects (pop, chime, click)
│       ├── bubble-world.js, gravity-sandbox.js, light-painter.js,
│       │   sand-art.js, magnet-toys.js, tiny-ecosystem.js,
│       │   pop-it.js, bubble-wrap.js, fidget-spinner.js,
│       │   stress-ball.js, newtons-cradle.js, zen-rake.js,
│       │   wind-chimes.js, balloon-float.js   # 14 independent game modules
└── docs/
    └── PROJECT.md               # Full project explanation / viva notes
```

## Adding a new Calm Zone game

The architecture was built so this is a short, mechanical checklist:
1. Add a `<div class="cz-panel" id="cz-yourgame">...</div>` block in `index.html` (copy an existing one as a template).
2. Add a matching `<div class="cz-card" onclick="czShow('yourgame')">` tile to the hub grid.
3. Create `js/calmzone/your-game.js` with a `yourgameStart()` function (canvas setup + animation loop) — reuse `playPop()` / `playChimeTone()` / `playClick()` from `sfx.js` for sound.
4. Register it in two places in `js/calmzone/switcher.js`: the `CZ_PANELS` array, and the `if (which === 'yourgame') setTimeout(yourgameStart, 60)` dispatch.
5. Add your file to the `<script src="...">` list in `index.html`, after `sfx.js`.

## Known limitations

- No backend/database — Vent Space and all state resets each browser session.
- AI features require a real backend to call Anthropic's API securely; this static version has no API key wired in, by design (never put real API keys in client-side code).
- Not a replacement for professional mental health care — the app says so explicitly and links to real crisis resources.

Full details in [docs/PROJECT.md](docs/PROJECT.md).

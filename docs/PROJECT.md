# MindSphere — Project Explanation
### A Mental Wellness Platform for Students

---

## 1. What is this project?

**MindSphere** is a web-based mental wellness application built for students, designed to help them understand their emotional and stress patterns, practice facing anxiety-inducing situations safely, and get support — all in one place. It runs entirely in a browser as a single HTML file (with embedded CSS and JavaScript), and uses Anthropic's Claude AI as its "brain" for analysis, reflections, and personalized suggestions.

**One-line pitch:** "An AI-powered companion that helps students recognize what's causing their stress, practice handling it, and get real help — anonymously, safely, and instantly."

---

## 2. Problem Statement

Students today face constant academic pressure, social anxiety, family expectations, and burnout — but:
- They often don't have language for what they're feeling (just "stressed" or "bad").
- They're afraid to talk about it openly (stigma).
- Professional counseling is not always accessible/affordable.
- There's no single tool that combines self-understanding + practice + relaxation + emergency safety.

MindSphere tries to address all four of these gaps in one platform.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | Pure CSS3 (custom design system, CSS variables/custom properties, responsive media queries) |
| Logic | Vanilla JavaScript (no frameworks — deliberately, to keep it a single portable file) |
| AI | Anthropic Claude API (`claude-sonnet-4-6` model) via `fetch()` calls to `api.anthropic.com` |
| Audio | Web Audio API (oscillators, gain nodes, filters) — used to *generate* sound in real time rather than play pre-recorded files |
| Visuals | HTML5 Canvas API — used for all the physics-based mini-games (particles, gravity, bubbles, etc.) |
| Location | Browser Geolocation API + a free reverse-geocoding API (BigDataCloud) to turn coordinates into a readable address |
| Data storage | In-memory JavaScript state (no database) — meaning data lives only for the current browser session |

**Why no framework (React/Vue) or backend?** This is a front-end prototype meant to demonstrate the *concept* end-to-end quickly. A real production version would need a backend (for the Vent Space community, persistent accounts, real chat history) and a database — this is explained in the Limitations section, and is a great "future work" talking point for your mentor.

---

## 4. Overall Architecture

It's a **single-page application (SPA)** — meaning there's only one HTML file. Instead of navigating to different URLs/pages, JavaScript shows/hides different `<div>` "pages" inside the same file:

```
index.html
 ├── Sidebar navigation (always visible)
 ├── Topbar (page title + quick action + AI status indicator)
 └── Content area — only ONE of these is visible at a time:
      ├── Dashboard
      ├── FearMap
      ├── Situation Assessment
      ├── Emotion Detection
      ├── Facial Analysis
      ├── Exposure Simulator
      ├── Emotion Music
      ├── Recommendations
      ├── Mood Journal
      ├── Daily Goals
      ├── My Progress (Analytics)
      ├── Get Support
      ├── Calm Zone (14 mini-games)
      ├── Vent Space (anonymous community)
      └── Emergency & SOS
```

A JavaScript function called `navigate(pageName)` handles switching between these — it hides the current page div and shows the requested one, and updates the sidebar highlight and page title.

---

## 5. Explaining Each Module

### 🏠 Dashboard
The home screen. Shows summary cards (Confidence Score, Stress Level, Fear Score, Journal Entries) that start empty ("No data yet") and populate as you use other modules — this was a deliberate design choice to avoid showing **fake/hardcoded numbers**, which is a common flaw in wellness-app prototypes. It also shows an AI connectivity indicator so the user always knows if the AI layer is reachable.

### 🗺️ FearMap
Student describes a stressful situation in free text (e.g., "placement interview in 2 days"). This is sent to Claude with a prompt asking it to return a **structured JSON** response: a Fear Score, Stress Score, Confidence Score, detected triggers, and a written breakdown. This demonstrates **prompt engineering** — telling the AI exactly what format to reply in so the app can parse and visualize it (as bars/rings), instead of just showing a paragraph.

### 🔍 Situation Assessment
Similar concept — structured input (sliders/dropdowns describing a situation) sent to the AI for a tailored risk/coping assessment.

### 💬 Emotion Detection
A conversational text-based tool: student types how they feel, and the AI identifies the underlying emotion and gives a short, relatable response — like texting a supportive friend rather than a clinical report.

### 📷 Facial Analysis
Uses the device camera (`getUserMedia`) to capture a photo, which is sent to Claude's **multimodal (vision) capability** — this is important to mention to your mentor: the same AI model can accept an image + text together in one request, and interpret facial expression to suggest a coping tip.

### 🎭 Exposure Simulator
Based on a real psychological technique called **exposure therapy** — practicing a feared scenario in a low-stakes simulated conversation (e.g., a mock interview) so the real thing feels less intimidating. This is a multi-turn chat with the AI, meaning the app keeps sending the whole conversation history each time so Claude has context of what was already said.

### 🎵 Emotion Music
Takes the student's stress/energy/focus levels, asks the AI to suggest a mood direction and playlist structure, and then — this is a key technical decision — **generates the actual audio itself in the browser** using the Web Audio API (lo-fi pads, piano loops, ambient noise, binaural tones), instead of using real copyrighted songs. This avoids copyright issues entirely while still giving working, playable audio.

### 💡 Recommendations
AI generates a personalized action plan (study technique, sleep habit, coping strategy) based on everything else the student has entered in the app so far.

### 📓 Mood Journal
A simple journaling tool with an optional "AI Reflection" button — after writing an entry, the AI reads it and responds with a short, empathetic reflection, similar to what a counselor might say back.

### ✅ Daily Goals
Habit-tracking checklist (sleep, breathing exercises, screen time, etc.) with streak counters, plus an "AI Goal Suggestion" feature that proposes a new goal based on the student's patterns.

### 📊 My Progress (Analytics)
Visual dashboard combining all historical data: confidence rings, a stress heatmap (calendar-style), and a trend table — this is where students can literally *see* their patterns over time instead of just individual data points.

### 🆘 Get Support
A directory of real, verified helpline numbers (like iCall, Vandrevala Foundation) plus an AI chat specifically tuned to respond supportively in a crisis-adjacent conversation, with hard-coded crisis resources always visible (never solely AI-generated, for safety).

### 🌿 Calm Zone
14 original, physics-based relaxation mini-games — Bubble World, Gravity Sandbox, Light Painter, Sand Art, Magnetic Toys, Tiny Ecosystem, Pop It, Bubble Wrap, Fidget Spinner, Stress Ball, Newton's Cradle, Zen Rake Garden, Wind Chimes, Balloon Float. All are drawn using the **Canvas API** with real physics (gravity, momentum, collision, friction) and generate their own sound effects live — no downloaded game assets, no copyrighted content, everything built from scratch with math (`sin`/`cos`, velocity, acceleration).

### 💭 Vent Space
An anonymous community feed — every user gets an auto-generated anonymous name (e.g., "Moon_Wolf42"), can post under categories (Stress, Anxiety, Relationships, Career, Studies, Family), react with emojis, comment, and report posts. It includes basic **content moderation**: posts reported 3+ times get auto-hidden pending review, sensitive posts get a content warning, and if a post's wording suggests real crisis language, a support-resource card appears automatically. Important honesty point for your mentor: since there's no backend/database, this is a **local, single-session prototype** — it demonstrates the UX and moderation logic, but a real deployment would need a server to let users see each other's posts.

### 🚨 Emergency & SOS
A floating SOS button available on every screen. One tap opens a modal with: a call button for the local emergency number, one-tap call/text for saved family/trusted contacts, and a live GPS location fetch (only when the user taps — never automatic, for privacy). Calls are triggered using real `<a href="tel:...">` links (not JavaScript-forced navigation), because sandboxed browser environments often block script-triggered calls — this was an actual bug I found and fixed during testing.

---

## 6. How the AI Integration Works (important for viva questions)

1. The app sends a `fetch()` POST request to Anthropic's `/v1/messages` API endpoint.
2. Each request includes a **system prompt** (instructions on tone/role, e.g., "sound like a caring friend, not a clinical report") and a **user prompt** (the actual data/question).
3. For structured features (FearMap, Music), the prompt explicitly asks Claude to **reply only in JSON** with a defined schema, which the JavaScript then parses with `JSON.parse()` and uses to update the UI (bars, rings, cards).
4. For multimodal input (Facial Analysis), the image is converted to Base64 and sent alongside the text prompt in the same request.
5. For conversational features (Simulator), the app keeps an array of `{role, content}` messages and re-sends the growing conversation each time, since the API itself is stateless — it doesn't remember past messages unless you send them again.

**Important limitation to mention to your mentor:** this AI connection only works while the file is running inside Anthropic's Claude.ai platform (which securely handles the API key on the backend). If you download this file and open it independently, or host it elsewhere, the AI calls will fail — because there's no API key embedded in the front-end code (for security reasons, you should never put a real API key in client-side JavaScript, since anyone could view-source and steal it). A production version would need its own backend server to hold the API key safely and proxy these requests.

---

## 7. Design Decisions Worth Mentioning

- **Color psychology:** Uses soft pastel blue, muted green, lavender, and soft pink — all backed by color-therapy research to lower cortisol/anxiety, deliberately avoiding harsh, saturated colors typical of "productivity" apps.
- **No hardcoded/fake data:** Every score/statistic is either real user input, real AI output, or explicitly empty until earned — a common mistake in student wellness-app prototypes is showing fake charts that don't mean anything.
- **Honesty over illusion:** When AI can't be reached, or Vent Space posts are just examples, the app says so directly instead of pretending to work — this is an intentional UX/ethics decision, especially important for a *mental health* app where trust matters.
- **Privacy-first location & emergency features:** Location is fetched only on explicit tap, never silently in the background.
- **Original assets only:** No copyrighted music, game assets, or characters — everything (audio, mini-games, artwork) is generated in code.

---

## 8. Real Technical Challenges Faced (great to mention — shows depth)

1. **CORS/security limitation:** AI features fail outside the Claude.ai environment — explained above.
2. **A genuine layout bug:** On mobile screens, opening the Analytics page pushed the *entire app* sideways by ~30px. Root cause: in CSS Flexbox, a child element doesn't automatically shrink below its own content's "natural" width unless you explicitly tell it to (`min-width: 0`). A wide data table deep inside the page was quietly forcing every parent container wider than the phone screen. Fixed by adding `min-width: 0` to the layout chain.
3. **Phone calls not working:** Triggering `tel:` calls via JavaScript (`window.location.href`) is often blocked in sandboxed/embedded browser contexts. Fixed by using real `<a href="tel:...">` anchor tags instead, which browsers treat as a trusted user action.
4. **Copyright-safe music & games:** Instead of licensed songs or game assets, built a real-time audio synthesizer (oscillators + filters) and canvas-based physics games from scratch.

---

## 9. Limitations (be upfront about these — mentors respect honesty)

- No backend/database → no persistent accounts, no real multi-user community, data resets each session.
- AI only works inside Claude.ai's environment, not standalone.
- Facial analysis and location are prototype-level (no ongoing sensor tracking, only single-shot capture).
- Not a replacement for professional mental health care — it explicitly says so and links to real helplines.

## 10. Future Scope (good closing point)

- Add a real backend (Node.js/Firebase) for accounts, persistent history, and a genuine shared Vent Space community.
- Secure API key handling via a backend proxy so AI features work outside Claude.ai too.
- Push notifications for goal reminders and mood check-ins.
- Native mobile app (iOS/Android) using this as the design/UX foundation.
- More mini-games, building toward the original goal of 80–100 relaxation activities.

---

### Quick one-paragraph summary if your mentor wants the short version:

*"MindSphere is a browser-based mental wellness app for students that combines AI-driven emotional analysis (FearMap, emotion & facial detection, exposure therapy simulation) with practical tools (mood journaling, goal tracking, relaxation mini-games, anonymous peer support, and one-tap emergency SOS). It's built with plain HTML/CSS/JavaScript and Canvas/Web Audio APIs — no frameworks, no external assets — and uses Anthropic's Claude AI for all the intelligent, personalized parts. It's a working front-end prototype; a production version would need a backend server for persistence and to run the AI features outside Claude.ai."*

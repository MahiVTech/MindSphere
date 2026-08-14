# 🧠 MindSphere

### *A digital safe space for students — built to understand stress, encourage reflection, and help you find your calm.*

MindSphere is an AI-powered mental wellness platform designed specifically around the everyday pressure students face — **academic stress, fear, anxiety, emotional overload, isolation, and burnout.**

Instead of being just another mood tracker, MindSphere brings multiple wellness tools together in one interactive experience:

> **Understand your emotions → face your fears → reflect → take action → calm down.**

🌱 **No framework. No build step. No bloated dependencies. Just HTML, CSS & JavaScript.**

---

## ✨ What makes MindSphere different?

MindSphere isn't built around a single feature.

It's designed as a **student mental-wellness ecosystem**.

| 🧩 Module                 | 💡 What it does                                                  |
| ------------------------- | ---------------------------------------------------------------- |
| 🧠 **FearMap**            | Analyses written thoughts for stress, fear & confidence patterns |
| 🎭 **Emotion Analysis**   | Detects emotional tone from text                                 |
| 📷 **Facial Analysis**    | Uses camera input for AI-assisted emotional analysis             |
| 🎯 **Exposure Simulator** | Interactive scenario-based exposure practice                     |
| 📔 **Mood Journal**       | Record your emotions and reflect on your day                     |
| 🤖 **AI Reflection**      | Generates personalized reflections from journal entries          |
| 🎵 **Mood Music**         | Creates mood-based audio experiences                             |
| 🌱 **Recommendations**    | Suggests personalized calming actions                            |
| 🎯 **Goal Tracker**       | Daily goals, streaks & progress                                  |
| 💬 **Vent Space**         | Anonymous peer-support style community                           |
| 🆘 **Emergency SOS**      | One-tap access to emergency contacts & location                  |
| 🧘 **Calm Zone**          | 14 interactive relaxation mini-games                             |

---

# 🌌 The Calm Zone

Sometimes the solution isn't another paragraph of advice.

Sometimes you just need to **do something calming.**

MindSphere includes **14 original browser-based mini-games**, created without external game or audio assets.

### 🎮 Included experiences

* 🫧 Bubble World
* 🪐 Gravity Sandbox
* 💡 Light Painter
* 🏖️ Sand Art
* 🧲 Magnet Toys
* 🌱 Tiny Ecosystem
* 🟣 Pop It
* 🫧 Bubble Wrap
* 🌀 Fidget Spinner
* 🏀 Stress Ball
* ⚙️ Newton's Cradle
* 🪷 Zen Rake
* 🎐 Wind Chimes
* 🎈 Balloon Float

Everything runs directly in the browser using **Canvas, JavaScript and Web Audio API**.

---

# 🤖 AI Architecture

MindSphere separates the **frontend experience** from AI functionality.

The static frontend contains a shared AI abstraction:

```text
User Input
    ↓
MindSphere Module
    ↓
AI Helper
    ↓
Secure Backend
    ↓
Anthropic API
    ↓
AI Response
    ↓
MindSphere UI
```

The current repository intentionally **does not contain an API key**.

That's important.

> 🔐 **Never expose a production API key inside client-side JavaScript.**

The AI integration is therefore structured so a backend can be added later without rebuilding the entire frontend.

---

# 🏗️ Architecture

MindSphere is intentionally dependency-free.

```text
MindSphere
│
├── 🎨 UI Layer
│   ├── index.html
│   └── css/
│       └── style.css
│
├── ⚙️ Core Layer
│   ├── core-state.js
│   ├── core-nav.js
│   └── core-visuals.js
│
├── 🤖 AI Layer
│   ├── ai-helper.js
│   └── ai-status.js
│
├── 🧠 Wellness Modules
│   └── modules/
│       ├── fearmap.js
│       ├── situation.js
│       ├── emotion.js
│       ├── facial.js
│       ├── simulator.js
│       ├── music.js
│       ├── recommendations.js
│       ├── journal.js
│       ├── goals.js
│       └── support.js
│
├── 🧘 Calm Zone
│   └── calmzone/
│       ├── switcher.js
│       ├── sfx.js
│       └── 14 mini-game modules
│
└── 📚 Documentation
    └── docs/
        └── PROJECT.md
```

---

# 🚀 Run MindSphere

MindSphere requires **no npm install, no framework and no build command.**

### Option 1 — Open directly

Simply open:

```text
index.html
```

Most non-AI features will work immediately.

### Option 2 — Run a local server

Recommended for development:

```bash
cd mindsphere
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

---

# 🧩 What's working right now?

### ✅ Fully functional offline

* Dashboard
* Mood tracking
* Journal
* Goals
* Streak tracking
* Analytics
* Calm Zone
* 14 mini-games
* Generated sound effects
* Vent Space interface
* Emergency/SOS interface
* Family contacts
* Location support
* Responsive UI

### 🔌 Backend required

These features are architected for AI integration but require a secure backend:

* FearMap
* Emotion Analysis
* Facial Analysis
* Exposure Simulator
* AI Music
* Recommendations
* Journal Reflection
* AI Goal Suggestions

---

# 🔐 Privacy & Safety

MindSphere deals with something much more important than ordinary app data: **people's emotions.**

The project therefore follows a few principles:

### 🔒 No API keys in the frontend

AI credentials should live on a secure backend.

### 📴 Offline-first functionality

Many wellness tools don't require an internet connection.

### 🆘 Emergency access

The platform includes an SOS interface for quickly contacting trusted people and accessing emergency functionality.

### ⚠️ Not medical treatment

MindSphere is an educational/student wellness project.

It **does not replace a psychologist, psychiatrist, counselor, doctor, or emergency service.**

---

# 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Canvas API
* Web Audio API
* Browser Geolocation API

### AI

* Anthropic API *(backend integration planned)*

### Architecture

* Dependency-free
* Modular JavaScript
* Single-page interface
* No framework
* No build system
* No external game assets

---

# 🧪 Adding a New Calm Zone Game

The Calm Zone was designed to be **extensible**.

Adding a new game follows a simple pattern:

```text
Create Panel
    ↓
Create Hub Card
    ↓
Create Game Module
    ↓
Register Module
    ↓
Add Script
    ↓
Done 🎮
```

A new game only needs:

```javascript
function yourgameStart() {
    // canvas setup
    // interaction
    // animation
}
```

Existing sound utilities can be reused:

```javascript
playPop();
playChimeTone();
playClick();
```

This makes the Calm Zone easy to expand without modifying the entire application.

---

# 📁 Project Documentation

Want to understand the project beyond the UI?

Read:

**[`docs/PROJECT.md`](docs/PROJECT.md)**

It contains:

* Problem statement
* Project motivation
* Architecture
* Module-by-module explanation
* AI integration strategy
* Technical decisions
* Known limitations
* Future scope
* Demo & viva preparation notes

---

# 🔮 Future Scope

MindSphere is intentionally designed so the current static prototype can evolve into a full platform.

### Phase 1 — Backend

* Secure AI API integration
* Authentication
* Persistent database
* User profiles
* Cloud storage

### Phase 2 — Intelligent Wellness

* Long-term mood trends
* Personalized wellness plans
* AI-powered journaling
* Adaptive recommendations
* Smarter emotional pattern detection

### Phase 3 — Student Community

* Moderated peer support
* Anonymous discussion rooms
* Campus-specific communities
* Counselor integration

### Phase 4 — Responsible AI

* Better emotion-model evaluation
* Bias testing
* Explainable recommendations
* Stronger privacy controls
* Human-in-the-loop crisis escalation

---

# ⚠️ Known Limitations

This version is a **frontend-first prototype**.

Because there is currently no backend:

* Data is not permanently stored.
* Vent Space resets between sessions.
* AI calls are not connected to a production backend.
* AI features requiring Anthropic API access remain unavailable.
* Facial emotion analysis should be treated as experimental rather than clinically reliable.

---

# 🎓 Why We Built It

Students are constantly told:

> *"Don't stress."*

That's not particularly useful advice.

MindSphere explores a different idea:

**What if a digital platform could help students recognize what they're feeling, reflect on it, take small actions, and have somewhere to start when things feel overwhelming?**

That's the idea behind MindSphere.

Not a replacement for real human support.

Not a diagnosis machine.

Just a **student-first digital wellness space** designed to make taking care of your mind a little easier.

---

# 👩‍💻 Project

**MindSphere — AI-Powered Student Mental Wellness Platform**

Built with ❤️ using **HTML • CSS • JavaScript**

> *Understand. Reflect. Breathe. Move Forward.*

---

## ⭐ If you found the project interesting

Give the repository a ⭐ and explore the code.

And if you're a student developer:

**Build something that solves a real problem — not just something that looks good in a screenshot.**

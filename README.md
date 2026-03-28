# LinkedOut

> The professional parody app. Sound like a thought leader. Look like a CEO. Get certified for doing dishes.

## Features

| Feature | What it does |
|---|---|
| 🎙️ **Jargon-ifier** | Speak plain English → get LinkedIn corporate gibberish back. Real-time mic transcription + Claude API rewrite. Dashboard with buzzword count, synergy score, and jargon level meter. |
| 📸 **Headshot Generator** | Upload any photo, apply professional CSS filters, add an "AI Enhanced ✓" badge. Four filter presets: Executive, Thought Leader, Disruptor, Founder Mode. |
| 🏆 **Useless Certifications** | Describe a mundane task → receive a prestigious certification card styled like LinkedIn's UI. Share it to your profile (clipboard). |

## Setup

**1. Clone & install**
```bash
git clone <repo>
cd linkedout
npm install
```

**2. Configure API key**
```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

Get an API key at [console.anthropic.com](https://console.anthropic.com).

**3. Run**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Tech Stack

- **React + Vite** — fast dev experience
- **Tailwind CSS v4** — utility-first styling
- **Web Speech API** — browser-native mic transcription (Chrome recommended)
- **Claude API** (`claude-sonnet-4-20250514`) — jargon generation + cert creation

## Notes

- The Web Speech API requires Chrome or Edge. Firefox does not support it.
- API calls go directly from the browser to `api.anthropic.com`. The key lives in `.env` and is never committed.
- The headshot generator uses CSS `filter` only — no server-side processing, no uploads.
- Certifications include a "Share to LinkedIn™" button that copies text to clipboard.

## Project Structure

```
src/
  components/
    Jargonifier.jsx       # Mic input, Claude API, side-by-side display
    HeadshotGenerator.jsx # Photo upload, CSS filters, before/after
    Certifications.jsx    # Task input, cert card generator
    Dashboard.jsx         # Analytics panel (buzzwords, synergy score)
    Nav.jsx               # Tab navigation
  App.jsx
  main.jsx
.env.example
```

---

*LinkedOut™ is not affiliated with LinkedIn Corporation. All synergies are fictional.*

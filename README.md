# 🌟 Aura AI — Your Personal AI Friend, Companion & Guide

> An emotionally aware, memory-equipped, singing & voice-enabled personal AI companion inspired by ChatGPT, crafted to listen, support, guide, and learn about you over time.

---

## 📸 Overview

**Aura AI** is a modern, full-stack, production-ready AI companion web application. Unlike standard question-answering bots that feel sterile and robotic, Aura is designed from the ground up to feel like a close, empathetic friend and mentor.

Aura can:
- 💬 **Have warm, casual, heartfelt conversations** about your day, feelings, and life.
- 🧠 **Remember what matters to you** (interests, goals, personal facts, preferences) via a structured long-term memory engine.
- 🎭 **Detect your emotional tone in real-time** (sad, stressed, lonely, excited, anxious) and adapt its warmth, tone, and guidance accordingly.
- 🎵 **"Sing for Me" / Mood Music Mode**: Compose original lyrics and synthesize procedural chord progressions, lofi beats, and singing vocals using the Web Audio API and Speech Synthesis.
- 🎙️ **Full Voice Conversation**: Seamless Speech-to-Text (live transcript) and natural Text-to-Speech, plus a dedicated **Fullscreen Voice Call Companion Room** with an audio-reactive pulsing 3D glowing orb.
- 📚 **Switch Adaptable Personas**: Friend Mode, Study Mode, Coding Partner, Career Mentor, Creative Spark, and Executive Briefing.
- 💻 **ChatGPT-Grade Polish**: Sidebar history (Today, Yesterday, 7 Days, Older), instant search, conversation pinning, renaming, export (Markdown / JSON), code syntax highlighting with copy buttons, dark & light themes, and image attachment preview.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) with Glassmorphism, Luxury Dark & Light Themes |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), Google Fonts (Inter & Outfit) |
| **Code Highlighting** | [PrismJS](https://prismjs.com/) with multi-language syntax highlighting & copy buttons |
| **Markdown Parsing** | [ReactMarkdown](https://github.com/remarkjs/react-markdown) + [Remark GFM](https://github.com/remarkjs/remark-gfm) (tables, checklists, blockquotes) |
| **Audio & Music Synthesis** | Native **Web Audio API** (Oscillators, Analysers, Chord Progressions) + **Web Speech API** (STT & TTS) |
| **Server / API Layer** | Next.js Server Route Handlers with Server-Sent Events (SSE) Streaming |
| **AI Model Engine** | Official **Google Gemini API** (`@google/generative-ai`) + Built-in **Intelligent Persona Engine** (Instant Offline/Demo Fallback) |
| **Storage Engine** | Zero-config atomic JSON/SQLite persistent local database |

---

## 🌟 Key Features Breakdown

### 1. 🧠 Structured Personal Memory Engine
- **Categorized Memories**: `Personal Fact`, `Preference`, `Goal`, `Interest`, `Relationship`, `Habit`.
- **Importance Ratings**: 1 to 5 stars.
- **Automatic Extraction**: Heuristics & LLM parse chat inputs (e.g. *"My name is Varun"*, *"I love TypeScript"*, *"Preparing for GATE"*) and automatically register memories.
- **Full Memory Hub UI**: Modal to view, filter, add custom memories, edit importance, and delete or clear memory history.
- **Context Injection**: Top relevant memories are dynamically inserted into prompt instructions.

### 2. 💖 Mood Detection & Emotional Support
- Detects user sentiment: **Happy**, **Excited**, **Sad**, **Stressed**, **Lonely**, **Angry**, **Confused**, **Anxious**, **Neutral**.
- Dynamic Mood Aura Pill in message headers.
- Compassionate, non-clinical supportive responses without toxic positivity or sterile disclaimers.
- Gentle crisis support cards (with 988 and AASRA helpline contacts) when severe distress is detected.

### 3. 🎵 "Sing for Me" / Mood Music Mode
- Generates mood-tailored original poetic lyrics (in English, Hindi/Hinglish, or custom).
- **Embedded Web Audio Synthesizer**: Procedural chords (Cmaj7, Am7, Dm7, G7, Fmaj7) with arpeggio synth pads and canvas waveform equalizer.
- **Singing Vocal Delivery**: Synchronized rhythmic singing vocalization via Web Speech Synthesis.

### 4. 🎙️ Voice Interaction & Voice Call Room
- **In-Chat Microphone**: Continuous Speech-to-Text with live interim transcript pill.
- **Text-to-Speech**: Natural read-aloud buttons on every response.
- **Fullscreen Voice Call Mode**: Ambient voice companion room with real-time audio-reactive glowing orb visualizer, hands-free conversational loop, and mute controls.

### 5. 🤖 Dual-Mode AI Architecture
- **Google Gemini Cloud AI**: When `GEMINI_API_KEY` is provided in `.env.local`, Aura connects directly to Google's Gemini models with full streaming.
- **Intelligent Persona Fallback Engine**: Works out-of-the-box even without an API key for instantaneous testing, demoing, and offline runs!

---

## 📁 Project Structure

```
ai-friend-chatbot/
├── .env.example                # Sample environment variables
├── .gitignore                  # Git ignore configuration
├── README.md                   # Project documentation
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind styling & animations
├── postcss.config.mjs          # PostCSS configuration
├── next.config.ts              # Next.js configuration
├── index.html                  # Main HTML entry point & SEO metadata template
├── public/                     # Static assets & public entry points
│   └── index.html              # Static HTML entry point for deployment
└── src/
    ├── app/
    │   ├── layout.tsx          # Root layout & Google Fonts
    │   ├── page.tsx            # Main application page
    │   ├── globals.css         # Styling, glassmorphism & Prism themes
    │   └── api/
    │       ├── chat/route.ts   # Streaming SSE chat endpoint
    │       ├── conversations/  # Conversation CRUD endpoints
    │       ├── memories/       # Personal memory CRUD endpoints
    │       └── music/compose/  # Procedural song composition endpoint
    ├── components/
    │   ├── common/             # ThemeToggle, Toast, Modals
    │   ├── sidebar/            # Sidebar, ConversationItem, SearchBar
    │   ├── chat/               # ChatContainer, MessageList, MessageBubble, ChatInput, CodeBlock, SuggestedPrompts, PersonaSelector, MoodIndicator
    │   ├── memory/             # MemoryModal (Personal Memory Hub)
    │   ├── music/              # MusicPlayerCard, WaveformVisualizer
    │   └── voice/              # VoiceCallModal, AudioOrbVisualizer
    ├── lib/
    │   ├── ai/                 # Gemini connector, System Prompts, Mood Detector, Fallback Persona Engine
    │   ├── db/                 # Persistent storage engine & seed data
    │   ├── audio/              # Web Audio Synthesizer & Speech Recognition/TTS
    │   └── utils.ts            # Helper utilities & metadata maps
    └── types/
        └── index.ts            # Core TypeScript data interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/varunnshhh-ux/ai-friend-chatbot.git
   cd ai-friend-chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
   *(Note: If no API key is provided, Aura will automatically run in its Intelligent Companion Fallback mode so all features remain functional!)*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Production Build

To create an optimized production bundle:

```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy

- **API Keys Kept Server-Side**: `GEMINI_API_KEY` is strictly accessed in Next.js Server Route Handlers and never exposed to client-side code.
- **Local Data Storage**: Conversations and personal memories are stored locally in `.data/storage.json`, protected by `.gitignore`.
- **Safety Guardrails**: Non-clinical emotional support with gentle crisis helpline disclosures when distress is detected.

---

## 🔮 Future Roadmap

- [ ] Multi-user authentication (NextAuth / Supabase)
- [ ] Cloud vector database integration (Pinecone / ChromaDB) for semantic memory search
- [ ] Multimodal audio streaming via Gemini Live WebSockets API
- [ ] Custom user voice cloning for personalized singing vocalists

---

## 📄 License

MIT License. Crafted with ❤️ by [Varun Sharma](https://github.com/varunnshhh-ux).

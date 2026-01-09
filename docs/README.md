# Synapse - Collaborative Learning Platform
> *Living Code. Neural Biomimicry. Intelligent Collaboration.*

Synapse is a next-generation collaborative learning environment built on the **"Big 5" Architectural Pillars**. It combines real-time collaboration, AI-augmented knowledge management (RAG), and a gamified skill progression system wrapped in a unique **"Neural Biomimicry"** aesthetic.

![Neural Terminal](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzQ1NjY3ODkw/giphy.gif)

## 🚀 Key Features

### 1. Neural Biomimicry UI
- **Living Code Aesthetic:** The interface feels alive with pulsing nodes, typing text effects, and data-grid layouts.
- **Glassmorphic HUDs:** "Control Pod" headers and translucent panels mimicking futuristic heads-up displays.
- **Micro-Interactions:** Sci-fi corner accents on cards, breathing gradients, and fluid motion transitions.

### 2. AI-Augmented Brain (RAG)
- **Bring Your Own Key (BYOK):** Securely use your own OpenRouter/OpenAI keys via Edge Functions.
- **Document Intelligence:** Upload PDF/MD/TXT files; Synapse parses, chunks, and embeds them for semantic search.
- **Contextual Chat:** Ask questions about your uploaded documents with source citations.

### 3. Gamification Engine
- **Skill Tree:** Visualize learning progress as a growing neural network.
- **XP & Leveling:** Earn experience points for interacting with the AI, uploading documents, and completing quizzes.
- **Daily Drills:** Quick-fire quizzes to reinforce knowledge.

### 4. Real-Time Collaboration
- **Live Presence:** See who is online in your workspace.
- **Shared Notes:** Collaborative text editing with seamless syncing.

---

## 🏗 Architecture: The "Big 5"

This project strictly adheres to five core pillars to ensure scalability and maintainability:

1.  **Database Schema (The Blueprint):**
    - Supabase (PostgreSQL) as the single source of truth.
    - Strict relations for Users, Rooms, Documents, and Embeddings.

2.  **Type Safety (The Inspector):**
    - End-to-end TypeScript coverage.
    - Database types generated directly from the schema.
    - No `any` types allowed.

3.  **State Management (The Traffic Control):**
    - **Zustand** for global client state (Auth, UI, LLM settings).
    - **React Query** for server state (caching, invalidation).
    - **Context API** reserved for strictly local compound components.

4.  **Security (The Bouncer):**
    - **Row Level Security (RLS):** Database policies ensure users only access their own data.
    - **Edge Functions:** Secure proxy for AI API keys; keys never exposed to the client.

5.  **Environment Config (The Keys):**
    - Strict validation of `.env` variables.
    - Secrets management via Supabase vault.

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS (Custom "Neural" Palette), Framer Motion
- **Backend / DB:** Supabase (Auth, Database, Storage, Edge Functions, Vector)
- **AI / LLM:** OpenRouter API (Access to GPT-4, Claude 3.5, Llama 3)
- **State:** Zustand, key-value storage (local)

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account
- OpenRouter API Key (optional, for AI features)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/synapse.git
    cd synapse
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 📂 Project Structure

```
src/
├── app/                # Application Routes (Layouts, Pages)
├── components/         # Reusable UI Components
│   ├── ui/             # Core primitives (Buttons, Cards, Loaders)
│   └── navigation/     # Sidebar, Headers
├── features/           # Feature-based modules
│   ├── auth/           # Login, Session management
│   ├── brain/          # Chat, RAG, AI logic
│   ├── documents/      # Upload, Parsing
│   └── gamification/   # Skills, XP, Quizzes
├── hooks/              # Custom React Hooks
├── lib/                # Utilities (Supabase client, API wrappers)
├── stores/             # Zustand State Stores
└── styles/             # Global CSS & Tailwind config
```

---

*Built with precision.*

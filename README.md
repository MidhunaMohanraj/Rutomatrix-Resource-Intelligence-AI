# Resource Intelligence AI

> AI-powered resource allocation system — eliminate manual resume hunting with LLM-ranked candidate matching.

---

## Architecture

```
resource-intelligence-ai/
├── frontend/                    # React SPA (the App.jsx artifact)
│   └── src/App.jsx             # Full frontend — dashboard, finder, pipeline, analytics, settings
│
└── backend/
    ├── server.js               # Express entry point
    ├── package.json
    ├── .env.example            # Copy to .env and fill in
    ├── db/
    │   └── schema.sql          # PostgreSQL schema + seed data
    ├── routes/
    │   ├── candidates.js       # CRUD for candidate profiles
    │   ├── searchRequests.js   # Create/read search requests
    │   ├── matching.js         # Run AI matching engine
    │   ├── shortlist.js        # Shortlist & pipeline stage management
    │   └── analytics.js        # Aggregated analytics data
    └── services/
        ├── llmService.js       # 🔌 Swappable LLM layer (Claude/OpenAI/Ollama/LMStudio)
        └── matchingEngine.js   # Core scoring + ranking logic
```

---

## Quick Start

### 1. Run the Frontend (Artifact)
Open `App.jsx` as a React artifact in Claude — it works standalone with mock data and calls the Anthropic API directly for AI matching.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DB credentials and LLM API key

# Create PostgreSQL database
npm run db:create

# Apply schema and seed data
npm run db:setup

# Start development server
npm run dev
```

---

## LLM Configuration

The `llmService.js` is fully isolated. Switch providers by changing `LLM_PROVIDER` in `.env`:

| Provider | Value | Notes |
|----------|-------|-------|
| Anthropic Claude | `anthropic` | Cloud, best quality |
| OpenAI GPT-4o | `openai` | Cloud, alternative |
| **Ollama (local Mac)** | `ollama` | Free, runs on MacBook |
| LM Studio (local Mac) | `lmstudio` | GUI for local models |

### Local Mac Setup (Ollama — Recommended Free Option)
```bash
brew install ollama
ollama pull llama3.2       
# or
ollama pull mistral         # 7B, better quality
ollama serve                # Starts at localhost:11434
```
Then set `LLM_PROVIDER=ollama` in `.env`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates` | List all candidates |
| POST | `/api/candidates` | Add new candidate |
| GET | `/api/candidates/:id` | Get candidate + skills |
| PATCH | `/api/candidates/:id` | Update candidate |
| POST | `/api/search-requests` | Create search request |
| GET | `/api/search-requests` | List search history |
| **POST** | **`/api/matching/run`** | **Run AI matching** |
| GET | `/api/matching/results/:id` | Get stored results |
| POST | `/api/shortlist` | Shortlist a candidate |
| PATCH | `/api/shortlist/:id/stage` | Move pipeline stage |
| DELETE | `/api/shortlist/:id` | Remove from shortlist |
| GET | `/api/analytics/overview` | Dashboard analytics |

### Example: Run AI Matching
```json
POST /api/matching/run
{
  "searchRequestId": 1,
  "jobDescription": "Senior React developer with TypeScript, Node.js, 5+ years..."
}
```

---

## Matching Score Formula

```
Final Score = (SkillMatch × 40%) + (Experience × 25%) + (Availability × 20%) + (Allocation × 15%)
```

Weights are configurable via environment variables or the Settings page (Phase 2).

---

## Roadmap

- [ ] LinkedIn API integration for external candidate sourcing
- [ ] Email notifications when candidates are allocated  
- [ ] Export shortlist to PDF/Excel
- [ ] Multi-tenant support (multiple resource managers)
- [ ] Slack bot integration for quick searches
- [ ] Resume PDF parsing

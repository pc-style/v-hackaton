# Research Assistant A.I.

Multi-agent research assistant on Next.js (App Router). Orchestrator + subagents (searcher, summarizer, fact-checker) run in parallel and synthesize a final answer with sources. All AI calls go through Vercel AI Gateway.

## Quickstart

1. Install deps
```bash
npm install
```

2. Copy env and configure
```bash
cp .env.example .env.local
# set AI_GATEWAY_URL, AI_GATEWAY_API_KEY, optional TAVILY_API_KEY
```

3. Dev server
```bash
npm run dev
```

4. Open http://localhost:3000 and ask a question.

## Deployment

- Deploy to Vercel, add env vars in Project Settings.
- Ensure all model calls route via AI Gateway.

## Notes

- If no gateway keys are set, the app returns stubbed responses for local UI testing.
- Optional web search is via Tavily. Leave `TAVILY_API_KEY` empty to disable.
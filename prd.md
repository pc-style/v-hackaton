# JudgeGPT: Hackathon PRD

## 📌 Project Overview
## 🔍 Problem Statement
Hackathon projects are judged inconsistently and with bias; we want a satirical yet technically solid demo that showcases Vercel AI Gateway–first patterns, observability, and multi-agent automation to evaluate submissions. The goal is to demonstrate AI Gateway policy, routing, and analytics while keeping the experience entertaining and demoable.

### In Scope
- Multi-agent judging flow with deterministic prompts and model routing via Vercel AI Gateway.
- Frontend leaderboard and commentary stream.
- Magnitude-based web eval tests that hit a deployed demo.
- Gateway analytics usage (keys, routes, rate limits, latency/error monitoring).

### Out of Scope
- Persisted user accounts and auth.
- Production-grade moderation and PII handling.
- Non-Gateway provider integrations or direct calls.


JudgeGPT is a satirical, multi-agent hackathon judging system designed for the [Vercel AI Gateway Hackathon](https://vercel.com/i/ai-gateway-hackathon). The project parodies evaluation bias by simulating a panel of eccentric AI judges who "score" hackathon submissions with heavily biased logic. While humorous, JudgeGPT demonstrates:

* Multi-agent orchestration
* Web automation with AI-native frameworks
* Real-time UI leaderboard with commentary

---

## 🎯 Hackathon Context

* **Hackathon Link**: [Vercel AI Gateway Hackathon](https://vercel.com/i/ai-gateway-hackathon)
* **Rules/Requirements**:

  * Must use Vercel AI Gateway for all AI requests.
  * Public repo with code + deployed demo.
  * Demo must run during judging (stability is key).
  * Evaluation: Technical innovation, creativity, presentation.

---
## 👥 Stakeholders and Ownership
- DRI: pc-style
- Engineering: @pc-style, contributors
- Reviewer(s): project collaborators
- Approver: pc-style
- Infra/Secrets: DRI owns Gateway keys and environment configuration


## 🛠 Tech Stack

* **Agents & Automation**: Magnitude for browser-driven agent tests with vision.
* **LLMs**: Claude 3.5 Sonnet for planning, GPT-4o for commentary, GPT-4.1 for backup **(all via Vercel AI Gateway; no direct provider calls)**.
* **Frontend**: Next.js (Vercel deploy) + Tailwind for sleek UI.
* **Leaderboard & Commentary**: Realtime scoring dashboard inspired by Steel.dev Leaderboard.

## 🔒 AI Integration Policy

- Vercel AI Gateway is the exclusive provider for all AI requests across all environments.
- No direct calls to OpenAI, Anthropic, Google Gemini, or any other LLM API are allowed. All requests must route through the Gateway.
- Model selection (e.g., Claude 3.5 Sonnet, GPT-4o) is expressed via model strings in code; routing, policies, failover, and observability are handled by the Gateway.
- All client configurations must use the Gateway base URL and API key via environment variables.

---
## 🚫 Non-Goals
- No direct use of third-party LLM endpoints or SDK defaults without Gateway baseURL.
- No custom model hosting; model selection is configured via Gateway.
- No backend persistence beyond what’s needed for a demo.


## ⚙️ Initialization & Setup

### 1. Vercel AI Gateway

- Create a Gateway in the Vercel dashboard → obtain Gateway URL + API key.
- Environment variables:
  - AI_GATEWAY_API_KEY
  - AI_GATEWAY_BASE_URL (e.g. https://gateway.ai.vercel.com/api/v1/&lt;team&gt;/&lt;gateway&gt;/openai)

Example usage (OpenAI-compatible client):
```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL
});

const response = await client.chat.completions.create({
  model: "gpt-4o-latest",
  messages: [{ role: "user", content: "Judge this project harshly." }],
});
```
Example usage (Vercel AI SDK via Gateway):
```ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const gatewayOpenAI = openai({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});

const result = await generateText({
  model: gatewayOpenAI("gpt-4o-mini"),
  prompt: "Provide a brutally honest critique of this hackathon project.",
});

console.log(result.text);
```


## 🧭 Milestones and Deliverables
- M1: Gateway configured (routes, models, rate limits), env wired (AI_GATEWAY_API_KEY, AI_GATEWAY_BASE_URL), sample clients working.
- M2: Judge personas and scoring rubric finalized; deterministic prompts stored in repo.
- M3: Leaderboard UI and commentary stream hooked to Gateway-backed calls.
- M4: Magnitude tests running against deployed demo; screenshots/artifacts generated.
- M5: Observability pass: Gateway analytics reviewed (latency, error codes, usage), add notes to README/PRD.

Exit criteria: Acceptance criteria below are met, and demo runs reliably end-to-end.



### 2. Magnitude Setup

* Install CLI:

```bash
npm install -g @magnitude/run
```

* Init config:

```bash
npx magnitude init
```

* Example test agent:
## ⚠️ Risks and Mitigations
- Gateway misconfiguration breaks demo.
  - Mitigation: Keep a tested default route and a backup model; document env in .env.example (without secrets).
- Rate limiting during live demo.
  - Mitigation: Pre-cache intro content where possible; lower token usage; keep short prompts.
- Model drift affecting tone.
  - Mitigation: Add strong system prompts; test with Magnitude before presenting.
- Secret leakage risk.
  - Mitigation: Only use AI_GATEWAY_API_KEY; never commit secrets; rotate after demo.


```ts
import { test } from "magnitude";
import { chromium } from "playwright";

test("Dr Sarah judges project", async ({ expect }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://submission.url");
  await page.screenshot({ path: "sarah-view.png" });
  const critique = await expect.ai().prompt("Critique this page as Dr. Sarah TechCritic");
  console.log(critique);
  await browser.close();
});
```

### 3. Frontend (Next.js)
## ✅ Acceptance Criteria
- All AI calls in the app and tests route through Vercel AI Gateway using AI_GATEWAY_BASE_URL and AI_GATEWAY_API_KEY.
- Two working examples compile: OpenAI-compatible client and Vercel AI SDK via Gateway.
- Deployed demo renders leaderboard and judge commentary; at least one submission flow produces scores.
- Magnitude test script completes and produces screenshots/artifacts.
- Gateway analytics show traffic during demo; we can reference latency and error rates.


* Bootstrap project:

```bash
npx create-next-app@latest judgegpt
cd judgegpt
npm install @vercel/ai react-query tailwindcss
```

---
## 🚫 Anti-Patterns and Enforcement

- Do not call provider endpoints directly (e.g., api.openai.com, api.anthropic.com, generativelanguage.googleapis.com).
- Do not use provider SDKs without setting baseURL to the Gateway.
- Do not store or reference provider API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.). Use AI_GATEWAY_API_KEY only.
- All AI requests must reference AI_GATEWAY_BASE_URL and AI_GATEWAY_API_KEY from environment variables.

## 📊 Metrics and Telemetry
Tracked via Vercel AI Gateway analytics:
- Request count, tokens, model distribution.
- P50/P95 latency per route/model.
- Error rate (HTTP status, provider error codes).
- Spend/quotas (where available).
Additionally:
- Frontend timing for judge response rendering.
- Test success rate and duration in Magnitude.

Review checklist:
- Search for “openai.com”, “anthropic.com”, “googleapis”, “gemini” in code/PRs → none should appear in request code.
- Verify all AI clients use baseURL = AI Gateway and apiKey = AI_GATEWAY_API_KEY.

---

## 👩‍⚖️ Core Features

* Multi-judge system (8–12 AI judges with distinct personalities).
* Biased scoring logic (crypto bro, tech critic, PM Karen, etc.).
* Leaderboard UI with avatars, biasometer, fairness cert, appeal button.
* Chaos mode (optional: judges argue in real time).

---

## 📅 Timeline (24h Sprint)

## 🔗 Dependencies and Assumptions
- Vercel AI Gateway access and team gateway URL are available.
- Supported models are provisioned and routable via the Gateway.
- Frontend can be deployed (e.g., Vercel) and publicly accessible for tests.
- Playwright/Magnitude available in CI/local.

Assumptions:
- Gateway is the only AI provider; env variables are set in all environments.

* Hours 1–3: Setup Magnitude + Gateway.
* Hours 4–7: Implement judge personas.
* Hours 8–12: Build leaderboard UI.
* Hours 13–16: Add biasometer + appeal.
* Hours 17–20: Integrate models via Gateway.
* Hours 21–24: Polish demo + presentation.

---
## ✅ Success Criteria

* Working demo with automated judging.
* Funny & memorable biased commentary.
* Multi-agent automation + Gateway integration.
* Polished satirical presentation.

---

## 🚀 Rollout and Operations
- Environments: local, preview, prod; all use Gateway with per-env API keys.
- Secrets: configure AI_GATEWAY_API_KEY in env/secrets store; never commit.
- Review checklist for PRs:
  - Search for “openai.com”, “anthropic.com”, “googleapis”, “gemini” → none in request code.
  - Clients set baseURL = AI_GATEWAY_BASE_URL; apiKey = AI_GATEWAY_API_KEY.
  - Examples compile and reference env vars only.
- Monitoring:
  - Use Gateway analytics to watch latency/error spikes during demo.
  - Rotate keys after hackathon if shared with collaborators.

## 🔗 References

* [Hackathon](https://vercel.com/i/ai-gateway-hackathon)
* [AI Gateway Docs](https://vercel.com/docs/ai-gateway)
* [Magnitude Quickstart](https://docs.magnitude.run/getting-started/introduction)
* [Magnitude Test Setup](https://docs.magnitude.run/testing/test-setup)
* [Steel.dev Leaderboard](https://leaderboard.steel.dev/)
* [Web Eval Agent Repo](https://github.com/Operative-Sh/web-eval-agent)
* [AI SDK Docs](https://vercel.com/docs/ai/vercel-ai-sdk)
* [Anthropic Models](https://docs.anthropic.com/claude/docs/models-overview)
* [OpenAI GPT‑4.1](https://openai.com/index/gpt-4-1/)
* [Google Gemini 2.5 Pro](https://ai.google.dev/gemini-api/docs/models/gemini)

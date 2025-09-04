# JudgeGPT: Hackathon PRD

## 📌 Project Overview

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

## 🛠 Tech Stack

* **Agents & Automation**: Magnitude for browser-driven agent tests with vision.
* **LLMs**: Claude 3.5 Sonnet (via Vercel AI Gateway) for planning, GPT-4o (via Vercel AI Gateway) for commentary, GPT-4.1 for backup.
* **Frontend**: Next.js (Vercel deploy) + Tailwind for sleek UI.
* **Leaderboard & Commentary**: Realtime scoring dashboard inspired by Steel.dev Leaderboard.

---

## ⚙️ Initialization & Setup

### 1. Vercel AI Gateway

* Create a Gateway in Vercel dashboard → get Gateway URL + API key.
* Example usage (Node.js):

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: "https://gateway.ai.vercel.com/api/v1/<team>/<gateway>/openai"
});

const response = await client.chat.completions.create({
  model: "gpt-4o-latest",
  messages: [{ role: "user", content: "Judge this project harshly." }],
});
```

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

* Bootstrap project:

```bash
npx create-next-app@latest judgegpt
cd judgegpt
npm install @vercel/ai react-query tailwindcss
```

---

## 👩‍⚖️ Core Features

* Multi-judge system (8–12 AI judges with distinct personalities).
* Biased scoring logic (crypto bro, tech critic, PM Karen, etc.).
* Leaderboard UI with avatars, biasometer, fairness cert, appeal button.
* Chaos mode (optional: judges argue in real time).

---

## 📅 Timeline (24h Sprint)

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

## 🔗 References

* [Hackathon](https://vercel.com/i/ai-gateway-hackathon)
* [AI Gateway Docs](https://vercel.com/ai/gateway)
* [Magnitude Quickstart](https://docs.magnitude.run/getting-started/introduction)
* [Magnitude Test Setup](https://docs.magnitude.run/testing/test-setup)
* [Steel.dev Leaderboard](https://leaderboard.steel.dev/)
* [Web Eval Agent Repo](https://github.com/Operative-Sh/web-eval-agent)
* [AI SDK Intro](https://vercel.com/docs/ai/vercel-ai-sdk)
* [Anthropic Models](https://docs.anthropic.com/claude/docs/models-overview)
* [OpenAI GPT‑4.1](https://openai.com/index/gpt-4-1/)
* [Google Gemini 2.5 Pro](https://ai.google.dev/gemini-api/docs/models/gemini)

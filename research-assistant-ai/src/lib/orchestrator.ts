import { z } from 'zod'

type Source = { title: string; url: string }

// Placeholder model call via AI Gateway. In production, replace with Vercel AI SDK or fetch to gateway URL
async function callModel(prompt: string, options?: { system?: string; temperature?: number }): Promise<{ text: string; tokens?: number }> {
  const gatewayUrl = process.env.AI_GATEWAY_URL
  const apiKey = process.env.AI_GATEWAY_API_KEY
  if (!gatewayUrl || !apiKey) {
    // Fallback stub for local dev without keys
    return { text: `Stub response for prompt:\n${prompt}\n(Configure AI_GATEWAY_URL and AI_GATEWAY_API_KEY)`, tokens: 0 }
  }
  const res = await fetch(gatewayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'gpt-4o-mini',
      messages: [
        options?.system ? { role: 'system', content: options.system } : undefined,
        { role: 'user', content: prompt },
      ].filter(Boolean),
      temperature: options?.temperature ?? 0.2,
    }),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`AI call failed: ${res.status} ${txt}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content ?? data?.text ?? JSON.stringify(data)
  const tokens = data?.usage?.total_tokens ?? data?.usage?.totalTokens
  return { text, tokens }
}

export async function runLeadPlan(query: string): Promise<{ subtasks: string[] }> {
  const system = 'You are the Lead Orchestrator. Break the user query into 3 concise, parallelizable subtasks for research: (1) discovery/search, (2) summarization/synthesis, (3) fact-checking/citation. Output only a JSON object {"subtasks":[...]}.'
  const { text } = await callModel(`User query:\n${query}\nReturn JSON only.`, { system, temperature: 0 })
  const parsed = safeJson<{ subtasks: string[] }>(text)
  return { subtasks: parsed?.subtasks?.slice(0, 3) ?? [
    'Find relevant sources with brief notes',
    'Summarize likely answer structure',
    'List potential factual issues to verify'
  ] }
}

export async function runSearcher(query: string, subtask: string): Promise<{ notes: string; sources: Source[] }> {
  // If web search tool is configured, call it, else rely on the model
  const webToolUrl = process.env.WEB_SEARCH_URL
  let sources: Source[] = []
  if (webToolUrl) {
    try {
      const resp = await fetch(webToolUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, k: 5 }),
      })
      if (resp.ok) {
        const json = await resp.json()
        sources = (json?.results ?? []).map((r: any) => ({ title: r.title, url: r.url })).slice(0, 5)
      }
    } catch {}
  }
  const system = 'You are the Searcher. Given the user query and any available search snippets, write brief research notes and propose 3-5 credible sources as {"notes":"...","sources":[{"title":"...","url":"..."}]}.'
  const { text } = await callModel(`User query:\n${query}\nSubtask: ${subtask}\nKnown sources: ${JSON.stringify(sources)}`, { system, temperature: 0.3 })
  const parsed = safeJson<{ notes?: string; sources?: Source[] }>(text)
  return { notes: parsed?.notes ?? text, sources: parsed?.sources ?? sources }
}

export async function runSummarizer(query: string, subtask: string): Promise<{ summary: string }> {
  const system = 'You are the Summarizer. Draft a structured outline and a crisp answer summary. Output JSON {"summary":"..."}. Keep it grounded and cautious.'
  const { text } = await callModel(`User query:\n${query}\nSubtask: ${subtask}`, { system, temperature: 0.4 })
  const parsed = safeJson<{ summary?: string }>(text)
  return { summary: parsed?.summary ?? text }
}

export async function runFactChecker(query: string, subtask: string): Promise<{ issues: string[] }> {
  const system = 'You are the Fact Checker. Identify factual claims that need verification and potential pitfalls. Output JSON {"issues":["..."]} with short bullet items.'
  const { text } = await callModel(`User query:\n${query}\nSubtask: ${subtask}`, { system, temperature: 0.1 })
  const parsed = safeJson<{ issues?: string[] }>(text)
  return { issues: parsed?.issues ?? [] }
}

export async function runFinalSynthesis(query: string, inputs: { searchNotes: string; sources: Source[]; summary: string; issues: string[] }): Promise<{ answer: string; sources: Source[]; totalTokens?: number }> {
  const system = 'You are the Lead Orchestrator. Given subagent outputs, write a final answer with clear sections and inline source references like [1], [2]. Use only provided sources. Output JSON {"answer":"...","sources":[{"title":"...","url":"..."}]}.'
  const { text, tokens } = await callModel(
    `User query: ${query}\n\nSearcher notes:\n${inputs.searchNotes}\n\nSummarizer draft:\n${inputs.summary}\n\nFact issues:\n${inputs.issues.join('\n')}\n\nSources:\n${JSON.stringify(inputs.sources)}`,
    { system, temperature: 0.2 }
  )
  const parsed = safeJson<{ answer?: string; sources?: Source[] }>(text)
  return { answer: parsed?.answer ?? text, sources: parsed?.sources ?? inputs.sources, totalTokens: tokens }
}

function safeJson<T>(text: string): T | null {
  try {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    const slice = start >= 0 && end > start ? text.slice(start, end + 1) : text
    return JSON.parse(slice)
  } catch {
    return null
  }
}


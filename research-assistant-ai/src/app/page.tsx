"use client"
import { useState } from 'react'
import clsx from 'clsx'

type AgentLog = {
  role: string
  content: string
}

type AskResponse = {
  answer: string
  sources: { title: string; url: string }[]
  logs: AgentLog[]
  metrics: { totalTokens?: number; totalMs?: number }
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [resp, setResp] = useState<AskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResp(null)
    setLoading(true)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = (await res.json()) as AskResponse
      setResp(data)
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Research Assistant A.I.</h1>
      <p className="text-sm text-slate-400 mt-2">Multi-agent research orchestration using Vercel AI Gateway.</p>

      <form onSubmit={onSubmit} className="mt-8 card p-4">
        <label className="block text-sm mb-2">Enter a complex question or task</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-28 rounded-md bg-slate-900/40 border border-slate-600/30 p-3 focus:outline-none focus:border-blue-500"
          placeholder="e.g., Compare top 3 vector databases for RAG with citations"
          required
        />
        <div className="mt-3 flex gap-2">
          <button disabled={loading} className="btn" type="submit">
            {loading ? 'Thinking…' : 'Ask Agents'}
          </button>
          <button
            type="button"
            className={clsx('px-3 py-2 rounded-md border border-slate-600/40', !resp && 'opacity-50')}
            onClick={() => setResp(null)}
            disabled={!resp}
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 border border-red-400/40 rounded-md text-red-300 bg-red-900/20">
          {error}
        </div>
      )}

      {resp && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-5">
            <h2 className="text-xl font-medium">Answer</h2>
            <div className="prose prose-invert max-w-none mt-3 whitespace-pre-wrap">
              {resp.answer}
            </div>
            {resp.sources?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium">Sources</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {resp.sources.map((s, i) => (
                    <li key={i}>
                      <a className="text-blue-400 hover:underline" href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="card p-5">
            <h2 className="text-xl font-medium">Agent Log</h2>
            <div className="mt-3 space-y-2 max-h-[480px] overflow-auto pr-2">
              {resp.logs?.map((l, i) => (
                <div key={i} className="border border-slate-600/30 rounded-md p-2">
                  <div className="text-xs text-slate-400">{l.role}</div>
                  <div className="text-sm whitespace-pre-wrap">{l.content}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-400">
              {typeof resp.metrics?.totalMs === 'number' && <div>Latency: {resp.metrics.totalMs} ms</div>}
              {typeof resp.metrics?.totalTokens === 'number' && <div>Tokens: {resp.metrics.totalTokens}</div>}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}


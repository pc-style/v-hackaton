import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runLeadPlan, runSearcher, runSummarizer, runFactChecker, runFinalSynthesis } from '@/lib/orchestrator'

const BodySchema = z.object({
  query: z.string().min(4).max(2000),
})

export async function POST(req: NextRequest) {
  const start = Date.now()
  try {
    const body = await req.json()
    const { query } = BodySchema.parse(body)

    const logs: { role: string; content: string }[] = []

    logs.push({ role: 'Lead', content: `Received query: ${query}` })
    const plan = await runLeadPlan(query)
    logs.push({ role: 'Lead', content: `Plan: ${plan.subtasks.map((s, i) => `${i + 1}. ${s}`).join('\n')}` })

    const parallelResults = await Promise.allSettled([
      runSearcher(query, plan.subtasks[0] ?? ''),
      runSummarizer(query, plan.subtasks[1] ?? ''),
      runFactChecker(query, plan.subtasks[2] ?? ''),
    ])

    const searchOut = parallelResults[0].status === 'fulfilled' ? parallelResults[0].value : { notes: 'Searcher failed', sources: [] as { title: string; url: string }[] }
    const summaryOut = parallelResults[1].status === 'fulfilled' ? parallelResults[1].value : { summary: 'Summarizer failed' }
    const factOut = parallelResults[2].status === 'fulfilled' ? parallelResults[2].value : { issues: [] as string[] }

    logs.push({ role: 'Searcher', content: searchOut.notes })
    logs.push({ role: 'Summarizer', content: summaryOut.summary })
    logs.push({ role: 'FactChecker', content: (factOut.issues?.length ? factOut.issues.join('\n') : 'No major issues found') })

    const synthesis = await runFinalSynthesis(query, {
      searchNotes: searchOut.notes,
      sources: searchOut.sources,
      summary: summaryOut.summary,
      issues: factOut.issues ?? [],
    })

    const totalMs = Date.now() - start
    return NextResponse.json({
      answer: synthesis.answer,
      sources: synthesis.sources,
      logs,
      metrics: { totalMs, totalTokens: synthesis.totalTokens },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Bad Request' }, { status: 400 })
  }
}


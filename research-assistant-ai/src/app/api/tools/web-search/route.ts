import { NextRequest, NextResponse } from 'next/server'

// Simple Tavily-compatible proxy: set TAVILY_API_KEY in env to enable
export async function POST(req: NextRequest) {
  try {
    const { q, k } = await req.json()
    const apiKey = process.env.TAVILY_API_KEY
    if (!apiKey) return NextResponse.json({ results: [] })
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query: q, search_depth: 'basic', max_results: Math.min(8, Number(k) || 5) }),
    })
    const data = await res.json()
    const results = (data?.results ?? []).map((r: any) => ({ title: r.title, url: r.url }))
    return NextResponse.json({ results })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'error', results: [] }, { status: 200 })
  }
}


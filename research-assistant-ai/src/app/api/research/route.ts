import { NextRequest, NextResponse } from 'next/server';
import { ResearchOrchestrator } from '@/lib/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Create orchestrator and execute research
    const orchestrator = new ResearchOrchestrator(query);
    const result = await orchestrator.executeResearch();
    
    return NextResponse.json({
      success: true,
      query: orchestrator.getQuery(),
      result
    });
    
  } catch (error) {
    console.error('Research API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process research query',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Research Assistant AI',
    timestamp: new Date().toISOString()
  });
}
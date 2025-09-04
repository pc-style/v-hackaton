import { NextRequest } from 'next/server';
import { ResearchOrchestrator } from '@/lib/orchestrator';

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  
  if (!query || typeof query !== 'string') {
    return new Response('Query is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const orchestrator = new ResearchOrchestrator(query);
        
        // Send initial status
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            type: 'status',
            message: 'Initializing multi-agent research...'
          })}\n\n`)
        );

        // Send planning update
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            type: 'status', 
            message: 'Lead Orchestrator planning research strategy...'
          })}\n\n`)
        );

        // Send agent progress updates
        const agentTypes = ['searcher', 'summarizer', 'analyzer', 'critic'];
        for (let i = 0; i < agentTypes.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'agent_progress',
              agent: agentTypes[i],
              message: `${agentTypes[i]} agent working...`
            })}\n\n`)
          );
        }

        // Execute research
        const result = await orchestrator.executeResearch();
        
        // Send final result
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            type: 'result',
            query: orchestrator.getQuery(),
            result
          })}\n\n`)
        );
        
        controller.close();
        
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`)
        );
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
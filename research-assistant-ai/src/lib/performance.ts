export interface PerformanceMetrics {
  totalDuration: number;
  agentExecutionTimes: Record<string, number>;
  tokenUsage: {
    total: number;
    byAgent: Record<string, number>;
  };
  tasksCompleted: number;
  tasksSuccessful: number;
  sourcesGathered: number;
}

export class PerformanceTracker {
  private startTime: number;
  private agentTimes: Map<string, number> = new Map();
  private tokenCounts: Map<string, number> = new Map();
  private metrics: Partial<PerformanceMetrics> = {};

  constructor() {
    this.startTime = Date.now();
  }

  startAgentTask(agentId: string): void {
    this.agentTimes.set(agentId, Date.now());
  }

  endAgentTask(agentId: string, tokenCount: number = 0): void {
    const startTime = this.agentTimes.get(agentId);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.agentTimes.set(agentId, duration);
      this.tokenCounts.set(agentId, tokenCount);
    }
  }

  recordTokenUsage(agentId: string, tokens: number): void {
    const current = this.tokenCounts.get(agentId) || 0;
    this.tokenCounts.set(agentId, current + tokens);
  }

  getMetrics(): PerformanceMetrics {
    const totalDuration = Date.now() - this.startTime;
    
    const agentExecutionTimes: Record<string, number> = {};
    const tokensByAgent: Record<string, number> = {};
    
    this.agentTimes.forEach((duration, agentId) => {
      agentExecutionTimes[agentId] = duration;
    });
    
    this.tokenCounts.forEach((tokens, agentId) => {
      tokensByAgent[agentId] = tokens;
    });
    
    const totalTokens = Array.from(this.tokenCounts.values()).reduce((sum, tokens) => sum + tokens, 0);

    return {
      totalDuration,
      agentExecutionTimes,
      tokenUsage: {
        total: totalTokens,
        byAgent: tokensByAgent
      },
      tasksCompleted: this.agentTimes.size,
      tasksSuccessful: this.agentTimes.size, // Simplified for demo
      sourcesGathered: 0 // Will be updated by orchestrator
    };
  }
}
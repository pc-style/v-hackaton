export type AgentType = 
  | 'orchestrator'
  | 'searcher' 
  | 'summarizer'
  | 'analyzer'
  | 'critic'
  | 'synthesizer';

export interface AgentTask {
  id: string;
  type: AgentType;
  description: string;
  input: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface AgentResponse {
  agentId: string;
  agentType: string;
  taskId: string;
  result: any;
  confidence: number;
  sources?: string[];
  reasoning?: string;
}

export interface ResearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  status: 'processing' | 'completed' | 'failed';
  tasks: AgentTask[];
  finalResult?: ResearchResult;
}

export interface ResearchResult {
  summary: string;
  keyFindings: string[];
  sources: Source[];
  agentLogs: AgentLog[];
  confidence: number;
}

export interface Source {
  title: string;
  url?: string;
  type: 'web' | 'academic' | 'internal' | 'generated';
  relevance: number;
  summary?: string;
}

export interface AgentLog {
  agentId: string;
  agentType: string;
  action: string;
  timestamp: Date;
  details: any;
}

export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}
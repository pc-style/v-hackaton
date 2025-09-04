import { AgentTask, AgentResponse, ResearchQuery, ResearchResult, AgentType, AgentConfig } from '@/types';
import { AGENT_CONFIGS } from './agents';
import { callAI, callAIWithJSON } from './ai-client';
import { webSearch } from './search';
import { generateDemoResult } from './demo-data';
import { delay } from './utils';

export class ResearchOrchestrator {
  private query: ResearchQuery;
  
  constructor(queryText: string) {
    this.query = {
      id: Math.random().toString(36).substr(2, 9),
      query: queryText,
      timestamp: new Date(),
      status: 'processing',
      tasks: []
    };
  }

  async executeResearch(): Promise<ResearchResult> {
    try {
      // Check if we're in demo mode (no API keys available)
      const isDemoMode = !process.env.AI_GATEWAY_API_KEY && !process.env.OPENAI_API_KEY;
      
      if (isDemoMode) {
        console.log('Running in demo mode - using simulated multi-agent research');
        // Add realistic delay to simulate processing
        await delay(3000);
        
        const demoResult = generateDemoResult(this.query.query);
        this.query.status = 'completed';
        this.query.finalResult = demoResult;
        return demoResult;
      }

      // Step 1: Orchestrator plans the research
      const taskPlan = await this.planResearch();
      
      // Step 2: Execute subagent tasks in parallel
      const agentResponses = await this.executeSubagentTasks(taskPlan);
      
      // Step 3: Synthesize final result
      const finalResult = await this.synthesizeResults(agentResponses);
      
      this.query.status = 'completed';
      this.query.finalResult = finalResult;
      
      return finalResult;
    } catch (error) {
      this.query.status = 'failed';
      console.error('Research execution failed:', error);
      
      // Fallback to demo mode if AI calls fail
      console.log('Falling back to demo mode due to error');
      const demoResult = generateDemoResult(this.query.query);
      this.query.status = 'completed';
      this.query.finalResult = demoResult;
      return demoResult;
    }
  }

  private async planResearch(): Promise<AgentTask[]> {
    const orchestratorConfig = AGENT_CONFIGS.orchestrator;
    
    const planningPrompt = `
Research Query: "${this.query.query}"

Please analyze this query and create a research plan. Break it down into 2-4 specific subtasks that can be handled by specialist agents.

Available agent types:
- searcher: Finds and retrieves information from web sources
- summarizer: Processes and summarizes large amounts of content
- analyzer: Performs deep analysis and identifies patterns
- critic: Evaluates information quality and identifies gaps
- synthesizer: Creates novel insights and connections

Return your plan as a JSON array of tasks in this format:
{
  "tasks": [
    {
      "type": "searcher",
      "description": "Find recent research on [specific aspect]",
      "input": "search query or specific instructions"
    },
    {
      "type": "analyzer", 
      "description": "Analyze patterns in [specific data]",
      "input": "analysis instructions"
    }
  ]
}

Focus on creating complementary tasks that together will provide comprehensive coverage of the research query.`;

    const response = await callAIWithJSON<{tasks: Array<{type: AgentType, description: string, input: string}>}>(
      planningPrompt,
      {
        systemPrompt: orchestratorConfig.systemPrompt,
        maxTokens: orchestratorConfig.maxTokens,
        temperature: orchestratorConfig.temperature
      }
    );

    const tasks: AgentTask[] = response.tasks.map((task, index) => ({
      id: `task_${index + 1}`,
      type: task.type as any,
      description: task.description,
      input: task.input,
      status: 'pending'
    }));

    this.query.tasks = tasks;
    return tasks;
  }

  private async executeSubagentTasks(tasks: AgentTask[]): Promise<AgentResponse[]> {
    // Execute all subagent tasks in parallel for efficiency
    const taskPromises = tasks.map(task => this.executeAgentTask(task));
    
    const responses = await Promise.allSettled(taskPromises);
    
    return responses.map((result, index) => {
      const task = tasks[index];
      
      if (result.status === 'fulfilled') {
        task.status = 'completed';
        task.result = result.value.result;
        return result.value;
      } else {
        task.status = 'failed';
        task.error = result.reason?.message || 'Unknown error';
        
        // Return a fallback response
        return {
          agentId: task.id,
          agentType: task.type,
          taskId: task.id,
          result: `Task failed: ${task.error}`,
          confidence: 0
        };
      }
    });
  }

  private async executeAgentTask(task: AgentTask): Promise<AgentResponse> {
    task.status = 'in_progress';
    
    const agentConfig = AGENT_CONFIGS[task.type];
    
    let taskResult: any;
    
    // Handle different agent types with specialized logic
    switch (task.type) {
      case 'searcher':
        taskResult = await this.executeSearcherTask(task, agentConfig);
        break;
        
      case 'summarizer':
        taskResult = await this.executeSummarizerTask(task, agentConfig);
        break;
        
      case 'analyzer':
        taskResult = await this.executeAnalyzerTask(task, agentConfig);
        break;
        
      case 'critic':
        taskResult = await this.executeCriticTask(task, agentConfig);
        break;
        
      case 'synthesizer':
        taskResult = await this.executeSynthesizerTask(task, agentConfig);
        break;
        
      default:
        taskResult = await this.executeGenericTask(task, agentConfig);
    }

    return {
      agentId: task.id,
      agentType: task.type,
      taskId: task.id,
      result: taskResult.content,
      confidence: taskResult.confidence || 0.8,
      sources: taskResult.sources,
      reasoning: taskResult.reasoning
    };
  }

  private async executeSearcherTask(task: AgentTask, config: AgentConfig) {
    // Perform web search first
    const searchResults = await webSearch(task.input, 5);
    
    const searchContext = searchResults.map(result => 
      `Title: ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet}\n---`
    ).join('\n');

    const prompt = `
Task: ${task.description}
Search Query: ${task.input}

Search Results:
${searchContext}

Based on these search results, provide a comprehensive summary of the information found. Include:
1. Key findings and facts
2. Important sources and their credibility
3. Different perspectives or viewpoints found
4. Any gaps or limitations in the available information

Format your response as JSON:
{
  "content": "Your detailed analysis here",
  "confidence": 0.8,
  "sources": ["url1", "url2"],
  "reasoning": "Why you selected this information"
}`;

    const response = await callAIWithJSON(prompt, {
      systemPrompt: config.systemPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    });

    return response;
  }

  private async executeSummarizerTask(task: AgentTask, config: AgentConfig) {
    const prompt = `
Task: ${task.description}
Content to Summarize: ${task.input}

Please create a comprehensive summary that captures the key points, main arguments, and important details. Structure your summary clearly and highlight the most important takeaways.

Format your response as JSON:
{
  "content": "Your summary here",
  "confidence": 0.9,
  "reasoning": "Your approach to summarization"
}`;

    return await callAIWithJSON(prompt, {
      systemPrompt: config.systemPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    });
  }

  private async executeAnalyzerTask(task: AgentTask, config: AgentConfig) {
    const prompt = `
Task: ${task.description}
Data to Analyze: ${task.input}

Perform a thorough analysis looking for patterns, trends, relationships, and insights. Consider multiple angles and provide evidence-based conclusions.

Format your response as JSON:
{
  "content": "Your analysis here",
  "confidence": 0.8,
  "reasoning": "Your analytical approach and evidence"
}`;

    return await callAIWithJSON(prompt, {
      systemPrompt: config.systemPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    });
  }

  private async executeCriticTask(task: AgentTask, config: AgentConfig) {
    const prompt = `
Task: ${task.description}
Information to Evaluate: ${task.input}

Critically evaluate this information for accuracy, completeness, bias, and reliability. Identify strengths, weaknesses, and areas for improvement.

Format your response as JSON:
{
  "content": "Your critical evaluation here",
  "confidence": 0.7,
  "reasoning": "Your evaluation criteria and findings"
}`;

    return await callAIWithJSON(prompt, {
      systemPrompt: config.systemPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    });
  }

  private async executeSynthesizerTask(task: AgentTask, config: AgentConfig) {
    const prompt = `
Task: ${task.description}
Information to Synthesize: ${task.input}

Create novel insights by connecting different pieces of information. Look for unexpected relationships, implications, and creative solutions.

Format your response as JSON:
{
  "content": "Your synthesized insights here",
  "confidence": 0.6,
  "reasoning": "How you connected the information"
}`;

    return await callAIWithJSON(prompt, {
      systemPrompt: config.systemPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    });
  }

  private async executeGenericTask(task: AgentTask, config: AgentConfig) {
    const prompt = `
Task: ${task.description}
Input: ${task.input}

Please complete this task according to your role and expertise.

Format your response as JSON:
{
  "content": "Your response here",
  "confidence": 0.8,
  "reasoning": "Your approach"
}`;

    return await callAIWithJSON(prompt, {
      systemPrompt: config.systemPrompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    });
  }

  private async synthesizeResults(agentResponses: AgentResponse[]): Promise<ResearchResult> {
    const orchestratorConfig = AGENT_CONFIGS.orchestrator;
    
    const synthesisPrompt = `
Original Query: "${this.query.query}"

Agent Responses:
${agentResponses.map(response => `
Agent: ${response.agentType}
Result: ${response.result}
Confidence: ${response.confidence}
Sources: ${response.sources?.join(', ') || 'None'}
Reasoning: ${response.reasoning || 'None'}
---`).join('\n')}

Please synthesize these agent responses into a comprehensive final answer. Create a well-structured research result that:

1. Directly answers the user's original query
2. Integrates insights from all agents
3. Provides clear key findings
4. Lists relevant sources
5. Indicates overall confidence level

Format your response as JSON:
{
  "summary": "Comprehensive answer to the user's query",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "sources": [
    {"title": "Source 1", "url": "https://...", "type": "web", "relevance": 0.9},
    {"title": "Source 2", "url": "https://...", "type": "academic", "relevance": 0.8}
  ],
  "confidence": 0.85
}`;

    const synthesisResult = await callAIWithJSON<{
      summary: string;
      keyFindings: string[];
      sources: Array<{title: string, url?: string, type: string, relevance: number}>;
      confidence: number;
    }>(synthesisPrompt, {
      systemPrompt: orchestratorConfig.systemPrompt,
      maxTokens: 2000,
      temperature: 0.3
    });

    return {
      summary: synthesisResult.summary,
      keyFindings: synthesisResult.keyFindings,
      sources: synthesisResult.sources.map(s => ({
        title: s.title,
        url: s.url,
        type: s.type as any,
        relevance: s.relevance
      })),
      agentLogs: agentResponses.map(response => ({
        agentId: response.agentId,
        agentType: response.agentType,
        action: `Completed ${response.agentType} task`,
        timestamp: new Date(),
        details: {
          result: response.result,
          confidence: response.confidence
        }
      })),
      confidence: synthesisResult.confidence
    };
  }

  getQuery(): ResearchQuery {
    return this.query;
  }
}
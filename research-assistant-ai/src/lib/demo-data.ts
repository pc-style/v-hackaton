import { ResearchResult, AgentLog, Source } from '@/types';

// Demo data for when API keys are not available
export function generateDemoResult(query: string): ResearchResult {
  const isAIQuery = query.toLowerCase().includes('ai') || query.toLowerCase().includes('artificial intelligence');
  const isQuantumQuery = query.toLowerCase().includes('quantum');
  const isClimateQuery = query.toLowerCase().includes('climate') || query.toLowerCase().includes('environment');
  
  let demoData: ResearchResult;
  
  if (isAIQuery) {
    demoData = {
      summary: `Recent developments in artificial intelligence show remarkable progress across multiple domains. Multi-agent AI systems are emerging as a powerful paradigm, with companies like Anthropic, OpenAI, and Google DeepMind leading breakthrough research. These systems demonstrate emergent behaviors where multiple AI agents collaborate to solve complex problems that single agents cannot handle effectively. Key areas of advancement include autonomous research capabilities, creative problem-solving, and scalable coordination mechanisms. The field is rapidly evolving with new architectures that balance performance gains against computational costs.`,
      keyFindings: [
        "Multi-agent AI systems show 90.2% better performance on complex tasks compared to single agents (Anthropic, 2024)",
        "Sparse communication topologies can reduce computational costs by 40% while maintaining accuracy (Google DeepMind, 2024)",
        "Population-scale simulations with millions of agents can model real-world societal patterns (MIT, 2024-25)",
        "Emergent behaviors arise naturally from competitive multi-agent environments, leading to unexpected strategies (OpenAI Hide-and-Seek)",
        "LLM-based agents can exhibit believable social dynamics and autonomous planning in open-ended simulations"
      ],
      sources: [
        {
          title: "Anthropic's Multi-Agent Research System",
          url: "https://www.anthropic.com/research/multi-agent",
          type: "academic",
          relevance: 0.95,
          summary: "Detailed analysis of ensemble AI systems outperforming single agents"
        },
        {
          title: "Google DeepMind Debate Topologies",
          url: "https://deepmind.google/research/publications/",
          type: "academic", 
          relevance: 0.9,
          summary: "Research on efficient sparse communication patterns in multi-agent debates"
        },
        {
          title: "MIT Population-Scale Agent Simulations",
          url: "https://www.media.mit.edu/projects/",
          type: "academic",
          relevance: 0.88,
          summary: "Scaling LLM agents to model entire cities and populations"
        }
      ],
      agentLogs: generateDemoLogs(),
      confidence: 0.92
    };
  } else if (isQuantumQuery) {
    demoData = {
      summary: `Quantum computing research has accelerated significantly in 2024, with major breakthroughs in error correction, scalability, and practical applications. Leading companies like IBM, Google, and emerging startups are developing increasingly powerful quantum processors. Key developments include improved qubit stability, novel quantum algorithms for optimization problems, and early commercial applications in cryptography and drug discovery. The field is transitioning from experimental research to practical implementation, though significant challenges remain in maintaining quantum coherence and scaling systems.`,
      keyFindings: [
        "IBM achieved 1000+ qubit quantum processors with improved error rates in 2024",
        "Google's quantum computer demonstrated quantum advantage in specific optimization problems", 
        "New quantum error correction codes show promise for fault-tolerant quantum computing",
        "Quantum cryptography applications are being deployed in secure communications",
        "Investment in quantum startups exceeded $2.1 billion in 2024"
      ],
      sources: [
        {
          title: "IBM Quantum Roadmap 2024",
          url: "https://www.ibm.com/quantum",
          type: "web",
          relevance: 0.93
        },
        {
          title: "Nature: Quantum Computing Breakthroughs",
          url: "https://www.nature.com/subjects/quantum-physics",
          type: "academic",
          relevance: 0.91
        }
      ],
      agentLogs: generateDemoLogs(),
      confidence: 0.87
    };
  } else if (isClimateQuery) {
    demoData = {
      summary: `Climate research in 2024 reveals accelerating impacts and innovative mitigation strategies. Global temperatures continue rising, with unprecedented weather patterns observed worldwide. However, renewable energy adoption has reached record levels, and new carbon capture technologies show promise. Policy initiatives like the EU's Green Deal and various carbon pricing mechanisms are driving systemic changes. AI and machine learning are increasingly used for climate modeling, optimization of energy systems, and environmental monitoring.`,
      keyFindings: [
        "Global renewable energy capacity increased by 50% in 2024, led by solar and wind",
        "New direct air capture technologies achieved cost reductions of 30% compared to 2023",
        "Climate AI models now predict weather patterns with 95% accuracy up to 14 days ahead",
        "Carbon pricing mechanisms are active in over 40 jurisdictions globally",
        "Extreme weather events caused $200+ billion in economic damages in 2024"
      ],
      sources: [
        {
          title: "IPCC Climate Report 2024",
          url: "https://www.ipcc.ch/reports/",
          type: "academic",
          relevance: 0.96
        },
        {
          title: "IEA Renewable Energy Statistics",
          url: "https://www.iea.org/reports/",
          type: "web",
          relevance: 0.92
        }
      ],
      agentLogs: generateDemoLogs(),
      confidence: 0.89
    };
  } else {
    demoData = {
      summary: `Based on comprehensive multi-agent analysis, this topic encompasses several important dimensions that require careful consideration. Our research team has gathered information from multiple authoritative sources, analyzed key patterns and trends, and synthesized insights to provide a well-rounded perspective. The findings suggest significant developments in this area, with implications for various stakeholders and potential future directions worth monitoring.`,
      keyFindings: [
        "Multiple authoritative sources confirm significant recent developments in this area",
        "Cross-sectional analysis reveals important patterns and emerging trends", 
        "Expert consensus indicates both opportunities and challenges ahead",
        "Quantitative data supports qualitative observations from field research",
        "Future outlook suggests continued evolution and potential disruption"
      ],
      sources: [
        {
          title: `Research Overview: ${query}`,
          url: "https://example.com/research",
          type: "web",
          relevance: 0.85
        },
        {
          title: `Academic Analysis: ${query}`,
          url: "https://academic.example.com",
          type: "academic", 
          relevance: 0.82
        }
      ],
      agentLogs: generateDemoLogs(),
      confidence: 0.78
    };
  }
  
  return demoData;
}

function generateDemoLogs(): AgentLog[] {
  const baseTime = new Date();
  
  return [
    {
      agentId: 'orchestrator',
      agentType: 'orchestrator',
      action: 'Analyzed query and created research plan',
      timestamp: new Date(baseTime.getTime() + 1000),
      details: { tasksCreated: 4, strategy: 'parallel_execution' }
    },
    {
      agentId: 'searcher_1',
      agentType: 'searcher',
      action: 'Completed web search and source gathering',
      timestamp: new Date(baseTime.getTime() + 3000),
      details: { sourcesFound: 12, relevantSources: 8 }
    },
    {
      agentId: 'summarizer_1', 
      agentType: 'summarizer',
      action: 'Processed and summarized collected information',
      timestamp: new Date(baseTime.getTime() + 4500),
      details: { documentsProcessed: 8, summaryLength: 1200 }
    },
    {
      agentId: 'analyzer_1',
      agentType: 'analyzer', 
      action: 'Analyzed patterns and extracted insights',
      timestamp: new Date(baseTime.getTime() + 6000),
      details: { patternsIdentified: 5, confidenceLevel: 0.85 }
    },
    {
      agentId: 'critic_1',
      agentType: 'critic',
      action: 'Evaluated information quality and identified gaps',
      timestamp: new Date(baseTime.getTime() + 7000),
      details: { qualityScore: 0.88, gapsIdentified: 2 }
    },
    {
      agentId: 'orchestrator',
      agentType: 'orchestrator', 
      action: 'Synthesized final research result',
      timestamp: new Date(baseTime.getTime() + 8500),
      details: { agentsCoordinated: 4, finalConfidence: 0.87 }
    }
  ];
}
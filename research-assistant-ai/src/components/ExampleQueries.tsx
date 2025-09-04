'use client';

import { Lightbulb } from 'lucide-react';

interface ExampleQueriesProps {
  onSelectQuery: (query: string) => void;
}

const EXAMPLE_QUERIES = [
  {
    title: "Multi-Agent AI Systems",
    query: "What are the latest developments in multi-agent AI systems and how do they compare to single-agent approaches in terms of performance and efficiency?",
    description: "Explore cutting-edge research from Anthropic, OpenAI, and Google DeepMind"
  },
  {
    title: "Quantum Computing Impact",
    query: "How will quantum computing affect cybersecurity, and what are the current developments in quantum-resistant cryptography?",
    description: "Analyze the intersection of quantum computing and information security"
  },
  {
    title: "Climate Tech Solutions", 
    query: "What are the most promising carbon capture technologies and their economic viability for large-scale deployment?",
    description: "Research environmental technology and policy implications"
  },
  {
    title: "Future of Work",
    query: "How is AI automation changing the job market, and what new roles are emerging in the AI economy?",
    description: "Examine workforce transformation and emerging opportunities"
  }
];

export default function ExampleQueries({ onSelectQuery }: ExampleQueriesProps) {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Try these example queries
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXAMPLE_QUERIES.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelectQuery(example.query)}
            className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {example.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {example.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              "{example.query.length > 100 ? example.query.substring(0, 100) + '...' : example.query}"
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
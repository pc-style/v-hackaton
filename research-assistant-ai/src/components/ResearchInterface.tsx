'use client';

import { useState } from 'react';
import { Search, Brain, Users, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { ResearchQuery, ResearchResult, AgentLog } from '@/types';
import ExampleQueries from './ExampleQueries';
import AgentVisualization from './AgentVisualization';
import Footer from './Footer';

interface ResearchInterfaceProps {
  onSearch: (query: string) => Promise<{ query: ResearchQuery; result: ResearchResult }>;
}

export default function ResearchInterface({ onSearch }: ResearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ query: ResearchQuery; result: ResearchResult } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await onSearch(query);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Research Assistant AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Multi-agent AI research system that coordinates specialized agents to provide 
            comprehensive, well-researched answers to complex queries.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a complex research question... (e.g., 'What are the latest developments in quantum computing and their potential impact on cybersecurity?')"
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Research
                </>
              )}
            </button>
          </div>
        </form>

        {/* Example Queries */}
        {!isLoading && !result && (
          <ExampleQueries onSelectQuery={setQuery} />
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto mb-8 space-y-6">
            <AgentVisualization agents={[
              { id: 'orch', type: 'orchestrator', name: 'Orchestrator', status: 'working' },
              { id: 'search', type: 'searcher', name: 'Searcher', status: 'working' },
              { id: 'summ', type: 'summarizer', name: 'Summarizer', status: 'working' },
              { id: 'anal', type: 'analyzer', name: 'Analyzer', status: 'working' },
              { id: 'crit', type: 'critic', name: 'Critic', status: 'working' },
              { id: 'synth', type: 'synthesizer', name: 'Synthesizer', status: 'working' },
            ]} />
            <AgentProgress />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="max-w-6xl mx-auto">
            <ResearchResults query={result.query} result={result.result} />
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

function AgentProgress() {
  const agents = [
    { name: 'Lead Orchestrator', status: 'Planning research strategy...', icon: Brain },
    { name: 'Information Searcher', status: 'Gathering sources...', icon: Search },
    { name: 'Content Summarizer', status: 'Processing information...', icon: FileText },
    { name: 'Data Analyzer', status: 'Analyzing patterns...', icon: Users },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Multi-Agent Research in Progress
      </h3>
      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div key={agent.name} className="flex items-center gap-3">
            <agent.icon className="w-5 h-5 text-indigo-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span>
                <Loader className="w-4 h-4 animate-spin text-indigo-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{agent.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ResearchResultsProps {
  query: ResearchQuery;
  result: ResearchResult;
}

function ResearchResults({ query, result }: ResearchResultsProps) {
  return (
    <div className="space-y-6">
      {/* Query Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research Complete</h2>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {Math.round(result.confidence * 100)}% Confidence
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Query:</strong> {query.query}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completed by {query.tasks.length} specialized agents
        </p>
      </div>

      {/* Main Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Research Summary</h3>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Key Findings</h3>
        <ul className="space-y-3">
          {result.keyFindings.map((finding, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{finding}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sources */}
      {result.sources.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sources</h3>
          <div className="grid gap-3">
            {result.sources.map((source, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{source.title}</h4>
                    {source.url && (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm break-all"
                      >
                        {source.url}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      source.type === 'academic' ? 'bg-purple-100 text-purple-800' :
                      source.type === 'web' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {source.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(source.relevance * 100)}% relevant
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Agent Activity Log</h3>
        <div className="space-y-3">
          {result.agentLogs.map((log, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                {log.agentType.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {log.agentType}
                  </span>
                  <span className="text-sm text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{log.action}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
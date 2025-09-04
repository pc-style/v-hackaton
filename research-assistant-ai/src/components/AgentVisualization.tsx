'use client';

import { Brain, Search, FileText, BarChart3, AlertTriangle, Lightbulb } from 'lucide-react';
import { AgentType } from '@/types';

interface Agent {
  id: string;
  type: AgentType;
  name: string;
  status: 'idle' | 'working' | 'completed';
  progress?: number;
}

interface AgentVisualizationProps {
  agents: Agent[];
}

const AGENT_ICONS: Record<AgentType, any> = {
  orchestrator: Brain,
  searcher: Search,
  summarizer: FileText,
  analyzer: BarChart3,
  critic: AlertTriangle,
  synthesizer: Lightbulb,
};

const AGENT_COLORS: Record<AgentType, string> = {
  orchestrator: 'bg-purple-500',
  searcher: 'bg-blue-500',
  summarizer: 'bg-green-500',
  analyzer: 'bg-orange-500', 
  critic: 'bg-red-500',
  synthesizer: 'bg-yellow-500',
};

export default function AgentVisualization({ agents }: AgentVisualizationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
        Multi-Agent Research Team
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {agents.map((agent) => {
          const IconComponent = AGENT_ICONS[agent.type];
          const colorClass = AGENT_COLORS[agent.type];
          
          return (
            <div key={agent.id} className="flex flex-col items-center">
              <div className={`
                relative w-16 h-16 rounded-full flex items-center justify-center text-white mb-2 transition-all duration-500
                ${colorClass}
                ${agent.status === 'working' ? 'animate-pulse scale-110' : ''}
                ${agent.status === 'completed' ? 'ring-4 ring-green-300' : ''}
              `}>
                <IconComponent className="w-8 h-8" />
                
                {/* Status indicator */}
                <div className={`
                  absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                  ${agent.status === 'idle' ? 'bg-gray-400' : ''}
                  ${agent.status === 'working' ? 'bg-yellow-400 animate-pulse' : ''}
                  ${agent.status === 'completed' ? 'bg-green-400' : ''}
                `} />
              </div>
              
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                {agent.name}
              </span>
              
              <span className={`text-xs capitalize mt-1 px-2 py-1 rounded-full
                ${agent.status === 'idle' ? 'bg-gray-100 text-gray-600' : ''}
                ${agent.status === 'working' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${agent.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
              `}>
                {agent.status}
              </span>
              
              {/* Progress bar for working agents */}
              {agent.status === 'working' && agent.progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${colorClass}`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Connection lines visualization */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Agents coordinating in parallel
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}
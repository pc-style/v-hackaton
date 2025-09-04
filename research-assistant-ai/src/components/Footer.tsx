'use client';

import { Github, ExternalLink, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Project Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Research Assistant AI
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Multi-agent AI research system demonstrating collaborative intelligence 
              through specialized agent coordination.
            </p>
          </div>

          {/* Hackathon Badge */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Vercel AI Gateway Hackathon</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Building the best agent
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/your-username/research-assistant-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">Source Code</span>
            </a>
            
            <a 
              href="https://vercel.com/i/ai-gateway-hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Hackathon</span>
            </a>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Multi-Agent Architecture
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                6 specialized agents working in parallel coordination
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Powered by Vercel AI Gateway
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All AI model calls routed through Vercel infrastructure
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Open Source
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Complete codebase available under MIT license
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
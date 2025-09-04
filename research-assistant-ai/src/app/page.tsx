'use client';

import ResearchInterface from '@/components/ResearchInterface';
import { ResearchQuery, ResearchResult } from '@/types';

export default function Home() {
  const handleSearch = async (query: string): Promise<{ query: ResearchQuery; result: ResearchResult }> => {
    const response = await fetch('/api/research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to process research query');
    }

    const data = await response.json();
    return {
      query: data.query,
      result: data.result
    };
  };

  return <ResearchInterface onSearch={handleSearch} />;
}
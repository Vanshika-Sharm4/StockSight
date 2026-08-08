import { useState } from 'react';
import { askAI, getPortfolioInsights, type AIAnalysis } from '../services/aiService';
import type { Holding } from '../types/dashboard';

export function useAIQuery() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AIAnalysis | null>(null);

  const runQuery = async (prompt: string, holdings?: Holding[]) => {
    setQuery(prompt);
    setOpen(true);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await askAI(prompt, holdings);
      setResult(res);
    } catch {
      setError('StockSight AI could not process that request. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const runInsights = async (holdings: Holding[]) => {
    setQuery('Portfolio AI Insights');
    setOpen(true);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await getPortfolioInsights(holdings);
      setResult(res);
    } catch {
      setError('Could not generate insights right now. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return { open, setOpen, query, loading, error, result, runQuery, runInsights };
}

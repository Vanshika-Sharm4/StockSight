import { useState } from 'react';
import axios from 'axios';
import { askAI, getPortfolioInsights, type AIAnalysis } from '../services/aiService';
import type { Holding } from '../types/dashboard';

function describe(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    return `(${err.response?.status ?? 'no response'}${detail ? `: ${detail}` : ''})`;
  }
  return '';
}

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
    } catch (err) {
      setError(`StockSight AI could not process that request. ${describe(err)}`);
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
    } catch (err) {
      setError(`Could not generate insights right now. ${describe(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return { open, setOpen, query, loading, error, result, runQuery, runInsights };
}

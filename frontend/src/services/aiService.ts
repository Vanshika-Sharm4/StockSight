import axios from 'axios';
import type { Holding } from '../types/dashboard';

const api = axios.create({
  // In local dev, set VITE_API_URL=http://localhost:5050/api in frontend/.env.
  // In production (Docker/AWS), leave unset - nginx proxies /api to the backend container.
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export interface AIAnalysis {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  keyIndicators: string[];
  verdict: 'Buy' | 'Hold' | 'Sell';
  rationale: string;
  summary: string;
}

/**
 * Universal AI bar - freeform query, optionally scoped to the user's
 * current holdings so answers like "how risky is my portfolio" work.
 */
export async function askAI(prompt: string, holdings?: Holding[]): Promise<AIAnalysis> {
  const { data } = await api.post<AIAnalysis>('/ai/query', { prompt, holdings });
  return data;
}

/**
 * "Explore AI Insights" card - summary + risk score for the whole portfolio.
 */
export async function getPortfolioInsights(holdings: Holding[]): Promise<AIAnalysis> {
  const { data } = await api.post<AIAnalysis>('/ai/insights', { holdings });
  return data;
}
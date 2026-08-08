export interface HoldingContext {
  symbol: string;
  companyName: string;
  value: number;
  changePercent: number;
  units: number;
}

export interface AIQueryRequest {
  prompt: string;
  holdings?: HoldingContext[];
}

export interface AIInsightsRequest {
  holdings: HoldingContext[];
}

export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';
export type Verdict = 'Buy' | 'Hold' | 'Sell';

export interface AIAnalysis {
  sentiment: Sentiment;
  keyIndicators: string[];
  verdict: Verdict;
  rationale: string;
  summary: string;
}

import type { PortfolioSummary, Timeframe } from '../types/dashboard';

// NOTE: This mocks the data the mockup's dashboard widgets need
// (Total Holding, My Portfolio, Watchlist, Performance chart).
// The existing backend only exposes /api/stocks/:symbol and
// /api/stocks/:symbol/history for single-ticker lookups.
//
// To make this real, add a `GET /api/portfolio` route on the backend
// that reads a user's stored holdings + watchlist from a DB, fetches
// live quotes for each symbol via `fetchQuote` (finnhubService.ts),
// and returns this same shape. Then replace the body of
// getPortfolioSummary() below with a single axios call, e.g.:
//
//   const { data } = await api.get<PortfolioSummary>('/portfolio');
//   return data;

function genSeries(points: number, base: number, volatility: number) {
  const out = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.45) * volatility;
    out.push({ date: `P${i}`, value: Math.max(v, base * 0.5) });
  }
  return out;
}

const MOCK: PortfolioSummary = {
  totalHolding: 12304.11,
  holdings: [
    { symbol: 'AAPL', companyName: 'Apple Inc.', value: 1721.3, change: 12.31, changePercent: 0.7, units: 104 },
    { symbol: 'AMZN', companyName: 'Amazon.com', value: 1721.3, change: 12.31, changePercent: 0.7, units: 12 },
    { symbol: 'MSFT', companyName: 'Microsoft Corp.', value: 1721.3, change: 12.31, changePercent: 0.7, units: 41 },
    { symbol: 'NVDA', companyName: 'NVIDIA Corp.', value: 1721.3, change: 12.31, changePercent: 0.7, units: 16 },
  ],
  watchlist: {
    mostViewed: [
      { symbol: 'SPOT', companyName: 'Spotify', exchange: 'NYSE', price: 11770.3, changePercent: 16.3 },
      { symbol: 'AMZN', companyName: 'Amazon', exchange: 'NYSE', price: 10280.8, changePercent: 8.13 },
      { symbol: 'MSFT', companyName: 'Microsoft', exchange: 'NYSE', price: 8510.2, changePercent: 4.89 },
      { symbol: 'NVDA', companyName: 'Nvidia', exchange: 'NYSE', price: 2110.2, changePercent: 2.15 },
    ],
    gain: [
      { symbol: 'SPOT', companyName: 'Spotify', exchange: 'NYSE', price: 11770.3, changePercent: 16.3 },
      { symbol: 'AMZN', companyName: 'Amazon', exchange: 'NYSE', price: 10280.8, changePercent: 8.13 },
    ],
    lose: [
      { symbol: 'META', companyName: 'Meta Platforms', exchange: 'NASDAQ', price: 4310.1, changePercent: -3.42 },
    ],
  },
  performance: {
    '1D': genSeries(24, 190000, 800),
    '1W': genSeries(7, 185000, 3000),
    '1M': genSeries(30, 170000, 4000),
    '6M': genSeries(26, 120000, 9000),
    '1Y': genSeries(12, 65000, 15000),
  },
};

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  // Simulated latency so Loading states can be exercised.
  await new Promise((r) => setTimeout(r, 250));
  return MOCK;
}

export function getPerformanceSeries(summary: PortfolioSummary, timeframe: Timeframe) {
  return summary.performance[timeframe];
}

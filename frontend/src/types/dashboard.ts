export interface Holding {
  symbol: string;
  companyName: string;
  value: number;
  change: number;
  changePercent: number;
  units: number;
}

export interface WatchlistItem {
  symbol: string;
  companyName: string;
  exchange: string;
  price: number;
  changePercent: number;
}

export type WatchlistTab = 'mostViewed' | 'gain' | 'lose';

export interface PerformancePoint {
  date: string;
  value: number;
}

export type Timeframe = '1D' | '1W' | '1M' | '6M' | '1Y';

export interface PortfolioSummary {
  totalHolding: number;
  holdings: Holding[];
  watchlist: Record<WatchlistTab, WatchlistItem[]>;
  performance: Record<Timeframe, PerformancePoint[]>;
}

export interface AppUser {
  name: string;
  firstName: string;
  email: string;
  avatarUrl?: string;
}

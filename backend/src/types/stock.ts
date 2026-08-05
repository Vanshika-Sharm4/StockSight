export interface Stock {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface StockHistoryPoint {
  date: string;
  close: number;
}

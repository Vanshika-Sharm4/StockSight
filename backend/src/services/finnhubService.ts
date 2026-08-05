import axios from 'axios';
import type { Stock, StockHistoryPoint } from '../types/stock';

const BASE_URL = 'https://finnhub.io/api/v1';

function getApiKey() {
  return process.env.FINNHUB_API_KEY;
}

export async function fetchQuote(symbol: string): Promise<Stock> {
  const [quoteRes, profileRes] = await Promise.all([
    axios.get(`${BASE_URL}/quote`, { params: { symbol, token: getApiKey() } }),
    axios.get(`${BASE_URL}/stock/profile2`, { params: { symbol, token: getApiKey() } }),
  ]);

  const quote = quoteRes.data;
  const profile = profileRes.data;

  if (!quote || quote.c === 0) {
    throw new Error('Invalid symbol or no data available');
  }

  return {
    symbol: symbol.toUpperCase(),
    companyName: profile.name || symbol.toUpperCase(),
    price: quote.c,
    change: quote.d,
    changePercent: quote.dp,
  };
}

export async function fetchHistory(symbol: string): Promise<StockHistoryPoint[]> {
  const res = await axios.get('https://www.alphavantage.co/query', {
    params: {
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize: 'compact',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  const series = res.data['Time Series (Daily)'];

  if (!series) {
    throw new Error('No historical data available');
  }

  return Object.entries(series)
    .slice(0, 30)
    .reverse()
    .map(([date, values]: [string, any]) => ({
      date,
      close: parseFloat(values['4. close']),
    }));
}

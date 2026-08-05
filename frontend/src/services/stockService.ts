import axios from 'axios';
import type { Stock, StockHistoryPoint } from '../types/stock';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export async function getStockQuote(symbol: string): Promise<Stock> {
  const { data } = await api.get(`/stocks/${symbol}`);
  return data;
}

export async function getStockHistory(symbol: string): Promise<StockHistoryPoint[]> {
  const { data } = await api.get(`/stocks/${symbol}/history`);
  return data;
}
import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import StockCard from '../../components/StockCard';
import StockChart from '../../components/StockChart';
import Loading from '../../components/Loading';
import { getStockQuote, getStockHistory } from '../../services/stockService';
import type { Stock as StockType, StockHistoryPoint } from '../../types/stock';

function Stock() {
  const [stock, setStock] = useState<StockType | null>(null);
  const [history, setHistory] = useState<StockHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (symbol: string) => {
    setLoading(true);
    setError('');
    try {
      const [quote, hist] = await Promise.all([
        getStockQuote(symbol),
        getStockHistory(symbol),
      ]);
      setStock(quote);
      setHistory(hist);
    } catch {
      setError('Could not fetch that ticker. Try another symbol.');
      setStock(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center py-4">
      <SearchBar onSearch={handleSearch} />
      {loading && <Loading />}
      {error && <p className="text-negative">{error}</p>}
      {stock && !loading && (
        <div className="w-full flex flex-col gap-6">
          <StockCard {...stock} />
          <StockChart data={history} />
        </div>
      )}
    </div>
  );
}

export default Stock;

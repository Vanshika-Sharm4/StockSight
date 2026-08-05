import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import StockCard from '../../components/StockCard';
import StockChart from '../../components/StockChart';
import Loading from '../../components/Loading';
import { getStockQuote, getStockHistory } from '../../services/stockService';
import type { Stock, StockHistoryPoint } from '../../types/stock';

function Home() {
  const [stock, setStock] = useState<Stock | null>(null);
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
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6 items-center">
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

export default Home;
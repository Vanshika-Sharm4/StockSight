import type { Stock } from '../../types/stock';

function StockCard({ symbol, companyName, price, change, changePercent }: Stock) {
  const positive = change >= 0;

  return (
    <div className="glass rounded-xl p-5 hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-bold">{symbol}</div>
          <div className="text-sm text-text-dim">{companyName}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">${price.toFixed(2)}</div>
          <div className={positive ? 'text-positive' : 'text-negative'}>
            {positive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockCard;

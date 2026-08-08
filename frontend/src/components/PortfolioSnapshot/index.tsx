import { Link } from 'react-router-dom';
import type { Holding } from '../../types/dashboard';

function PortfolioSnapshot({ holdings }: { holdings: Holding[] }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">My Portfolio</span>
        <Link to="/portfolio" className="text-xs text-text-dim hover:text-accent flex items-center gap-1">
          See all ↗
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {holdings.map((h) => (
          <Link
            key={h.symbol}
            to={`/stock/${h.symbol}`}
            className="glass glass-hover rounded-xl p-3 flex flex-col gap-1"
          >
            <div className="text-sm font-semibold">
              ${h.value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </div>
            <div className={`text-xs ${h.change >= 0 ? 'text-positive' : 'text-negative'}`}>
              {h.change >= 0 ? '+' : ''}
              {h.change.toFixed(2)} ({h.changePercent.toFixed(1)}%)
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-text-dim">{h.symbol}</span>
              <span className="text-xs text-text-dim">
                Units <span className="text-text font-medium">{h.units}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PortfolioSnapshot;

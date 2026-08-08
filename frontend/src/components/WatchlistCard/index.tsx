import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PortfolioSummary, WatchlistTab } from '../../types/dashboard';

const TABS: { key: WatchlistTab; label: string }[] = [
  { key: 'mostViewed', label: 'Most Viewed' },
  { key: 'gain', label: 'Gain' },
  { key: 'lose', label: 'Lose' },
];

function WatchlistCard({ summary }: { summary: PortfolioSummary }) {
  const [tab, setTab] = useState<WatchlistTab>('mostViewed');
  const items = summary.watchlist[tab];

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Watchlist</span>
        <Link to="/market" className="text-xs text-text-dim hover:text-accent flex items-center gap-1">
          See all ↗
        </Link>
      </div>

      <div className="flex gap-1 bg-surface-hover rounded-full p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              tab === key ? 'bg-gradient-accent text-white' : 'text-text-dim hover:text-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="flex flex-col divide-y divide-surface-border">
        {items.map((item) => (
          <li key={item.symbol} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-surface-hover flex items-center justify-center text-xs font-semibold">
                {item.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-medium">{item.companyName}</div>
                <div className="text-xs text-text-dim">
                  {item.exchange} {item.symbol}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                ${item.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </div>
              <div className={`text-xs ${item.changePercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                {item.changePercent >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WatchlistCard;

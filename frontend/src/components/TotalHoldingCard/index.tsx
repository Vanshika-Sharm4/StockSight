import { useState } from 'react';

interface TotalHoldingCardProps {
  total: number;
}

const RANGES = ['1M', '6M', '1Y'];

function TotalHoldingCard({ total }: TotalHoldingCardProps) {
  const [range, setRange] = useState('6M');

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-dim">Total Holding</span>
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="appearance-none bg-surface-hover text-xs rounded-full pl-3 pr-6 py-1.5 outline-none cursor-pointer"
          >
            {RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-3xl font-semibold tracking-tight">
        $ {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}

export default TotalHoldingCard;

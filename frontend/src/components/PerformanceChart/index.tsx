import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { PortfolioSummary, Timeframe } from '../../types/dashboard';

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '6M', '1Y'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <div className="text-text-dim mb-0.5">{label}</div>
      <div className="font-semibold text-text">
        ${Number(payload[0].value).toLocaleString('en-US', { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
}

function PerformanceChart({ summary }: { summary: PortfolioSummary }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const data = summary.performance[timeframe];

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Portfolio Performance</span>
        <div className="flex gap-1 bg-surface-hover rounded-full p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                timeframe === tf ? 'bg-gradient-accent text-white' : 'text-text-dim hover:text-text'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#2a2a38" strokeDasharray="3 6" />
            <XAxis dataKey="date" stroke="#8b8b9e" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#8b8b9e"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#a855f7"
              strokeWidth={2.5}
              fill="url(#performanceFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceChart;

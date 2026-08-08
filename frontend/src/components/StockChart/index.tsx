import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { StockHistoryPoint } from '../../types/stock';

function StockChart({ data }: { data: StockHistoryPoint[] }) {
  return (
    <div className="glass rounded-xl p-5 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#8b8b9e" fontSize={12} />
          <YAxis stroke="#8b8b9e" fontSize={12} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a38', borderRadius: 8 }} />
          <Line type="monotone" dataKey="close" stroke="#a855f7" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;

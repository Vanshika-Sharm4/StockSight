import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { StockHistoryPoint } from '../../types/stock';

function StockChart({ data }: { data: StockHistoryPoint[] }) {
  return (
    <div className="glass rounded-xl p-5 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#8b93a7" fontSize={12} />
          <YAxis stroke="#8b93a7" fontSize={12} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ background: '#0a0e14', border: '1px solid rgba(255,255,255,0.1)' }} />
          <Line type="monotone" dataKey="close" stroke="#aa3bff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;

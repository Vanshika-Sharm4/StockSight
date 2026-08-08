import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getPortfolioSummary } from '../../services/portfolioService';
import type { PortfolioSummary } from '../../types/dashboard';
import TotalHoldingCard from '../../components/TotalHoldingCard';
import AIInsightsCard from '../../components/AIInsightsCard';
import WatchlistCard from '../../components/WatchlistCard';
import PortfolioSnapshot from '../../components/PortfolioSnapshot';
import PerformanceChart from '../../components/PerformanceChart';
import Loading from '../../components/Loading';
import type { useAIQuery } from '../../hooks/useAIQuery';

function Dashboard() {
  const { ai } = useOutletContext<{ ai: ReturnType<typeof useAIQuery> }>();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);

  useEffect(() => {
    getPortfolioSummary().then(setSummary);
  }, []);

  if (!summary) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-6">
          <TotalHoldingCard total={summary.totalHolding} />
          <AIInsightsCard onExplore={() => ai.runInsights(summary.holdings)} />
        </div>
        <WatchlistCard summary={summary} />
        <PortfolioSnapshot holdings={summary.holdings} />
      </div>

      <PerformanceChart summary={summary} />
    </div>
  );
}

export default Dashboard;

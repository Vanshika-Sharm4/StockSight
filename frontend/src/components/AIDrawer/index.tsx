import type { AIAnalysis } from '../../services/aiService';
import Loading from '../Loading';

interface AIDrawerProps {
  open: boolean;
  onClose: () => void;
  query: string;
  loading: boolean;
  error: string;
  result: AIAnalysis | null;
}

const SENTIMENT_STYLE: Record<string, string> = {
  Bullish: 'text-positive bg-positive-dim',
  Bearish: 'text-negative bg-negative-dim',
  Neutral: 'text-text-dim bg-surface-hover',
};

const VERDICT_STYLE: Record<string, string> = {
  Buy: 'text-positive bg-positive-dim',
  Sell: 'text-negative bg-negative-dim',
  Hold: 'text-accent bg-accent-dim',
};

function AIDrawer({ open, onClose, query, loading, error, result }: AIDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full glass rounded-l-2xl p-6 flex flex-col gap-5 overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-text-dim mb-1">StockSight AI</div>
            <div className="text-lg font-semibold">{query || 'AI Insights'}</div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-hover text-text-dim"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {loading && <Loading />}
        {error && <p className="text-negative text-sm">{error}</p>}

        {result && !loading && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${SENTIMENT_STYLE[result.sentiment]}`}>
                {result.sentiment}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${VERDICT_STYLE[result.verdict]}`}>
                {result.verdict}
              </span>
            </div>

            <p className="text-sm text-text leading-relaxed">{result.summary}</p>

            <div>
              <div className="text-xs uppercase tracking-wide text-text-dim mb-2">Key Indicators</div>
              <ul className="flex flex-col gap-2">
                {result.keyIndicators.map((indicator, i) => (
                  <li key={i} className="text-sm text-text-dim flex gap-2">
                    <span className="text-accent">•</span>
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-text-dim mb-2">AI Verdict Rationale</div>
              <p className="text-sm text-text leading-relaxed">{result.rationale}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIDrawer;

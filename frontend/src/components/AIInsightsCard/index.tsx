interface AIInsightsCardProps {
  onExplore: () => void;
}

function AIInsightsCard({ onExplore }: AIInsightsCardProps) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
      <div
        className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-40 blur-2xl bg-gradient-accent"
        aria-hidden
      />
      <div className="relative">
        <div className="text-base font-semibold mb-1">Decisions Powered by Data</div>
        <p className="text-sm text-text-dim leading-relaxed">
          Move beyond guesswork with AI-driven investment insights tailored to your strategy.
        </p>
      </div>
      <button
        onClick={onExplore}
        className="relative self-start rounded-full bg-gradient-accent text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition glow-accent"
      >
        Explore AI Insights
      </button>
    </div>
  );
}

export default AIInsightsCard;

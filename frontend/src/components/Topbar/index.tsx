import { useState } from 'react';
import type { AppUser } from '../../types/dashboard';

interface TopbarProps {
  user: AppUser;
  onAskAI: (prompt: string) => void;
}

function Topbar({ user, onAskAI }: TopbarProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onAskAI(prompt.trim());
    setPrompt('');
  };

  return (
    <header className="flex flex-col gap-4 px-6 pt-6 pb-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome<span className="text-text-dim">,</span>{' '}
          <span className="text-gradient-accent">{user.firstName}</span>
        </h1>
        <p className="text-sm text-text-dim mt-0.5">Here's your investment portfolio overview</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative h-10 w-10 rounded-full glass glass-hover flex items-center justify-center text-text-dim"
          aria-label="Notifications"
        >
          <BellIcon className="h-4.5 w-4.5" />
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <button
          className="h-10 w-10 rounded-full glass glass-hover flex items-center justify-center text-text-dim"
          aria-label="Settings"
        >
          <GearIcon className="h-4.5 w-4.5" />
        </button>
        <div className="flex items-center gap-2">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-accent flex items-center justify-center text-sm font-semibold text-white">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="hidden lg:block">
            <div className="text-sm font-medium leading-tight">{user.name}</div>
            <div className="text-xs text-text-dim leading-tight">{user.email}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full md:w-auto md:min-w-[340px] order-last md:order-none">
        <div className="glass rounded-full flex items-center gap-2 px-4 py-2.5">
          <SparkleIcon className="h-4 w-4 text-accent shrink-0" />
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask StockSight.ai anything..."
            className="bg-transparent flex-1 outline-none text-sm placeholder:text-text-dim"
          />
        </div>
      </form>
    </header>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}
function GearIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}
function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
    </svg>
  );
}

export default Topbar;

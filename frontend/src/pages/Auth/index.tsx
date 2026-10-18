import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getAuthErrorMessage } from '../../services/authService';

type Mode = 'signin' | 'signup';

const MIN_PASSWORD = 8;

function passwordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= MIN_PASSWORD) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];

function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Already signed in (or session restored) -> straight to the dashboard.
  if (!loading && user) return <Navigate to={from} replace />;

  const isSignUp = mode === 'signup';
  const strength = passwordStrength(password);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    if (isSignUp && password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) await signUp(name.trim(), email.trim(), password);
      else await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl bg-surface-hover/60 border border-surface-border px-4 py-3 text-sm text-text ' +
    'placeholder:text-text-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30';

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text">
      {/* Ambient violet glow, same accent as the dashboard */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -right-32 h-[30rem] w-[30rem] rounded-full bg-accent-2/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-2">
        {/* Brand / value panel */}
        <section className="hidden lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent text-lg font-bold text-white glow-accent">
              S
            </div>
            <span className="text-xl font-semibold tracking-tight">StockSight</span>
          </div>

          <h1 className="text-5xl font-semibold leading-tight tracking-tight">
            Invest with <span className="text-gradient-accent">clarity</span>,
            <br />
            not guesswork.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-dim">
            Track your portfolio, watch the market in real time, and get AI-driven insights tailored to your holdings.
          </p>

          {/* Decorative sample card */}
          <div className="glass mt-10 max-w-md rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-text-faint">Sample portfolio</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">$12,304.11</div>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-positive-dim px-3 py-1 text-xs font-medium text-positive">+4.2%</span>
                <span className="rounded-full bg-accent-dim px-3 py-1 text-xs font-medium text-accent">AI: Bullish</span>
              </div>
            </div>
            <svg viewBox="0 0 400 110" className="mt-4 h-24 w-full" role="img" aria-label="Sample performance chart">
              <defs>
                <linearGradient id="authSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 85 C40 80 60 50 100 58 S160 90 200 62 S270 20 310 34 S370 44 400 14 L400 110 L0 110 Z"
                fill="url(#authSpark)"
              />
              <path
                d="M0 85 C40 80 60 50 100 58 S160 90 200 62 S270 20 310 34 S370 44 400 14"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <ul className="mt-8 flex flex-col gap-3 text-sm text-text-dim">
            {['Live quotes and interactive price history', 'Ask StockSight.ai anything about the market', 'Sentiment and Buy / Hold / Sell analysis'].map(
              (item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-dim text-accent">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ),
            )}
          </ul>
        </section>

        {/* Form card */}
        <section className="mx-auto w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent text-lg font-bold text-white">S</div>
            <span className="text-xl font-semibold tracking-tight">StockSight</span>
          </div>

          <div className="glass rounded-3xl p-7 sm:p-9">
            {/* Mode toggle, same pill style as the Watchlist tabs */}
            <div className="mb-7 flex gap-1 rounded-full bg-surface-hover p-1" role="tablist" aria-label="Sign in or create account">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm transition-colors ${
                    mode === m ? 'bg-gradient-accent font-medium text-white' : 'text-text-dim hover:text-text'
                  }`}
                >
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
            <p className="mt-1 text-sm text-text-dim">
              {isSignUp ? 'Start tracking your portfolio in minutes.' : 'Sign in to see your portfolio overview.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-text-dim">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nadia Rachel"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-text-dim">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-text-dim">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                    minLength={isSignUp ? MIN_PASSWORD : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? `At least ${MIN_PASSWORD} characters` : 'Your password'}
                    className={`${inputClass} pr-16`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-text-dim transition-colors hover:text-text"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {isSignUp && password.length > 0 && (
                  <div className="mt-2.5" aria-live="polite">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strength >= bar ? (strength <= 1 ? 'bg-negative' : 'bg-accent') : 'bg-surface-border'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-1.5 text-xs text-text-faint">{STRENGTH_LABELS[strength]}</div>
                  </div>
                )}
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-negative/30 bg-negative-dim px-4 py-3 text-sm text-negative">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="glow-accent mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-accent py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                {submitting ? (isSignUp ? 'Creating account...' : 'Signing in...') : isSignUp ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-dim">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
                className="font-medium text-accent transition-colors hover:text-accent-2"
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-text-faint">Passwords are hashed before they are stored, never saved in plain text.</p>
        </section>
      </div>
    </div>
  );
}

export default Auth;

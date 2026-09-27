import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Cpu, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Radio, 
  Users, 
  Flame, 
  Sun, 
  Moon,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const AuthGateView: React.FC = () => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    resetPassword, 
    authError, 
    clearAuthError 
  } = useAuth();
  
  const { theme, toggleTheme } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearAuthError();
    setResetSuccess(false);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else if (mode === 'reset') {
        await resetPassword(email);
        setResetSuccess(true);
      }
    } catch {
      // Error message is set in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    clearAuthError();
    try {
      await signInWithGoogle();
    } catch {
      // Error is set in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
                AlgoMentor
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded">
                AI DSA Studio
              </span>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          id="btn-gate-theme-toggle"
          aria-label="Toggle theme"
          className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-semibold rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Hero & Auth Card Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Column (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Personalized DSA Learning & Cloud Sync</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
              Master Algorithms with an <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI Instructor</span> & Real-Time Arena.
            </h1>

            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Sign in to track your learning journey, execute code across 4 programming languages in an interactive Monaco editor, solve problems in live peer study rooms, and ace technical interviews.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-zinc-900 dark:text-white">Monaco Code Editor</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">JS, Python, C++, Java execution</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-zinc-900 dark:text-white">Daily Streak & Progress</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Cloud-synced to your account</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-zinc-900 dark:text-white">Live Study Rooms</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">WebSocket peer collaboration</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-zinc-900 dark:text-white">Mock DSA Interviews</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Timed challenges & rubrics</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card (5 Cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 sm:p-8">
              
              {/* Tab Selector */}
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl mb-6 border border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  id="tab-auth-signin"
                  onClick={() => {
                    clearAuthError();
                    setResetSuccess(false);
                    setMode('signin');
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-auth-signup"
                  onClick={() => {
                    clearAuthError();
                    setResetSuccess(false);
                    setMode('signup');
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title & Prompt */}
              <div className="mb-5">
                <h2 className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
                  {mode === 'signin' && 'Welcome Back'}
                  {mode === 'signup' && 'Start Your DSA Journey'}
                  {mode === 'reset' && 'Reset Account Password'}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {mode === 'signin' && 'Sign in to access your personal dashboard and tracked progress.'}
                  {mode === 'signup' && 'Create your account to sync practice logs and active streaks.'}
                  {mode === 'reset' && 'Enter your email to receive recovery instructions.'}
                </p>
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Reset Success Banner */}
              {resetSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Password reset email dispatched! Please check your inbox.</span>
                </div>
              )}

              {/* Google OAuth Button */}
              {mode !== 'reset' && (
                <>
                  <button
                    type="button"
                    id="btn-gate-google-signin"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-white flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center my-4">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] text-zinc-400 font-mono uppercase">
                      Or with email
                    </span>
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Name or Handle
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. AlgoExplorer"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {mode !== 'reset' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                        Password
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => {
                            clearAuthError();
                            setMode('reset');
                          }}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-gate-submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>
                        {mode === 'signin' && 'Sign In to Workspace'}
                        {mode === 'signup' && 'Create Free Account'}
                        {mode === 'reset' && 'Send Password Reset Link'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mode switch helper link */}
              <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
                {mode === 'signin' && (
                  <p>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        clearAuthError();
                        setMode('signup');
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1"
                    >
                      Sign up free
                    </button>
                  </p>
                )}
                {mode === 'signup' && (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        clearAuthError();
                        setMode('signin');
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1"
                    >
                      Sign in
                    </button>
                  </p>
                )}
                {mode === 'reset' && (
                  <p>
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        clearAuthError();
                        setMode('signin');
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1"
                    >
                      Back to Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© AlgoMentor • AI Data Structures & Algorithms Training System</p>
        <p className="font-mono text-[11px]">Powered by Gemini 2.5 & Google Firebase</p>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    authError,
    clearAuthError
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearAuthError();
    setResetSuccess(false);

    try {
      if (authModalMode === 'signin') {
        await signInWithEmail(email, password);
      } else if (authModalMode === 'signup') {
        await signUpWithEmail(email, password, displayName);
      } else if (authModalMode === 'reset') {
        await resetPassword(email);
        setResetSuccess(true);
      }
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    clearAuthError();
    try {
      await signInWithGoogle();
    } catch (err) {
      // Handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono">
                {authModalMode === 'signin' && 'Sign In to AlgoMentor'}
                {authModalMode === 'signup' && 'Create Your Free Account'}
                {authModalMode === 'reset' && 'Reset Password'}
              </h2>
              <p className="text-xs text-zinc-400">
                {authModalMode === 'signin' && 'Sync your solved problems and learning streak'}
                {authModalMode === 'signup' && 'Get cloud persistence across all devices'}
                {authModalMode === 'reset' && 'Enter your email to receive recovery instructions'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              clearAuthError();
              setIsAuthModalOpen(false);
            }}
            id="btn-close-auth-modal"
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Error Banner */}
          {authError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Reset Success Banner */}
          {resetSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Password reset email dispatched! Please check your inbox.</span>
            </div>
          )}

          {/* Google OAuth Button */}
          {authModalMode !== 'reset' && (
            <>
              <button
                type="button"
                id="btn-google-auth"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-700 text-xs font-semibold text-white flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
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
                <div className="w-full border-t border-zinc-800" />
                <span className="bg-zinc-900 px-3 text-[11px] text-zinc-500 font-mono uppercase">
                  Or with email
                </span>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Display Name / Handle
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. AlgoMaster"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {authModalMode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-zinc-400">
                    Password
                  </label>
                  {authModalMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        clearAuthError();
                        setAuthModalMode('reset');
                      }}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 border border-indigo-500/40"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {authModalMode === 'signin' && 'Sign In'}
                    {authModalMode === 'signup' && 'Create Account'}
                    {authModalMode === 'reset' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch mode footer */}
          <div className="pt-3 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            {authModalMode === 'signin' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearAuthError();
                    setAuthModalMode('signup');
                  }}
                  className="text-indigo-400 font-bold hover:underline ml-1"
                >
                  Sign up free
                </button>
              </p>
            )}
            {authModalMode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearAuthError();
                    setAuthModalMode('signin');
                  }}
                  className="text-indigo-400 font-bold hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
            {authModalMode === 'reset' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearAuthError();
                    setAuthModalMode('signin');
                  }}
                  className="text-indigo-400 font-bold hover:underline ml-1"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

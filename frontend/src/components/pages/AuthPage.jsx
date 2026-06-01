import { useState } from 'react';

export default function AuthPage({
  mode,
  onModeChange,
  onLogin,
  onRegister,
  loginForm,
  registerForm,
  onUpdateLogin,
  onUpdateRegister,
  loading,
  error,
  theme,
  onToggleTheme,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-8">
      <section className="glass-card grid w-full overflow-hidden rounded-3xl md:grid-cols-2">
        <div className="bg-white/5 p-8 sm:p-12">
          <p className="font-display text-sm uppercase tracking-[0.28em] text-[var(--muted)]">LeetChallenger</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Competitive LeetCode challenges, fully synced.
          </h1>
          <p className="mt-6 max-w-md text-[var(--muted)]">
            Sign in to track stats, compare profiles, and challenge your friends. Everything is secured behind your login.
          </p>
          <button
            type="button"
            className="mt-8 rounded-full border border-[var(--border)] bg-white/10 px-5 py-2 text-sm font-medium text-white"
            onClick={onToggleTheme}
          >
            Theme: {theme}
          </button>
        </div>
        <div className="p-8 sm:p-12">
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-1 text-sm">
            <button
              type="button"
              onClick={() => onModeChange('login')}
              className={`rounded-full px-4 py-2 ${mode === 'login' ? 'bg-white/20 text-white' : 'text-[var(--muted)]'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => onModeChange('register')}
              className={`rounded-full px-4 py-2 ${mode === 'register' ? 'bg-white/20 text-white' : 'text-[var(--muted)]'}`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form className="space-y-4" onSubmit={onLogin}>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm outline-none"
                placeholder="Email or username"
                value={loginForm.emailOrUsername}
                onChange={(event) => onUpdateLogin('emailOrUsername', event.target.value)}
              />
              <div className="space-y-2">
                <input
                  className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm outline-none"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(event) => onUpdateLogin('password', event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs text-[var(--muted)]"
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
              <button
                disabled={loading}
                className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={onRegister}>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm outline-none"
                placeholder="Full name"
                value={registerForm.name}
                onChange={(event) => onUpdateRegister('name', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm outline-none"
                placeholder="App username"
                value={registerForm.username}
                onChange={(event) => onUpdateRegister('username', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm outline-none"
                placeholder="Email"
                value={registerForm.email}
                onChange={(event) => onUpdateRegister('email', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm outline-none"
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(event) => onUpdateRegister('password', event.target.value)}
              />
              <button
                disabled={loading}
                className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}

          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        </div>
      </section>
    </main>
  );
}

"use client";

import { FormEvent, useState } from "react";

export function RegisterForm() {
  const [player, setPlayer] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player, password }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        email?: string;
        error?: string;
      };

      if (data.success) {
        setSuccess(
          (data.message ?? "Registered") +
            (data.email ? ` — ${data.email}` : "")
        );
        setPlayer("");
        setPassword("");
        return;
      }

      setError(data.error ?? "Registration failed");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="login-bg-glow login-bg-glow-1" aria-hidden />
      <div className="login-bg-glow login-bg-glow-2" aria-hidden />
      <div className="login-bg-pattern" aria-hidden />

      <div className="relative z-10 w-full max-w-md">
        <div className="login-card rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="login-logo mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="login-logo-iq">iq</span>
              <span className="login-logo-rest">poker</span>
              <span className="login-logo-num">88</span>
            </div>
            <p className="text-sm tracking-[0.25em] text-emerald-200/70 uppercase">
              Premium Online Poker
            </p>
          </div>

          {error && (
            <div
              className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200"
              role="status"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="player"
                className="mb-1.5 block text-xs font-medium tracking-wider text-emerald-100/80 uppercase"
              >
                Login
              </label>
              <div className="login-input-wrap">
                <svg
                  className="login-input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <input
                  id="player"
                  type="text"
                  name="Player"
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Choose your login"
                  className="login-input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium tracking-wider text-emerald-100/80 uppercase"
              >
                Password
              </label>
              <div className="login-input-wrap">
                <svg
                  className="login-input-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  name="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Choose your password"
                  className="login-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-submit w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-emerald-100/30">
          &copy; {new Date().getFullYear()} iqpoker88. All rights reserved.
        </p>
      </div>
    </div>
  );
}

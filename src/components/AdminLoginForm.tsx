"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (data.success) {
        router.push("/admin");
        router.refresh();
        return;
      }

      setError(data.error ?? "Login failed");
    } catch {
      setError("Network error");
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
              Admin Panel
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-medium tracking-wider text-emerald-100/80 uppercase"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="login-input w-full rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium tracking-wider text-emerald-100/80 uppercase"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="login-input w-full rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-submit w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

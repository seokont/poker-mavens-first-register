"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Player = {
  id: string;
  player: string;
  realName: string;
  email: string;
  location: string;
  gender: string;
  createdAt: string;
  approved: boolean;
  approvedAt: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadPlayers = useCallback(async () => {
    const response = await fetch("/api/admin/players");
    if (response.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!response.ok) throw new Error("Failed to load players");

    const data = (await response.json()) as { users: Player[] };
    setPlayers(data.users);
  }, [router]);

  useEffect(() => {
    loadPlayers()
      .catch(() => setError("Failed to load players"))
      .finally(() => setLoading(false));
  }, [loadPlayers]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleApprove(id: string) {
    setApprovingId(id);
    setActionError(null);
    setActionSuccess(null);

    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        error?: string;
      };

      if (!data.success) {
        setActionError(data.error ?? "Approval failed");
        return;
      }

      setActionSuccess(data.message ?? "Player approved");
      await loadPlayers();
    } catch {
      setActionError("Network error");
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <div className="login-page admin-page relative min-h-screen w-full max-w-[100vw] overflow-x-hidden px-3 py-6 sm:px-6 sm:py-8">
      <div className="admin-bg-layer" aria-hidden>
        <div className="login-bg-glow login-bg-glow-1" />
        <div className="login-bg-glow login-bg-glow-2" />
        <div className="login-bg-pattern" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="login-logo text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="login-logo-iq">iq</span>
              <span className="login-logo-rest">poker</span>
              <span className="login-logo-num">88</span>
            </div>
            <p className="mt-1 text-sm text-emerald-200/60">Admin — New Players</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-lg border border-white/20 px-4 py-2 text-sm text-emerald-100/80 transition-colors hover:bg-white/10"
          >
            Logout
          </button>
        </header>

        {actionError && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {actionError}
          </div>
        )}

        {actionSuccess && (
          <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {actionSuccess}
          </div>
        )}

        <div className="login-card w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          {loading && (
            <p className="p-8 text-center text-emerald-100/60">Loading...</p>
          )}

          {error && (
            <p className="p-8 text-center text-red-300">{error}</p>
          )}

          {!loading && !error && players.length === 0 && (
            <p className="p-8 text-center text-emerald-100/60">
              No registered players yet
            </p>
          )}

          {!loading && !error && players.length > 0 && (
            <table className="admin-table text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] tracking-wider text-emerald-200/70 uppercase sm:text-xs">
                  <th className="w-[4%] px-2 py-3 font-medium sm:px-3">#</th>
                  <th className="w-[10%] px-2 py-3 font-medium sm:px-3">Player</th>
                  <th className="w-[10%] px-2 py-3 font-medium sm:px-3">Name</th>
                  <th className="w-[18%] px-2 py-3 font-medium sm:px-3">Email</th>
                  <th className="w-[9%] px-2 py-3 font-medium sm:px-3">Loc.</th>
                  <th className="hidden w-[7%] px-2 py-3 font-medium sm:table-cell sm:px-3">Gender</th>
                  <th className="w-[14%] px-2 py-3 font-medium sm:px-3">Registered</th>
                  <th className="w-[10%] px-2 py-3 font-medium sm:px-3">Status</th>
                  <th className="w-[12%] px-2 py-3 font-medium sm:px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr
                    key={player.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="px-2 py-2.5 text-emerald-100/50 sm:px-3 sm:py-3">
                      {index + 1}
                    </td>
                    <td
                      className="px-2 py-2.5 font-medium text-emerald-50 sm:px-3 sm:py-3"
                      title={player.player}
                    >
                      {player.player}
                    </td>
                    <td
                      className="px-2 py-2.5 text-emerald-100/80 sm:px-3 sm:py-3"
                      title={player.realName || "—"}
                    >
                      {player.realName || "—"}
                    </td>
                    <td
                      className="px-2 py-2.5 text-amber-200/80 sm:px-3 sm:py-3"
                      title={player.email}
                    >
                      {player.email}
                    </td>
                    <td
                      className="px-2 py-2.5 text-emerald-100/80 sm:px-3 sm:py-3"
                      title={player.location || "—"}
                    >
                      {player.location || "—"}
                    </td>
                    <td className="hidden px-2 py-2.5 text-emerald-100/80 sm:table-cell sm:px-3 sm:py-3">
                      {player.gender}
                    </td>
                    <td
                      className="px-2 py-2.5 whitespace-nowrap text-emerald-100/60 sm:px-3 sm:py-3"
                      title={formatDate(player.createdAt)}
                    >
                      {formatDate(player.createdAt)}
                    </td>
                    <td className="px-2 py-2.5 sm:px-3 sm:py-3">
                      {player.approved ? (
                        <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 sm:text-xs">
                          OK
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 sm:text-xs">
                          Wait
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2.5 sm:px-3 sm:py-3">
                      {player.approved ? (
                        <span className="text-xs text-emerald-100/40">—</span>
                      ) : (
                        <button
                          onClick={() => handleApprove(player.id)}
                          disabled={approvingId === player.id}
                          className="login-submit w-full rounded-lg px-2 py-1 text-[10px] font-semibold uppercase disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-xs"
                        >
                          {approvingId === player.id ? "..." : "Approve"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && players.length > 0 && (
            <div className="border-t border-white/10 px-3 py-2.5 text-xs text-emerald-100/40 sm:px-5 sm:py-3">
              Total: {players.length} · Pending:{" "}
              {players.filter((p) => !p.approved).length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

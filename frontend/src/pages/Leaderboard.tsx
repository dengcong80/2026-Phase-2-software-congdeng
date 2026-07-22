import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestStore, refreshLeaderboard } from '../stores/useQuestStore';

export function Leaderboard() {
  const { leaderboard, onlineCount } = useQuestStore();

  useEffect(() => {
    void refreshLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbf8_0%,#ecfdf5_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-emerald-200 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <Link to="/" className="text-sm font-medium text-emerald-700">← Back to dashboard</Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Live leaderboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Top explorers</h1>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-slate-700">
            Online now: {onlineCount}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200">
          <table className="min-w-full divide-y divide-emerald-100 text-left">
            <thead className="bg-emerald-50 text-sm uppercase tracking-[0.3em] text-emerald-700">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 bg-white">
              {leaderboard.map((entry) => (
                <tr key={`${entry.username}-${entry.rank}`}>
                  <td className="px-4 py-3 font-semibold text-emerald-700">#{entry.rank}</td>
                  <td className="px-4 py-3 text-slate-900">{entry.username}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.totalXp}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.questsCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

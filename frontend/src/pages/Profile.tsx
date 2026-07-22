import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

export function Profile() {
  const { username, totalXp, role } = useUserStore();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
        <Link to="/" className="text-sm font-medium text-cyan-400">← Back to dashboard</Link>
        <h1 className="mt-4 text-3xl font-semibold text-white">Profile</h1>
        <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-800/60 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Username</p>
            <p className="mt-2 text-xl font-semibold text-white">{username ?? 'Guest'}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Role</p>
            <p className="mt-2 text-xl font-semibold text-white">{role ?? 'Standard'}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total XP</p>
            <p className="mt-2 text-xl font-semibold text-cyan-300">{totalXp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const register = useUserStore((state) => state.register);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_55%)] px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Join Auckland Quest</h1>
        <p className="mt-2 text-sm text-slate-400">Register to submit quests and earn XP.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            Username
            <input required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" />
          </label>
          <label className="block text-sm text-slate-300">
            Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Create account</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="font-medium text-cyan-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

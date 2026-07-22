import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuestStore } from '../stores/useQuestStore';

export function CreateQuestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [rewardXp, setRewardXp] = useState('50');
  const [error, setError] = useState<string | null>(null);
  const createQuest = useQuestStore((state) => state.createQuest);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createQuest({
        title,
        description,
        latitude: Number(latitude),
        longitude: Number(longitude),
        rewardXp: Number(rewardXp),
      });
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create quest.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
        <Link to="/" className="text-sm font-medium text-cyan-400">← Back to dashboard</Link>
        <h1 className="mt-4 text-3xl font-semibold text-white">Create a community quest</h1>
        <p className="mt-2 text-sm text-slate-400">Share a new challenge for the Auckland Quest community.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            Title
            <input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none" />
          </label>
          <label className="block text-sm text-slate-300">
            Description
            <textarea required rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Latitude
              <input type="number" required value={latitude} onChange={(event) => setLatitude(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            </label>
            <label className="block text-sm text-slate-300">
              Longitude
              <input type="number" required value={longitude} onChange={(event) => setLongitude(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            Reward XP
            <input type="number" required value={rewardXp} onChange={(event) => setRewardXp(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none" />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">Submit quest</button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Compass, Heart, MapPin, Sparkles, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuestCard } from '../components/QuestCard';
import { ProgressBar } from '../components/ProgressBar';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { TopNav } from '../components/TopNav';
import { QuestMap } from '../components/QuestMap';
import { useQuestStore } from '../stores/useQuestStore';
import { useUserStore } from '../stores/useUserStore';
import { BadgeIcon } from '../components/BadgeIcon';

export function Dashboard() {
  const { quests, fetchQuests, completeQuest, toggleLike, error, location, nearbyQuests, requestLocation, shares, createShare, toggleShareLike, onlineCount } = useQuestStore();
  const { username, totalXp, logout, isAuthenticated } = useUserStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    void fetchQuests();
    void requestLocation().catch(() => undefined);
  }, [fetchQuests, requestLocation]);

  useEffect(() => {
    if (!selectedQuestId && nearbyQuests.length > 0) {
      setSelectedQuestId(nearbyQuests[0].id);
    }
  }, [nearbyQuests, selectedQuestId]);

  const quickStats = useMemo(() => {
    const completed = quests.filter((quest) => quest.completedByMe).length;
    return {
      completed,
      total: quests.length,
      xpGoal: Math.max(100, totalXp + 100),
    };
  }, [quests, totalXp]);

  async function handleComplete(id: string) {
    try {
      const result = await completeQuest(id);
      setStatusMessage(`Check-in complete. You earned ${result.earnedXp} XP and unlocked ${result.newBadges.length > 0 ? result.newBadges.join(', ') : 'a fresh badge'}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not check in.');
    }
  }

  async function handleLike(id: string) {
    try {
      await toggleLike(id);
      setStatusMessage('The community feels this one too.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not like quest.');
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleShare(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedQuestId) return;
    const quest = quests.find((item) => item.id === selectedQuestId) ?? nearbyQuests.find((item) => item.id === selectedQuestId);
    if (!quest) return;
    createShare({ questId: quest.id, questTitle: quest.title, note: reflection || 'A beautiful moment on the trail.', imagePreview });
    setReflection('');
    setImagePreview(undefined);
    setStatusMessage('Your check-in is now live for the community.');
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.15),_transparent_45%),linear-gradient(135deg,#f8fbf8_0%,#ecfdf5_100%)] text-slate-800">
      <TopNav />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[32px] border border-emerald-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Auckland Quest</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Find your next kiwi adventure</h1>
            <p className="mt-2 text-sm text-slate-600">{username ? `Welcome back, ${username}.` : 'Log in to start your quest journey.'}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <button onClick={logout} className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-slate-700">Log out</button>
            ) : (
              <Link to="/login" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Log in</Link>
            )}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-emerald-200 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Live nearby</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{nearbyQuests.length > 0 ? '3 quests near you' : 'Discover quests near your current location'}</h2>
                <p className="mt-2 text-sm text-slate-600">{location ? `Your position: ${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}.` : 'Allow browser location access to unlock nearby recommendations.'}</p>
              </div>
              <button onClick={() => void requestLocation().catch(() => undefined)} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">Use my location</button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-emerald-100 bg-emerald-50/50 p-2">
              <QuestMap quests={quests} center={location ? [location.lat, location.lng] : [-36.8485, 174.7633]} onSelectQuest={(id) => setSelectedQuestId(id)} />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {nearbyQuests.slice(0, 3).map((quest) => (
                <Link key={quest.id} to={`/quests/${quest.id}`} className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 transition hover:border-emerald-300 hover:bg-emerald-100/70">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><Compass size={16} /> Nearby</div>
                  <p className="mt-3 font-semibold text-slate-900">{quest.title}</p>
                  <p className="mt-1 text-sm text-slate-600">+{quest.rewardXp} XP</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-200 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Your progress</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{totalXp} XP earned</h2>
              </div>
              <Link to="/create" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Create quest</Link>
            </div>
            <div className="mt-6 space-y-4">
              <ProgressBar value={quickStats.completed} max={Math.max(1, quickStats.total)} label="Quests completed" />
              <ProgressBar value={totalXp} max={quickStats.xpGoal} label="XP to next milestone" />
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-slate-700">
              <Sparkles size={18} className="text-emerald-600" />
              <span>{onlineCount} explorers online right now</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-emerald-200 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Community check-ins</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Share your trail story</h2>
              </div>
              <Link to="/leaderboard" className="text-sm font-medium text-emerald-700">View leaderboard</Link>
            </div>
            {statusMessage && <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-slate-700">{statusMessage}</p>}
            {error && <p className="mb-4 text-sm text-rose-500">{error}</p>}

            <form onSubmit={handleShare} className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <label className="block text-sm font-medium text-slate-700">
                Choose a nearby quest
                <select value={selectedQuestId ?? ''} onChange={(event) => setSelectedQuestId(event.target.value)} className="mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-slate-800 outline-none">
                  {nearbyQuests.map((quest) => <option key={quest.id} value={quest.id}>{quest.title}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Share a photo & note
                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2 block w-full text-sm text-slate-600" />
              </label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="h-32 w-full rounded-2xl object-cover" />}
              <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} rows={3} placeholder="Write one sentence about your experience..." className="w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-slate-800 outline-none" />
              <button type="submit" className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><UploadCloud size={16} /> Post check-in</button>
            </form>

            <div className="mt-6 space-y-3">
              {shares.map((share) => (
                <div key={share.id} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{share.questTitle}</p>
                      <p className="text-sm text-slate-600">{share.username} • {new Date(share.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => void toggleShareLike(share.id)} className="flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700">
                      <Heart size={16} /> {share.likes}
                    </button>
                  </div>
                  {share.imagePreview && <img src={share.imagePreview} alt={share.note} className="mt-3 h-36 w-full rounded-2xl object-cover" />}
                  <p className="mt-3 text-sm text-slate-700">{share.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-200 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Your trail board</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recommended quests</h2>
              </div>
              <Link to="/profile" className="text-sm font-medium text-emerald-700">View profile</Link>
            </div>
            <div className="mt-6 space-y-3">
              {quests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} onLike={handleLike} />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-emerald-200 bg-white/85 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Badges & milestones</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Celebrate your journey</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"><MapPin size={16} /> Live trail updates</div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <BadgeIcon label="Explorer" />
            <BadgeIcon label="Community Starter" />
            <BadgeIcon label="Trail Storyteller" />
          </div>
        </section>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Compass, Heart, MapPin, Sparkles, Trophy, Users, Award, CheckCircle2, X, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { QuestMap } from '../components/QuestMap';
import { ProgressBar } from '../components/ProgressBar';
import { useQuestStore } from '../stores/useQuestStore';
import { useUserStore } from '../stores/useUserStore';
import { useTaskListStore } from '../stores/useTaskListStore';

export function Home() {
  const { 
    quests, 
    fetchQuests, 
    completeQuest, 
    toggleLike, 
    location, 
    nearbyQuests, 
    requestLocation,
    shares,
    leaderboard,
    onlineCount 
  } = useQuestStore();
  
  const { username, totalXp } = useUserStore();
  const { tasks, removeTask } = useTaskListStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetchQuests();
    void requestLocation().catch(() => undefined);
  }, [fetchQuests, requestLocation]);

  // Compute user level and XP progress
  const userLevel = useMemo(() => {
    return Math.floor(totalXp / 100) + 1;
  }, [totalXp]);

  const xpProgress = useMemo(() => {
    const currentLevelXp = totalXp % 100;
    return { current: currentLevelXp, target: 100 };
  }, [totalXp]);

  // Get today's featured quest (first nearby quest)
  const todayQuest = nearbyQuests[0] || quests[0];

  async function handleComplete(id: string) {
    try {
      const result = await completeQuest(id);
      setStatusMessage(`Quest completed! +${result.earnedXp} XP earned`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not complete quest.');
    }
  }

  async function handleLike(id: string) {
    try {
      await toggleLike(id);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not like quest.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <TopNav />
      
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Greeting Section */}
        <header className="mb-6 rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {username || 'Explorer'}! 🌟
              </h1>
              <p className="mt-2 text-slate-600">
                Level {userLevel} • {totalXp} XP • {onlineCount} explorers online
              </p>
            </div>
            
            {/* Current Level & XP Progress */}
            <div className="min-w-[240px]">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>Level {userLevel}</span>
                <span>Level {userLevel + 1}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${(xpProgress.current / xpProgress.target) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-center text-xs text-slate-600">
                {xpProgress.current} / {xpProgress.target} XP
              </p>
            </div>
          </div>
        </header>

        {/* My Task List - Below Header */}
        {tasks.length > 0 && (
          <section className="mb-6 rounded-3xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <ListTodo className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">My Task List</h2>
              <span className="ml-2 rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">
                {tasks.length}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {task.category.toUpperCase()}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          task.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-700'
                            : task.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {task.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-2">{task.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        removeTask(task.id);
                        setStatusMessage('Task removed from list');
                        setTimeout(() => setStatusMessage(null), 2000);
                      }}
                      className="rounded-full p-1.5 text-slate-400 transition hover:bg-red-100 hover:text-red-600"
                      title="Remove from task list"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin size={14} />
                      {location && (
                        <>
                          {Math.sqrt(
                            Math.pow(task.latitude - location.lat, 2) + 
                            Math.pow(task.longitude - location.lng, 2)
                          ).toFixed(1)} km
                        </>
                      )}
                    </span>
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-bold text-purple-700">
                      +{task.rewardXp} XP
                    </span>
                  </div>

                  <Link
                    to={`/quests/${task.id}`}
                    className="block rounded-xl bg-blue-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {statusMessage && (
          <div className="mb-6 rounded-2xl bg-emerald-100 border border-emerald-300 px-4 py-3 text-emerald-800">
            {statusMessage}
          </div>
        )}

        {/* ⭐⭐⭐⭐⭐ Today's Mission - Highest Priority */}
        {todayQuest && (
          <section className="mb-6 rounded-3xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="text-amber-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">Today's Mission</h2>
              <div className="ml-auto rounded-full bg-amber-500 px-4 py-1 text-sm font-bold text-white">
                +{todayQuest.rewardXp} XP
              </div>
            </div>
            
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{todayQuest.title}</h3>
                <p className="mt-2 text-slate-700">{todayQuest.description}</p>
                
                <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {todayQuest.latitude.toFixed(3)}, {todayQuest.longitude.toFixed(3)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={16} />
                    {todayQuest.likesCount} likes
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link 
                    to={`/quests/${todayQuest.id}`}
                    className="rounded-full bg-amber-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-amber-700"
                  >
                    View Details
                  </Link>
                  {!todayQuest.completedByMe && (
                    <button
                      onClick={() => handleComplete(todayQuest.id)}
                      className="flex items-center gap-2 rounded-full border-2 border-amber-600 bg-white px-6 py-3 font-semibold text-amber-700 transition hover:bg-amber-50"
                    >
                      <CheckCircle2 size={18} />
                      Complete
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/60 p-2">
                <QuestMap 
                  quests={[todayQuest]} 
                  center={[todayQuest.latitude, todayQuest.longitude]}
                  userLocation={location ? [location.lat, location.lng] : null}
                />
              </div>
            </div>
          </section>
        )}

        {/* ⭐⭐⭐⭐ Nearby Quests */}
        <section className="mb-6 rounded-3xl border border-emerald-300 bg-white/90 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="text-emerald-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">Nearby Quests</h2>
            </div>
            <button
              onClick={() => void requestLocation()}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Refresh Location
            </button>
          </div>

          <p className="mb-4 text-sm text-slate-600">
            {location 
              ? `Your position: ${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}`
              : 'Enable location to see nearby quests'
            }
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {nearbyQuests.slice(0, 3).map((quest) => (
              <Link
                key={quest.id}
                to={`/quests/${quest.id}`}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Nearby
                  </span>
                  <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
                    +{quest.rewardXp} XP
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900">{quest.title}</h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{quest.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ⭐⭐⭐⭐ Map - Full Interactive Map */}
        <section className="mb-6 rounded-3xl border border-teal-300 bg-white/90 p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="text-teal-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-900">Quest Map</h2>
          </div>
          
          <div className="overflow-hidden rounded-2xl border-2 border-teal-200">
            <QuestMap 
              quests={quests} 
              center={location ? [location.lat, location.lng] : [-36.8485, 174.7633]}
              userLocation={location ? [location.lat, location.lng] : null}
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ⭐⭐⭐ XP & Progress */}
          <section className="rounded-3xl border border-cyan-300 bg-white/90 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <Award className="text-cyan-600" size={24} />
              <h2 className="text-xl font-bold text-slate-900">Your Progress</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
                <p className="text-sm font-medium text-slate-600">Total XP</p>
                <p className="text-3xl font-bold text-cyan-700">{totalXp}</p>
              </div>

              <ProgressBar 
                value={quests.filter(q => q.completedByMe).length}
                max={Math.max(1, quests.length)}
                label="Quests Completed"
              />

              <div className="rounded-2xl bg-cyan-50 p-4">
                <p className="text-sm font-medium text-slate-700">Recent Badges</p>
                <div className="mt-2 flex gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-200 text-2xl">
                    🏆
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-200 text-2xl">
                    ⭐
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-200 text-2xl">
                    🎯
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ⭐⭐⭐ Community Feed Preview */}
          <section className="rounded-3xl border border-purple-300 bg-white/90 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-slate-900">Community</h2>
              </div>
              <Link to="/community" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {shares.slice(0, 3).map((share) => (
                <div key={share.id} className="rounded-2xl border border-purple-100 bg-purple-50/50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{share.username}</p>
                      <p className="text-sm text-slate-600">{share.questTitle}</p>
                    </div>
                    <button
                      onClick={() => handleLike(share.questId)}
                      className="flex items-center gap-1 text-sm text-purple-600"
                    >
                      <Heart size={14} />
                      {share.likes}
                    </button>
                  </div>
                  {share.imagePreview && (
                    <img 
                      src={share.imagePreview} 
                      alt={share.note}
                      className="mt-2 h-20 w-full rounded-lg object-cover"
                    />
                  )}
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2">{share.note}</p>
                </div>
              ))}
              
              {shares.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  No community posts yet. Be the first!
                </p>
              )}
            </div>
          </section>

          {/* ⭐⭐ Weekly Ranking / Leaderboard */}
          <section className="rounded-3xl border border-orange-300 bg-white/90 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="text-orange-600" size={24} />
                <h2 className="text-xl font-bold text-slate-900">Leaderboard</h2>
              </div>
              <Link to="/leaderboard" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.username}
                  className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 font-bold text-orange-800">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{entry.username}</p>
                    <p className="text-xs text-slate-600">{entry.totalXp} XP</p>
                  </div>
                  {index < 3 && (
                    <span className="text-xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                </div>
              ))}
              
              {leaderboard.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  No rankings available yet
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
          <Link
            to="/create"
            className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Create Quest
          </Link>
          <Link
            to="/explore"
            className="rounded-full border-2 border-emerald-600 bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Explore All
          </Link>
          <Link
            to="/profile"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View Profile
          </Link>
        </section>
      </div>
    </div>
  );
}

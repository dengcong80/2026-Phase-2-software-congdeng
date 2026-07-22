import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, Search, Filter, Navigation, CheckCircle2, Award, TrendingUp, Plus, Check } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { QuestMap } from '../components/QuestMap';
import { useQuestStore } from '../stores/useQuestStore';
import { useTaskListStore } from '../stores/useTaskListStore';
import { OFFICIAL_QUESTS, CATEGORY_LABELS } from '../data/officialQuests';

type SortOption = 'recommended' | 'nearest' | 'xp' | 'popular' | 'recent';

export function ExplorePage() {
  const { quests, fetchQuests, location, requestLocation } = useQuestStore();
  const { addTask, removeTask, isInTaskList } = useTaskListStore();
  
  // Filters
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [xpRange, setXpRange] = useState<string>('all');
  const [distance, setDistance] = useState<string>('all');
  const [completed, setCompleted] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  useEffect(() => {
    void fetchQuests();
    void requestLocation().catch(() => undefined);
  }, [fetchQuests, requestLocation]);

  // Calculate distance for each quest
  const questsWithDistance = useMemo(() => {
    return OFFICIAL_QUESTS.map((quest) => {
      let dist = 0;
      if (location) {
        const dx = quest.latitude - location.lat;
        const dy = quest.longitude - location.lng;
        dist = Math.sqrt(dx * dx + dy * dy) * 111; // Approximate km
      }
      return { ...quest, distance: dist };
    });
  }, [location]);

  // Filter quests
  const filteredQuests = useMemo(() => {
    let result = questsWithDistance;

    // Category filter
    if (category !== 'all') {
      result = result.filter((q) => q.category === category);
    }

    // Difficulty filter
    if (difficulty !== 'all') {
      result = result.filter((q) => q.difficulty === difficulty);
    }

    // XP Range filter
    if (xpRange === '0-50') {
      result = result.filter((q) => q.rewardXp <= 50);
    } else if (xpRange === '50-100') {
      result = result.filter((q) => q.rewardXp > 50 && q.rewardXp <= 100);
    } else if (xpRange === '100+') {
      result = result.filter((q) => q.rewardXp > 100);
    }

    // Distance filter
    if (distance !== 'all' && location) {
      const maxDist = distance === 'nearby' ? 2 : distance === '5km' ? 5 : 10;
      result = result.filter((q) => q.distance <= maxDist);
    }

    // Completed filter (mock - check if quest.id exists in completed quests)
    const completedIds = quests.filter((q) => q.completedByMe).map((q) => q.id);
    if (completed === 'yes') {
      result = result.filter((q) => completedIds.includes(q.id));
    } else if (completed === 'no') {
      result = result.filter((q) => !completedIds.includes(q.id));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [questsWithDistance, category, difficulty, xpRange, distance, completed, searchQuery, location, quests]);

  // Sort quests
  const sortedQuests = useMemo(() => {
    const result = [...filteredQuests];

    switch (sortBy) {
      case 'nearest':
        return result.sort((a, b) => a.distance - b.distance);
      case 'xp':
        return result.sort((a, b) => b.rewardXp - a.rewardXp);
      case 'popular':
        // Mock popularity - sort by XP as proxy
        return result.sort((a, b) => b.rewardXp - a.rewardXp);
      case 'recent':
        // Keep original order as "recently added"
        return result.reverse();
      case 'recommended':
      default:
        // Recommendation algorithm: location + interest + popularity
        return result.sort((a, b) => {
          const scoreA = (10 - a.distance) * 0.4 + a.rewardXp * 0.6;
          const scoreB = (10 - b.distance) * 0.4 + b.rewardXp * 0.6;
          return scoreB - scoreA;
        });
    }
  }, [filteredQuests, sortBy]);

  const handleQuestSelect = (questId: string) => {
    setSelectedQuestId(questId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <TopNav />
      
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Compass className="text-emerald-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Explore Map</h1>
                <p className="text-sm text-slate-600">
                  {location
                    ? `${filteredQuests.length} quests available`
                    : 'Enable location to see nearby quests'}
                </p>
              </div>
            </div>
            <button
              onClick={() => void requestLocation()}
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-emerald-700"
            >
              <Navigation size={18} />
              Use My Location
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Map Section */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-md">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search quests... (e.g., Mission Bay)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition ${
                    showFilters
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Filter Options</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="all">All</option>
                      <option value="explore">Explore Auckland</option>
                      <option value="nature">Nature & Parks</option>
                      <option value="food">Food & Coffee</option>
                      <option value="university">University</option>
                      <option value="culture">Culture & History</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="all">All</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* XP Range */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">XP</label>
                    <select
                      value={xpRange}
                      onChange={(e) => setXpRange(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="all">All</option>
                      <option value="0-50">0-50</option>
                      <option value="50-100">50-100</option>
                      <option value="100+">100+</option>
                    </select>
                  </div>

                  {/* Distance */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Distance</label>
                    <select
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="all">All</option>
                      <option value="nearby">Nearby (&lt;2km)</option>
                      <option value="5km">Within 5km</option>
                      <option value="10km">Within 10km</option>
                    </select>
                  </div>

                  {/* Completed */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Status</label>
                    <select
                      value={completed}
                      onChange={(e) => setCompleted(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="all">All</option>
                      <option value="no">Not Completed</option>
                      <option value="yes">Completed</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCategory('all');
                    setDifficulty('all');
                    setXpRange('all');
                    setDistance('all');
                    setCompleted('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center px-2 text-sm font-medium text-slate-600">Sort by:</span>
              {[
                { value: 'recommended', label: 'Recommended', icon: Award },
                { value: 'nearest', label: 'Nearest', icon: Navigation },
                { value: 'xp', label: 'Highest XP', icon: TrendingUp },
                { value: 'popular', label: 'Most Popular', icon: Award },
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as SortOption)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      sortBy === option.value
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={14} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-3xl border-2 border-emerald-300 shadow-xl">
              <QuestMap
                quests={sortedQuests.map(q => ({
                  id: q.id,
                  title: q.title,
                  description: q.description,
                  rewardXp: q.rewardXp,
                  latitude: q.latitude,
                  longitude: q.longitude,
                  status: 'Active',
                  likesCount: 0,
                  completedByMe: false
                }))}
                center={location ? [location.lat, location.lng] : [-36.8485, 174.7633]}
                userLocation={location ? [location.lat, location.lng] : null}
                onSelectQuest={handleQuestSelect}
              />
            </div>
          </div>

          {/* Quest List Sidebar */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg lg:max-h-[800px] lg:overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Quest List ({sortedQuests.length})
            </h2>

            <div className="space-y-3">
              {sortedQuests.map((quest) => {
                const completedIds = quests.filter((q) => q.completedByMe).map((q) => q.id);
                const isCompleted = completedIds.includes(quest.id);
                const isSelected = selectedQuestId === quest.id;

                return (
                  <div
                    key={quest.id}
                    className={`rounded-2xl border p-4 transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="flex-1 font-semibold text-slate-900">{quest.title}</h3>
                      {isCompleted && (
                        <CheckCircle2 className="text-emerald-600" size={20} />
                      )}
                    </div>

                    <p className="mb-3 text-sm text-slate-600 line-clamp-2">
                      {quest.description}
                    </p>

                    <div className="mb-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                        {CATEGORY_LABELS[quest.category]}
                      </span>
                      <span className={`rounded-full px-2 py-1 font-medium ${
                        quest.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : quest.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {quest.difficulty}
                      </span>
                      <span className="rounded-full bg-purple-100 px-2 py-1 font-medium text-purple-700">
                        +{quest.rewardXp} XP
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={14} />
                      {location ? (
                        <span>{quest.distance.toFixed(1)} km away</span>
                      ) : (
                        <span>{quest.latitude.toFixed(3)}, {quest.longitude.toFixed(3)}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/quests/${quest.id}`}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        View Details
                      </Link>
                      
                      {isInTaskList(quest.id) ? (
                        <button
                          onClick={() => removeTask(quest.id)}
                          className="flex items-center gap-1 rounded-xl bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                          title="Remove from task list"
                        >
                          <Check size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => addTask({
                            id: quest.id,
                            title: quest.title,
                            description: quest.description,
                            rewardXp: quest.rewardXp,
                            category: quest.category,
                            difficulty: quest.difficulty,
                            latitude: quest.latitude,
                            longitude: quest.longitude,
                          })}
                          className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          title="Add to my task list"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {sortedQuests.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  <Compass className="mx-auto mb-3 text-slate-300" size={48} />
                  <p>No quests match your filters</p>
                  <button
                    onClick={() => {
                      setCategory('all');
                      setDifficulty('all');
                      setXpRange('all');
                      setDistance('all');
                      setCompleted('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

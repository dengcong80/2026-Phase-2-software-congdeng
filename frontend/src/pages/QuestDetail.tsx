import { useEffect, useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  Heart, 
  MapPin, 
  Navigation, 
  Clock,
  Award,
  Share2,
  MessageCircle,
  Star,
  TrendingUp,
  AlertCircle,
  Image as ImageIcon,
  Send,
  ThumbsUp,
  Zap
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { QuestMap } from '../components/QuestMap';
import { useQuestStore } from '../stores/useQuestStore';
import { useUserStore } from '../stores/useUserStore';
import { useTaskListStore } from '../stores/useTaskListStore';
import { OFFICIAL_QUESTS } from '../data/officialQuests';
import { getQuestComments, createQuestComment, toggleCommentLike } from '../services/api';
import type { CommentResponse } from '../types';

export function QuestDetail() {
  const { id } = useParams();
  const { selectedQuest, fetchQuestById, completeQuest, toggleLike, error, isLoading, createShare, location, clearError } = useQuestStore();
  const { username, isAuthenticated } = useUserStore();
  const { addTask, isInTaskList } = useTaskListStore();
  
  const [message, setMessage] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'tips'>('details');
  const [newComment, setNewComment] = useState('');
  const [newTip, setNewTip] = useState('');
  
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [tips, setTips] = useState<string[]>([
    '📸 Best photo spot: Near the main viewpoint',
    '🚗 Parking available nearby',
    '☕ Café within walking distance',
    '⏱️ Allow 30–45 minutes for completion',
  ]);

  // Find official questData data
  const officialQuest = OFFICIAL_QUESTS.find((q) => q.id === id);

  // Use quest-specific images if available, otherwise use default
  const galleryImages = officialQuest?.images || [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop',
  ];

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        await fetchQuestById(id);
        const state = useQuestStore.getState();
        if (state.error && officialQuest) {
          clearError();
        } else if (!state.error) {
          getQuestComments(id).then(setComments).catch(() => {});
        }
      };
      loadData();
    }
  }, [fetchQuestById, id, officialQuest, clearError]);

  async function handleComplete() {
    if (!id || !questData) return;
    try {
      const result = await completeQuest(id);
      createShare({ 
        questId: questData.id, 
        questTitle: questData.title, 
        note: reflection || 'Completed this amazing questData!', 
        imagePreview 
      });
      setMessage(`🎉 questData completed! You earned ${result.earnedXp} XP${result.newBadges.length > 0 ? ` and unlocked: ${result.newBadges.join(', ')}` : '!'}`);
      setReflection('');
      setImagePreview(undefined);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not complete questData.');
    }
  }

  async function handleLike() {
    if (!id) return;
    try {
      await toggleLike(id);
      setMessage('❤️ Liked!');
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not like questData.');
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function openMap() {
    if (!questData) return;
    window.open(`https://www.google.com/maps?q=${questData.latitude},${questData.longitude}`, '_blank', 'noopener,noreferrer');
  }

  function handleShare() {
    if (!questData) return;
    const url = window.location.href;
    const text = `Check out this quest: ${questData.title}`;
    
    if (navigator.share) {
      navigator.share({ title: questData.title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setMessage('📋 Link copied to clipboard!');
        setTimeout(() => setMessage(null), 2000);
      }).catch(() => {});
    }
  }

  async function handleAddComment() {
    if (!newComment.trim() || !username || !id) return;
    
    try {
      const comment = await createQuestComment(id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
      setMessage('💬 Comment posted!');
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage('Could not post comment.');
    }
  }

  async function handleToggleCommentLike(commentId: string) {
    if (!isAuthenticated) return;
    try {
      const newCount = await toggleCommentLike(commentId);
      setComments(comments.map(c => 
        c.id === commentId 
          ? { ...c, likesCount: newCount, likedByMe: !c.likedByMe } 
          : c
      ));
    } catch (err) {
      // ignore
    }
  }

  function handleAddTip() {
    if (!newTip.trim()) return;
    setTips([...tips, `💡 ${newTip}`]);
    setNewTip('');
    setMessage('✨ Tip added!');
    setTimeout(() => setMessage(null), 2000);
  }

  function handleAddToTaskList() {
    if (!questData || !officialQuest) return;
    addTask({
      id: questData.id,
      title: questData.title,
      description: questData.description,
      rewardXp: questData.rewardXp,
      category: officialQuest.category,
      difficulty: officialQuest.difficulty,
      latitude: questData.latitude,
      longitude: questData.longitude,
    });
    setMessage('📋 Added to your task list!');
    setTimeout(() => setMessage(null), 2000);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <TopNav />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
            <p className="text-slate-600">Loading questData...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use selectedQuest from API or fallback to officialQuest
  const questData = selectedQuest || (officialQuest ? {
    id: officialQuest.id,
    title: officialQuest.title,
    description: officialQuest.description,
    rewardXp: officialQuest.rewardXp,
    latitude: officialQuest.latitude,
    longitude: officialQuest.longitude,
    status: 'Active' as const,
    likesCount: 0,
    completedByMe: false,
  } : null);

  if (!questData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <TopNav />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">Quest not found</p>
            <Link to="/explore" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
              ← Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <TopNav />
      
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/explore" 
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Explore
        </Link>

        {message && (
          <div className="mb-6 animate-fadeIn rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {officialQuest && (
                      <>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {officialQuest.category.toUpperCase()}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          officialQuest.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-700'
                            : officialQuest.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {officialQuest.difficulty}
                        </span>
                      </>
                    )}
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {questData.status}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">{questData.title}</h1>
                  <p className="mt-3 text-lg text-slate-700">{questData.description}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Award size={16} />
                    Reward
                  </div>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">+{questData.rewardXp} XP</p>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Heart size={16} />
                    Likes
                  </div>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{questData.likesCount}</p>
                </div>

                {officialQuest && (
                  <>
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} />
                        Time
                      </div>
                      <p className="mt-1 text-xl font-bold text-slate-900">30-45m</p>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Star size={16} />
                        Difficulty
                      </div>
                      <p className="mt-1 text-xl font-bold text-slate-900">{officialQuest.difficulty}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                {isAuthenticated && !questData.completedByMe && (
                  <button 
                    onClick={handleComplete}
                    className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={18} />
                    Check In & Complete
                  </button>
                )}
                
                {questData.completedByMe && (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-6 py-3 font-semibold text-emerald-700">
                    <CheckCircle2 size={18} />
                    Completed 🏆
                  </div>
                )}

                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-full border-2 px-5 py-3 font-medium transition ${
                    questData.likedByMe 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-emerald-300 bg-white text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  <Heart size={18} className={questData.likedByMe ? 'fill-emerald-600' : ''} />
                  {questData.likedByMe ? 'Liked' : 'Like'}
                </button>

                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Share2 size={18} />
                  Share
                </button>

                {!isInTaskList(questData.id) && (
                  <button 
                    onClick={handleAddToTaskList}
                    className="flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-5 py-3 font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    <TrendingUp size={18} />
                    Add to Tasks
                  </button>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                <ImageIcon size={24} />
                Photo Gallery
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {galleryImages.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`Gallery ${index + 1}`}
                    className="h-48 w-full rounded-2xl object-cover shadow-md transition hover:scale-105"
                  />
                ))}
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Your photo" 
                    className="h-48 w-full rounded-2xl object-cover shadow-md ring-2 ring-emerald-400"
                  />
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-3xl border border-emerald-200 bg-white shadow-lg">
              <div className="flex border-b border-slate-200">
                {[
                  { id: 'details', label: 'Details', icon: AlertCircle },
                  { id: 'comments', label: 'Comments', icon: MessageCircle, count: comments.length },
                  { id: 'tips', label: 'Tips', icon: Zap, count: tips.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-semibold transition ${
                        activeTab === tab.id
                          ? 'border-b-2 border-emerald-600 text-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-slate-900">Description</h3>
                      <p className="text-slate-700">{questData.description}</p>
                    </div>

                    {officialQuest?.completionHint && (
                      <div className="rounded-xl bg-blue-50 p-4">
                        <p className="flex items-center gap-2 font-semibold text-blue-900">
                          <AlertCircle size={16} />
                          Completion Hint
                        </p>
                        <p className="mt-2 text-sm text-blue-800">{officialQuest.completionHint}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="mb-2 font-semibold text-slate-900">Location</h3>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={16} />
                        <span>
                          {questData.latitude.toFixed(4)}, {questData.longitude.toFixed(4)}
                        </span>
                      </div>
                      {location && (
                        <p className="mt-1 text-sm text-slate-500">
                          Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={openMap}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      <Navigation size={18} />
                      Get Directions
                    </button>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {/* Add Comment */}
                    {isAuthenticated && (
                      <div className="rounded-xl bg-slate-50 p-4">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your experience..."
                          rows={3}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={handleAddComment}
                          className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <Send size={16} />
                          Post Comment
                        </button>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{comment.username}</p>
                              <p className="mt-1 text-sm text-slate-700">{comment.text}</p>
                              <p className="mt-2 text-xs text-slate-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button 
                              onClick={() => handleToggleCommentLike(comment.id)}
                              className={`flex items-center gap-1 text-sm transition-colors ${
                                comment.likedByMe ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'
                              }`}
                            >
                              <ThumbsUp size={14} className={comment.likedByMe ? 'fill-emerald-600' : ''} />
                              {comment.likesCount}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div className="space-y-4">
                    {/* Add Tip */}
                    {isAuthenticated && (
                      <div className="rounded-xl bg-amber-50 p-4">
                        <input
                          type="text"
                          value={newTip}
                          onChange={(e) => setNewTip(e.target.value)}
                          placeholder="Share a helpful tip..."
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={handleAddTip}
                          className="mt-2 flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                        >
                          <Star size={16} />
                          Add Tip
                        </button>
                      </div>
                    )}

                    {/* Tips List */}
                    <div className="space-y-2">
                      {tips.map((tip, index) => (
                        <div key={index} className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-slate-700">
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                <MapPin size={20} />
                Map Location
              </h2>
              <div className="overflow-hidden rounded-2xl border border-emerald-200">
                <QuestMap
                  quests={[questData]}
                  center={[questData.latitude, questData.longitude]}
                  userLocation={location ? [location.lat, location.lng] : null}
                />
              </div>
            </div>

            {/* Check-in Form */}
            {isAuthenticated && !questData.completedByMe && (
              <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-lg">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Camera size={20} />
                  Complete questData
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Upload Photo (Optional)
                    </label>
                    <div className="relative inline-block w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="flex items-center gap-3">
                        <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                          Choose File
                        </button>
                        <span className="text-sm text-slate-500">
                          {imagePreview ? 'File selected' : 'No file chosen'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Share Your Experience
                    </label>
                    <textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      rows={4}
                      placeholder="Tell us about your experience..."
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

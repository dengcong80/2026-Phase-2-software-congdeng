import { useEffect } from 'react';
import { Heart, Users } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { useQuestStore } from '../stores/useQuestStore';

export function CommunityPage() {
  const { shares, toggleShareLike, fetchQuests } = useQuestStore();

  useEffect(() => {
    void fetchQuests();
  }, [fetchQuests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <TopNav />
      
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-purple-200 bg-white/90 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-purple-600" size={28} />
            <h1 className="text-3xl font-bold text-slate-900">Community Feed</h1>
          </div>
          <p className="text-slate-600">See what other explorers are sharing</p>
        </header>

        <div className="space-y-4">
          {shares.map((share) => (
            <article
              key={share.id}
              className="rounded-3xl border border-purple-200 bg-white p-6 shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{share.username}</p>
                  <p className="text-sm text-slate-600">{share.questTitle}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(share.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => void toggleShareLike(share.id)}
                  className="flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-4 py-2 font-medium text-purple-700 transition hover:bg-purple-100"
                >
                  <Heart size={16} />
                  {share.likes}
                </button>
              </div>

              {share.imagePreview && (
                <img
                  src={share.imagePreview}
                  alt={share.note}
                  className="mb-3 h-64 w-full rounded-2xl object-cover"
                />
              )}

              <p className="text-slate-700">{share.note}</p>
            </article>
          ))}

          {shares.length === 0 && (
            <div className="rounded-3xl border border-purple-200 bg-white p-12 text-center">
              <Users className="mx-auto mb-4 text-purple-300" size={48} />
              <p className="text-slate-600">No community posts yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { OFFICIAL_QUESTS } from '../data/officialQuests';

export function DebugQuests() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <TopNav />
      
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Debug: All Official Quests</h1>
        
        <div className="space-y-3">
          {OFFICIAL_QUESTS.map((quest) => (
            <div key={quest.id} className="rounded-2xl border border-emerald-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {quest.category}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                      {quest.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{quest.title}</h3>
                  <p className="text-sm text-slate-600">{quest.description}</p>
                  <p className="mt-2 text-xs text-slate-500">ID: {quest.id}</p>
                </div>
                <Link
                  to={`/quests/${quest.id}`}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

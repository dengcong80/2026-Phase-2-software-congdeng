import { CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { QuestResponse } from '../types';

interface Props {
  quest: QuestResponse;
  onComplete?: (id: string) => Promise<void>;
  onLike?: (id: string) => Promise<void>;
}

export function QuestCard({ quest, onComplete, onLike }: Props) {
  return (
    <article className="rounded-3xl border border-slate-700/80 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Quest</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{quest.title}</h3>
        </div>
        <div className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm font-medium text-cyan-300">
          +{quest.rewardXp} XP
        </div>
      </div>

      <p className="text-sm text-slate-300">{quest.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <span className="rounded-full bg-slate-800 px-3 py-1">{quest.status}</span>
        <span className="flex items-center gap-1"><Heart size={16} /> {quest.likesCount}</span>
        <span className="flex items-center gap-1"><Sparkles size={16} /> {quest.completedByMe ? 'Completed' : 'Open'}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link to={`/quests/${quest.id}`} className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700">
          View details
        </Link>
        {onComplete && !quest.completedByMe && (
          <button onClick={() => onComplete(quest.id)} className="flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            <CheckCircle2 size={16} /> Complete
          </button>
        )}
        {onLike && (
          <button onClick={() => onLike(quest.id)} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
            Like
          </button>
        )}
      </div>
    </article>
  );
}

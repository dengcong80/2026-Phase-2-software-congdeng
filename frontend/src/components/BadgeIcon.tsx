import { Award } from 'lucide-react';

interface Props {
  label: string;
}

export function BadgeIcon({ label }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/65 p-3">
      <div className="rounded-full bg-amber-500/15 p-2 text-amber-400">
        <Award size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400">Badge earned</p>
      </div>
    </div>
  );
}

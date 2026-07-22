interface Props {
  value: number;
  max: number;
  label: string;
  className?: string;
}

export function ProgressBar({ value, max, label, className = '' }: Props) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
        <span>{label}</span>
        <span className="font-semibold">{value}/{max}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}

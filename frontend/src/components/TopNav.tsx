import { Compass, House, MessagesSquare, Trophy, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: House },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/community', label: 'Community', icon: MessagesSquare },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export function TopNav() {
  return (
    <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">Auckland Quest</p>
          <p className="text-sm text-slate-400">Discover, share, and complete local adventures</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function StatsCards({ stats, isLoading }) {
  const cards = [
    {
      label: 'Total Tasks',
      value: stats?.total ?? '—',
      icon: '📋',
      gradient: 'from-slate-700/60 to-slate-800/60',
      border: 'border-slate-600/30',
    },
    {
      label: 'To Do',
      value: stats?.byStatus?.todo ?? '—',
      icon: '⏳',
      gradient: 'from-slate-700/60 to-slate-800/60',
      border: 'border-slate-600/30',
    },
    {
      label: 'In Progress',
      value: stats?.byStatus?.['in-progress'] ?? '—',
      icon: '🚀',
      gradient: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
    },
    {
      label: 'Completed',
      value: stats?.byStatus?.completed ?? '—',
      icon: '✅',
      gradient: 'from-brand-500/10 to-teal-600/5',
      border: 'border-brand-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon, gradient, border }, i) => (
        <div
          key={label}
          className={`rounded-2xl bg-gradient-to-br ${gradient} border ${border} p-4 animate-slide-up`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xl">{icon}</span>
          </div>
          <div className={`font-display font-bold text-3xl text-white mb-1 ${isLoading ? 'animate-pulse' : ''}`}>
            {isLoading ? '—' : value}
          </div>
          <div className="text-xs text-slate-500 font-medium">{label}</div>
        </div>
      ))}
    </div>
  );
}

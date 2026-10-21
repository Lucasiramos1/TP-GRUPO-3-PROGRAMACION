// src/components/landing/StatsBar.jsx

function StatsBar({ stats = [] }) {
  return (
    <div className="mt-3xl grid grid-cols-2 md:grid-cols-4 gap-xl border-t border-outline-variant pt-2xl">
      {stats.map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="font-headline-lg text-headline-lg text-primary">{value}</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;

export default function Checklist({ title, items = [], values = {}, onToggle, readOnly = false }) {
  const total = items.length;
  const checked = items.filter((k) => values?.[k]).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-white/70">{pct}%</span>
      </div>
      <ul className="divide-y divide-white/10">
        {items.map((label) => (
          <li key={label} className="flex items-center gap-3 px-4 py-3">
            <input
              type="checkbox"
              className="size-4 accent-emerald-500"
              checked={!!values?.[label]}
              onChange={() => !readOnly && onToggle?.(label)}
              disabled={readOnly}
            />
            <span className="select-none">{label}</span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-4 py-4 text-sm text-white/60">No items</li>
        )}
      </ul>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarMonth({ selectedDate, onSelectDate }) {
  const [summary, setSummary] = useState({}); // date -> { warmup_count, food_count, total }
  const [offline, setOffline] = useState(false);
  const localMapRef = useRef(new Map()); // date -> entry

  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const selected = useMemo(() => new Date(selectedDate), [selectedDate]);
  const ym = `${selected.getFullYear()}-${String(selected.getMonth()+1).padStart(2,'0')}`;

  const totalItems = 8; // warmup(4) + food(4) baseline for % calc

  useEffect(() => {
    async function load() {
      try {
        setOffline(false);
        const res = await fetch(`${baseUrl}/tracker?month=${ym}`);
        if (!res.ok) throw new Error('bad');
        const data = await res.json();
        const map = {};
        for (const d of data?.days ?? []) {
          map[d.date] = {
            warmup_count: d.warmup_count || 0,
            food_count: d.food_count || 0,
            total: totalItems,
          };
        }
        setSummary(map);
      } catch (_) {
        setOffline(true);
        // Derive from local cache when offline
        const localMap = localMapRef.current;
        const map = {};
        for (const [date, entry] of localMap.entries()) {
          const w = Object.values(entry.warmup || {}).filter(Boolean).length;
          const f = Object.values(entry.food || {}).filter(Boolean).length;
          map[date] = { warmup_count: w, food_count: f, total: totalItems };
        }
        setSummary(map);
      }
    }
    load();
  }, [baseUrl, ym]);

  // Expose a way for siblings to update local cache via window event
  useEffect(() => {
    function onEntrySaved(e) {
      const { date, entry } = e.detail || {};
      if (!date || !entry) return;
      localMapRef.current.set(date, entry);
      const w = Object.values(entry.warmup || {}).filter(Boolean).length;
      const f = Object.values(entry.food || {}).filter(Boolean).length;
      setSummary((prev) => ({ ...prev, [date]: { warmup_count: w, food_count: f, total: totalItems } }));
    }
    window.addEventListener('tracker:entrySaved', onEntrySaved);
    return () => window.removeEventListener('tracker:entrySaved', onEntrySaved);
  }, []);

  const grid = useMemo(() => buildMonthGrid(selected), [selected]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">This Month</h3>
        <span className="text-xs text-white/60">{offline ? 'Offline mode' : 'Online'}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/70 mb-1">
        {DAYS.map((d) => (<div key={d} className="py-1">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell) => {
          if (!cell) return <div key={Math.random()} className="h-10" />;
          const dateStr = iso(cell);
          const info = summary[dateStr];
          const pct = info ? Math.round(((info.warmup_count + info.food_count) / (info.total || totalItems)) * 100) : 0;
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate?.(dateStr)}
              className={`h-10 rounded-md border text-sm transition ${isSelected ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10 hover:border-white/20'}`}
              title={`${pct}%`}
            >
              <div className="flex items-center justify-between px-2">
                <span>{cell.getDate()}</span>
                <span className="text-[10px] text-white/70">{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildMonthGrid(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const startOffset = first.getDay();
  const days = last.getDate();
  const cells = Array(startOffset).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  return cells;
}

function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

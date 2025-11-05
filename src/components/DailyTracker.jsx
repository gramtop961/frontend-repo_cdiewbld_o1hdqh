import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Apple, Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react';

const WARMUP_ITEMS = [
  { id: 'neck', label: 'Neck & shoulder rolls' },
  { id: 'pendulum', label: 'Arm pendulum swings' },
  { id: 'catcow', label: 'Cat–Cow stretch' },
  { id: 'hipsquats', label: 'Hip circles + light squats' },
  { id: 'breathing', label: 'Deep breathing' },
];

const FOOD_ITEMS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
  { id: 'fruit', label: 'Fruit/Salad' },
  { id: 'water', label: '3–4 L Water' },
];

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function monthKey(date) {
  return date.toISOString().slice(0, 7); // YYYY-MM
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export default function DailyTracker() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entry, setEntry] = useState({ date: formatDate(new Date()), warmup: {}, food: {}, notes: '' });
  const [summary, setSummary] = useState({ month: monthKey(new Date()), days: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [offline, setOffline] = useState(false);

  const localMapRef = useRef({}); // fallback cache keyed by YYYY-MM-DD

  const baseUrl = import.meta.env.VITE_BACKEND_URL || '';

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const days = [];
    const startDay = start.getDay(); // 0..6 (Sun..Sat)
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= end.getDate(); d++) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
    }
    return days;
  }, [viewDate]);

  const selectedKey = formatDate(selectedDate);

  // Helpers to compute counts
  const countCompleted = (obj) => Object.values(obj || {}).filter(Boolean).length;
  const totalItems = WARMUP_ITEMS.length + FOOD_ITEMS.length;

  // Build summary from local cache (used in offline mode or as optimistic UI)
  const recomputeLocalSummary = (month) => {
    const days = [];
    const [y, m] = month.split('-').map(Number);
    const last = new Date(y, m, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const key = `${month}-${String(d).padStart(2, '0')}`;
      const rec = localMapRef.current[key];
      if (rec) {
        days.push({
          date: key,
          warmup_count: countCompleted(rec.warmup),
          food_count: countCompleted(rec.food),
        });
      }
    }
    setSummary({ month, days });
  };

  // Fetch single day
  useEffect(() => {
    let aborted = false;
    async function fetchEntry(d) {
      setLoading(true);
      try {
        if (!baseUrl) throw new Error('No backend URL');
        const res = await fetch(`${baseUrl}/tracker/${d}`);
        if (!res.ok) throw new Error('Network');
        const data = await res.json();
        if (aborted) return;
        const next = { date: d, warmup: data.warmup || {}, food: data.food || {}, notes: data.notes || '' };
        setEntry(next);
        // keep local cache in sync
        localMapRef.current[d] = next;
        setOffline(false);
      } catch (e) {
        // Offline fallback: use local cache for day
        const cached = localMapRef.current[d] || { date: d, warmup: {}, food: {}, notes: '' };
        if (!aborted) {
          setEntry(cached);
          setOffline(true);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    fetchEntry(selectedKey);
    return () => {
      aborted = true;
    };
  }, [selectedKey, baseUrl]);

  // Fetch month summary
  useEffect(() => {
    let aborted = false;
    async function fetchMonth() {
      try {
        if (!baseUrl) throw new Error('No backend URL');
        const res = await fetch(`${baseUrl}/tracker?month=${monthKey(viewDate)}`);
        if (!res.ok) throw new Error('Network');
        const data = await res.json();
        if (aborted) return;
        setSummary(data);
        setOffline(false);
      } catch {
        recomputeLocalSummary(monthKey(viewDate));
        if (!aborted) setOffline(true);
      }
    }
    fetchMonth();
    return () => {
      aborted = true;
    };
  }, [viewDate, baseUrl]);

  const save = async (next) => {
    setSaving(true);
    // Optimistic update into local cache and summary
    localMapRef.current[selectedKey] = next;
    recomputeLocalSummary(monthKey(viewDate));

    try {
      if (!baseUrl) throw new Error('No backend URL');
      const res = await fetch(`${baseUrl}/tracker/${selectedKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warmup: next.warmup, food: next.food, notes: next.notes || null }),
      });
      if (!res.ok) throw new Error('Network');
      const data = await res.json();
      setEntry(data);
      // refresh month summary from server for accuracy
      const res2 = await fetch(`${baseUrl}/tracker?month=${monthKey(viewDate)}`);
      if (res2.ok) {
        setSummary(await res2.json());
        setOffline(false);
      }
    } catch (e) {
      // keep optimistic values, mark offline
      setOffline(true);
    } finally {
      setSaving(false);
    }
  };

  const toggle = (group, id) => {
    const next = { ...entry, [group]: { ...(entry[group] || {}), [id]: !entry[group]?.[id] } };
    setEntry(next);
    save(next);
  };

  const dayScore = (d) => {
    const key = formatDate(d);
    // Prefer server summary; if missing, compute from local cache
    const rec = summary.days.find((x) => x.date === key);
    if (rec) {
      return Math.round(((rec.warmup_count + rec.food_count) / totalItems) * 100);
    }
    const cached = localMapRef.current[key];
    if (cached) {
      return Math.round(((countCompleted(cached.warmup) + countCompleted(cached.food)) / totalItems) * 100);
    }
    return 0;
  };

  const isToday = (d) => formatDate(d) === formatDate(new Date());
  const isSelected = (d) => formatDate(d) === selectedKey;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-100 text-violet-700 border border-violet-200">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Tracker</h2>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Prev" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-2 rounded-lg border bg-white hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-medium w-32 text-center">
            {viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </div>
          <button aria-label="Next" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-2 rounded-lg border bg-white hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="text-xs text-gray-500 text-center py-1">{d}</div>
        ))}
        {daysInMonth.map((d, idx) => (
          <button
            key={idx}
            disabled={!d}
            onClick={() => d && (setSelectedDate(d))}
            className={`aspect-square rounded-lg border flex items-center justify-center text-sm relative ${
              d ? 'bg-white hover:bg-gray-50' : 'bg-transparent border-transparent'
            } ${d && isSelected(d) ? 'ring-2 ring-violet-400' : ''}`}
          >
            {d && (
              <>
                <span className={`absolute top-1 left-1 text-[10px] ${isToday(d) ? 'text-violet-600 font-semibold' : 'text-gray-500'}`}>{d.getDate()}</span>
                <span className="text-xs font-medium text-gray-700">{dayScore(d)}%</span>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-4 h-4 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Warm-up Checklist</h3>
            <span className="ml-auto text-xs text-gray-500">{loading ? 'Loading…' : saving ? 'Saving…' : offline ? 'Offline mode' : ''}</span>
          </div>
          <ul className="space-y-2">
            {WARMUP_ITEMS.map((it) => (
              <li key={it.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle('warmup', it.id)} className={`w-6 h-6 rounded-full border inline-flex items-center justify-center ${entry.warmup?.[it.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-transparent'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-800">{it.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Apple className="w-4 h-4 text-rose-600" />
            <h3 className="font-semibold text-gray-900">Food Checklist</h3>
          </div>
          <ul className="space-y-2">
            {FOOD_ITEMS.map((it) => (
              <li key={it.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle('food', it.id)} className={`w-6 h-6 rounded-full border inline-flex items-center justify-center ${entry.food?.[it.id] ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-300 text-transparent'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-800">{it.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

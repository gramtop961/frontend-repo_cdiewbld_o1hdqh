import { useEffect, useMemo, useRef, useState } from 'react';
import Checklist from './Checklist.jsx';

const WARMUP_ITEMS = ['Neck circles','Arm swings','Hip hinges','Ankle rolls'];
const FOOD_ITEMS = ['Breakfast','Lunch','Dinner','Hydration'];

export default function DailyTracker({ selectedDate, onDateChange }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [entry, setEntry] = useState({ date: selectedDate, warmup: {}, food: {}, notes: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [offline, setOffline] = useState(false);
  const localMapRef = useRef(new Map()); // date -> entry

  useEffect(() => {
    setEntry((e) => ({ ...e, date: selectedDate }));
  }, [selectedDate]);

  const totalItems = WARMUP_ITEMS.length + FOOD_ITEMS.length;

  async function fetchEntry(date) {
    setLoading(true);
    try {
      setOffline(false);
      const res = await fetch(`${baseUrl}/tracker/${date}`);
      if (!res.ok) throw new Error('bad');
      const data = await res.json();
      setEntry(data);
      localMapRef.current.set(date, data);
    } catch (e) {
      setOffline(true);
      const cached = localMapRef.current.get(date) || { date, warmup: {}, food: {}, notes: '' };
      setEntry(cached);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntry(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, baseUrl]);

  function emitEntrySaved(date, entryData) {
    window.dispatchEvent(new CustomEvent('tracker:entrySaved', { detail: { date, entry: entryData } }));
  }

  async function saveEntry(next) {
    setSaving(true);
    // Optimistic local cache and calendar update
    localMapRef.current.set(next.date, next);
    emitEntrySaved(next.date, next);
    try {
      setOffline(false);
      const res = await fetch(`${baseUrl}/tracker/${next.date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error('bad');
    } catch (_) {
      setOffline(true);
      // keep local cache only
    } finally {
      setSaving(false);
    }
  }

  const onToggleWarmup = (key) => {
    const next = {
      ...entry,
      warmup: { ...entry.warmup, [key]: !entry.warmup?.[key] },
    };
    setEntry(next);
    saveEntry(next);
  };

  const onToggleFood = (key) => {
    const next = {
      ...entry,
      food: { ...entry.food, [key]: !entry.food?.[key] },
    };
    setEntry(next);
    saveEntry(next);
  };

  const warmupChecked = useMemo(() => Object.values(entry.warmup || {}).filter(Boolean).length, [entry.warmup]);
  const foodChecked = useMemo(() => Object.values(entry.food || {}).filter(Boolean).length, [entry.food]);
  const pct = Math.round(((warmupChecked + foodChecked) / totalItems) * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{formatHuman(selectedDate)}</h2>
          <p className="text-sm text-white/60">Daily progress: {pct}%</p>
        </div>
        <div className="text-xs">
          {loading && <span className="text-white/70">Loading…</span>}
          {!loading && saving && <span className="text-emerald-400">Saving…</span>}
          {!loading && !saving && offline && <span className="text-amber-400">Offline mode</span>}
          {!loading && !saving && !offline && <span className="text-white/60">Online</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Checklist title="Warm-up" items={WARMUP_ITEMS} values={entry.warmup} onToggle={onToggleWarmup} />
        <Checklist title="Food" items={FOOD_ITEMS} values={entry.food} onToggle={onToggleFood} />
      </div>
    </div>
  );
}

function formatHuman(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

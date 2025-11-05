import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

const baseItems = [
  { id: 'neck', label: 'Neck & shoulder rolls', detail: '5 each way', timed: false },
  { id: 'pendulum', label: 'Arm pendulum swings', detail: '30 sec', timed: true, seconds: 30 },
  { id: 'catcow', label: 'Cat–Cow stretch', detail: '10 reps', timed: false },
  { id: 'hipsquats', label: 'Hip circles + light squats', detail: '10 reps', timed: false },
  { id: 'breathing', label: 'Deep breathing', detail: '1 min', timed: true, seconds: 60 },
];

export default function RoutineChecklist() {
  const [checked, setChecked] = useState({});
  const [timers, setTimers] = useState({});

  const items = useMemo(() => baseItems, []);

  const total = items.length;
  const done = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((done / total) * 100);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const startTimer = (id, seconds) => {
    if (timers[id]?.running) return;
    setTimers((prev) => ({ ...prev, [id]: { remaining: seconds, running: true } }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const t = next[key];
          if (t?.running && t.remaining > 0) {
            t.remaining -= 1;
            if (t.remaining === 0) {
              t.running = false;
              // auto-check when finished
              setChecked((c) => ({ ...c, [key]: true }));
            }
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Daily Mobility & Warm-Up (10 min)</h2>
        <div className="flex items-center gap-3">
          <div className="w-40 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{done}/{total} done</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggle(item.id)}
                aria-label={`Toggle ${item.label}`}
                className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full border ${
                  checked[item.id]
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-gray-300 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.detail}</p>
              </div>
            </div>
            {item.timed ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="tabular-nums text-sm text-gray-700 min-w-[3.5rem] text-right">
                  {timers[item.id]?.remaining ?? item.seconds}s
                </span>
                <button
                  onClick={() => startTimer(item.id, item.seconds)}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                >
                  {timers[item.id]?.running ? 'Running' : 'Start'}
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-400">reps</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

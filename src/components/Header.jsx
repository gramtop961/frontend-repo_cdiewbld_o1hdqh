import React from 'react';
import { Dumbbell, Flame, Heart } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-white to-blue-100 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 text-rose-600">
          <Flame className="w-6 h-6" />
          <span className="font-semibold tracking-wide uppercase text-xs">Daily Goal Tracker</span>
        </div>
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Move better. Eat smarter. Feel great.
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl">
              A simple, focused dashboard to keep your mobility, nutrition, and workouts on track — anywhere.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-3">
            <Dumbbell className="w-5 h-5 text-gray-700" />
            <div>
              <p className="text-sm font-medium text-gray-900">25–35 min workouts</p>
              <p className="text-xs text-gray-500">Balanced, travel-friendly plan</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatChip icon={<Heart className="w-4 h-4" />} label="Posture first" />
          <StatChip icon={<Flame className="w-4 h-4" />} label="Walk 10 min after meals" />
          <StatChip icon={<Dumbbell className="w-4 h-4" />} label="Protein every 3–4 hrs" />
        </div>
      </div>
    </header>
  );
}

function StatChip({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 text-sm text-gray-700">
      {icon}
      <span>{label}</span>
    </div>
  );
}

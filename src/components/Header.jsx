import { Dumbbell, CalendarDays } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 backdrop-blur bg-neutral-950/70">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 grid place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
            <Dumbbell className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Daily Fitness Tracker</h1>
            <p className="text-xs text-white/60">Track warm-up and meals, online or offline</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-white/70">
          <CalendarDays className="size-4" />
          <span className="text-sm">Stay consistent, one day at a time</span>
        </div>
      </div>
    </header>
  );
}

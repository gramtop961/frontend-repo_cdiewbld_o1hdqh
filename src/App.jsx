import { useState } from 'react';
import Header from './components/Header.jsx';
import DailyTracker from './components/DailyTracker.jsx';
import Checklist from './components/Checklist.jsx';
import CalendarMonth from './components/CalendarMonth.jsx';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 order-2 lg:order-1">
          <DailyTracker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </section>
        <aside className="lg:col-span-2 order-1 lg:order-2">
          <CalendarMonth selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <div className="mt-6">
            <Checklist title="Warm-up reference" items={["Neck circles","Arm swings","Hip hinges","Ankle rolls"]} readOnly />
          </div>
        </aside>
      </main>
    </div>
  );
}

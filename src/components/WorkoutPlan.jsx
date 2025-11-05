import React from 'react';
import { Dumbbell, Clock } from 'lucide-react';

const plan = [
  { day: 'Mon', focus: 'Lower body', safe: 'Squats, calf raises, wall sit' },
  { day: 'Tue', focus: 'Core', safe: 'Plank (knees if needed), leg raises, side crunch' },
  { day: 'Wed', focus: 'Cardio', safe: 'Brisk walk or hotel stairs 30 min' },
  { day: 'Thu', focus: 'Full body', safe: 'Glute bridge, superman hold, band rows (if pain-free)' },
  { day: 'Fri', focus: 'Mobility + Stretch', safe: 'Yoga, gentle shoulder openers' },
  { day: 'Sat–Sun', focus: 'Active rest', safe: 'Light walking, stretching' },
];

const milestones = [
  { time: '2 weeks', change: 'Less bloating, belly feels lighter' },
  { time: '4–6 weeks', change: 'Noticeable tightening around waist, more energy' },
  { time: '8–12 weeks', change: 'Leaner, stronger look, better posture and muscle tone' },
];

export default function WorkoutPlan() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Workout Plan (5 Days/Week)</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Each workout: 25–35 minutes</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-3 sm:grid-cols-4 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-600">
          <div className="px-4 py-3">Day</div>
          <div className="px-4 py-3">Focus</div>
          <div className="px-4 py-3 col-span-2">Safe Exercises</div>
        </div>
        {plan.map((row, idx) => (
          <div
            key={row.day}
            className={`grid grid-cols-3 sm:grid-cols-4 border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="px-4 py-3 font-medium text-gray-900">{row.day}</div>
            <div className="px-4 py-3 text-gray-800">{row.focus}</div>
            <div className="px-4 py-3 col-span-2 text-gray-700">{row.safe}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Visible Change Timeline</h3>
        <div className="relative pl-4">
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gray-200" />
          <ul className="space-y-4">
            {milestones.map((m, i) => (
              <li key={m.time} className="relative">
                <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                <div className="ml-4 bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500">{m.time}</p>
                  <p className="font-medium text-gray-900">{m.change}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

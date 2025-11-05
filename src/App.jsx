import React from 'react';
import Header from './components/Header';
import RoutineChecklist from './components/RoutineChecklist';
import NutritionPlan from './components/NutritionPlan';
import WorkoutPlan from './components/WorkoutPlan';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-gray-900">
      <Header />
      <main>
        <RoutineChecklist />
        <NutritionPlan />
        <WorkoutPlan />

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3">Daily Tips</h3>
            <ul className="grid sm:grid-cols-2 gap-2 list-disc list-inside text-gray-700">
              <li>Protein every 3–4 hours (even snacks).</li>
              <li>Walk 10 minutes after every meal — helps belly fat burn.</li>
              <li>Limit sugar, soft drinks, alcohol.</li>
              <li>Keep posture upright — slouching adds belly pressure and shoulder pain.</li>
            </ul>
          </div>
        </section>
      </main>
      <footer className="text-center text-xs text-gray-500 pb-8">
        Built for your goals — consistent, simple, effective.
      </footer>
    </div>
  );
}

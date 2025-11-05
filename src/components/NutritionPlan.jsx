import React from 'react';
import { Apple } from 'lucide-react';

const intake = [
  { name: 'Calories', amount: '~2,000 kcal/day', why: 'Enough to gain lean mass slowly' },
  { name: 'Protein', amount: '110–130 g', why: 'Builds muscle, reduces belly fat' },
  { name: 'Carbs', amount: '200 g', why: 'Energy for travel & light training' },
  { name: 'Healthy fats', amount: '50–60 g', why: 'Hormones, joint health' },
  { name: 'Water', amount: '3–4 L/day', why: 'Digestion & recovery' },
];

const meals = [
  {
    title: 'Morning (after waking)',
    items: ['Warm water + lemon', '5 soaked almonds + 2 walnuts', '1 banana or apple'],
  },
  {
    title: 'Breakfast',
    items: ['4 boiled eggs or 100 g paneer/tofu', '1 bowl oats or poha', '1 cup milk or protein shake'],
  },
  {
    title: 'Mid-Morning',
    items: ['1 fruit (papaya, guava, or apple)', '1 green tea'],
  },
  {
    title: 'Lunch (hotel/restaurant)',
    items: [
      'Grilled chicken or paneer (150–200 g)',
      '1 cup rice or 2 chapatis',
      '1 bowl dal or vegetables',
      'Salad',
      'Avoid creamy gravies, fried items, sugary drinks.',
    ],
  },
  {
    title: 'Evening Snack',
    items: ['Roasted chana, boiled eggs, or paneer cubes', '1 fruit or black coffee'],
  },
  {
    title: 'Dinner',
    items: ['1 roti or small cup rice', 'Grilled chicken/fish/paneer + veggies', '1 bowl curd'],
  },
  {
    title: 'Before Bed',
    items: ['1 glass milk with turmeric or 1 scoop casein'],
  },
];

export default function NutritionPlan() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-200">
          <Apple className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Ideal Daily Intake</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {intake.map((i) => (
          <div key={i.name} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">{i.name}</p>
            <p className="mt-1 font-semibold text-gray-900">{i.amount}</p>
            <p className="mt-2 text-sm text-gray-600">{i.why}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {meals.map((m) => (
          <div key={m.title} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-900">{m.title}</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700 text-sm">
              {m.items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

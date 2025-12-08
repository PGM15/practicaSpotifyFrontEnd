'use client';

import { useState, useEffect } from 'react';

const PRESETS = [
  { label: "Mainstream (80-100)", min: 80, max: 100 },
  { label: "Popular (50-80)", min: 50, max: 80 },
  { label: "Underground (0-50)", min: 0, max: 50 }
];

export default function PopularityWidget({ selectedItems, onSelect }) {

  const defaultRange = [0, 100];

  const [range, setRange] = useState(selectedItems || defaultRange);
  const [minVal, maxVal] = range;

  // Sincronizar cuando dashboard cambie
  useEffect(() => {
    if (selectedItems) setRange(selectedItems);
  }, [selectedItems]);

  const updateRange = (newMin, newMax) => {
    const updated = [Number(newMin), Number(newMax)];
    setRange(updated);
    onSelect(updated);
  };

  const applyPreset = (preset) => {
    const updated = [preset.min, preset.max];
    setRange(updated);
    onSelect(updated);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">📊 Popularidad</h2>

      {/* Presets */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className={`p-3 rounded-lg border text-center transition ${
              minVal === p.min && maxVal === p.max
                ? "bg-blue-600 border-blue-400"
                : "bg-gray-700 border-gray-600 hover:bg-gray-600"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Slider doble */}
      <div className="flex flex-col gap-4">
        
        <div>
          <label className="font-semibold">Min Popularity: {minVal}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={minVal}
            onChange={(e) => updateRange(e.target.value, maxVal)}
            className="w-full"
          />
        </div>

        <div>
          <label className="font-semibold">Max Popularity: {maxVal}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={maxVal}
            onChange={(e) => updateRange(minVal, e.target.value)}
            className="w-full"
          />
        </div>

      </div>

      {/* Mostrar rango actual */}
      <p className="text-gray-300 mt-4">
        Popularidad seleccionada: <strong>{minVal} – {maxVal}</strong>
      </p>
    </div>
  );
}

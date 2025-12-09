'use client';

import { useState } from 'react';
import { DECADES } from '@/lib/decades';

export default function DecadeWidget({ selectedItems, onSelect }) {
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Añadir o quitar década
  const toggleDecade = (decade) => {
    const exists = selectedItems.includes(decade);

    if (exists) {
      onSelect(selectedItems.filter(d => d !== decade));
    } else {
      onSelect([...selectedItems, decade]);
    }
  };

  // Añadir rango personalizado
  const applyCustomRange = () => {
    if (!customStart || !customEnd) return;

    const start = parseInt(customStart);
    const end = parseInt(customEnd);

    if (isNaN(start) || isNaN(end) || start >= end) return;

    // Añadimos el valor de rango como "1993-2001"
    const rangeValue = `${start}-${end}`;

    if (!selectedItems.includes(rangeValue)) {
      onSelect([...selectedItems, rangeValue]);
    }
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">📅 Elegir Décadas / Eras</h2>

      {/* Selector de décadas */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {DECADES.map(decade => {
          const selected = selectedItems.includes(decade);

          return (
            <button
              key={decade}
              onClick={() => toggleDecade(decade)}
              className={`p-3 rounded-lg border text-center transition capitalize ${
                selected
                  ? 'bg-blue-600 border-blue-400'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
            >
              {decade}s
            </button>
          );
        })}
      </div>

      {/* Rango de años personalizado */}
      <h3 className="font-semibold mb-2">🎯 Rango de años personalizado</h3>

      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="Inicio (ej: 1990)"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
        />

        <input
          type="number"
          placeholder="Fin (ej: 1999)"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={applyCustomRange}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
      >
        Añadir rango
      </button>

      {/* Lista de seleccionados */}
      {selectedItems.length > 0 && (
        <div className="mt-4 text-sm text-gray-300">
          <p><strong>Seleccionado:</strong></p>
          <ul className="list-disc ml-5 mt-2">
            {selectedItems.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

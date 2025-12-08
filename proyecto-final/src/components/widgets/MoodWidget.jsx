'use client';

import { useState, useEffect } from 'react';

const MOODS = [
  { label: "Happy", energy: 70, valence: 80, danceability: 60, acousticness: 20 },
  { label: "Sad", energy: 20, valence: 20, danceability: 30, acousticness: 70 },
  { label: "Energetic", energy: 90, valence: 60, danceability: 85, acousticness: 10 },
  { label: "Calm", energy: 30, valence: 60, danceability: 40, acousticness: 80 },
];

export default function MoodWidget({ selectedItems, onSelect }) {

  // Valores por defecto garantizados siempre
  const defaultParams = {
    energy: 50,
    valence: 50,
    danceability: 50,
    acousticness: 50,
    mood: null
  };

  // PROTECCIÓN: selectedItems puede venir undefined → fusionamos con default
  const [params, setParams] = useState({
    ...defaultParams,
    ...(selectedItems || {})
  });

  // Si el dashboard actualiza `selectedItems`, sincronizamos los valores
  useEffect(() => {
    setParams({
      ...defaultParams,
      ...(selectedItems || {})
    });
  }, [selectedItems]);


  const handleChange = (key, value) => {
    const newParams = { ...params, [key]: Number(value) };
    setParams(newParams);
    onSelect(newParams);
  };

  const applyMoodPreset = (preset) => {
    const newParams = {
      energy: preset.energy,
      valence: preset.valence,
      danceability: preset.danceability,
      acousticness: preset.acousticness,
      mood: preset.label
    };
    setParams(newParams);
    onSelect(newParams);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">😊 Mood & Energy</h2>

      {/* Moods predefinidos */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {MOODS.map(m => (
          <button
            key={m.label}
            onClick={() => applyMoodPreset(m)}
            className={`p-3 rounded-lg border text-center transition ${
              params.mood === m.label
                ? "bg-yellow-600 border-yellow-400"
                : "bg-gray-700 border-gray-600 hover:bg-gray-600"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* SLIDERS */}
      <div className="flex flex-col gap-5">

        {/* Energy */}
        <div>
          <label className="font-semibold">⚡ Energy: {params.energy}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={params.energy}
            onChange={(e) => handleChange("energy", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Valence */}
        <div>
          <label className="font-semibold">😊 Valence: {params.valence}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={params.valence}
            onChange={(e) => handleChange("valence", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Danceability */}
        <div>
          <label className="font-semibold">💃 Danceability: {params.danceability}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={params.danceability}
            onChange={(e) => handleChange("danceability", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Acousticness */}
        <div>
          <label className="font-semibold">🎻 Acousticness: {params.acousticness}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={params.acousticness}
            onChange={(e) => handleChange("acousticness", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Mostrar mood elegido */}
      {params.mood && (
        <p className="text-gray-300 mt-4">
          Mood seleccionado: <strong>{params.mood}</strong>
        </p>
      )}
    </div>
  );
}

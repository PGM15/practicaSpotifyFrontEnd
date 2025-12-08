'use client';

import { useState, useMemo } from 'react';
import { GENRES } from '@/lib/genres';

export default function GenreWidget({ selectedItems, onSelect }) {
  const [query, setQuery] = useState('');

  // Filtrar géneros según la búsqueda
  const filteredGenres = useMemo(() => {
    return GENRES.filter(g =>
      g.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Agregar / quitar género
  const toggleGenre = (genre) => {
    const exists = selectedItems.includes(genre);

    if (exists) {
      onSelect(selectedItems.filter(g => g !== genre));
    } else {
      if (selectedItems.length < 5) {
        onSelect([...selectedItems, genre]);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">🎸 Seleccionar Géneros</h2>

      {/* Input de búsqueda */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar género…"
        className="w-full p-2 bg-gray-700 text-white rounded-lg mb-4"
      />

      {/* Lista de géneros */}
      <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
        {filteredGenres.map((genre) => {
          const selected = selectedItems.includes(genre);

          return (
            <div
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`p-2 rounded-lg cursor-pointer capitalize ${
                selected
                  ? 'bg-purple-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {genre}
            </div>
          );
        })}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredGenres.length === 0 && (
        <p className="text-gray-400 mt-3">No se encontraron géneros.</p>
      )}
    </div>
  );
}

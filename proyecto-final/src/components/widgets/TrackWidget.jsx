'use client';

import { useEffect, useState } from 'react';
import { searchTracks, searchTracksByGenre } from '@/lib/spotify';

// Debounce para evitar spam a la API
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function TrackWidget({ selectedItems, onSelect, genre = null }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);

      // 🔥 SI HAY GÉNERO SELECCIONADO → BUSCAR POR GÉNERO
      if (genre) {
        const data = await searchTracksByGenre(genre);
        setResults(data.tracks?.items || []);
        setLoading(false);
        return;
      }

      // 🔥 SI NO HAY QUERY → limpiar
      if (!debouncedQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      // 🔥 BÚSQUEDA NORMAL POR TEXTO
      const data = await searchTracks(debouncedQuery);
      setResults(data.tracks?.items || []);
      setLoading(false);
    };

    fetchTracks();
  }, [debouncedQuery, genre]);

  const toggleTrack = (track) => {
    const exists = selectedItems.some(t => t.id === track.id);

    if (exists) {
      onSelect(selectedItems.filter(t => t.id !== track.id));
    } else {
      onSelect([...selectedItems, track]);
    }
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-xl mt-10">
      <h2 className="text-xl font-bold mb-4">
        🎵 Buscar Canciones {genre ? `(Género: ${genre})` : ""}
      </h2>

      {/* Input solo si NO hay género seleccionado */}
      {!genre && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca una canción…"
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
        />
      )}

      {loading && <p className="text-gray-400 mb-3">Cargando...</p>}

      {/* Resultados */}
      <div className="flex flex-col gap-3">
        {results.map(track => {
          const selected = selectedItems.some(t => t.id === track.id);

          return (
            <div
              key={track.id}
              onClick={() => toggleTrack(track)}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                selected ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <img
                src={track.album?.images?.[2]?.url || '/placeholder.jpg'}
                className="w-12 h-12 rounded-lg"
                alt={track.name}
              />

              <div className="flex flex-col">
                <span className="font-semibold">{track.name}</span>
                <span className="text-sm text-gray-300">
                  {track.artists.map(a => a.name).join(', ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && results.length === 0 && (
        <p className="text-gray-400 mt-4">No se encontraron canciones.</p>
      )}
    </div>
  );
}

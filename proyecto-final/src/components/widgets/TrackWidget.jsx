'use client';

import { useEffect, useState } from 'react';
import { searchTracks, searchTracksByGenre } from '@/lib/spotify';
import { useFavorites } from '@/context/FavoriteContext'; // ⭐ añadido

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
  const { toggleFavorite } = useFavorites(); // ⭐ añadido

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);

        if (genre) {
          const data = await searchTracksByGenre(genre);

          if (!data?.tracks?.items) {
            console.warn("Respuesta inesperada al buscar por género"); // CONTROL DE ERROR
            setResults([]);
          } else {
            setResults(data.tracks.items);
          }

          setLoading(false);
          return;
        }

        if (!debouncedQuery) {
          setResults([]); // CONTROL DE ERROR: evitar búsquedas vacías
          setLoading(false);
          return;
        }

        const data = await searchTracks(debouncedQuery);

        if (!data?.tracks?.items) {
          console.warn("Respuesta inesperada al buscar tracks"); // CONTROL DE ERROR
          setResults([]);
        } else {
          setResults(data.tracks.items);
        }
      } catch (err) {
        console.error("Error fetching tracks:", err); // CONTROL DE ERROR
      } finally {
        setLoading(false);
      }
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

      <div className="flex flex-col gap-3">
        {results.map(track => {
          const selected = selectedItems.some(t => t.id === track.id);

          return (
            <div
              key={track.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                selected ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {/* Seleccionar canción */}
              <div
                onClick={() => toggleTrack(track)}
                className="flex items-center gap-4 flex-1"
              >
                <img
                  src={track.album?.images?.[2]?.url || '/placeholder.jpg'}
                  alt={track.name}
                  className="w-12 h-12 rounded-lg"
                />

                <div className="flex flex-col">
                  <span className="font-semibold">{track.name}</span>
                  <span className="text-sm text-gray-300">
                    {track.artists.map(a => a.name).join(', ')}
                  </span>
                </div>
              </div>

              {/* ⭐ FAVORITO */}
              <button
                onClick={() =>
                  toggleFavorite({
                    id: track.id,
                    name: track.name,
                    image: track.album?.images?.[2]?.url || null,
                    artists: track.artists?.map(a => a.name).join(', '),
                    type: "track"
                  })
                }
                className="text-yellow-400 hover:text-yellow-500 text-xl px-2"
              >
                ⭐
              </button>
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

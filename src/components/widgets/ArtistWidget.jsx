'use client';

import { useEffect, useState } from 'react';
import { searchArtists } from '@/lib/spotify';

// Debounce para no saturar la API
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function ArtistWidget({ selectedItems, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query);

  // Buscar artistas en Spotify usando searchArtists()
  useEffect(() => {
    const fetchArtists = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const data = await searchArtists(debouncedQuery);

        setResults(data?.artists?.items || []);
      } catch (error) {
        console.error('Error buscando artistas:', error);
      }

      setLoading(false);
    };

    fetchArtists();
  }, [debouncedQuery]);

  // Agregar o quitar artista de la selección
  const toggleArtist = (artist) => {
    const exists = selectedItems.some((a) => a.id === artist.id);

    if (exists) {
      onSelect(selectedItems.filter((a) => a.id !== artist.id));
    } else {
      if (selectedItems.length < 5) {
        onSelect([...selectedItems, artist]);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">🎤 Buscar Artistas</h2>

      {/* Input de búsqueda */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca un artista…"
        className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
      />

      {/* Estado de carga */}
      {loading && <p className="text-gray-400 mb-3">Cargando...</p>}

      {/* Lista de resultados */}
      <div className="flex flex-col gap-3">
        {results.map((artist) => {
          const selected = selectedItems.some((a) => a.id === artist.id);

          return (
            <div
              key={artist.id}
              onClick={() => toggleArtist(artist)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                selected
                  ? 'bg-green-600'
                  : 'bg-gray-700 hover:bg-gray-600 transition'
              }`}
            >
              <img
                src={artist.images?.[2]?.url || '/placeholder.jpg'}
                alt={artist.name}
                className="w-12 h-12 object-cover rounded-full"
              />

              <div className="flex flex-col">
                <span className="font-semibold">{artist.name}</span>
                {artist.followers?.total && (
                  <span className="text-xs text-gray-300">
                    {artist.followers.total.toLocaleString()} seguidores
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Texto cuando no hay resultados */}
      {!loading && query !== '' && results.length === 0 && (
        <p className="text-gray-400 mt-4">No se encontraron artistas.</p>
      )}
    </div>
  );
}

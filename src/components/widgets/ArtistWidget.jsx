'use client';

import { useEffect, useState } from 'react';
import { searchArtists } from '@/lib/spotify';
import { useFavorites } from '@/context/FavoriteContext';

// Debounce para evitar saturar API
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
  const { toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchArtists = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const data = await searchArtists(debouncedQuery);

        if (!data?.artists?.items) {
          console.warn("Respuesta inesperada al buscar artistas");
          setResults([]);
        } else {
          setResults(data.artists.items);
        }

      } catch (error) {
        console.error("Error buscando artistas:", error);
      }

      setLoading(false);
    };

    fetchArtists();
  }, [debouncedQuery]);

  const toggleArtist = (artist) => {
    const exists = selectedItems.some(a => a.id === artist.id);
    if (exists) {
      onSelect(selectedItems.filter(a => a.id !== artist.id));
    } else {
      if (selectedItems.length < 5) {
        onSelect([...selectedItems, artist]);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">🎤 Buscar Artistas</h2>

      {/* BUSCADOR */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca un artista…"
        className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
      />

      {loading && <p className="text-gray-400 mb-3">Cargando…</p>}

      {/* RESULTADOS */}
      <div className="flex flex-col gap-3">
        {results.map((artist) => {
          const selected = selectedItems.some(a => a.id === artist.id);

          return (
            <div
              key={artist.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                selected ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {/* Selección */}
              <div
                onClick={() => toggleArtist(artist)}
                className="flex items-center gap-3 flex-1"
              >
                <img
                  src={artist.images?.[2]?.url || '/placeholder.jpg'}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full object-cover"
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

              {/* ⭐ FAVORITO */}
              <button
                onClick={() =>
                  toggleFavorite({
                    id: artist.id,
                    name: artist.name,
                    image: artist.images?.[2]?.url || null,
                    type: "artist"
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

      {!loading && query !== '' && results.length === 0 && (
        <p className="text-gray-400 mt-4">No se encontraron artistas.</p>
      )}
    </div>
  );
}

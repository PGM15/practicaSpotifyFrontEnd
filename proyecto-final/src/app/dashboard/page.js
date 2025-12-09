'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';

import ArtistWidget from '@/components/widgets/ArtistWidget.jsx';
import TrackWidget from '@/components/widgets/TrackWidget.jsx';
import GenreWidget from '@/components/widgets/GenreWidget.jsx';
import DecadeWidget from '@/components/widgets/DecadeWidget.jsx';
import MoodWidget from '@/components/widgets/MoodWidget.jsx';
import PopularityWidget from '@/components/widgets/PopularityWidget.jsx';

import PlaylistDisplay from '@/components/widgets/PlaylistDisplay.jsx';
import { generatePlaylist } from '@/lib/spotify';

export default function Dashboard() {
  const router = useRouter();

  // 🔥 ESTADO ÚNICO PARA TODOS LOS WIDGETS
  const [preferences, setPreferences] = useState({
    artists: [],
    tracks: [],
    genres: [],
    decades: [],
    mood: null,
    popularity: [0, 100],
  });

  // 🔥 ESTADO PARA LA PLAYLIST
  const [playlist, setPlaylist] = useState([]);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  // 🔥 HANDLERS PARA CADA WIDGET
  const handleArtists = items => setPreferences(prev => ({ ...prev, artists: items }));
  const handleTracks = items => setPreferences(prev => ({ ...prev, tracks: items }));
  const handleGenres = items => setPreferences(prev => ({ ...prev, genres: items }));
  const handleDecades = items => setPreferences(prev => ({ ...prev, decades: items }));
  const handleMood = items => setPreferences(prev => ({ ...prev, mood: items }));
  const handlePopularity = items => setPreferences(prev => ({ ...prev, popularity: items }));

  // 🔐 Proteger ruta dashboard
  useEffect(() => {
    if (!isAuthenticated()) router.push('/');
  }, [router]);

  // 🎵 GENERAR PLAYLIST
  const handleGeneratePlaylist = async () => {
    setLoadingPlaylist(true);

    try {
      const tracks = await generatePlaylist(preferences);
      setPlaylist(tracks);
    } catch (error) {
      console.error("Error generando playlist:", error);
    }

    setLoadingPlaylist(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span role="img" aria-label="chart">📊</span> Dashboard
        </h1>

        <button
          onClick={() => { logout(); router.push('/'); }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
        >
          Logout
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex flex-col gap-10 max-w-3xl mx-auto">

        <ArtistWidget
          selectedItems={preferences.artists}
          onSelect={handleArtists}
        />

        <TrackWidget
          selectedItems={preferences.tracks}
          onSelect={handleTracks}
          genre={preferences.genres[0]}
        />

        <GenreWidget
          selectedItems={preferences.genres}
          onSelect={handleGenres}
        />

        <DecadeWidget
          selectedItems={preferences.decades}
          onSelect={handleDecades}
        />

        <MoodWidget
          selectedItems={preferences.mood}
          onSelect={handleMood}
        />

        <PopularityWidget
          selectedItems={preferences.popularity}
          onSelect={handlePopularity}
        />

        {/* BOTÓN PARA GENERAR PLAYLIST */}
        <button
          onClick={handleGeneratePlaylist}
          className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition text-xl font-semibold"
        >
          🎧 Generar Playlist
        </button>

        {/* LOADING */}
        {loadingPlaylist && (
          <p className="text-gray-300">Generando playlist...</p>
        )}

        {/* PLAYLIST RESULTANTE */}
        {playlist.length > 0 && (
          <PlaylistDisplay tracks={playlist} />
        )}

      </div>
    </main>
  );
}

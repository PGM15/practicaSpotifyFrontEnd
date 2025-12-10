'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';

import ArtistWidget from '@/components/widgets/ArtistWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import PlaylistDisplay from '@/components/widgets/PlaylistDisplay';
import FavoritesList from "@/components/FavoritesList";

import { generatePlaylist } from '@/lib/spotify';

export default function Dashboard() {
  const router = useRouter();

  const [preferences, setPreferences] = useState({
    artists: [],
    tracks: [],
    genres: [],
    decades: [],
    mood: null,
    popularity: [0, 100],
  });

  const [playlist, setPlaylist] = useState([]);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  const handleArtists = items => setPreferences(prev => ({ ...prev, artists: items }));
  const handleTracks = items => setPreferences(prev => ({ ...prev, tracks: items }));
  const handleGenres = items => setPreferences(prev => ({ ...prev, genres: items }));
  const handleDecades = items => setPreferences(prev => ({ ...prev, decades: items }));
  const handleMood = items => setPreferences(prev => ({ ...prev, mood: items }));
  const handlePopularity = items => setPreferences(prev => ({ ...prev, popularity: items }));

  useEffect(() => {
    if (!isAuthenticated()) router.push('/');
  }, [router]);

  const handleGeneratePlaylist = async () => {
    setLoadingPlaylist(true);

    try {
      const newTracks = await generatePlaylist(preferences);
      setPlaylist(newTracks);
    } catch (err) {
      console.error(err);
    }

    setLoadingPlaylist(false);
  };

  const handleRefreshPlaylist = async () => {
    setLoadingPlaylist(true);

    try {
      const freshTracks = await generatePlaylist(preferences);
      setPlaylist(freshTracks);
    } catch (err) {}

    setLoadingPlaylist(false);
  };

  const handleAddTracks = async () => {
    setLoadingPlaylist(true);

    try {
      const extraTracks = await generatePlaylist(preferences);
      const merged = [...playlist, ...extraTracks];
      const unique = Array.from(new Map(merged.map(t => [t.id, t])).values());
      setPlaylist(unique);
    } catch (err) {}

    setLoadingPlaylist(false);
  };

  return (
    <main className="min-h-screen p-4 sm:p-10 bg-[#121212] text-white">

      {/* HEADER */}
      <header className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center mb-12 border-b border-[#1f1f1f] pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <span className="text-[#1DB954] text-5xl">🎧</span>
          Tu Dashboard Musical
        </h1>

        <button
          onClick={() => { logout(); router.push('/'); }}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-md hover:scale-105 w-full sm:w-auto"
        >
          Logout
        </button>
      </header>

      {/* GRID RESPONSIVE DE WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        <div className="spotify-card">
          <ArtistWidget selectedItems={preferences.artists} onSelect={handleArtists} />
        </div>

        <div className="spotify-card">
          <TrackWidget selectedItems={preferences.tracks} onSelect={handleTracks} genre={preferences.genres[0]} />
        </div>

        <div className="spotify-card">
          <GenreWidget selectedItems={preferences.genres} onSelect={handleGenres} />
        </div>

        <div className="spotify-card">
          <DecadeWidget selectedItems={preferences.decades} onSelect={handleDecades} />
        </div>

        <div className="spotify-card">
          <MoodWidget selectedItems={preferences.mood} onSelect={handleMood} />
        </div>

        <div className="spotify-card">
          <PopularityWidget selectedItems={preferences.popularity} onSelect={handlePopularity} />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN PRINCIPALES */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-10">

        <button
          onClick={handleGeneratePlaylist}
          className="btn-spotify text-xl text-black rounded-full transition-all shadow-lg hover:scale-105 w-full"
        >
          🎧 Generar Playlist
        </button>

        {playlist.length > 0 && (
          <>
            <button
              onClick={handleRefreshPlaylist}
              className="px-6 py-3 text-xl bg-yellow-600 hover:bg-yellow-700 rounded-full transition-all shadow-lg hover:scale-105 w-full"
            >
              🔄 Refrescar Playlist
            </button>

            <button
              onClick={handleAddTracks}
              className="px-6 py-3 text-xl bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-lg hover:scale-105 w-full"
            >
              ➕ Añadir Más Canciones
            </button>
          </>
        )}

        {loadingPlaylist && (
          <p className="text-center text-gray-400">Cargando playlist...</p>
        )}

        {/* PLAYLIST Y FAVORITOS */}
        {playlist.length > 0 && (
          <PlaylistDisplay tracks={playlist} setPlaylist={setPlaylist} />
        )}

        <FavoritesList />
      </div>
    </main>
  );
}

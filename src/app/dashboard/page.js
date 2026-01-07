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
  const [savingToSpotify, setSavingToSpotify] = useState(false);

  // handlers
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

  // 🟢 NUEVO: guardar playlist en Spotify
  const handleSaveToSpotify = async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      alert('Debes iniciar sesión con Spotify');
      return;
    }

    setSavingToSpotify(true);

    try {
      const res = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Mi Taste Mixer Playlist 🎧',
          tracks: playlist.map(track => track.uri),
          accessToken,
        }),
      });

      if (!res.ok) throw new Error();

      alert('✅ Playlist creada en tu Spotify');
    } catch (err) {
      alert('❌ Error creando la playlist');
    }

    setSavingToSpotify(false);
  };

  return (
    <main className="min-h-screen p-6 sm:p-10 dashboard-bg relative">

      {/* HEADER */}
      <header className="relative mb-14 fade-in">
        <div className="relative flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-[#1f1f1f]">
          <h1 className="text-5xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="text-[#1DB954] text-6xl animate-pulse">🎧</span>
            Dashboard Musical
          </h1>

          <button
            onClick={() => { logout(); router.push('/'); }}
            className="px-6 py-2 mt-5 sm:mt-0 bg-red-600 hover:bg-red-700 rounded-full shadow-xl hover:scale-110 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* GRID DE WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">

        <ArtistWidget selectedItems={preferences.artists} onSelect={handleArtists} />
        <TrackWidget selectedItems={preferences.tracks} onSelect={handleTracks} genre={preferences.genres[0]} />
        <GenreWidget selectedItems={preferences.genres} onSelect={handleGenres} />
        <DecadeWidget selectedItems={preferences.decades} onSelect={handleDecades} />
        <MoodWidget selectedItems={preferences.mood} onSelect={handleMood} />
        <PopularityWidget selectedItems={preferences.popularity} onSelect={handlePopularity} />

      </div>

      {/* BOTONES */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-10">

        <button
          onClick={handleGeneratePlaylist}
          className="btn-spotify w-full text-xl text-black"
        >
          🚀 Generar Playlist
        </button>

        {playlist.length > 0 && (
          <>
            <button
              onClick={handleRefreshPlaylist}
              className="px-6 py-3 text-xl bg-yellow-600 hover:bg-yellow-700 rounded-full"
            >
              🔄 Refrescar Playlist
            </button>

            <button
              onClick={handleAddTracks}
              className="px-6 py-3 text-xl bg-blue-600 hover:bg-blue-700 rounded-full"
            >
              ➕ Añadir Más Canciones
            </button>

            {/* 🟢 NUEVO BOTÓN */}
            <button
              onClick={handleSaveToSpotify}
              disabled={savingToSpotify}
              className="px-6 py-3 text-xl bg-green-500 hover:bg-green-600 rounded-full text-black font-bold"
            >
              {savingToSpotify ? '⏳ Guardando en Spotify...' : '💾 Guardar en mi Spotify'}
            </button>
          </>
        )}

        {loadingPlaylist && (
          <p className="text-center text-gray-400">Cargando playlist...</p>
        )}

        {playlist.length > 0 && (
          <PlaylistDisplay tracks={playlist} setPlaylist={setPlaylist} />
        )}

        <FavoritesList />
      </div>
    </main>
  );
}

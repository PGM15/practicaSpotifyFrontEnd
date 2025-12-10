'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0d1117] text-white px-4">

      {/* Fondo animado */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1a1f2e] via-[#0d1117] to-black opacity-90"></div>
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#1DB954] opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#1DB954] opacity-20 blur-3xl rounded-full animate-pulse delay-2000"></div>

      {/* Tarjeta principal */}
      <div className="bg-white/5 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-lg w-full border border-white/10 animate-fadeIn flex flex-col items-center text-center">
        
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
          🎵 Spotify Taste Mixer
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Proyecta tus gustos musicales para generar tu playlist ideal.<br/>
        </p>

        {/* Botón login */}
        <button
          onClick={handleLogin}
          className="px-7 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black text-lg font-semibold rounded-full
                     transition-all shadow-lg hover:scale-105"
        >
          Iniciar sesión con Spotify
        </button>

        {/* Info del proyecto */}
        <div className="mt-8 text-gray-400 text-sm animate-slideUp">
          <p>✨ Explora artistas, géneros, moods y épocas.</p>
          <p>✨ Genera playlists de forma inteligente.</p>
          <p>✨ Guarda tus canciones favoritas.</p>
        </div>
      </div>
    </main>
  );
}

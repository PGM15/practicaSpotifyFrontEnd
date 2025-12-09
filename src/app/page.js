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
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">🎵 Spotify Taste Mixer</h1>

      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 transition rounded-lg text-lg font-semibold"
      >
        Login with Spotify
      </button>
    </main>
  );
}

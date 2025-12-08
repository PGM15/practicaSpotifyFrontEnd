'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';
import ArtistWidget from '@/components/widgets/ArtistWidget.jsx';

export default function Dashboard() {
  const router = useRouter();
  const [selectedArtists, setSelectedArtists] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        <button
          onClick={() => { logout(); router.push('/'); }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Logout
        </button>
      </header>

      <ArtistWidget 
        selectedItems={selectedArtists}
        onSelect={setSelectedArtists}
      />
    </main>
  );
}

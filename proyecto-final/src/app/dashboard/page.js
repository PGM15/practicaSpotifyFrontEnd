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




export default function Dashboard() {
  const router = useRouter();

  // ESTADOS PARA CADA WIDGET
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [moodSettings, setMoodSettings] = useState(null);
  const [popularityRange, setPopularityRange] = useState([0, 100]);





  // Proteger ruta de dashboard
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

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

        {/* WIDGET: ARTISTAS */}
        <ArtistWidget
          selectedItems={selectedArtists}
          onSelect={setSelectedArtists}
        />

        {/* WIDGET: TRACKS */}
        <TrackWidget
        selectedItems={selectedTracks}
        onSelect={setSelectedTracks}
        genre={selectedGenres[0]}   // el primer género seleccionado
        />


        {/* WIDGET: GÉNEROS */}
        <GenreWidget
          selectedItems={selectedGenres}
          onSelect={setSelectedGenres}
        />
        <DecadeWidget
            selectedItems={selectedDecades}
            onSelect={setSelectedDecades}
        />
        <MoodWidget
            selectedItems={moodSettings}
            onSelect={setMoodSettings}
        />

        <PopularityWidget
            selectedItems={popularityRange}
            onSelect={setPopularityRange}
        />

      </div>
    </main>
  );
}

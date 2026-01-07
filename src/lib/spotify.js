export function getAccessToken() {
  if (typeof window === "undefined") return null; // evita SSR crash
  
  const token = localStorage.getItem("access_token");

  // Si el token no existe, intenta obtenerlo desde sessionStorage (a veces se guarda ahí en Next.js)
  if (!token) return sessionStorage.getItem("access_token");

  return token;
}


export async function searchArtists(query) {
  const token = getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.json();
}

export async function searchTracks(query) {
  const token = getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.json(); // devuelve { tracks: { items: [...] } }
}

export async function searchTracksByGenre(genre) {
  const token = getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=20`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return res.json(); // { tracks: { items: [...] } }
}



export async function generatePlaylist(preferences) {
  const { artists, tracks, genres, decades, popularity } = preferences;
  const token = await getAccessToken();

  let artistTracks = [];
  let genreTracks = [];
  let seedTracks = [];

  // 1️⃣ TRACKS SELECCIONADOS (TrackWidget) – PRIORIDAD ALTA
  for (const track of tracks.slice(0, 5)) {
    const res = await fetch(
      `https://api.spotify.com/v1/tracks/${track.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    seedTracks.push(data);
  }

  // 2️⃣ Tracks por artista
  for (const artist of artists.slice(0, 3)) {
    const res = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    artistTracks.push(...data.tracks.slice(0, 5));
  }

  // 3️⃣ Tracks por género
  for (const genre of genres.slice(0, 3)) {
    const res = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=15`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    genreTracks.push(...data.tracks.items.slice(0, 5));
  }

  // 4️⃣ Mezclar TODAS las fuentes
  let allTracks = [
    ...seedTracks,
    ...artistTracks,
    ...genreTracks,
  ];

  // 5️⃣ Filtrar por década
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const start = parseInt(decade);
        return year >= start && year < start + 10;
      });
    });
  }

  // 6️⃣ Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 7️⃣ Quitar duplicados
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  );

  // 8️⃣ Mezclar aleatoriamente
  const shuffled = uniqueTracks.sort(() => 0.5 - Math.random());

  // 9️⃣ Limitar resultado final
  return shuffled.slice(0, 30);
}

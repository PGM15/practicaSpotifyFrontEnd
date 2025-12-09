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
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Top tracks por artista
  for (const artist of artists) {
    const tracks = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await tracks.json();
    allTracks.push(...data.tracks);
  }

  // 2. Buscar por género
  for (const genre of genres) {
    const results = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await results.json();
    allTracks.push(...data.tracks.items);
  }

  // 3. Filtrar por década
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Quitar duplicados y limitar
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}

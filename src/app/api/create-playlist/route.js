export async function POST(req) {
  try {
    const { name, tracks, accessToken } = await req.json();

    // 1️⃣ Validaciones
    if (!accessToken) {
      return Response.json(
        { error: "No access token" },
        { status: 401 }
      );
    }

    if (!tracks || tracks.length === 0) {
      return Response.json(
        { error: "No tracks provided" },
        { status: 400 }
      );
    }

    // 2️⃣ Obtener usuario
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userRes.ok) {
      const err = await userRes.text();
      return Response.json(
        { error: err },
        { status: userRes.status }
      );
    }

    const userData = await userRes.json();

    // 3️⃣ Crear playlist
    const playlistRes = await fetch(
      `https://api.spotify.com/v1/users/${userData.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "Mi Taste Mixer Playlist 🎧",
          public: true,
        }),
      }
    );

    if (!playlistRes.ok) {
      const err = await playlistRes.text();
      return Response.json(
        { error: err },
        { status: playlistRes.status }
      );
    }

    const playlist = await playlistRes.json();

    // 4️⃣ Añadir canciones (URIs DIRECTAS)
    const addTracksRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: tracks, 
        }),
      }
    );

    if (!addTracksRes.ok) {
      const err = await addTracksRes.text();
      return Response.json(
        { error: err },
        { status: addTracksRes.status }
      );
    }

    return Response.json({
      success: true,
      url: playlist.external_urls.spotify,
    });

  } catch (err) {
    console.error("CREATE PLAYLIST ERROR:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

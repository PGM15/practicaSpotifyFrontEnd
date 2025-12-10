export async function POST(req) {
  try {
    const { name, tracks, accessToken } = await req.json();

    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Missing access token" }), {
        status: 400,
      });
    }

    // 1️⃣ Obtener el ID del usuario
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userRes.json();

    // 2️⃣ Crear playlist
    const createRes = await fetch(
      `https://api.spotify.com/v1/users/${userData.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: "Generada automáticamente con Spotify Taste Mixer 🎧",
          public: true,
        }),
      }
    );

    const playlist = await createRes.json();

    // 3️⃣ Añadir canciones
    const trackUris = tracks.map((t) => `spotify:track:${t.id}`);

    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: trackUris }),
    });

    return Response.json({
      url: playlist.external_urls.spotify,
      id: playlist.id,
    });
  } catch (err) {
    console.error("Error in create playlist:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

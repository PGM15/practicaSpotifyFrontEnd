export default function HomePage() {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirect = process.env.NEXT_PUBLIC_REDIRECT_URI;

    const scopes =
        "user-read-private user-read-email playlist-read-private user-top-read";

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirect
    )}&scope=${encodeURIComponent(scopes)}`;

    return (
        <main style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
            <a href={authUrl}>
                <button style={{ padding: "20px", fontSize: "20px" }}>
                    Login con Spotify
                </button>
            </a>
        </main>
    );
}

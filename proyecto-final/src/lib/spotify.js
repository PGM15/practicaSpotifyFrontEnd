export async function getSpotifyAccessToken(code) {
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Authorization": basicAuthHeader(),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body
    });

    const data = await res.json();
    return data;
}

export async function refreshAccessToken(refreshToken) {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: basicAuthHeader(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body
    });

    return res.json();
}

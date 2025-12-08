import { basicAuthHeader } from "../../../lib/auth";

export async function POST(req) {
    const { refresh_token } = await req.json();

    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: basicAuthHeader(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body
    });

    const data = await res.json();
    return Response.json(data);
}

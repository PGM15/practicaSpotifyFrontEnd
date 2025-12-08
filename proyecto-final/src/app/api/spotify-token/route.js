import { basicAuthHeader } from '@/lib/auth';

export async function POST(req) {
  const { code } = await req.json();

  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body
  });

  const data = await response.json();
  return Response.json(data);
}

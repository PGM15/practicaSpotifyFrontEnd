'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const savedState = localStorage.getItem('spotify_auth_state');

      if (!state || state !== savedState) {
        setError('Error de validación de seguridad (CSRF). Intenta iniciar sesión de nuevo.');
        localStorage.removeItem('spotify_auth_state');
        return;
      }

      localStorage.removeItem('spotify_auth_state');

      const res = await fetch('/api/spotify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('expires_in', data.expires_in);

      router.push('/dashboard');
    };

    run();
  }, [router, searchParams]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-400">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <p>Procesando autenticación...</p>
    </main>
  );
}

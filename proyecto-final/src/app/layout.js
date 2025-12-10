import "./globals.css";
import { FavoriteProvider } from "../context/FavoriteContext";

export const metadata = {
  title: "Spotify Playlist Generator",
  description: "Proyecto Final Web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex justify-center">
        <FavoriteProvider>
          <main className="w-full max-w-6xl px-4 sm:px-6 lg:px-10">
            {children}
          </main>
        </FavoriteProvider>
      </body>
    </html>
  );
}

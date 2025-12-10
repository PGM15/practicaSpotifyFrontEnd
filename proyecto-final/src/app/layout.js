import "./globals.css";
import { FavoriteProvider } from "../context/FavoriteContext";

export const metadata = {
  title: "Spotify Taste Mixer",
  description: "Proyecto Final Web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="w-full min-h-screen overflow-x-hidden">
        <FavoriteProvider>
          {/* Contenedor sin max-width para permitir fondo completo */}
          <main className="w-full min-h-screen">
            {children}
          </main>
        </FavoriteProvider>
      </body>
    </html>
  );
}

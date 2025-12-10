"use client";
import { useFavorites } from "../context/FavoriteContext";

export default function FavoritesList() {
  const { favorites, toggleFavorite } = useFavorites();

  if (!favorites.length)
    return <p className="text-gray-400 text-sm mt-4">No tienes favoritos aún.</p>; // Control de error: lista vacía

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">⭐ Tus Favoritos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map(item => (
          <div key={item.id} className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded"
                />
              )}
              <p>{item.name}</p>
            </div>

            <button
              onClick={() => toggleFavorite(item)}
              className="text-red-400 hover:text-red-600"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

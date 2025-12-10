"use client";

import { useFavorites } from "@/context/FavoriteContext";

export default function PlaylistDisplay({ tracks, setPlaylist }) {
  const { toggleFavorite } = useFavorites();

  const removeTrack = (trackId) => {
    setPlaylist(prev => prev.filter(track => track.id !== trackId));
  };

  return (
    <div className="spotify-card mt-10">
      <h2 className="text-2xl font-bold mb-5">🎵 Tu Playlist Generada</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tracks.map(track => (
          <div
            key={track.id}
            className="flex flex-col bg-gray-700 p-4 rounded-xl hover:bg-gray-600 transition"
          >
            <img
              src={track.album?.images?.[1]?.url || "/placeholder.jpg"}
              alt={track.name}
              className="rounded-lg w-full object-cover"
            />

            <div className="mt-3 flex-1">
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-300">
                {track.artists?.map(a => a.name).join(", ")}
              </p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() =>
                  toggleFavorite({
                    id: track.id,
                    name: track.name,
                    image: track.album?.images?.[2]?.url || null,
                    type: "track",
                  })
                }
                className="text-yellow-400 hover:scale-110 transition text-xl"
              >
                ⭐
              </button>

              <button
                onClick={() => removeTrack(track.id)}
                className="text-red-400 hover:scale-110 transition text-xl"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

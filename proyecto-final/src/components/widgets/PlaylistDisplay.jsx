export default function PlaylistDisplay({ tracks }) {
  return (
    <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-5">🎵 Tu Playlist Generada</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tracks.map(track => (
          <div
            key={track.id}
            className="flex gap-4 bg-gray-700 p-3 rounded-lg items-center"
          >
            <img
              src={track.album?.images?.[2]?.url || "/placeholder.jpg"}
              alt={track.name}
              className="w-16 h-16 rounded-lg object-cover"
            />

            <div>
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-300">
                {track.artists?.map(a => a.name).join(", ")}
              </p>
              <p className="text-xs text-gray-400">Popularidad: {track.popularity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

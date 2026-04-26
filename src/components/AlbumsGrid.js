import React from 'react';

// AlbumsGrid: simple presentational grid that renders album tiles.
// Clicking a tile calls `onOpenAlbum(album)` to open the modal in the parent.
export default function AlbumsGrid({ albums, onOpenAlbum }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {albums.map((album, index) => (
        <div
          key={album.id}
          className="group relative overflow-hidden rounded-lg cursor-pointer animate-fadeIn"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onOpenAlbum && onOpenAlbum(album)}
        >
          {/* Use data-src + the site's IntersectionObserver for lazy-loading */}
          <img
            data-src={album.thumbnail}
            alt={album.title}
            className="w-full h-80 md:h-96 lg:h-[28rem] object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-light mb-2">{album.title}</h3>
            <p className="text-sm opacity-80">{album.count} Photos</p>
          </div>
        </div>
      ))}
    </div>
  );
}

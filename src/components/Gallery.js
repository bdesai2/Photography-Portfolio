import React from 'react';
import { albums } from '../data';

const Gallery = ({ setCurrentPage, setSelectedAlbum }) => {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-white mb-4">Photo Gallery</h2>
        <p className="text-xl text-neutral-400">Explore my collection of photography</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {albums.map((album) => (
          <div
            key={album.id}
            className="group relative overflow-hidden rounded-lg cursor-pointer animate-fadeIn"
            onClick={() => {
              setSelectedAlbum(album);
              setCurrentPage('album');
            }}
          >
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
    </section>
  );
};

export default Gallery;
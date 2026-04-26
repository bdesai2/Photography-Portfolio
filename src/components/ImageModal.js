import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SocialShare from './SocialShare';

const ImageModal = ({ selectedImage, setSelectedImage }) => {
  if (!selectedImage) return null;

  const { album, image, index } = selectedImage;

  const nextImage = () => {
    const nextIndex = (index + 1) % album.images.length;
    setSelectedImage({ album, image: album.images[nextIndex], index: nextIndex });
  };

  const prevImage = () => {
    const prevIndex = (index - 1 + album.images.length) % album.images.length;
    setSelectedImage({ album, image: album.images[prevIndex], index: prevIndex });
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X size={32} />
      </button>

      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
      >
        <ChevronLeft size={48} />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
      >
        <ChevronRight size={48} />
      </button>

      <div className="max-w-6xl max-h-screen px-16 py-8 flex flex-col items-center">
        <img
          src={image}
          alt={`${album.title} ${index + 1}`}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <p className="text-white mt-4 text-center">
          {album.title} - {index + 1} of {album.images.length}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {album.images.map((_, idx) => (
        <div><button
            key={idx}
            onClick={() => {
              const newIndex = idx;
              setSelectedImage({ album, image: album.images[newIndex], index: newIndex });
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === index ? 'bg-white w-8' : 'bg-white bg-opacity-50'
            }`}
          />
          <SocialShare
            photoUrl={image}
            photoName={`${album.title} ${index + 1}`}
            albumName={album.title}
            className="mt-4"
          /></div>
        ))}
      </div>
    </div>
  );
};

export default ImageModal;
import React, { useState } from 'react';
import DownloadButton from './DownloadTracker';
import './masonry.css';

// AlbumPage: displays a masonry-style collage of thumbnails for a single album/gallery.
// Clicking a thumbnail calls `onOpenImage(index)` which should open the
// full-screen modal (the parent manages modal state).
const AlbumPage = ({ album, onOpenImage }) => {
  if (!album) return null;

  const images = album.images || [];

  // Collapsible helper component (collapsed by default)
  const Collapsible = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(!!defaultOpen);
    return (
      <div className="mb-6">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full flex items-center justify-between bg-neutral-900 px-4 py-3 rounded-lg text-white action-btn--primary" 
        >
          <span className="text-lg font-medium">{title}</span>
          <svg
            className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 114.293 8.293l5-5A1 1 0 0110 3z" clipRule="evenodd" />
          </svg>
        </button>
        {open && <div className="mt-4">{children}</div>}
      </div>
    );
  };

  const renderDescription = (text) => {
    if (!text) return null;
    // If the description contains the bullet character, split into list items
    if (text.includes('•')) {
      const items = text
        .split('•')
        .map(s => s.replace(/\r?\n/g, ' ').trim())
        .filter(Boolean);
      return (
        <ul className="text-neutral-300 text-sm list-disc list-inside space-y-1">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    }

    return <p className="text-neutral-300 text-sm">{text}</p>;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-light text-white mb-8 text-center tracking-wide">{album.title}</h1>
        <div className="prose prose-invert max-w-none text-center mb-12 text-white">
          {album.description}
        </div>
        {/* Using shared masonry styles from ./masonry.css */}

        <div className="masonry">
          {images.map((image, index) => (
            <div key={index} className="masonry-item relative">
              <div className="relative">
                <button onClick={() => onOpenImage(index)} aria-label={`Open image ${index + 1}`}>
                  <img src={image.url} alt={`${album.title} ${index + 1}`} loading="lazy" />
                </button>

                {/* Download button overlay */}
                <div className="absolute bottom-3 right-3">
                  <DownloadButton
                    photoUrl={image.url}
                    photoName={`${album.title.replace(/\s+/g, '-')}-${index + 1}.jpg`}
                    albumName={album.title}
                    photoId={`${album.id}-${index}`}
                    className="px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {album.content && album.content.length > 0 && (
        <div className="content">
          <div className="max-w-7xl mx-auto mb-8">
            <Collapsible title="Park Details" defaultOpen={false}>
              <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                {album.content && album.content.map((section, index) => (
                  //show the cards in 2 columns on desktop, 1 column on mobile. 
                  //Wrap text if too long. Use the section title as the card title and the description as the card content.
                  <div key={index} className="bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl text-white font-semibold mb-2">{section.Title}</h2>
                    {renderDescription(section.Description)}
                  </div>
                ))}
              </div>
            </Collapsible>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AlbumPage);

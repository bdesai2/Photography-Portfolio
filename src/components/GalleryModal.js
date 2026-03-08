import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import DownloadButton from './DownloadTracker';

// GalleryModal: full-screen viewer for a selected album. It receives
// navigation callbacks and the index setter from the parent so it stays
// purely presentational and reusable.
export default function GalleryModal({ selectedAlbum, selectedImage, closeGallery, nextImage, prevImage, setSelectedImage }) {
  // Keyboard navigation: left/right to navigate, Esc to close
  // Always declare the hook (hooks must be called in the same order)
  useEffect(() => {
    // Guard: only attach listener when modal is open with a selected image
    if (!selectedAlbum || selectedImage === null) return;

    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeGallery();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nextImage, prevImage, closeGallery, selectedAlbum, selectedImage]);

  // Focus trap: keep focus inside modal while open and restore focus on close
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!selectedAlbum || selectedImage === null) return;

    const previousActive = document.activeElement;
    // Focus the close button when modal opens
    setTimeout(() => closeBtnRef.current?.focus(), 0);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      const container = modalRef.current;
      if (!container) return;
      const focusable = Array.from(container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => !el.hasAttribute('disabled'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => {
      window.removeEventListener('keydown', handleTab);
      // restore previous focus
      try { previousActive?.focus(); } catch (err) {}
    };
  }, [selectedAlbum, selectedImage]);

  if (!selectedAlbum || selectedImage === null) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label={`${selectedAlbum.title} gallery`} className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center animate-fadeIn">
      {/* Close button */}
      <button
        ref={closeBtnRef}
        onClick={closeGallery}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all z-50"
        aria-label="Close gallery"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Prev control */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Image + caption */}
      <div className="w-full h-full max-h-screen px-4 md:px-16 py-8 flex flex-col items-center justify-center">
        <div className="relative w-full">
          <img
            src={selectedAlbum.images[selectedImage]}
            alt={`${selectedAlbum.title} ${selectedImage + 1}`}
            className="w-full max-h-[85vh] object-contain"
          />

          {/* Download button for the current image */}
          <div className="absolute top-4 right-4">
            <DownloadButton
              photoUrl={selectedAlbum.images[selectedImage]}
              photoName={`${selectedAlbum.title.replace(/\s+/g, '-')}-${selectedImage + 1}.jpg`}
              albumName={selectedAlbum.title}
              photoId={`${selectedAlbum.id}-${selectedImage}`}
              className="px-3 py-2 text-sm"
            />
          </div>
        </div>

        <p className="text-white mt-4 text-center text-sm md:text-base">
          {selectedAlbum.title} - {selectedImage + 1} of {selectedAlbum.images.length}
        </p>
      </div>

      {/* Next control */}
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Pagination dots (choose a specific image) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {selectedAlbum.images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedImage ? 'bg-white w-8' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-4 right-4 text-neutral-300 text-sm opacity-90">
        <span className="mr-2">← → to navigate</span>
        <span>• Esc to close</span>
      </div>
    </div>
  );
}

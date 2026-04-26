import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link, Check } from 'lucide-react';

// Minimal Social Share - Small icon with tooltip dropdown
const SocialShare = ({ 
  photoUrl,
  photoName = 'photo',
  albumName = 'Gallery',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build the share URL (current page or specific photo)
  const shareUrl = window.location.href;
  const shareTitle = `${photoName} - ${albumName} | photofy.me`;
  
  // Encode for URLs
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedImage = encodeURIComponent(photoUrl);

  // Share URLs for each platform
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL
  };

  const handleShare = (platform) => {
    // Track with Google Analytics if available
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'photo',
        item_id: photoName
      });
    }
    
    // Close tooltip after click
    if (platform !== 'copy') {
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Track copy event
      if (window.gtag) {
        window.gtag('event', 'share', {
          method: 'copy_link',
          content_type: 'photo',
          item_id: photoName
        });
      }
      
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Icon Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent click events
          setIsOpen(!isOpen);
        }}
        className="p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all backdrop-blur-sm"
        title="Share"
        aria-label="Share photo"
      >
        <Share2 size={18} />
      </button>

      {/* Tooltip Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-neutral-800 rounded-lg shadow-2xl p-2 z-50 animate-fadeIn border border-neutral-700">
            <div className="flex gap-1">
              
              {/* Facebook */}
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleShare('Facebook')}
                className="p-2 hover:bg-neutral-700 rounded transition-colors group"
                title="Share on Facebook"
                aria-label="Share on Facebook"
              >
                <Facebook size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
              </a>

              {/* Twitter/X */}
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleShare('Twitter')}
                className="p-2 hover:bg-neutral-700 rounded transition-colors group"
                title="Share on X (Twitter)"
                aria-label="Share on X"
              >
                <Twitter size={20} className="text-sky-400 group-hover:scale-110 transition-transform" />
              </a>

              {/* LinkedIn */}
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleShare('LinkedIn')}
                className="p-2 hover:bg-neutral-700 rounded transition-colors group"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
              </a>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-neutral-700 rounded transition-colors group"
                title={copied ? "Copied!" : "Copy link"}
                aria-label="Copy link"
              >
                {copied ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <Link size={20} className="text-neutral-400 group-hover:text-white group-hover:scale-110 transition-all" />
                )}
              </button>

            </div>

            {/* Small arrow pointing down */}
            <div className="absolute -bottom-1 right-3 w-2 h-2 bg-neutral-800 border-r border-b border-neutral-700 transform rotate-45" />
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE USAGE IN YOUR PHOTO GALLERY
// ─────────────────────────────────────────────────────────────────────────────

const ExamplePhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      name: 'Mountain Sunset',
      album: 'Landscapes'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
      name: 'Forest Path',
      album: 'Landscapes'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200',
      name: 'Portrait',
      album: 'Portraits'
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      
      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-8">Photo Gallery with Social Share</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(photo)}
            >
              <img 
                src={photo.url} 
                alt={photo.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              {/* Share button appears on hover - bottom right */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <SocialShare
                  photoUrl={photo.url}
                  photoName={photo.name}
                  albumName={photo.album}
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-white font-medium">{photo.name}</h3>
                <p className="text-neutral-400 text-sm">{photo.album}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox/Modal with Share Button */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full">
            
            {/* Close button top right */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full z-10"
            >
              ✕
            </button>

            {/* Share button bottom right of image */}
            <div className="absolute bottom-4 right-4 z-10">
              <SocialShare
                photoUrl={selectedImage.url}
                photoName={selectedImage.name}
                albumName={selectedImage.album}
              />
            </div>

            {/* Photo */}
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-w-full max-h-[85vh] mx-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Photo info */}
            <div className="text-center mt-4 text-white">
              <h2 className="text-2xl font-light">{selectedImage.name}</h2>
              <p className="text-neutral-400">{selectedImage.album}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SocialShare;
export { ExamplePhotoGallery };
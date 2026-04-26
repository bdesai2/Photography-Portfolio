import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// HeroCarousel: cycles through `heroImages` automatically and exposes
// simple previous/next controls. `heroImages` is expected to be an array
// of objects: { url, alt } (we source this from `src/data/images.json`).
export default function HeroCarousel({ heroImages }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="relative h-64 md:h-80 lg:h-screen overflow-hidden">
      {heroImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={img.url} alt={img.alt} className="w-full h-full object-contain md:object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
      ))}

      {/* Centered title, subtitle, description and location */}
      <div className="absolute inset-0 flex items-center justify-center text-white z-10">
        <div className="text-center px-4">
          {/*<div className="mb-2 text-sm md:text-base font-light tracking-widest opacity-75 uppercase">
            {heroImages[currentSlide]?.location || 'Lens & Light'}
          </div>*/}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-4 tracking-wider animate-slideUp">
            {heroImages[currentSlide]?.title || 'LENS & LIGHT'}
          </h1>
          <p className="hidden md:block text-lg md:text-xl font-light tracking-wide animate-slideUp opacity-90 mb-4">
            {heroImages[currentSlide]?.description || 'Capturing Moments, Creating Memories'}
          </p>
        </div>
      </div>

      {/* Tags + description overlay at the bottom of the image */}
      {heroImages[currentSlide]?.tags && heroImages[currentSlide].tags.length > 0 && (
        <div className="hidden md:flex absolute bottom-20 left-0 right-0 z-10 px-6 md:px-12">
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {heroImages[currentSlide].tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs md:text-sm px-3 py-1 rounded-full bg-white bg-opacity-15 backdrop-blur-sm text-white border border-white border-opacity-20 tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-full"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

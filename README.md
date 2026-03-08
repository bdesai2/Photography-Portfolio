<<<<<<< HEAD
# Lens & Light Photography Portfolio

A modern, responsive photography portfolio website built with React, showcasing stunning photo collections with smooth animations and an elegant dark theme.

## Features

### 🎨 **Modern Design**

- Sleek dark theme with neutral color palette
- Responsive design that works on all devices
- Smooth animations and transitions
- Professional typography with custom fonts

### 📸 **Photo Gallery**

- Organized photo collections (Portraits, Landscapes, Urban, Wildlife, Architecture, Street)
- Interactive album browsing
- Full-screen image modal with navigation
- Lazy loading for optimal performance
- Hover effects and smooth scaling animations

### 🖥️ **User Experience**

- Fixed navigation header with mobile menu
- Hero slider with auto-play functionality
- Featured collections on homepage
- Contact form with validation
- Social media integration

### ⚡ **Performance**

- Optimized images with lazy loading
- Intersection Observer for efficient rendering
- Minimal bundle size with React
- Fast loading times

### 🛠️ **Technical Features**

- Built with React 19
- Styled with Tailwind CSS v4
- Lucide React icons
- Mobile-first responsive design
- Clean component architecture

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bdesai2/AI_Photo-Gallery.git
   cd AI_Photo-Gallery
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Home**: View the hero slider and featured photo collections
- **Gallery**: Browse all photo albums
- **Album View**: Click on any album to view individual photos
- **Image Modal**: Click on photos to view them in full screen with navigation
- **Contact**: Use the contact form to get in touch

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Navigation component
│   ├── HeroSlider.js      # Hero image slider
│   ├── Gallery.js         # Album grid display
│   ├── AlbumView.js       # Individual album view
│   ├── ImageModal.js      # Full-screen image viewer
│   ├── ContactForm.js     # Contact form component
│   └── Footer.js          # Footer component
├── data.js                # Photo album data
├── App.js                 # Main application component
├── index.js               # Application entry point
└── index.css              # Global styles
```

## Technologies Used

- **React** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Unsplash** - Stock photography API (for demo images)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
# AI Photo Gallery (Lens & Light)

React photo gallery demo and portfolio site composed of small, focused components.

**This README was updated to reflect recent feature work and a patch-level version bump.**

**Project Version:** 1.1.0
**Last updated:** 2026-03-07

## Project overview

- `src/App.js` — app composition, top-level state and handlers
- `src/components/` — presentational components: `Header`, `HeroCarousel`, `AlbumsGrid`, `AlbumPage`, `GalleryModal`, `ContactForm`, etc.
- `src/data/images.json` — central JSON for hero and album images (imported at build time)

## Key Features

- Responsive, mobile-first photo gallery with hero carousel and album grid
- Full-screen image modal viewer with keyboard navigation
- Lazy loading and Intersection Observer optimizations for performance
- Contact form (client-side demo) and Book Session CTAs
- Download tracking for images (localStorage + optional analytics)

## Recent Changes (since v1.0.0)

### Version 1.1.0 (2026-03-07)

- Added download tracking (`DownloadTracker`) and `DownloadButton` used in album thumbnails and modal
- Centralized action button styles with `.action-btn` utilities in `src/index.css` for consistent theming
- Added Book Session CTAs and a client-side `ContactLink` helper to reliably scroll to the contact form (`#contact-me`)
- Improved album readability: descriptions that contain bullet markers (`•`) are rendered as lists, and verbose `album.content` is grouped into a collapsed "Park Details" section (collapsed by default)
- Fixed Tailwind dynamic-class purge issues by replacing template string classes with a static `colorClasses` map where needed
- Minor accessibility and UX improvements across the gallery and album pages

### Version 1.0.0 (2026-01-24)

- Initial full-feature release: gallery, albums, modal viewer, and contact form

## Installation

Open a PowerShell terminal and run:

```powershell
cd "C:\Projects\AI projects\AI tools\photofy.me"
npm install
npm start
```

If you prefer `bun`:

```powershell
bun install
bun dev
```

Then open `http://localhost:3000` in your browser.

## Updating content

- To edit images and album metadata, update `src/data/images.json`. The file is imported at build time.
- For runtime-updatable content, host the JSON remotely and fetch it on startup (add a small loader or hook in `src/lib/`).

## Development notes & next steps

- The contact form currently uses a demo submission handler (local alert). Replace it with a real backend integration for production.
- Consider animating the collapsible "Park Details" section and optionally persisting its open/closed state (URL, query param, or `localStorage`) for a smoother UX.
- For production analytics, wire the download events to your GA4 or favorite analytics backend (the `DownloadTracker` supports optional analytics calls).

## Project structure (high level)

```
src/
├── components/
│   ├── Header.js
│   ├── HeroCarousel.js
│   ├── AlbumsGrid.js
│   ├── AlbumPage.js
│   ├── GalleryModal.js
│   ├── ContactForm.js
│   └── DownloadTracker.js
├── data/
│   └── images.json
├── index.css
├── App.js
└── index.js
```

## Technologies

- React
- Tailwind CSS
- Lucide React icons

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am "Add new feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request for review

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

Author: Lens & Light

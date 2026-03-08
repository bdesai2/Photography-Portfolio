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
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Changelog

### Version 1.0.0 (January 24, 2026)

- **Initial Release**
  - Complete photography portfolio website
  - 6 photo collections with sample images
  - Responsive design for all devices
  - Dark theme with modern UI
  - Interactive gallery with modal viewer
  - Contact form functionality
  - Optimized performance with lazy loading

### Version 0.1.0 (Development)

- Basic React setup with Tailwind CSS
- Initial component structure
- PostCSS configuration fixes
- Component refactoring for better organization

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# AI Photo Gallery (Lens & Light)

React photo gallery demo (split into components).

## Project overview

- `src/App.js` — app composition, state and handlers
- `src/components/` — `Header`, `HeroCarousel`, `AlbumsGrid`, `ContactForm`, `GalleryModal`
- `src/data/images.json` — central JSON for hero and album images (edit this file to update content)

## How to run

Install dependencies and start the dev server:

```powershell
cd "Photo-Gallery/AI_Photo-Gallery"
npm install
npm start
```

If using `bun`:

```powershell
bun install
bun dev
```

## Updating images

Edit `src/data/images.json` to change hero images or albums. The file is imported at build time. For runtime-updatable images, host the JSON remotely and fetch it on startup (add a small loader in `src/lib/utils.js`).

## Versioning

- Project version: 0.1.0
- Last updated: 2026-02-14

## Notes & next steps

- The contact form currently uses a local `alert`. Pass an `onSubmit` handler to `ContactForm` to integrate with your backend.
- Consider moving the lazy-load logic to a small utility hook in `src/lib/utils.js` if you plan to reuse it.

---

Author: Lens & Light

License: MIT
>>>>>>> 7eaa6286336b021a2766dc51e2de6beddf8b655c

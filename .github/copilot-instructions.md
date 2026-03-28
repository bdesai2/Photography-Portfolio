# photofy.me — AI Coding Guidelines

## Architecture Overview
**Photography portfolio** — React (Create React App / `react-scripts`) with **React Router v6** multi-page routing. Tailwind CSS for styling. No backend — static site with build-time data imports.

## How to Run
```bash
npm install
npm start       # react-scripts start → http://localhost:3000
npm run build   # Production bundle
npm test        # react-scripts test
```

## Routing (React Router v6)
`src/App.js` defines routes via `<Routes>` / `<Route>`:
- `/` — Home (hero carousel + album grid)
- `/albums/:albumSlug` — Album detail view
- `/about` — About page
- `/contact` — Contact form
- `/blog/:slug` — Blog/content pages
- `*` — 404 fallback

## Key Files & Directories
- `src/App.js` — Route definitions, layout composition
- `src/data.js` — **Canonical data source** for hero images, albums, and collections (imported at build time)
- `src/components/` — All UI components:
  - `HeroCarousel.js` / `HeroSlider.js` — Landing hero sections
  - `AlbumsGrid.js` / `AlbumView.js` — Gallery browsing
  - `Gallery.js` / `PhotoLightbox.js` — Image display + lightbox
  - `ContactForm.js` — Contact (currently uses `window.alert`)
  - `NavigationBar.js` / `Footer.js` — Layout chrome
  - `NationalParksMap.js` / `StateParksMap.js` — Interactive map components
  - `GoogleAnalytics.js` / `CookieConsent.js` — Tracking + compliance
  - `DownloadTracker.js` — Image download analytics
- `src/lib/` — Utilities: `utils.js` (custom hooks), `schemas.js` (structured data for SEO)
- `public/images/` — Static images served at runtime
- `content/` — Markdown content files for blog/pages

## Conventions
- Components are small and presentational, composed via React Router in `App.js`
- Image collections authored as static data in `src/data.js` — imported at build time
- Tailwind CSS + PostCSS for styling (`tailwind.config.js`)
- Reusable logic goes in `src/lib/` as custom hooks
- SEO via `react-helmet-async` with structured data schemas

## Integrations
- **Google Analytics** (`react-ga4`) — `GoogleAnalytics` component
- **EmailJS** (`@emailjs/browser`) — available for contact form email delivery
- **Cookie Consent** (`react-cookie-consent`) — GDPR compliance banner
- **Lucide React** — icon library

## Gotchas
- `src/data.js` is the canonical data source (not `src/data/images.json`, which is a legacy file)
- README contains leftover merge conflict markers — validate commands via `package.json`
- Uses `react-scripts` — prefer existing scripts over introducing new build tools

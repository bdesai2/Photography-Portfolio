import ReactGA from 'react-ga4';

// Single, consolidated Google Analytics helper for the site.
// Uses `VITE_GA_MEASUREMENT_ID` when available; otherwise falls back to a
// hard-coded ID if present (legacy). If neither is set, functions are no-ops.

// GA measurement ID loaded from environment variable (see .env)
const TRACKING_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';

export const initGA = (options = {}) => {
  if (!TRACKING_ID) {
    if (typeof window !== 'undefined') console.warn('GA measurement id missing; analytics disabled');
    return;
  }

  try {
    ReactGA.initialize(TRACKING_ID, options);
    // send initial pageview
    if (typeof window !== 'undefined') {
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
    }
  } catch (err) {
    if (typeof window !== 'undefined') console.warn('Failed to initialize GA', err);
  }
};

export const logPageView = (page) => {
  if (!TRACKING_ID) return;
  try {
    const p = page || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
    ReactGA.send({ hitType: 'pageview', page: p });
  } catch (err) {
    if (typeof window !== 'undefined') console.warn('Failed to send pageview', err);
  }
};

export const logEvent = (category, action, label = '') => {
  if (!TRACKING_ID) return;
  try {
    ReactGA.event({ category, action, label });
  } catch (err) {
    if (typeof window !== 'undefined') console.warn('Failed to log event', err);
  }
};

// Convenience tracking helpers used by the app
export const trackPhotoView = (albumName, photoId) => logEvent('Photo', 'View', `${albumName} - ${photoId}`);
export const trackAlbumOpen = (albumName) => logEvent('Album', 'Open', albumName);
export const trackContactFormSubmit = () => logEvent('Contact', 'Submit', 'Contact Form');
export const trackSocialClick = (platform) => logEvent('Social', 'Click', platform);
export const trackBookingClick = () => logEvent('Booking', 'Click', 'Book Session');
export const trackPrintView = (printSize) => logEvent('Print', 'View', printSize);
export const trackDownloadStart = (fileName) => logEvent('Download', 'Start', fileName);

export default {
  initGA,
  logPageView,
  logEvent,
};
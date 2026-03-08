import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import AlbumsGrid from './components/AlbumsGrid';
import ContactForm from './components/ContactForm';
import GalleryModal from './components/GalleryModal';
import imagesData from './data/images.json';
import ProjectsGrid from './components/ProjectsGrid';
import ProjectPage from './components/ProjectPage';
import AlbumPage from './components/AlbumPage';
import BookSession from './components/BookSession';
import { useLazyLoadImages } from './lib/utils';
import SEO from './components/SEO';
import { organizationSchema, personSchema } from './lib/schemas';
import { initGA, logPageView, trackAlbumOpen } from './components/GoogleAnalytics';
import CookieConsent from 'react-cookie-consent';

// PhotographyPortfolio: top-level page component that keeps application state
// and orchestrates composed child components. Most UI is delegated to
// components/* so this file holds only state, handlers and composition.

const PhotographyPortfolio = () => {
  // UI state: currently-open album modal/index
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { heroImages } = imagesData;

  const { albums } = imagesData;
  const { projects = [] } = imagesData;

  // local form state for the contact form (used only if local submission)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  // derive a lightweight page name for SEO / active header state
  const path = location.pathname || '/';
  const currentPage = useMemo(() => {
    if (path === '/') return 'home';
    if (path.startsWith('/albums')) return 'albums';
    if (path.startsWith('/projects')) return 'projects';
    return 'home';
  }, [path]);

  // Use reusable hook for lazy-loading images; re-run when path/album change.
  useLazyLoadImages([path, selectedAlbum]);

  // Initialize Google Analytics and log pageviews on route change
  useEffect(() => {
    try {
      initGA();
    } catch (err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      logPageView(path + (location.search || ''));
    } catch (err) {
      // ignore
    }
  }, [location, path]);
  // Handlers for opening / closing the full-screen album modal
  const openAlbumGallery = useCallback((album) => {
    trackAlbumOpen(album.title);
    setSelectedAlbum(album);
    setSelectedImage(0);
  }, []);

  // Projects state (we navigate to `/projects/:id` instead of storing selectedProject here)

  const closeGallery = useCallback(() => {
    setSelectedAlbum(null);
    setSelectedImage(null);
  }, []);

  // Advance the modal image index (wraps around)
  const nextImage = useCallback(() => {
    if (selectedAlbum) {
      setSelectedImage((prev) => (prev + 1) % selectedAlbum.images.length);
    }
  }, [selectedAlbum]);

  // Move to previous image (wraps around)
  const prevImage = useCallback(() => {
    if (selectedAlbum) {
      setSelectedImage((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
    }
  }, [selectedAlbum]);

  // Local contact form submission (simple demo behaviour)
  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      alert('Thank you for your message! I will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Determine SEO title and description based on current page
  const pageSEO = useMemo(() => {
    const baseUrl = 'https://yourportfolio.com';
    switch (currentPage) {
      case 'home':
        return {
          title: 'Professional Photographer in Wylie, TX | Landscapes, Portraits & More',
          description: 'Award-winning photographer in Wylie, TX specializing in landscapes, portraits, events, wildlife, and commercial photography. Serving Plano, Dallas, Murphy, and surrounding areas.',
          url: baseUrl,
        };
      case 'albums':
        return {
          title: 'Photography Collections | All Albums | Wylie, TX Photographer',
          description: 'Browse all photography collections including landscapes, portraits, wildlife, urban, commercial and event photography by professional photographer in Wylie, TX.',
          url: `${baseUrl}/albums`,
        };
      case 'projects':
        return {
          title: 'Photography Projects | Featured Works | Professional Photographer Wylie TX',
          description: 'Discover featured photography projects and detailed collections including our US National Parks photography series. Professional photography services in Wylie, TX.',
          url: `${baseUrl}/projects`,
        };
      default:
        return {
          title: 'Professional Photographer in Wylie, TX',
          description: 'Award-winning photographer in Wylie, TX providing professional photography services including portraits, landscapes, events, and commercial photography for Dallas and surrounding areas.',
          url: baseUrl,
        };
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-neutral-900">
      <SEO 
        title={pageSEO.title} 
        description={pageSEO.description}
        url={pageSEO.url}
      />
      
      {/* Schema.org structured data for better SEO */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      <Header currentPage={currentPage} setCurrentPage={useCallback((p) => { if (p === 'home') navigate('/'); if (p === 'albums') navigate('/albums'); if (p === 'projects') navigate('/projects'); }, [navigate])} />

      {/* Main content area. Navigation is provided by `Header`. */}
      <main className="pt-16">
        <Routes>
          <Route
            path="/"
            element={
              <div className="animate-fadeIn">
                <HeroCarousel heroImages={heroImages} />

                <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                  <h2 className="text-4xl font-light text-white mb-12 text-center tracking-wide">Featured Collections</h2>
                  <AlbumsGrid albums={albums.slice(0, 6)} onOpenAlbum={(album) => navigate(`/albums/${album.id}`)} />
                  <div className="mt-8 text-center">
                    <button onClick={() => navigate('/albums')} className="px-6 py-3 bg-white text-neutral-900 rounded-full font-semibold hover:bg-neutral-100 transition-colors">All Collections</button>
                  </div>
                </section>

                {projects.length > 0 && (
                  <section className="px-4 md:px-8 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-light text-white mb-12 text-center tracking-wide">Featured Projects</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      {projects.map((project) => {
                        if (!project.thumbnail) return null; // Skip projects without thumbnails
                        if (project.enabled === false) return null; // Skip disabled projects
                        return (
                          <div key={project.id} className="group cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                            <div className="relative overflow-hidden rounded-lg mb-6 h-96">
                              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center">
                              <button className="px-8 py-3 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors">Explore Project</button>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-light text-white mb-4">{project.title}</h3>
                            <p className="text-neutral-300 text-lg leading-relaxed">{project.description}</p>
                          </div>
                        </div>
                      );
                      })}
                    </div>
                  </section>
                )}

                <ContactForm onSubmit={() => alert('Thank you for your message! I will get back to you soon.')} />
              </div>
            }
          />

          <Route
            path="/albums"
            element={
              <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-12 text-center tracking-wide">All Collections</h1>
                <AlbumsGrid albums={albums} onOpenAlbum={(album) => navigate(`/albums/${album.id}`)} />
              </div>
            }
          />

          <Route
            path="/projects"
            element={
              <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-12 text-center tracking-wide">Projects</h1>
                <ProjectsGrid projects={projects} onOpenProject={(p) => navigate(`/projects/${p.id}`)} />
              </div>
            }
          />

          <Route
            path="/albums/:albumId"
            element={<AlbumRoute albums={albums} onOpenImage={useCallback((album, index) => { setSelectedAlbum(album); setSelectedImage(index); }, [])} />}
          />

          <Route
            path="/projects/:projectId/:galleryId"
            element={<ProjectGalleryRoute projects={projects} onOpenImage={useCallback((album, index) => { setSelectedAlbum(album); setSelectedImage(index); }, [])} />}
          />

          <Route
            path="/projects/:projectId"
            element={<ProjectRoute projects={projects} onOpenAlbum={openAlbumGallery} onOpenImage={useCallback((gallery, index) => { setSelectedAlbum(gallery); setSelectedImage(index); }, [])} />}
          />
          <Route
            path="/book"
            element={<BookSession />}
          />
        </Routes>
      </main>

      {/* Fullscreen gallery modal (delegated to component) */}
      <GalleryModal
        selectedAlbum={selectedAlbum}
        selectedImage={selectedImage}
        closeGallery={closeGallery}
        nextImage={nextImage}
        prevImage={prevImage}
        setSelectedImage={setSelectedImage}
      />

      <footer className="bg-neutral-950 text-neutral-400 py-12 text-center border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-sm">Wylie, Texas</p>
              <p className="text-sm">Serving Dallas-Fort Worth Area</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Services</h3>
              <p className="text-sm">Portraits & Events</p>
              <p className="text-sm">Commercial & Wildlife</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Contact</h3>
              {/*<p className="text-sm">Phone: (469) XXX-XXXX</p>*/}
              <p className="text-sm">Email: bdesai2@gmail.com</p>
            </div>
          </div>
          <p className="text-sm">© 2025 Professional Photographer in Wylie, TX. All rights reserved. | Photography Portfolio serving Wylie, Dallas, Plano, Murphy, and surrounding areas.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PhotographyPortfolio;

// Helper route component to render a project by id from images data
function ProjectRoute({ projects, onOpenAlbum, onOpenImage }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
        <h2 className="text-2xl text-white mb-4">Project not found</h2>
        <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-white text-neutral-900 rounded">Back to Projects</button>
      </div>
    );
  }

  return <ProjectPage project={project} onBack={() => navigate('/projects')} onOpenAlbum={(gallery) => navigate(`/projects/${project.id}/${gallery.id}`)} onOpenImage={onOpenImage} />;
}

// AlbumRoute: find album by id from top-level albums array and render AlbumPage
function AlbumRoute({ albums, onOpenImage }) {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const album = albums.find((a) => String(a.id) === String(albumId));

  if (!album) {
    return (
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
        <h2 className="text-2xl text-white mb-4">Album not found</h2>
        <button onClick={() => navigate('/albums')} className="px-4 py-2 bg-white text-neutral-900 rounded">Back to Albums</button>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
      <nav className="text-sm text-neutral-400 mb-6">
        <Link to="/" className="hover:underline text-neutral-300">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/albums" className="hover:underline text-neutral-300">Albums</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{album.title}</span>
      </nav>

      <AlbumPage
        album={album}
        onOpenImage={(index) => onOpenImage(album, index)}
      />
    </div>
  );
}

// ProjectGalleryRoute: render a specific gallery inside a project
function ProjectGalleryRoute({ projects, onOpenImage }) {
  const { projectId, galleryId } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
        <h2 className="text-2xl text-white mb-4">Project not found</h2>
        <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-white text-neutral-900 rounded">Back to Projects</button>
      </div>
    );
  }

  const gallery = (project.galleries || []).find((g) => String(g.id) === String(galleryId));
  if (!gallery) {
    return (
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
        <h2 className="text-2xl text-white mb-4">Gallery not found</h2>
        <button onClick={() => navigate(`/projects/${projectId}`)} className="px-4 py-2 bg-white text-neutral-900 rounded">Back to Project</button>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
      <nav className="text-sm text-neutral-400 mb-6">
        <Link to="/" className="hover:underline text-neutral-300">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/projects" className="hover:underline text-neutral-300">Projects</Link>
        <span className="mx-2">/</span>
        <Link to={`/projects/${project.id}`} className="hover:underline text-neutral-300">{project.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{gallery.title}</span>
      </nav>

      <AlbumPage album={gallery} onOpenImage={(index) => onOpenImage(gallery, index)} />
    </div>
  );
}
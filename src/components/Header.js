import React, { useState } from 'react';
import { Menu, Home, Grid, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Header: responsive navigation used across the app. Keeps only
// navigation presentation and mobile menu state — page switching
// is lifted to the parent via `setCurrentPage`.
export default function Header({ currentPage, setCurrentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // derive current path for active state fallback
  const path = location.pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 bg-opacity-95 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="text-white text-2xl font-light tracking-wider hover:text-neutral-300 transition-colors"
          >
            Photofy Me
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 transition-colors ${
                (currentPage === 'home' || path === '/') ? 'text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => navigate('/albums')}
              className={`flex items-center gap-2 transition-colors ${
                (currentPage === 'albums' || path === '/albums') ? 'text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              Albums
            </button>
            <button
              onClick={() => navigate('/projects')}
              className={`flex items-center gap-2 transition-colors ${
                (currentPage === 'projects' || path.startsWith('/projects')) ? 'text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              Projects
            </button>
            <button
              onClick={() => navigate('/book')}
              className="ml-4 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Book Session
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu content */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            <button onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-neutral-800 transition-colors" >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button onClick={() => {
                navigate('/albums');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-neutral-800 transition-colors" >
              <Grid className="w-4 h-4" />
              Albums
            </button>
            <button onClick={() => {
                navigate('/projects');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-neutral-800 transition-colors">
              <Globe className="w-4 h-4" />
              Projects
            </button>
            <button onClick={() => {
                navigate('/book');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-neutral-800 transition-colors">
              Book Session
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
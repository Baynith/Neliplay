import React, { useState, useEffect } from 'react';
import { Home, Film, LayoutGrid, Search, Globe } from 'lucide-react';
import { Movie } from '../types/movie';

interface HeaderProps {
  currentTab: 'home' | 'movies' | 'genres' | 'search';
  onSelectTab: (tab: 'home' | 'movies' | 'genres' | 'search') => void;
  language: 'sw' | 'en';
  onToggleLanguage: () => void;
  onSelectMovie: (movie: Movie) => void;
  movies: Movie[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Floating Sticky Header on Pink-Orange Radiant Canvas */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-orange-200/50 shadow-sm py-2.5 sm:py-3'
            : 'bg-white/80 backdrop-blur-md border-b border-orange-100/60 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left: NeliPlay Transparent Logo + Nav Links */}
          <div className="flex items-center gap-6 sm:gap-10">
            <div
              onClick={() => {
                onSelectTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer select-none shrink-0 group flex items-center"
            >
              <img
                src="/assets/aistudio/neliplay_brand_transparent.png"
                alt="NeliPlay"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <button
                onClick={() => {
                  onSelectTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative py-1 transition-colors cursor-pointer ${
                  currentTab === 'home'
                    ? 'text-[#FF6A00] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#FF6A00] after:to-[#FF2D87]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'sw' ? 'Nyumbani' : 'Home'}
              </button>

              <button
                onClick={() => {
                  onSelectTab('movies');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative py-1 transition-colors cursor-pointer ${
                  currentTab === 'movies'
                    ? 'text-[#FF6A00] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#FF6A00] after:to-[#FF2D87]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'sw' ? 'Filamu' : 'Movies'}
              </button>

              <button
                onClick={() => {
                  onSelectTab('genres');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative py-1 transition-colors cursor-pointer ${
                  currentTab === 'genres'
                    ? 'text-[#FF6A00] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#FF6A00] after:to-[#FF2D87]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'sw' ? 'Aina za Filamu' : 'Genres'}
              </button>
            </nav>
          </div>

          {/* Right Side: Quick Search Action & Language Toggle */}
          <div className="flex items-center gap-3">
            {/* Search Button that opens dedicated Search Page */}
            <button
              onClick={() => {
                onSelectTab('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100/70 border border-orange-200/80 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-xs hover:border-[#FF6A00]/50 hover:scale-105 active:scale-95"
              title="Tafuta filamu / Search movies"
            >
              <Search className="w-4 h-4 text-[#FF6A00]" />
              <span className="hidden sm:inline">
                {language === 'sw' ? 'Tafuta Filamu...' : 'Search Movies...'}
              </span>
            </button>

            {/* Language Toggle with Brand Gradient accent */}
            <button
              onClick={onToggleLanguage}
              title={language === 'sw' ? 'Badili kwenda English' : 'Switch to Kiswahili'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#0066FF]" />
              <span className="uppercase text-[11px] font-mono">{language}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-100 px-6 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentTab === 'home' ? 'text-[#FF6A00] font-bold' : 'text-slate-500'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'text-[#FF6A00]' : ''}`} />
          <span>{language === 'sw' ? 'Nyumbani' : 'Home'}</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentTab === 'movies' ? 'text-[#FF6A00] font-bold' : 'text-slate-500'
          }`}
        >
          <Film className={`w-5 h-5 ${currentTab === 'movies' ? 'text-[#FF6A00]' : ''}`} />
          <span>{language === 'sw' ? 'Filamu' : 'Movies'}</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('genres');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentTab === 'genres' ? 'text-[#FF2D87] font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${currentTab === 'genres' ? 'text-[#FF2D87]' : ''}`} />
          <span>{language === 'sw' ? 'Aina' : 'Genres'}</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            currentTab === 'search' ? 'text-[#FF6A00] font-bold' : 'text-slate-500'
          }`}
        >
          <Search className={`w-5 h-5 ${currentTab === 'search' ? 'text-[#FF6A00]' : ''}`} />
          <span>{language === 'sw' ? 'Tafuta' : 'Search'}</span>
        </button>
      </div>
    </>
  );
};

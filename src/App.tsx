/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, TrendingUp, Film, ShieldAlert, Smile, Clapperboard, HeartHandshake } from 'lucide-react';
import { Movie, GenreType } from './types/movie';
import { STORED_MOVIES, GENRES } from './data/movies';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MovieRow } from './components/MovieRow';
import { MovieDetailsPage } from './components/MovieDetailsPage';
import { NeliPlayer } from './components/NeliPlayer';
import { GenreExplorer } from './components/GenreExplorer';
import { MoviesCatalogue } from './components/MoviesCatalogue';
import { SearchPage } from './components/SearchPage';
import { Footer } from './components/Footer';

export type PageView = 'home' | 'movies' | 'genres' | 'details' | 'watch' | 'search';

// Helper to determine route on initial load or browser refresh
function getRouteFromLocation(movies: Movie[]): {
  page: PageView;
  movie: Movie | null;
  query: string;
  genre: GenreType | 'All';
} {
  if (typeof window === 'undefined') {
    return { page: 'home', movie: null, query: '', genre: 'All' };
  }

  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // 1. Watch route: /watch/:id or ?watch=:id
  let watchId = '';
  if (path.startsWith('/watch/')) {
    watchId = decodeURIComponent(path.replace('/watch/', '')).replace(/\/$/, '');
  } else if (searchParams.has('watch')) {
    watchId = searchParams.get('watch') || '';
  }

  if (watchId) {
    const movie = movies.find(m => m.id === watchId);
    if (movie) {
      return { page: 'watch', movie, query: '', genre: 'All' };
    }
  }

  // 2. Movie details route: /movie/:id or ?movie=:id
  let movieId = '';
  if (path.startsWith('/movie/')) {
    movieId = decodeURIComponent(path.replace('/movie/', '')).replace(/\/$/, '');
  } else if (searchParams.has('movie')) {
    movieId = searchParams.get('movie') || '';
  }

  if (movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      return { page: 'details', movie, query: '', genre: 'All' };
    }
  }

  // 3. Tab routes: /movies, /genres, /search
  if (path === '/movies' || searchParams.get('tab') === 'movies') {
    return { page: 'movies', movie: null, query: '', genre: 'All' };
  }

  if (path === '/genres' || searchParams.get('tab') === 'genres') {
    return { page: 'genres', movie: null, query: '', genre: 'All' };
  }

  if (path === '/search' || searchParams.has('q')) {
    return { page: 'search', movie: null, query: searchParams.get('q') || '', genre: 'All' };
  }

  return { page: 'home', movie: null, query: '', genre: 'All' };
}

export default function App() {
  const allMovies = STORED_MOVIES;

  // Initialize page & movie state from current browser URL
  const initialRoute = getRouteFromLocation(allMovies);
  const [currentPage, setCurrentPage] = useState<PageView>(initialRoute.page);
  const [previousPage, setPreviousPage] = useState<PageView>('home');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<GenreType | 'All'>(initialRoute.genre);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(initialRoute.movie);
  const [searchQuery, setSearchQuery] = useState(initialRoute.query);
  const [language, setLanguage] = useState<'sw' | 'en'>('sw');

  // Unified navigation function that updates URL and document title
  const navigate = (page: PageView, movie?: Movie | null, push = true) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    if (movie !== undefined) setSelectedMovie(movie);

    let targetUrl = '/';
    let title = 'NeliPlay Swahili — Your Home of Swahili Entertainment';

    if (page === 'details' && movie) {
      targetUrl = `/movie/${movie.id}`;
      title = `${movie.title} | NeliPlay Swahili`;
    } else if (page === 'watch' && movie) {
      targetUrl = `/watch/${movie.id}`;
      title = `Kutazama: ${movie.title} | NeliPlay Swahili`;
    } else if (page === 'movies') {
      targetUrl = '/movies';
      title = 'Katalogi ya Filamu | NeliPlay Swahili';
    } else if (page === 'genres') {
      targetUrl = '/genres';
      title = 'Aina za Filamu | NeliPlay Swahili';
    } else if (page === 'search') {
      targetUrl = searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search';
      title = 'Tafuta Filamu | NeliPlay Swahili';
    }

    if (push && typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({ page, movieId: movie?.id }, '', targetUrl);
    }
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  };

  // Listen to browser Back / Forward (popstate) buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromLocation(allMovies);
      setCurrentPage(route.page);
      setSelectedMovie(route.movie);
      if (route.query) setSearchQuery(route.query);

      if (route.page === 'details' && route.movie) {
        document.title = `${route.movie.title} | NeliPlay Swahili`;
      } else if (route.page === 'watch' && route.movie) {
        document.title = `Kutazama: ${route.movie.title} | NeliPlay Swahili`;
      } else {
        document.title = 'NeliPlay Swahili — Your Home of Swahili Entertainment';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allMovies]);

  // Sync initial URL on mount if needed
  useEffect(() => {
    if (initialRoute.page === 'details' && initialRoute.movie) {
      document.title = `${initialRoute.movie.title} | NeliPlay Swahili`;
    } else if (initialRoute.page === 'watch' && initialRoute.movie) {
      document.title = `Kutazama: ${initialRoute.movie.title} | NeliPlay Swahili`;
    }
  }, []);

  // Keyboard arrow keys scrolling & TV remote accessibility
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in search input
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      // During video playback, player handles arrow keys for seek/volume
      if (currentPage === 'watch') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        window.scrollBy({ top: 220, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        window.scrollBy({ top: -220, behavior: 'smooth' });
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentPage]);

  // Curated Content Rows from the 75 Swahili Movies
  const trendingMovies = allMovies.filter(m => m.trending);
  const recentlyAddedMovies = allMovies.filter(m => m.recentlyAdded);
  const popularMovies = allMovies.filter(m => m.popular);
  const actionMovies = allMovies.filter(m => m.genres.includes('Action') || m.genres.includes('Crime'));
  const dramaMovies = allMovies.filter(m => m.genres.includes('Drama') || m.genres.includes('Romance'));
  const familyAnimationMovies = allMovies.filter(m => m.genres.includes('Family') || m.genres.includes('Animation'));
  const comedyMovies = allMovies.filter(m => m.genres.includes('Comedy'));

  // Navigation handlers
  const handleOpenDetails = (movie: Movie) => {
    navigate('details', movie, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayMovie = (movie: Movie) => {
    navigate('watch', movie, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetails = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigate('home', null, true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromWatch = () => {
    if (selectedMovie) {
      navigate('details', selectedMovie, true);
    } else {
      navigate('home', null, true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGenreFromExplorer = (genre: GenreType) => {
    setSelectedGenreFilter(genre);
    navigate('movies', null, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-[#FF6A00] selection:text-white antialiased overflow-x-hidden">
      
      {/* 1. Universal Top Header */}
      <Header
        currentTab={
          currentPage === 'home' || currentPage === 'movies' || currentPage === 'genres' || currentPage === 'search'
            ? currentPage
            : 'home'
        }
        onSelectTab={(tab) => {
          if (tab === 'movies') setSelectedGenreFilter('All');
          navigate(tab, null, true);
        }}
        language={language}
        onToggleLanguage={() => setLanguage(l => (l === 'sw' ? 'en' : 'sw'))}
        onSelectMovie={handleOpenDetails}
        movies={allMovies}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Page Routing (No popups — each view is a real page!) */}
      <main className="flex-1">
        {/* PAGE 1: HOMEPAGE */}
        {currentPage === 'home' && (
          <div className="space-y-4 pb-20">
            
            {/* Billboard Hero with seamless Pink-Orange Radiant Transition */}
            <HeroBanner
              movies={allMovies}
              onPlayMovie={handlePlayMovie}
              onOpenDetails={handleOpenDetails}
              language={language}
            />

            {/* Quick Genre Pill Navigator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSelectGenreFromExplorer(g.id)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-orange-50/70 border border-orange-200/80 text-xs font-bold text-slate-700 hover:text-slate-900 whitespace-nowrap transition-all cursor-pointer group shadow-sm hover:border-[#FF6A00]/50 hover:scale-105 active:scale-95"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs"
                      style={{ backgroundColor: g.color }}
                    />
                    <span>{language === 'sw' ? g.swahiliName : g.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 1: Trending Movies (Filamu Zinazotazamika Sana) */}
            <MovieRow
              title={language === 'sw' ? 'Filamu Zinazotazamika Sana' : 'Trending Swahili Movies'}
              icon={<Flame className="w-5 h-5 text-[#FF6A00]" />}
              movies={trendingMovies}
              onPlayMovie={handlePlayMovie}
              onOpenDetails={handleOpenDetails}
              onViewAll={() => {
                setSelectedGenreFilter('All');
                setPreviousPage('home');
                setCurrentPage('movies');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              viewAllLabel={language === 'sw' ? 'Ona Zote' : 'View All'}
              aspectRatio="2/3"
            />

            {/* Row 2: Recently Added (Mpya Zilizoongezwa) */}
            <MovieRow
              title={language === 'sw' ? 'Filamu Mpya Zilizoongezwa' : 'Recently Added'}
              icon={<Sparkles className="w-5 h-5 text-[#FF2D87]" />}
              movies={recentlyAddedMovies}
              onPlayMovie={handlePlayMovie}
              onOpenDetails={handleOpenDetails}
              onViewAll={() => {
                setSelectedGenreFilter('All');
                setPreviousPage('home');
                setCurrentPage('movies');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              viewAllLabel={language === 'sw' ? 'Ona Zote' : 'View All'}
              aspectRatio="2/3"
            />

            {/* Row 3: Popular Swahili Cinema (Filamu Maarufu Zaidi) */}
            <MovieRow
              title={language === 'sw' ? 'Filamu Maarufu Zaidi' : 'Most Popular Cinema'}
              icon={<TrendingUp className="w-5 h-5 text-[#0066FF]" />}
              movies={popularMovies}
              onPlayMovie={handlePlayMovie}
              onOpenDetails={handleOpenDetails}
              onViewAll={() => {
                setSelectedGenreFilter('All');
                setPreviousPage('home');
                setCurrentPage('movies');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              viewAllLabel={language === 'sw' ? 'Ona Zote' : 'View All'}
              aspectRatio="2/3"
            />

            {/* Row 4: Action & Crime (Vitendo & Mapambano) */}
            {actionMovies.length > 0 && (
              <MovieRow
                title={language === 'sw' ? 'Vitendo na Mapambano Makali' : 'Action & Crime Thrillers'}
                icon={<ShieldAlert className="w-5 h-5 text-[#FF6A00]" />}
                movies={actionMovies}
                onPlayMovie={handlePlayMovie}
                onOpenDetails={handleOpenDetails}
                onViewAll={() => handleSelectGenreFromExplorer('Action')}
                viewAllLabel={language === 'sw' ? 'Ona Zote' : 'View All'}
                aspectRatio="2/3"
              />
            )}

            {/* Row 5: Heartfelt Drama & Romance (Mazonge & Mahaba) */}
            {dramaMovies.length > 0 && (
              <MovieRow
                title={language === 'sw' ? 'Mazonge, Maisha na Mahaba' : 'Drama & Romance'}
                icon={<HeartHandshake className="w-5 h-5 text-[#FF2D87]" />}
                movies={dramaMovies}
                onPlayMovie={handlePlayMovie}
                onOpenDetails={handleOpenDetails}
                onViewAll={() => handleSelectGenreFromExplorer('Drama')}
                viewAllLabel={language === 'sw' ? 'Ona Zote' : 'View All'}
                aspectRatio="2/3"
              />
            )}

            {/* Row 6: Family & Animation (Familia & Katuni) */}
            {familyAnimationMovies.length > 0 && (
              <MovieRow
                title={language === 'sw' ? 'Familia na Katuni za Watoto' : 'Family & Animation'}
                icon={<Smile className="w-5 h-5 text-emerald-500" />}
                movies={familyAnimationMovies}
                onPlayMovie={handlePlayMovie}
                onOpenDetails={handleOpenDetails}
                onViewAll={() => handleSelectGenreFromExplorer('Family')}
                viewAllLabel={language === 'sw' ? 'Ona Zote' : 'View All'}
                aspectRatio="2/3"
              />
            )}

            {/* Row 7: Comedy & Entertainment (Vichekesho) */}
            {comedyMovies.length > 0 && (
              <MovieRow
                title={language === 'sw' ? 'Vichekesho na Burudani ya Moyo' : 'Comedy & Laughter'}
                icon={<Clapperboard className="w-5 h-5 text-amber-500" />}
                movies={comedyMovies}
                onPlayMovie={handlePlayMovie}
                onOpenDetails={handleOpenDetails}
                onViewAll={() => handleSelectGenreFromExplorer('Comedy')}
                viewAllLabel={language === 'sw' ? 'Ona Zote' : 'View All'}
                aspectRatio="2/3"
              />
            )}

          </div>
        )}

        {/* PAGE 2: MOVIES CATALOGUE */}
        {currentPage === 'movies' && (
          <MoviesCatalogue
            movies={allMovies}
            onPlayMovie={handlePlayMovie}
            onOpenDetails={handleOpenDetails}
            onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
            initialGenreFilter={selectedGenreFilter}
          />
        )}

        {/* PAGE 3: EXPLORE GENRES */}
        {currentPage === 'genres' && (
          <GenreExplorer
            onSelectGenre={handleSelectGenreFromExplorer}
            onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
            allMovies={allMovies}
          />
        )}

        {/* PAGE 4: DEDICATED SEARCH PAGE */}
        {currentPage === 'search' && (
          <SearchPage
            movies={allMovies}
            initialQuery={searchQuery}
            onSelectMovie={handleOpenDetails}
            onPlayMovie={handlePlayMovie}
            onBack={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
          />
        )}

        {/* PAGE 5: DEDICATED MOVIE DETAILS PAGE (NOT A POPUP!) */}
        {currentPage === 'details' && selectedMovie && (
          <MovieDetailsPage
            movie={selectedMovie}
            onBack={handleBackFromDetails}
            onPlayMovie={handlePlayMovie}
            onSelectMovie={handleOpenDetails}
            allMovies={allMovies}
            language={language}
          />
        )}

        {/* PAGE 6: YOUTUBE-STYLE WATCH PAGE (WITH RECOMMENDED MOVIES & RED TIMELINE) */}
        {currentPage === 'watch' && selectedMovie && (
          <NeliPlayer
            movie={selectedMovie}
            onClose={handleBackFromWatch}
            language={language}
            allMovies={allMovies}
            onSelectMovie={handlePlayMovie}
          />
        )}
      </main>

      {/* 3. Global Footer (hidden during video playback) */}
      {currentPage !== 'watch' && (
        <Footer
          onSelectTab={(tab) => {
            navigate(tab, null, true);
          }}
          language={language}
        />
      )}
    </div>
  );
}

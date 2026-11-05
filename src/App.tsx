/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [previousPage, setPreviousPage] = useState<PageView>('home');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<GenreType | 'All'>('All');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'sw' | 'en'>('sw');

  const allMovies = STORED_MOVIES;

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
    setSelectedMovie(movie);
    setPreviousPage(currentPage === 'watch' ? 'home' : currentPage);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setPreviousPage(currentPage);
    setCurrentPage('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetails = () => {
    const target = previousPage === 'details' || previousPage === 'watch' ? 'home' : previousPage;
    setCurrentPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromWatch = () => {
    if (selectedMovie) {
      setCurrentPage('details');
    } else {
      setCurrentPage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGenreFromExplorer = (genre: GenreType) => {
    setSelectedGenreFilter(genre);
    setPreviousPage('genres');
    setCurrentPage('movies');
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
          setPreviousPage(currentPage);
          setCurrentPage(tab);
          if (tab === 'movies') setSelectedGenreFilter('All');
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    <span className="text-[10px] text-slate-400">({g.movieCount})</span>
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
            setPreviousPage(currentPage);
            setCurrentPage(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          language={language}
        />
      )}
    </div>
  );
}

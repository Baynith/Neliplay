import React, { useState } from 'react';
import { Film, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Movie, GenreType } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MoviesCatalogueProps {
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onBackToHome: () => void;
  language: 'sw' | 'en';
  initialGenreFilter?: GenreType | 'All';
}

export const MoviesCatalogue: React.FC<MoviesCatalogueProps> = ({
  movies,
  onPlayMovie,
  onOpenDetails,
  onBackToHome,
  language,
  initialGenreFilter = 'All',
}) => {
  const [selectedGenre, setSelectedGenre] = useState<GenreType | 'All'>(initialGenreFilter);
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'rating' | 'alpha'>('trending');

  const genresList: (GenreType | 'All')[] = [
    'All',
    'Action',
    'Drama',
    'Comedy',
    'Romance',
    'Thriller',
    'Horror',
    'Adventure',
    'Crime',
    'Family',
    'Animation',
    'Science Fiction',
    'Mystery',
    'Fantasy',
    'War',
    'History',
  ];

  const filteredMovies = movies
    .filter(m => selectedGenre === 'All' || m.genres.includes(selectedGenre))
    .sort((a, b) => {
      if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
      if (sortBy === 'rating') return b.ratingScore - a.ratingScore;
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    });

  return (
    <div className="min-h-screen text-slate-900 pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="space-y-1">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:text-[#FF6A00] transition-colors cursor-pointer mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}</span>
            </button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900">
              {language === 'sw' ? 'Katalogi ya ' : 'All '}
              <span className="text-[#FF6A00]">{language === 'sw' ? 'Filamu' : 'Movies'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {language === 'sw'
                ? 'Mkusanyiko rasmi wa filamu za Kiswahili tayari kutazamwa bure.'
                : 'Official collection of Swahili movies ready to stream for free.'}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-[#FF6A00] cursor-pointer"
            >
              <option value="trending">{language === 'sw' ? 'Maarufu (Trending)' : 'Trending'}</option>
              <option value="newest">{language === 'sw' ? 'Mpya Zaidi (Newest)' : 'Newest'}</option>
              <option value="rating">{language === 'sw' ? 'Alama za Juu (Top Rated)' : 'Top Rated'}</option>
              <option value="alpha">{language === 'sw' ? 'Kichwa (A-Z)' : 'Title (A-Z)'}</option>
            </select>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {genresList.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-gradient-to-r from-[#FF6A00] via-[#FF2D87] to-[#0066FF] text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs'
              }`}
            >
              {genre === 'All' ? (language === 'sw' ? 'Zote' : 'All') : genre}
            </button>
          ))}
        </div>

        {/* Responsive Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 justify-items-center">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="w-full flex justify-center">
                <MovieCard
                  movie={movie}
                  onPlay={onPlayMovie}
                  onOpenDetails={onOpenDetails}
                  aspectRatio="2/3"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <Film className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">
              {language === 'sw' ? 'Hakuna filamu katika aina hii.' : 'No movies found.'}
            </h3>
            <button
              onClick={() => setSelectedGenre('All')}
              className="px-4 py-2 rounded-xl bg-[#0066FF] text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
            >
              {language === 'sw' ? 'Onyesha Filamu Zote' : 'Show All'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

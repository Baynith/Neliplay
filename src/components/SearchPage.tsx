import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Film, ArrowLeft } from 'lucide-react';
import { Movie, GenreType } from '../types/movie';
import { MovieCard } from './MovieCard';
import { GENRE_CATEGORIES } from '../data/movies';

interface SearchPageProps {
  movies: Movie[];
  initialQuery?: string;
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  onBack: () => void;
  language: 'sw' | 'en';
}

export const SearchPage: React.FC<SearchPageProps> = ({
  movies,
  initialQuery = '',
  onSelectMovie,
  onPlayMovie,
  onBack,
  language,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredMovies = useMemo(() => {
    let result = movies;

    if (selectedGenre !== 'All') {
      result = result.filter(m => 
        m.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q) ||
        m.synopsisSwahili.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.cast.some(c => c.toLowerCase().includes(q)) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        (m.tmdbId && m.tmdbId.toString().includes(q))
      );
    }

    return result;
  }, [movies, query, selectedGenre]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Top back & title bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#FF6A00] border border-orange-200/60 shadow-sm transition-all cursor-pointer font-bold text-sm hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back Home'}</span>
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {language === 'sw' ? 'Ukurasa wa Kutafuta' : 'Search Catalogue'}
        </span>
      </div>

      {/* Hero Search Bar */}
      <div className="relative max-w-3xl mx-auto mb-8">
        <div className="relative flex items-center shadow-lg rounded-3xl bg-white border-2 border-orange-200/80 focus-within:border-[#FF6A00] focus-within:ring-4 focus-within:ring-orange-500/15 transition-all">
          <Search className="w-6 h-6 text-[#FF6A00] ml-5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'sw' ? 'Andika jina la filamu, muigizaji, aina au neno...' : 'Search by movie title, actor, genre, keyword...'}
            className="w-full py-4 px-4 text-base sm:text-lg bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Futa / Clear"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8 justify-start sm:justify-center">
        <button
          onClick={() => setSelectedGenre('All')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
            selectedGenre === 'All'
              ? 'bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white shadow-md scale-105'
              : 'bg-white hover:bg-orange-50/50 text-slate-700 border border-slate-200/80'
          }`}
        >
          {language === 'sw' ? 'Zote (75)' : 'All (75)'}
        </button>

        {GENRE_CATEGORIES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGenre(g.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              selectedGenre === g.id
                ? 'bg-slate-900 text-white shadow-md scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: g.color }}
            />
            <span>{language === 'sw' ? g.swahiliName : g.name}</span>
            <span className="text-[10px] opacity-70">({g.movieCount})</span>
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-[#FF6A00]" />
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
            {language === 'sw' ? 'Matokeo ya Filamu' : 'Movie Results'}
          </h2>
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-orange-100 shadow-xs">
          {filteredMovies.length} {language === 'sw' ? 'zimepatikana' : 'movies found'}
        </span>
      </div>

      {/* Grid or Empty State */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              onPlayMovie={onPlayMovie}
              language={language}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-3xl border border-orange-100/80 p-8 max-w-xl mx-auto shadow-sm">
          <Sparkles className="w-12 h-12 text-[#FF6A00] mx-auto mb-4 opacity-70" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {language === 'sw' ? 'Hakuna filamu iliyopatikana' : 'No movies found'}
          </h3>
          <p className="text-slate-600 text-sm mb-6">
            {language === 'sw' 
              ? `Hakuna matokeo ya "${query}". Jaribu kutafuta kwa neno lingine au chagua aina nyingine hapo juu.`
              : `No matches found for "${query}". Try different search terms or select another category.`}
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedGenre('All');
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {language === 'sw' ? 'Onyesha Filamu Zote' : 'Show All Movies'}
          </button>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { 
  Flame, 
  Theater, 
  Smile, 
  Heart, 
  Zap, 
  Skull, 
  Mountain, 
  ShieldAlert, 
  Users, 
  Rocket, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { GenreCategory, GenreType, Movie } from '../types/movie';
import { GENRES } from '../data/movies';
import { NeliWatermark } from './NeliWatermark';

interface GenreExplorerProps {
  onSelectGenre: (genre: GenreType) => void;
  onBackToHome: () => void;
  language: 'sw' | 'en';
  allMovies: Movie[];
}

export const GenreExplorer: React.FC<GenreExplorerProps> = ({
  onSelectGenre,
  onBackToHome,
  language,
  allMovies,
}) => {
  const getGenreIcon = (id: GenreType) => {
    switch (id) {
      case 'Action': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Drama': return <Theater className="w-5 h-5 text-purple-500" />;
      case 'Comedy': return <Smile className="w-5 h-5 text-amber-500" />;
      case 'Romance': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Thriller': return <Zap className="w-5 h-5 text-cyan-500" />;
      case 'Horror': return <Skull className="w-5 h-5 text-rose-500" />;
      case 'Adventure': return <Mountain className="w-5 h-5 text-sky-500" />;
      case 'Crime': return <ShieldAlert className="w-5 h-5 text-slate-700" />;
      case 'Family': return <Users className="w-5 h-5 text-emerald-500" />;
      case 'Science Fiction': return <Rocket className="w-5 h-5 text-indigo-500" />;
      default: return <Flame className="w-5 h-5 text-orange-500" />;
    }
  };

  const getMovieCountForGenre = (genreId: GenreType) => {
    return allMovies.filter(m => m.genres.includes(genreId)).length;
  };

  return (
    <div className="relative min-h-screen text-slate-900 pt-20 sm:pt-24 pb-24 overflow-hidden">
      
      {/* Large Subtle NeliPlay Watermark */}
      <NeliWatermark
        position="backdrop"
        size="hero-sky"
        opacity={0.08}
        glow
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6A00]" />
            <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}</span>
          </button>

          <span className="text-xs font-semibold text-slate-500">
            {language === 'sw' ? 'Aina 10 za Filamu' : '10 Categories'}
          </span>
        </div>

        {/* Hero Title with Orange/Pink/Blue Gradient */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-slate-900">
            {language === 'sw' ? 'Gundua ' : 'Explore '}
            <span className="bg-gradient-to-r from-[#FF6A00] via-[#FF2D87] to-[#0066FF] bg-clip-text text-transparent">
              {language === 'sw' ? 'Aina za Filamu' : 'Genres'}
            </span>
          </h1>
          <p className="text-xs sm:text-base text-slate-600 font-medium">
            {language === 'sw'
              ? 'Pata filamu yako inayofuata ya kusisimua kulingana na ladha na hisia zako.'
              : 'Find your next favourite movie according to your mood and taste.'}
          </p>
        </div>

        {/* 10 Genre Cards Grid (Responsive 1-4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {GENRES.map((genre: GenreCategory) => {
            const count = getMovieCountForGenre(genre.id);
            return (
              <div
                key={genre.id}
                onClick={() => onSelectGenre(genre.id)}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer select-none border border-slate-200/90 hover:border-[#FF6A00] transition-all duration-300 transform hover:-translate-y-1.5 shadow-md hover:shadow-xl hover:shadow-[#0066FF]/20"
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={genre.coverImage}
                    alt={genre.name}
                    className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.1] group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                {/* Corner Watermark */}
                <NeliWatermark
                  position="top-right"
                  size="xs"
                  opacity={0.35}
                />

                {/* Content Overlay */}
                <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      {getGenreIcon(genre.id)}
                    </div>

                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 shadow-sm">
                      {count} {language === 'sw' ? 'filamu' : 'movies'}
                    </span>
                  </div>

                  {/* Bottom Text & Arrow */}
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#FFA000] transition-colors font-display">
                        {language === 'sw' ? genre.swahiliName : genre.name}
                      </h3>
                      <p className="text-xs text-slate-200 line-clamp-1 font-normal">
                        {language === 'sw' ? genre.swahiliDescription : genre.description}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-white/20 group-hover:bg-gradient-to-r group-hover:from-[#FF6A00] group-hover:to-[#0066FF] border border-white/30 flex items-center justify-center text-white shrink-0 group-hover:scale-110 shadow-md transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Brand Lockup */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/neliplay_brand_transparent.png"
              alt="NeliPlay"
              className="h-7 object-contain"
            />
            <div>
              <p className="text-xs text-slate-500 font-semibold">Your Home of Swahili Entertainment.</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {language === 'sw' 
              ? 'Filamu zote zinapatikana bure kwa lugha ya Kiswahili.' 
              : 'All movies are free to watch in Kiswahili.'}
          </p>
        </div>
      </div>
    </div>
  );
};

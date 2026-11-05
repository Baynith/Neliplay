import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Volume2, Sparkles } from 'lucide-react';
import { Movie } from '../types/movie';
import { optimizeTmdbImage } from '../utils/imageOptimizer';

interface HeroBannerProps {
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  language: 'sw' | 'en';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movies,
  onPlayMovie,
  onOpenDetails,
  language,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredMovies = movies.filter(m => m.featured || m.trending).slice(0, 6);
  const currentMovie = featuredMovies[currentIndex] || movies[0];

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!currentMovie) return null;

  const backdropSrc = optimizeTmdbImage(currentMovie.backdropUrl || currentMovie.posterUrl, 'banner');

  return (
    <div className="relative w-full pt-16 sm:pt-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Card Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-orange-200/50 bg-slate-950 min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex flex-col justify-end">
          
          {/* 1. Cinematic Backdrop (Bright, high-clarity image without dark muddiness) */}
          <div className="absolute inset-0 z-0">
            <img
              src={backdropSrc}
              alt={currentMovie.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.03] transition-all duration-700 ease-out"
            />

            {/* Clean bottom gradient scrim only for text legibility, leaving faces crisp & clear */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent max-w-3xl" />
          </div>

          {/* 2. Top corner subtle badge (Clean, minimal, never obscures faces) */}
          <div className="absolute top-5 right-5 z-20 hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span className="text-[11px] font-bold text-white tracking-wide">
              {language === 'sw' ? 'Filamu Iliyoangaziwa' : 'Featured Swahili Movie'}
            </span>
          </div>

          {/* 3. Hero Information on Left */}
          <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl space-y-3.5">
            
            {/* Badges strip */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-[11px] font-black tracking-wider text-white uppercase shadow-md">
                TOP 10 SWAHILI
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-bold text-white uppercase border border-white/20">
                HD 1080p
              </span>
              <span className="text-white text-xs font-mono font-semibold">
                {currentMovie.releaseYear}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs font-medium text-white">
                {currentMovie.runtime}
              </span>
              <span className="text-white/40">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-orange-300 font-semibold">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Simulizi ya Kiswahili</span>
              </span>
            </div>

            {/* Large Movie Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display leading-[1.08] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              {currentMovie.titlePrefix ? (
                <>
                  <span>{currentMovie.titlePrefix} </span>
                  <span className="text-[#FFB300]">
                    {currentMovie.titleHighlight}
                  </span>
                </>
              ) : (
                <span className="text-[#FFB300]">
                  {currentMovie.title}
                </span>
              )}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentMovie.genres.map(genre => (
                <span key={genre} className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold text-slate-200 border border-white/10">
                  {genre}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3 max-w-xl drop-shadow-sm">
              {language === 'sw' ? currentMovie.synopsisSwahili : currentMovie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlayMovie(currentMovie)}
                className="group inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#FF6A00] via-[#FF2D87] to-[#0066FF] shadow-[0_8px_25px_rgba(255,106,0,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{language === 'sw' ? 'Tazama Sasa' : 'Watch Now'}</span>
              </button>

              <button
                onClick={() => onOpenDetails(currentMovie)}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-slate-900 bg-white/95 hover:bg-white shadow-md border border-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Info className="w-5 h-5 text-[#FF6A00]" />
                <span>{language === 'sw' ? 'Maelezo Zaidi' : 'More Info'}</span>
              </button>
            </div>

          </div>

          {/* Slide Indicator Bar at bottom right */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {featuredMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-gradient-to-r from-[#FF6A00] to-[#FF2D87]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

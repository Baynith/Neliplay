import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Calendar, 
  Film, 
  Users, 
  Award, 
  Share2, 
  Heart,
  Volume2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Movie } from '../types/movie';
import { NeliImage } from './NeliImage';
import { MovieCard } from './MovieCard';
import { optimizeTmdbImage } from '../utils/imageOptimizer';

interface MovieDetailsPageProps {
  movie: Movie;
  onBack: () => void;
  onPlayMovie: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
  allMovies: Movie[];
  language: 'sw' | 'en';
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movie,
  onBack,
  onPlayMovie,
  onSelectMovie,
  allMovies,
  language,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movie.id]);

  // Related movies based on shared genres
  const moreLikeThis = allMovies
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 10);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${movie.title} | NeliPlay Swahili`,
        text: movie.synopsisSwahili,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-16 sm:pt-20 animate-fadeIn">
      {/* Top sticky sub-nav / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#FF6A00] border border-orange-200/60 shadow-sm transition-all cursor-pointer font-bold text-sm hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#FF6A00] border border-orange-200/60 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            title="Shiriki / Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#FF2D87] border border-pink-200/60 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            title="Weka Vipendwa / Favorite"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Cinematic Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-orange-100 bg-slate-950">
          
          {/* Backdrop Image with clean, vibrant presentation */}
          <div className="relative h-72 sm:h-96 md:h-[500px] w-full overflow-hidden">
            <img
              src={optimizeTmdbImage(movie.backdropUrl || movie.posterUrl, 'banner')}
              alt={movie.title}
              decoding="async"
              className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.02]"
            />
            {/* Subtle scrim only at the bottom and left for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />
            
            {/* Subtle NeliPlay Brand Watermark */}
            <div className="absolute top-6 right-6 opacity-40 pointer-events-none">
              <img 
                src="/assets/aistudio/neliplay_brand_transparent.png" 
                alt="NeliPlay" 
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>
          </div>

          {/* Foreground Movie Presentation */}
          <div className="relative p-6 sm:p-10 -mt-32 sm:-mt-48 z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Left: High-Res Portrait Poster with NeliPlay Watermark */}
              <div className="w-48 sm:w-64 md:w-72 shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/40 ring-4 ring-orange-500/20 bg-slate-900 group">
                <NeliImage
                  src={movie.posterUrl}
                  alt={movie.title}
                  aspectRatio="2/3"
                  watermarkPosition="bottom-right"
                  watermarkSize="md"
                  watermarkOpacity={0.4}
                  className="w-full h-auto"
                />
              </div>

              {/* Right: Info & Play CTAs */}
              <div className="flex-1 space-y-5 text-white">
                
                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white text-xs font-black tracking-wide shadow-md uppercase">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Simulizi ya Kiswahili</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                    {movie.ageRating}
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                    HD 1080p
                  </span>

                  {movie.tmdbId && (
                    <a
                      href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-300 text-xs font-medium border border-cyan-500/30 hover:border-cyan-400 transition-colors"
                    >
                      <span>TMDB #{movie.tmdbId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white drop-shadow-md">
                  {movie.titlePrefix ? (
                    <>
                      <span>{movie.titlePrefix} </span>
                      <span className="text-[#FFB300]">{movie.titleHighlight}</span>
                    </>
                  ) : (
                    <span>{movie.title}</span>
                  )}
                </h1>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FF6A00]" />
                    <span>{movie.releaseYear}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FF2D87]" />
                    <span>{movie.runtime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-white">{movie.ratingScore}</span>
                    <span className="text-xs text-slate-400">/ 5.0</span>
                  </div>
                </div>

                {/* Genre chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 transition-colors"
                    >
                      <Film className="w-3 h-3 text-[#FF6A00]" />
                      <span>{genre}</span>
                    </span>
                  ))}
                </div>

                {/* Main Play CTA Button */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onPlayMovie(movie)}
                    className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-black text-white bg-neli-play-btn shadow-[0_12px_30px_rgba(255,106,0,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                  >
                    <Play className="w-6 h-6 fill-current transition-transform group-hover:scale-110" />
                    <span>{language === 'sw' ? 'Tazama Filamu Sasa' : 'Watch Movie Now'}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Main Details and Cast on Light Pink-Orange Glow Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Swahili Synopsis & Story Overview */}
          <div className="lg:col-span-2 space-y-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-orange-100/80 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#FF6A00]" />
                <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                  {language === 'sw' ? 'Simulizi na Maelezo ya Filamu' : 'Synopsis & Overview'}
                </h2>
              </div>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg font-normal">
                {movie.synopsisSwahili}
              </p>
            </div>

            {movie.overview && movie.overview !== movie.synopsisSwahili && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                  English Synopsis (TMDB)
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {movie.overview}
                </p>
              </div>
            )}
          </div>

          {/* Right Col: Cast, Director, Metadata details */}
          <div className="space-y-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-orange-100/80 shadow-md">
            
            {/* Director */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <Users className="w-4 h-4 text-[#FF6A00]" />
                <span>{language === 'sw' ? 'Mwongozaji (Director)' : 'Director'}</span>
              </div>
              <p className="text-slate-900 font-bold text-base">
                {movie.director || 'NeliPlay Productions'}
              </p>
            </div>

            {/* Cast list */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                <Users className="w-4 h-4 text-[#FF2D87]" />
                <span>{language === 'sw' ? 'Waigizaji Wakuu (Top Cast)' : 'Top Cast'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/60 text-slate-800 text-xs font-bold shadow-xs"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Audio & Subtitles */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold">{language === 'sw' ? 'Lugha ya Sauti:' : 'Audio Language:'}</span>
                <span className="font-bold text-[#FF6A00]">Kiswahili (Simulizi ya DJ)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{language === 'sw' ? 'Manukuu (Subtitles):' : 'Subtitles:'}</span>
                <span className="font-bold text-slate-800">Kiswahili, English</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{language === 'sw' ? 'Ubora wa Picha:' : 'Video Quality:'}</span>
                <span className="font-bold text-emerald-600">Full HD (1080p / 720p)</span>
              </div>
            </div>

          </div>

        </div>

        {/* More Like This (Filamu Zinazofanana) */}
        {moreLikeThis.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Film className="w-6 h-6 text-[#FF6A00]" />
                <h2 className="text-2xl font-black font-display text-slate-900">
                  {language === 'sw' ? 'Filamu Zinazofanana na Hii' : 'More Like This'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {moreLikeThis.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  onSelectMovie={onSelectMovie}
                  onPlayMovie={onPlayMovie}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

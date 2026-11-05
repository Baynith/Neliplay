import React from 'react';
import { X, Play, Clock, Calendar, Volume2, Shield, Film, Users, Award } from 'lucide-react';
import { Movie } from '../types/movie';
import { NeliImage } from './NeliImage';
import { NeliWatermark } from './NeliWatermark';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlayMovie: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
  allMovies: Movie[];
  language: 'sw' | 'en';
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onPlayMovie,
  onSelectMovie,
  allMovies,
  language,
}) => {
  if (!movie) return null;

  const moreLikeThis = allMovies
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl my-8 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
          title="Funga / Close"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>

        {/* Hero Backdrop Header */}
        <div className="relative h-72 sm:h-96 md:h-[400px] w-full overflow-hidden bg-slate-900">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

          {/* Watermark */}
          <NeliWatermark
            position="top-right"
            size="lg"
            opacity={0.16}
            className="top-6 right-16"
            glow
          />

          {/* Floating Action Strip */}
          <div className="absolute bottom-6 left-6 sm:left-8 right-6 flex items-end justify-between">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#0066FF] shadow-sm">
                <Film className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>{movie.genres.join(' · ')}</span>
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {movie.titlePrefix ? (
                  <>
                    <span>{movie.titlePrefix} </span>
                    <span className="text-[#FFA000]">{movie.titleHighlight}</span>
                  </>
                ) : (
                  <span className="text-[#FFA000]">{movie.title}</span>
                )}
              </h1>
            </div>

            <button
              onClick={() => {
                onClose();
                onPlayMovie(movie);
              }}
              className="hidden sm:inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-base font-bold text-white bg-neli-play-btn shadow-[0_10px_25px_rgba(255,106,0,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{language === 'sw' ? 'Tazama Filamu' : 'Play Movie'}</span>
            </button>
          </div>
        </div>

        {/* Details Content Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pb-4 border-b border-slate-100">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Calendar className="w-4 h-4 text-[#FF6A00]" />
              <span className="font-mono tabular-nums">{movie.releaseYear}</span>
            </span>

            <span className="text-slate-300">·</span>

            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Clock className="w-4 h-4 text-[#0066FF]" />
              <span className="font-mono tabular-nums">{movie.runtime}</span>
            </span>

            <span className="text-slate-300">·</span>

            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Volume2 className="w-4 h-4 text-[#FF2D87]" />
              <span>{movie.language} (Sauti Halisi)</span>
            </span>

            <span className="text-slate-300">·</span>

            <span className="flex items-center gap-1.5 font-semibold">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="font-mono font-bold text-slate-800">{movie.ageRating}</span>
            </span>

            {movie.ratingScore && (
              <>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-[#FF6A00] font-bold">
                  <Award className="w-4 h-4" />
                  <span>{movie.ratingScore} / 5.0</span>
                </span>
              </>
            )}
          </div>

          {/* Grid Layout: Poster & Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Poster Thumbnail */}
            <div className="md:col-span-4 max-w-[240px] mx-auto md:mx-0 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <NeliImage
                src={movie.posterUrl}
                alt={movie.title}
                aspectRatio="2/3"
                withWatermark={true}
                watermarkPosition="bottom-right"
                watermarkSize="sm"
                watermarkOpacity={0.4}
                fallbackTitle={movie.title}
                fallbackGenre={movie.genres[0]}
              />
            </div>

            {/* Right Information */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                  {language === 'sw' ? 'Muhtasari wa Filamu' : 'Storyline & Overview'}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {language === 'sw' ? movie.synopsisSwahili : movie.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-xs mb-0.5">
                    {language === 'sw' ? 'Muongozaji (Director)' : 'Director'}
                  </span>
                  <span className="font-bold text-slate-900">{movie.director}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-xs mb-0.5">
                    {language === 'sw' ? 'Tafsiri za Maandishi (Subtitles)' : 'Subtitles'}
                  </span>
                  <span className="font-bold text-slate-900">{movie.subtitles.join(', ')}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs block mb-1">
                  <Users className="w-3.5 h-3.5 inline mr-1 text-[#0066FF]" />
                  {language === 'sw' ? 'Waigizaji Wakuu (Cast):' : 'Starring Cast:'}
                </span>
                <p className="text-sm text-slate-800 font-semibold">{movie.cast.join(' · ')}</p>
              </div>

              {/* Mobile Play Button */}
              <div className="sm:hidden pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onPlayMovie(movie);
                  }}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-base font-bold text-white bg-neli-play-btn shadow-lg"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{language === 'sw' ? 'Tazama Filamu' : 'Play Movie'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* More Like This Row */}
          {moreLikeThis.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                {language === 'sw' ? 'Filamu Zaidi Kama Hii' : 'More Like This'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {moreLikeThis.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectMovie(item)}
                    className="cursor-pointer group"
                  >
                    <div className="rounded-xl overflow-hidden mb-1.5 border border-slate-200 group-hover:border-[#FF6A00] shadow-sm transition-all">
                      <NeliImage
                        src={item.posterUrl}
                        alt={item.title}
                        aspectRatio="2/3"
                        withWatermark={true}
                        watermarkSize="xs"
                        watermarkOpacity={0.3}
                      />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#FF6A00]">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.releaseYear} · {item.runtime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

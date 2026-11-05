import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { NeliImage } from './NeliImage';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onOpenDetails?: (movie: Movie) => void;
  onPlayMovie?: (movie: Movie) => void;
  onSelectMovie?: (movie: Movie) => void;
  aspectRatio?: '16/9' | '2/3';
  language?: 'sw' | 'en';
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPlay,
  onOpenDetails,
  onPlayMovie,
  onSelectMovie,
  aspectRatio = '2/3',
}) => {
  const isPoster = aspectRatio === '2/3';

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayMovie) onPlayMovie(movie);
    else if (onPlay) onPlay(movie);
  };

  const handleOpen = () => {
    if (onSelectMovie) onSelectMovie(movie);
    else if (onOpenDetails) onOpenDetails(movie);
  };

  return (
    <div
      onClick={handleOpen}
      className={`group relative flex-none cursor-pointer select-none rounded-2xl overflow-hidden bg-white border border-orange-100/80 transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-xl hover:shadow-[#FF6A00]/15 hover:border-[#FF6A00]/60 ${
        isPoster 
          ? 'w-[135px] xs:w-[150px] sm:w-[170px] md:w-[190px] lg:w-[210px]' 
          : 'w-[220px] xs:w-[250px] sm:w-[280px] md:w-[310px]'
      }`}
    >
      {/* Artwork Container */}
      <div className="relative w-full overflow-hidden bg-slate-100">
        <NeliImage
          src={isPoster ? movie.posterUrl : (movie.backdropUrl || movie.posterUrl)}
          alt={movie.title}
          aspectRatio={aspectRatio}
          withWatermark={true}
          watermarkPosition="bottom-right"
          watermarkSize="xs"
          watermarkOpacity={0.4}
          fallbackTitle={movie.title}
          fallbackGenre={movie.genres[0]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Action Scrim */}
        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5">
          <button
            onClick={handlePlay}
            title="Tazama Sasa / Play"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neli-play-btn flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current translate-x-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            title="Maelezo Zaidi / Details"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6A00]" />
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF6A00] to-[#FF2D87] text-white text-[9px] font-black uppercase shadow-sm">
            Swahili Dub
          </span>
        </div>
      </div>

      {/* Card Metadata Footer for Radiant Canvas */}
      <div className="p-2.5 sm:p-3 bg-white">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF6A00] transition-colors truncate">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-medium">
          <span className="text-[#FF6A00] font-semibold truncate">{movie.genres[0]}</span>
          <span className="font-mono text-slate-400 shrink-0">{movie.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

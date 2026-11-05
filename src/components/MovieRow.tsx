import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  icon?: React.ReactNode;
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onViewAll?: () => void;
  viewAllLabel?: string;
  aspectRatio?: '16/9' | '2/3';
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  icon,
  movies,
  onPlayMovie,
  onOpenDetails,
  onViewAll,
  viewAllLabel = 'Ona Zote',
  aspectRatio = '2/3',
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const displayMovies = movies.slice(0, 16);

  return (
    <div className="py-3 sm:py-5 space-y-2 relative group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {icon && <div className="text-lg">{icon}</div>}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-display">
            {title}
          </h2>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-[#FF6A00] hover:text-[#FF2D87] transition-colors cursor-pointer"
          >
            {viewAllLabel} &gt;
          </button>
        )}
      </div>

      {/* Relative Carousel with Light-Styled Paddles */}
      <div className="relative">
        {/* Left Arrow Paddle */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 top-0 bottom-4 w-11 z-30 bg-white/95 hover:bg-white text-slate-800 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer shadow-lg border border-slate-200"
            title="Sogeza Kushoto"
          >
            <ChevronLeft className="w-6 h-6 text-slate-900 hover:text-[#FF6A00] transition-transform hover:scale-110" />
          </button>
        )}

        {/* Horizontal Carousel */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-3.5 sm:gap-4.5 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlayMovie}
              onOpenDetails={onOpenDetails}
              aspectRatio={aspectRatio}
            />
          ))}
        </div>

        {/* Right Arrow Paddle */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 top-0 bottom-4 w-12 z-30 bg-white/90 hover:bg-white text-slate-800 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer shadow-xl border border-slate-200"
            title="Sogeza Kulia"
          >
            <ChevronRight className="w-7 h-7 text-slate-900 hover:text-[#FF6A00] transition-transform hover:scale-125" />
          </button>
        )}
      </div>
    </div>
  );
};

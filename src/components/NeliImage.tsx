import React, { useState } from 'react';
import { Film, RefreshCw } from 'lucide-react';
import { NeliWatermark } from './NeliWatermark';
import { optimizeTmdbImage, ImageSizeVariant } from '../utils/imageOptimizer';

interface NeliImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '2/3' | '16/9' | '1/1' | 'auto';
  objectFit?: 'cover' | 'contain';
  withWatermark?: boolean;
  watermarkPosition?: 'bottom-right' | 'top-right' | 'top-left' | 'bottom-left';
  watermarkOpacity?: number;
  watermarkSize?: 'xs' | 'sm' | 'md';
  fallbackTitle?: string;
  fallbackGenre?: string;
  imageVariant?: ImageSizeVariant;
}

export const NeliImage: React.FC<NeliImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '16/9',
  objectFit = 'cover',
  withWatermark = true,
  watermarkPosition = 'bottom-right',
  watermarkOpacity = 0.28,
  watermarkSize = 'sm',
  fallbackTitle,
  fallbackGenre,
  imageVariant,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Automatically determine the compressed image size variant
  const determinedVariant: ImageSizeVariant = imageVariant || (
    aspectRatio === '2/3' ? 'poster' : 'thumb'
  );
  const optimizedSrc = optimizeTmdbImage(src, determinedVariant);

  const aspectClass = {
    '2/3': 'aspect-[2/3]',
    '16/9': 'aspect-[16/9]',
    '1/1': 'aspect-square',
    'auto': '',
  }[aspectRatio];

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoading(true);
    setRetryKey(prev => prev + 1);
  };

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${aspectClass} ${className}`}>
      {/* Loading Skeleton / Shimmer */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse z-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-[#FF6A00] animate-spin opacity-60" />
        </div>
      )}

      {/* Main Image with compression & async decoding */}
      {!hasError ? (
        <img
          key={retryKey}
          src={optimizedSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-${objectFit} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        /* Resilient Fallback UI */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-100 border border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-orange-50 p-2 mb-1.5 flex items-center justify-center border border-orange-200/60 shadow-xs">
            <Film className="w-5 h-5 text-[#FF6A00]" />
          </div>
          {fallbackTitle && (
            <span className="text-[11px] font-semibold text-slate-800 line-clamp-1 px-1 mb-0.5">
              {fallbackTitle}
            </span>
          )}
          {fallbackGenre && (
            <span className="text-[9px] text-[#FF2D87] font-medium">
              {fallbackGenre} · Kiswahili
            </span>
          )}
          <button
            onClick={handleRetry}
            className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors shadow-2xs"
            title="Jaribu kupakia tena"
          >
            <RefreshCw className="w-2.5 h-2.5 text-[#FF6A00]" />
            <span>Jaribu Tena</span>
          </button>
        </div>
      )}

      {/* NeliPlay Watermark Overlay */}
      {withWatermark && !isLoading && (
        <NeliWatermark
          position={watermarkPosition}
          size={watermarkSize}
          opacity={watermarkOpacity}
        />
      )}
    </div>
  );
};

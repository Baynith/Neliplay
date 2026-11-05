/**
 * Image compression and optimization utility for NeliPlay Swahili.
 * Automatically transforms heavy TMDB 'original' or 'w1280' assets into
 * highly compressed, ultra-fast web-optimized sizes:
 * - 'thumb': ~15-30KB (w300) for mobile & card lists
 * - 'poster': ~40-70KB (w342 / w500) for movie details & cards
 * - 'backdrop': ~120-180KB (w780) instead of 8MB+ 'original' images
 */

export type ImageSizeVariant = 'thumb' | 'poster' | 'backdrop' | 'banner';

export function optimizeTmdbImage(url: string | undefined | null, variant: ImageSizeVariant = 'poster'): string {
  if (!url || typeof url !== 'string') return '';
  
  // If not a TMDB image, return as-is
  if (!url.includes('image.tmdb.org') && !url.includes('themoviedb.org')) {
    return url;
  }

  // Choose the optimal compressed dimension
  let targetWidth = 'w500';
  switch (variant) {
    case 'thumb':
      targetWidth = 'w300';
      break;
    case 'poster':
      targetWidth = 'w342';
      break;
    case 'backdrop':
      targetWidth = 'w780';
      break;
    case 'banner':
      targetWidth = 'w1280';
      break;
  }

  // Replace any /original/ or /w1280/ or /w500/ with our target optimized size
  return url.replace(/\/t\/p\/(original|w1280|w500|w780|w342|w300|w185)\//, `/t/p/${targetWidth}/`);
}

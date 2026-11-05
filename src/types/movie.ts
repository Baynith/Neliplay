export type GenreType = 
  | 'Action' 
  | 'Drama' 
  | 'Comedy' 
  | 'Romance' 
  | 'Thriller' 
  | 'Horror' 
  | 'Adventure' 
  | 'Crime' 
  | 'Family' 
  | 'Science Fiction'
  | 'History'
  | 'Animation'
  | 'Mystery'
  | 'Documentary'
  | 'Fantasy'
  | 'War'
  | 'Music'
  | 'Western'
  | 'TV Movie';

export interface Movie {
  id: string;
  tmdbId?: number;
  title: string;
  titlePrefix?: string;     // e.g. "Malkia wa"
  titleHighlight?: string;  // e.g. "Mapenzi"
  overview: string;
  synopsisSwahili: string;
  releaseYear: number;
  runtime: string;          // e.g. "1h 45m"
  runtimeMinutes: number;
  genres: GenreType[];
  language: string;         // "Kiswahili"
  subtitles: string[];      // ["Kiswahili", "English", "Français"]
  ageRating: string;        // "16+", "PG-13", "18+"
  director: string;
  cast: string[];
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  backupVideoUrl?: string;
  featured?: boolean;
  trending?: boolean;
  recentlyAdded?: boolean;
  popular?: boolean;
  ratingScore: number;      // 4.9, etc.
  isSwahiliNarrated?: boolean; // false for Avenger & Goten, true for DJ dubbed movies
  startTimeSeconds?: number;  // 330 (5m 30s) to skip DJ intro ads
}

export interface GenreCategory {
  id: GenreType;
  name: string;
  swahiliName: string;
  color: string;
  borderGlow: string;
  coverImage: string;
  description: string;
  swahiliDescription: string;
  movieCount: number;
}

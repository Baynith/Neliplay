/**
 * TMDB API Service for NeliPlay Swahili
 * Configured with User TMDB API Key: 9e571833942d8651835053f5dc09363d
 */

export const TMDB_API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY || '9e571833942d8651835053f5dc09363d';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_POSTER = 'https://image.tmdb.org/t/p/w500';
export const TMDB_IMAGE_BASE_BACKDROP = 'https://image.tmdb.org/t/p/w1280';

export interface TMDBMovieResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { name: string; character: string }[];
    crew: { name: string; job: string }[];
  };
}

export const GENRE_ID_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export function mapTmdbGenres(tmdbGenres: { id: number; name: string }[] | number[]): string[] {
  if (!tmdbGenres || tmdbGenres.length === 0) return ['Drama'];
  const mapped: string[] = [];
  for (const item of tmdbGenres) {
    if (typeof item === 'number') {
      if (GENRE_ID_MAP[item]) mapped.push(GENRE_ID_MAP[item]);
    } else if (item && item.name) {
      mapped.push(item.name);
    }
  }
  return mapped.length > 0 ? Array.from(new Set(mapped)).slice(0, 3) : ['Drama'];
}

// Search movies on TMDB
export async function searchTMDB(query: string): Promise<TMDBMovieResult[]> {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query.trim()
      )}&include_adult=false&language=en-US&page=1`
    );
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn('Failed to search TMDB:', err);
    return [];
  }
}

// Fetch detailed movie info including cast & crew
export async function getTMDBDetails(tmdbId: number | string): Promise<TMDBMovieDetails | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=en-US`
    );
    if (!res.ok) throw new Error(`TMDB details error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch TMDB details:', err);
    return null;
  }
}

// Fetch live popular or trending movies from TMDB
export async function fetchLiveTrendingTMDB(): Promise<TMDBMovieResult[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error(`TMDB trending error: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn('Failed to fetch TMDB trending:', err);
    return [];
  }
}

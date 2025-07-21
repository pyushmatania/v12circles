// TMDB API Service for fetching real movie data
const TMDB_API_KEY = '00c8935eeb21058413bf54ae11048768';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGM4OTM1ZWViMjEwNTg0MTNiZjU0YWUxMTA0ODc2OCIsIm5iZiI6MTc1MjIwNzkwMi44ODksInN1YiI6IjY4NzA5MjFlNWFiYmI2OWUzZDlhNTgxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7udmAb8IF7qfjyIxOLB1UguBBRUFgh04DvN2TLk6WMM';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  popularity: number;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TMDBActor {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
  known_for: TMDBMovie[];
  gender?: number;
}

export interface TMDBProductionCompany {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  popularity: number;
  vote_average: number;
  release_date: string;
  runtime?: number;
  tagline?: string;
  genres?: Array<{ id: number; name: string }>;
  production_companies: TMDBProductionCompany[];
  credits?: {
    cast: TMDBActor[];
    crew: TMDBActor[];
  };
}

class TMDBService {
  private async makeRequest(endpoint: string, params: Record<string, string | number> = {}) {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('language', 'en-US');
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return response.json();
  }

  async getPopularMovies(page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/movie/popular', { page });
  }

  async getTopRatedMovies(page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/movie/top_rated', { page });
  }

  async getNowPlayingMovies(page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/movie/now_playing', { page });
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.makeRequest(`/movie/${movieId}`, { 
      append_to_response: 'credits,images' 
    });
  }

  async getPopularActors(page: number = 1): Promise<{ results: TMDBActor[] }> {
    return this.makeRequest('/person/popular', { page });
  }

  async getActorDetails(actorId: number): Promise<TMDBActor> {
    return this.makeRequest(`/person/${actorId}`, { 
      append_to_response: 'movie_credits,images' 
    });
  }

  async searchMovies(query: string, page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/search/movie', { query, page });
  }

  async searchActors(query: string, page: number = 1): Promise<{ results: TMDBActor[] }> {
    return this.makeRequest('/search/person', { query, page });
  }

  async searchCompanies(query: string, page: number = 1): Promise<{ results: TMDBProductionCompany[] }> {
    return this.makeRequest('/search/company', { query, page });
  }

  getImageUrl(path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getBackdropUrl(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const tmdbService = new TMDBService();

// Helper function to convert TMDB data to our community format
export const convertTMDBMovieToCommunityItem = (movie: TMDBMovie) => {
  const item = {
    id: `movie_${movie.id}`,
    name: movie.title,
    avatar: tmdbService.getImageUrl(movie.poster_path, 'w500'),
    cover: tmdbService.getBackdropUrl(movie.backdrop_path, 'w1280'),
    description: `${Math.round(movie.popularity / 1000)}K+ fans`,
    type: 'movie' as const,
    followers: Math.round(movie.popularity * 1000),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: movie.id,
    rating: movie.vote_average,
    releaseDate: movie.release_date
  };
  return item;
};

export const convertTMDBActorToCommunityItem = (actor: TMDBActor, type: 'actor' | 'actress' | 'director') => {
  const item = {
    id: `${type}_${actor.id}`,
    name: actor.name,
    avatar: tmdbService.getImageUrl(actor.profile_path, 'w500'),
    cover: actor.known_for[0] ? tmdbService.getBackdropUrl(actor.known_for[0].backdrop_path, 'w1280') : '',
    description: `${Math.round(actor.popularity / 100)}K+ followers`,
    type,
    followers: Math.round(actor.popularity * 100),
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: actor.id,
    knownFor: actor.known_for.map(movie => movie.title).slice(0, 3)
  };
  return item;
};

export const convertTMDBCompanyToCommunityItem = (company: TMDBProductionCompany) => {
  const item = {
    id: `productionHouse_${company.id}`,
    name: company.name,
    avatar: company.logo_path ? tmdbService.getImageUrl(company.logo_path, 'w500') : '',
    cover: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1280',
    description: 'Production Company',
    type: 'productionHouse' as const,
    followers: Math.floor(Math.random() * 1000000) + 100000, // Random followers for demo
    verified: true,
    isActive: true,
    projects: [],
    tmdbId: company.id,
    country: company.origin_country
  };
  return item;
}; 
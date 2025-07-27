export interface KeyPerson {
  id: string;
  name: string;
  role: 'actor' | 'actress' | 'director' | 'producer' | 'writer' | 'music_director' | 'cinematographer' | 'editor' | 'other';
  profileImage?: string;
  tmdbId?: string;
  imdbId?: string;
  isMainCast?: boolean;
  orderIndex?: number;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  category: string;
  language: string;
  status: string;
  fundedPercentage: number;
  targetAmount: number;
  raisedAmount: number;
  createdAt: string;
  updatedAt: string;
  poster: string;
  description: string;
  director?: string;
  genre: string;
  tags: string[];
  perks: string[];
  rating: number;
  trailer: string;
  movie?: string;
  keyPeople: KeyPerson[];
  actor?: string;
  actress?: string;
  productionHouse?: string;
  targetAmountHuman?: string;
  raisedAmountHuman?: string;
  keyCommunityData?: Array<{
    id: string;
    movieId: string;
    movieName: string;
    productionHouse: string;
    keyPeople: KeyPerson[];
    actor: string;
    actress: string;
    director: string;
  }>;
  disabled: boolean;
  featured?: boolean;
  budget?: number;
  cast?: string;
  artist?: string;
  
  // New TMDB enriched fields
  tmdbId?: number;
  tmdbRating?: number;
  runtime?: number;
  releaseYear?: number;
  country?: string;
  revenue?: number;
  tmdbGenres?: string[];
  spokenLanguages?: string[];
  tmdbOverview?: string;
  tagline?: string;
  imdbId?: string;
  
  // Spotify API fields for music albums
  spotifyId?: string;
  spotifyUrl?: string;
  artistSpotifyId?: string;
  artistSpotifyUrl?: string;
  albumType?: string;
  totalTracks?: number;
  popularity?: number;
  followers?: number;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  project?: string;
  projectId?: string;
} 
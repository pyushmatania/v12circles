// Comprehensive Community Data - Using balanced TMDB data
// Generated on: 2025-01-13

import balancedData from './balancedCommunityData.json';

export type RealCommunityItem = {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  type: 'movie' | 'productionHouse' | 'director' | 'actor' | 'actress' | 'musicArtist';
  followers: number;
  verified: boolean;
  isActive: boolean;
  projects: any[];
  tmdbId?: number;
  rating?: number;
  releaseDate?: string;
  knownFor?: string[];
  country?: string;
  category?: string;
  spotifyUrl?: string;
};

// Use the new balanced data with Bollywood, Hollywood, and World/Regional content
export const comprehensiveCommunityData: {
  movies: RealCommunityItem[];
  productionHouses: RealCommunityItem[];
  directors: RealCommunityItem[];
  actors: RealCommunityItem[];
  actresses: RealCommunityItem[];
  musicArtists: RealCommunityItem[];
} = {
  movies: balancedData.movies as RealCommunityItem[],
  productionHouses: balancedData.productionHouses as RealCommunityItem[],
  directors: balancedData.directors as RealCommunityItem[],
  actors: balancedData.actors as RealCommunityItem[],
  actresses: balancedData.actresses as RealCommunityItem[],
  musicArtists: [
    // Bollywood Music Artists (20)
    {
      id: 'music_1',
      name: 'Arijit Singh',
      avatar: 'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
      description: 'King of Bollywood Music',
      type: 'musicArtist',
      followers: 25000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123456,
      rating: 9.2,
      knownFor: ['Tum Hi Ho', 'Chaleya', 'Kesariya'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_2',
      name: 'Shreya Ghoshal',
      avatar: 'https://image.tmdb.org/t/p/w500/2v9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2v9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Melody Queen of India',
      type: 'musicArtist',
      followers: 18000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123457,
      rating: 9.0,
      knownFor: ['Teri Ore', 'Saans', 'Sunn Raha Hai'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_3',
      name: 'Pritam',
      avatar: 'https://image.tmdb.org/t/p/w500/1k8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1k8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Music Director & Composer',
      type: 'musicArtist',
      followers: 12000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123458,
      rating: 8.8,
      knownFor: ['Tum Hi Ho', 'Raabta', 'Gerua'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_4',
      name: 'Neha Kakkar',
      avatar: 'https://image.tmdb.org/t/p/w500/2l9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2l9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Sensation',
      type: 'musicArtist',
      followers: 15000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123459,
      rating: 8.5,
      knownFor: ['Dilbar', 'Mile Ho Tum', 'Garmi'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_5',
      name: 'Atif Aslam',
      avatar: 'https://image.tmdb.org/t/p/w500/3m0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3m0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pakistani Singer',
      type: 'musicArtist',
      followers: 10000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123460,
      rating: 8.7,
      knownFor: ['Tere Sang Yaara', 'Jeena Jeena', 'Pehli Dafa'],
      country: 'Pakistan',
      category: 'bollywood'
    },
    {
      id: 'music_6',
      name: 'Sunidhi Chauhan',
      avatar: 'https://image.tmdb.org/t/p/w500/4n1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4n1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Playback Singer',
      type: 'musicArtist',
      followers: 8000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123461,
      rating: 8.3,
      knownFor: ['Sheila Ki Jawani', 'Dhoom Machale', 'Beedi'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_7',
      name: 'KK',
      avatar: 'https://image.tmdb.org/t/p/w500/5o2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5o2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Late Singer Legend',
      type: 'musicArtist',
      followers: 12000000,
      verified: true,
      isActive: false,
      projects: [],
      tmdbId: 123462,
      rating: 9.1,
      knownFor: ['Tum Mile', 'Yaaron', 'Pal'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_8',
      name: 'Alka Yagnik',
      avatar: 'https://image.tmdb.org/t/p/w500/6p3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6p3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Veteran Playback Singer',
      type: 'musicArtist',
      followers: 6000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123463,
      rating: 8.9,
      knownFor: ['Tip Tip Barsa Paani', 'Choli Ke Peeche', 'Ek Do Teen'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_9',
      name: 'Kumar Sanu',
      avatar: 'https://image.tmdb.org/t/p/w500/7q4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/7q4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: '90s Music Legend',
      type: 'musicArtist',
      followers: 5000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123464,
      rating: 8.6,
      knownFor: ['Tum Mile', 'Pehla Nasha', 'Sochenge Tumhe'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_10',
      name: 'Udit Narayan',
      avatar: 'https://image.tmdb.org/t/p/w500/8r5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8r5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Playback Singer',
      type: 'musicArtist',
      followers: 4000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123465,
      rating: 8.4,
      knownFor: ['Pehla Nasha', 'Tip Tip Barsa Paani', 'Main Nikla Gaddi Leke'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_11',
      name: 'Javed Ali',
      avatar: 'https://image.tmdb.org/t/p/w500/9s6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/9s6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Sufi Singer',
      type: 'musicArtist',
      followers: 3000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123466,
      rating: 8.2,
      knownFor: ['Kun Faya Kun', 'Jashn-e-Bahara', 'Sajda'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_12',
      name: 'Rahat Fateh Ali Khan',
      avatar: 'https://image.tmdb.org/t/p/w500/0t7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/0t7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Qawwali Singer',
      type: 'musicArtist',
      followers: 7000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123467,
      rating: 8.8,
      knownFor: ['Tere Mast Mast Do Nain', 'Jag Ghoomeya', 'Dil To Bachcha Hai'],
      country: 'Pakistan',
      category: 'bollywood'
    },
    {
      id: 'music_13',
      name: 'Palak Muchhal',
      avatar: 'https://image.tmdb.org/t/p/w500/1u8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1u8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Young Singer',
      type: 'musicArtist',
      followers: 2000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123468,
      rating: 7.9,
      knownFor: ['Kaise Mujhe', 'Main Rang Sharbaton Ka', 'Mann Mera'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_14',
      name: 'Armaan Malik',
      avatar: 'https://image.tmdb.org/t/p/w500/2v9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2v9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 9000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123469,
      rating: 8.1,
      knownFor: ['Main Hoon Hero Tera', 'Naina', 'Bol Do Na Zara'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_15',
      name: 'Darshan Raval',
      avatar: 'https://image.tmdb.org/t/p/w500/3w0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3w0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Independent Artist',
      type: 'musicArtist',
      followers: 11000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123470,
      rating: 8.3,
      knownFor: ['Tere Naal', 'Chogada', 'Ek Ladki Ko Dekha'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_16',
      name: 'Jubin Nautiyal',
      avatar: 'https://image.tmdb.org/t/p/w500/4x1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4x1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Playback Singer',
      type: 'musicArtist',
      followers: 8000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123471,
      rating: 8.0,
      knownFor: ['Tum Hi Aana', 'Raataan Lambiyan', 'Lut Gaye'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_17',
      name: 'Sachet-Parampara',
      avatar: 'https://image.tmdb.org/t/p/w500/5y2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5y2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Music Duo',
      type: 'musicArtist',
      followers: 6000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123472,
      rating: 8.2,
      knownFor: ['Mann Ki Awaaz', 'Bekhayali', 'Barbaadiyan'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_18',
      name: 'Tulsi Kumar',
      avatar: 'https://image.tmdb.org/t/p/w500/6z3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6z3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Playback Singer',
      type: 'musicArtist',
      followers: 4000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123473,
      rating: 7.8,
      knownFor: ['Tum Se Hi', 'Hawayein', 'Soch Na Sake'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_19',
      name: 'Amit Trivedi',
      avatar: 'https://image.tmdb.org/t/p/w500/7a4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/7a4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Music Composer',
      type: 'musicArtist',
      followers: 3000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123474,
      rating: 8.5,
      knownFor: ['Iktara', 'Aazaadiyan', 'London Thumakda'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_20',
      name: 'Vishal-Shekhar',
      avatar: 'https://image.tmdb.org/t/p/w500/8b5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8b5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Music Director Duo',
      type: 'musicArtist',
      followers: 5000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123475,
      rating: 8.3,
      knownFor: ['Tum Hi Ho', 'Raabta', 'Gerua'],
      country: 'India',
      category: 'bollywood'
    },
    // International Music Artists (30)
    {
      id: 'music_21',
      name: 'Taylor Swift',
      avatar: 'https://image.tmdb.org/t/p/w500/3v9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3v9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Superstar',
      type: 'musicArtist',
      followers: 50000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123476,
      rating: 9.5,
      knownFor: ['Shake It Off', 'Blank Space', 'Lover'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_22',
      name: 'Ed Sheeran',
      avatar: 'https://image.tmdb.org/t/p/w500/4x1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4x1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Singer-Songwriter',
      type: 'musicArtist',
      followers: 45000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123477,
      rating: 9.3,
      knownFor: ['Shape of You', 'Perfect', 'Thinking Out Loud'],
      country: 'UK',
      category: 'international'
    },
    {
      id: 'music_23',
      name: 'Drake',
      avatar: 'https://image.tmdb.org/t/p/w500/1e8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1e8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Singer',
      type: 'musicArtist',
      followers: 40000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123478,
      rating: 9.1,
      knownFor: ['God\'s Plan', 'One Dance', 'Hotline Bling'],
      country: 'Canada',
      category: 'international'
    },
    {
      id: 'music_24',
      name: 'Ariana Grande',
      avatar: 'https://image.tmdb.org/t/p/w500/2f9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2f9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Princess',
      type: 'musicArtist',
      followers: 42000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123479,
      rating: 9.2,
      knownFor: ['Thank U, Next', '7 Rings', 'Side to Side'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_25',
      name: 'Post Malone',
      avatar: 'https://image.tmdb.org/t/p/w500/3g0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3g0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Singer',
      type: 'musicArtist',
      followers: 35000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123480,
      rating: 8.9,
      knownFor: ['Rockstar', 'Circles', 'Sunflower'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_26',
      name: 'Billie Eilish',
      avatar: 'https://image.tmdb.org/t/p/w500/4h1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4h1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Alternative Pop Artist',
      type: 'musicArtist',
      followers: 38000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123481,
      rating: 9.0,
      knownFor: ['Bad Guy', 'When We All Fall Asleep', 'Happier Than Ever'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_27',
      name: 'The Weeknd',
      avatar: 'https://image.tmdb.org/t/p/w500/5i2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5i2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'R&B Artist',
      type: 'musicArtist',
      followers: 32000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123482,
      rating: 8.8,
      knownFor: ['Blinding Lights', 'Starboy', 'The Hills'],
      country: 'Canada',
      category: 'international'
    },
    {
      id: 'music_28',
      name: 'Dua Lipa',
      avatar: 'https://image.tmdb.org/t/p/w500/6j3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6j3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 30000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123483,
      rating: 8.7,
      knownFor: ['New Rules', 'Don\'t Start Now', 'Levitating'],
      country: 'UK',
      category: 'international'
    },
    {
      id: 'music_29',
      name: 'BTS',
      avatar: 'https://image.tmdb.org/t/p/w500/5y2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5y2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'K-Pop Supergroup',
      type: 'musicArtist',
      followers: 60000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123484,
      rating: 9.4,
      knownFor: ['Dynamite', 'Butter', 'Permission to Dance'],
      country: 'South Korea',
      category: 'international'
    },
    {
      id: 'music_30',
      name: 'Blackpink',
      avatar: 'https://image.tmdb.org/t/p/w500/8l5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8l5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'K-Pop Girl Group',
      type: 'musicArtist',
      followers: 55000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123485,
      rating: 9.3,
      knownFor: ['DDU-DU DDU-DU', 'Kill This Love', 'How You Like That'],
      country: 'South Korea',
      category: 'international'
    },
    {
      id: 'music_31',
      name: 'Justin Bieber',
      avatar: 'https://image.tmdb.org/t/p/w500/9m6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/9m6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Star',
      type: 'musicArtist',
      followers: 48000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123486,
      rating: 8.9,
      knownFor: ['Baby', 'Sorry', 'Stay'],
      country: 'Canada',
      category: 'international'
    },
    {
      id: 'music_32',
      name: 'Lady Gaga',
      avatar: 'https://image.tmdb.org/t/p/w500/0n7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/0n7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Icon',
      type: 'musicArtist',
      followers: 40000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123487,
      rating: 9.1,
      knownFor: ['Poker Face', 'Bad Romance', 'Shallow'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_33',
      name: 'Bruno Mars',
      avatar: 'https://image.tmdb.org/t/p/w500/1o8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1o8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Funk & Pop Artist',
      type: 'musicArtist',
      followers: 38000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123488,
      rating: 9.0,
      knownFor: ['Uptown Funk', 'Just the Way You Are', '24K Magic'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_34',
      name: 'Adele',
      avatar: 'https://image.tmdb.org/t/p/w500/2p9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2p9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Soul Singer',
      type: 'musicArtist',
      followers: 35000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123489,
      rating: 9.2,
      knownFor: ['Hello', 'Rolling in the Deep', 'Someone Like You'],
      country: 'UK',
      category: 'international'
    },
    {
      id: 'music_35',
      name: 'Coldplay',
      avatar: 'https://image.tmdb.org/t/p/w500/3q0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3q0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Alternative Rock Band',
      type: 'musicArtist',
      followers: 30000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123490,
      rating: 8.8,
      knownFor: ['Yellow', 'Fix You', 'Viva La Vida'],
      country: 'UK',
      category: 'international'
    },
    {
      id: 'music_36',
      name: 'Imagine Dragons',
      avatar: 'https://image.tmdb.org/t/p/w500/4r1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4r1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Alternative Rock Band',
      type: 'musicArtist',
      followers: 28000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123491,
      rating: 8.5,
      knownFor: ['Radioactive', 'Demons', 'Believer'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_37',
      name: 'Maroon 5',
      avatar: 'https://image.tmdb.org/t/p/w500/5s2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5s2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Rock Band',
      type: 'musicArtist',
      followers: 25000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123492,
      rating: 8.3,
      knownFor: ['Sugar', 'Moves Like Jagger', 'Girls Like You'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_38',
      name: 'One Direction',
      avatar: 'https://image.tmdb.org/t/p/w500/6t3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6t3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Boy Band',
      type: 'musicArtist',
      followers: 35000000,
      verified: true,
      isActive: false,
      projects: [],
      tmdbId: 123493,
      rating: 8.7,
      knownFor: ['What Makes You Beautiful', 'Story of My Life', 'Drag Me Down'],
      country: 'UK',
      category: 'international'
    },
    {
      id: 'music_39',
      name: 'Shawn Mendes',
      avatar: 'https://image.tmdb.org/t/p/w500/7u4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/7u4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 32000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123494,
      rating: 8.6,
      knownFor: ['Stitches', 'Treat You Better', 'Senorita'],
      country: 'Canada',
      category: 'international'
    },
    {
      id: 'music_40',
      name: 'Camila Cabello',
      avatar: 'https://image.tmdb.org/t/p/w500/8v5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8v5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 28000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123495,
      rating: 8.4,
      knownFor: ['Havana', 'Senorita', 'Never Be the Same'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_41',
      name: 'Halsey',
      avatar: 'https://image.tmdb.org/t/p/w500/9w6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/9w6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Alternative Pop Artist',
      type: 'musicArtist',
      followers: 26000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123496,
      rating: 8.2,
      knownFor: ['Closer', 'Without Me', 'Bad at Love'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_42',
      name: 'Lana Del Rey',
      avatar: 'https://image.tmdb.org/t/p/w500/0x7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/0x7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Alternative Pop Artist',
      type: 'musicArtist',
      followers: 24000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123497,
      rating: 8.8,
      knownFor: ['Summertime Sadness', 'Video Games', 'Born to Die'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_43',
      name: 'The Chainsmokers',
      avatar: 'https://image.tmdb.org/t/p/w500/1y8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1y8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'EDM Duo',
      type: 'musicArtist',
      followers: 22000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123498,
      rating: 8.0,
      knownFor: ['Closer', 'Don\'t Let Me Down', 'Something Just Like This'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_44',
      name: 'Marshmello',
      avatar: 'https://image.tmdb.org/t/p/w500/2z9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2z9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'EDM Producer',
      type: 'musicArtist',
      followers: 20000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123499,
      rating: 7.8,
      knownFor: ['Alone', 'Friends', 'Happier'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_45',
      name: 'Calvin Harris',
      avatar: 'https://image.tmdb.org/t/p/w500/3a0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3a0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'DJ & Producer',
      type: 'musicArtist',
      followers: 18000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123500,
      rating: 8.1,
      knownFor: ['This Is What You Came For', 'We Found Love', 'Feel So Close'],
      country: 'UK',
      category: 'international'
    },
    {
      id: 'music_46',
      name: 'David Guetta',
      avatar: 'https://image.tmdb.org/t/p/w500/4b1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4b1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'DJ & Producer',
      type: 'musicArtist',
      followers: 16000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123501,
      rating: 7.9,
      knownFor: ['Titanium', 'Without You', 'Turn Me On'],
      country: 'France',
      category: 'international'
    },
    {
      id: 'music_47',
      name: 'Avicii',
      avatar: 'https://image.tmdb.org/t/p/w500/5c2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5c2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Late EDM Legend',
      type: 'musicArtist',
      followers: 20000000,
      verified: true,
      isActive: false,
      projects: [],
      tmdbId: 123502,
      rating: 8.9,
      knownFor: ['Wake Me Up', 'Levels', 'The Nights'],
      country: 'Sweden',
      category: 'international'
    },
    {
      id: 'music_48',
      name: 'Kygo',
      avatar: 'https://image.tmdb.org/t/p/w500/6d3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6d3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Tropical House Producer',
      type: 'musicArtist',
      followers: 14000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123503,
      rating: 7.7,
      knownFor: ['Firestone', 'Stole the Show', 'It Ain\'t Me'],
      country: 'Norway',
      category: 'international'
    },
    {
      id: 'music_49',
      name: 'Martin Garrix',
      avatar: 'https://image.tmdb.org/t/p/w500/7e4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/7e4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'EDM Producer',
      type: 'musicArtist',
      followers: 12000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123504,
      rating: 7.6,
      knownFor: ['Animals', 'In the Name of Love', 'Scared to Be Lonely'],
      country: 'Netherlands',
      category: 'international'
    },
    {
      id: 'music_50',
      name: 'Zedd',
      avatar: 'https://image.tmdb.org/t/p/w500/8f5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8f5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'EDM Producer',
      type: 'musicArtist',
      followers: 10000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123505,
      rating: 7.5,
      knownFor: ['Clarity', 'Stay', 'The Middle'],
      country: 'Germany',
      category: 'international'
    },
    // Additional Bollywood Music Artists (15 more)
    {
      id: 'music_51',
      name: 'Yo Yo Honey Singh',
      avatar: 'https://image.tmdb.org/t/p/w500/9g6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/9g6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Music Producer',
      type: 'musicArtist',
      followers: 16000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123506,
      rating: 8.4,
      knownFor: ['Lungi Dance', 'Blue Eyes', 'Desi Kalakaar'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_52',
      name: 'Badshah',
      avatar: 'https://image.tmdb.org/t/p/w500/0h7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/0h7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Music Producer',
      type: 'musicArtist',
      followers: 14000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123507,
      rating: 8.2,
      knownFor: ['DJ Waley Babu', 'Kala Chashma', 'Mercy'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_53',
      name: 'Raftaar',
      avatar: 'https://image.tmdb.org/t/p/w500/1i8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1i8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Music Producer',
      type: 'musicArtist',
      followers: 12000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123508,
      rating: 8.0,
      knownFor: ['Swag Mera Desi', 'Tere Wargi Nai Ae', 'Dhaakad'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_54',
      name: 'Divine',
      avatar: 'https://image.tmdb.org/t/p/w500/2j9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2j9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Hip-Hop Artist',
      type: 'musicArtist',
      followers: 8000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123509,
      rating: 8.1,
      knownFor: ['Mere Gully Mein', 'Kaam 25', 'Kohinoor'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_55',
      name: 'Naezy',
      avatar: 'https://image.tmdb.org/t/p/w500/3k0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3k0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Hip-Hop Artist',
      type: 'musicArtist',
      followers: 6000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123510,
      rating: 7.8,
      knownFor: ['Aafat', 'Mere Gully Mein', 'Asal Hustle'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_56',
      name: 'King',
      avatar: 'https://image.tmdb.org/t/p/w500/4l1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4l1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Singer',
      type: 'musicArtist',
      followers: 10000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123511,
      rating: 8.3,
      knownFor: ['Maan Meri Jaan', 'Tu Aake Dekhle', 'Diljit Dosanjh'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_57',
      name: 'Diljit Dosanjh',
      avatar: 'https://image.tmdb.org/t/p/w500/5m2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5m2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer & Actor',
      type: 'musicArtist',
      followers: 18000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123512,
      rating: 8.6,
      knownFor: ['Lover', 'Do You Know', 'Born to Shine'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_58',
      name: 'Guru Randhawa',
      avatar: 'https://image.tmdb.org/t/p/w500/6n3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6n3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer',
      type: 'musicArtist',
      followers: 15000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123513,
      rating: 8.4,
      knownFor: ['Lahore', 'High Rated Gabru', 'Slowly Slowly'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_59',
      name: 'Jassie Gill',
      avatar: 'https://image.tmdb.org/t/p/w500/7o4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/7o4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer',
      type: 'musicArtist',
      followers: 9000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123514,
      rating: 8.0,
      knownFor: ['Leke Pahla Pahla Pyaar', 'Punjab', 'Diljit Dosanjh'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_60',
      name: 'Ammy Virk',
      avatar: 'https://image.tmdb.org/t/p/w500/8p5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8p5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer & Actor',
      type: 'musicArtist',
      followers: 7000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123515,
      rating: 7.9,
      knownFor: ['Diljit Dosanjh', 'Punjab', 'Leke Pahla Pahla Pyaar'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_61',
      name: 'Sidhu Moose Wala',
      avatar: 'https://image.tmdb.org/t/p/w500/9q6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/9q6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Late Punjabi Singer',
      type: 'musicArtist',
      followers: 13000000,
      verified: true,
      isActive: false,
      projects: [],
      tmdbId: 123516,
      rating: 8.7,
      knownFor: ['295', 'So High', 'Same Beef'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_62',
      name: 'AP Dhillon',
      avatar: 'https://image.tmdb.org/t/p/w500/0r7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/0r7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer',
      type: 'musicArtist',
      followers: 11000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123517,
      rating: 8.5,
      knownFor: ['With You', 'Excuses', 'Brown Munde'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_63',
      name: 'Gurinder Gill',
      avatar: 'https://image.tmdb.org/t/p/w500/1s8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1s8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer',
      type: 'musicArtist',
      followers: 8000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123518,
      rating: 8.2,
      knownFor: ['Brown Munde', 'Lifestyle', 'AP Dhillon'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_64',
      name: 'Shubh',
      avatar: 'https://image.tmdb.org/t/p/w500/2t9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2t9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer',
      type: 'musicArtist',
      followers: 9000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123519,
      rating: 8.3,
      knownFor: ['We Rollin', 'Elevated', 'No Love'],
      country: 'India',
      category: 'bollywood'
    },
    {
      id: 'music_65',
      name: 'Karan Aujla',
      avatar: 'https://image.tmdb.org/t/p/w500/3u0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3u0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Punjabi Singer',
      type: 'musicArtist',
      followers: 7000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123520,
      rating: 8.1,
      knownFor: ['Don\'t Look', 'Geetan Di Machine', 'Chitta'],
      country: 'India',
      category: 'bollywood'
    },
    // Additional Hollywood Music Artists (15 more)
    {
      id: 'music_66',
      name: 'Olivia Rodrigo',
      avatar: 'https://image.tmdb.org/t/p/w500/4v1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4v1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer & Actress',
      type: 'musicArtist',
      followers: 35000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123521,
      rating: 8.8,
      knownFor: ['Drivers License', 'Good 4 U', 'Vampire'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_67',
      name: 'Doja Cat',
      avatar: 'https://image.tmdb.org/t/p/w500/5w2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5w2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Singer',
      type: 'musicArtist',
      followers: 32000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123522,
      rating: 8.6,
      knownFor: ['Say So', 'Kiss Me More', 'Woman'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_68',
      name: 'Lil Nas X',
      avatar: 'https://image.tmdb.org/t/p/w500/6x3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6x3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Singer',
      type: 'musicArtist',
      followers: 28000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123523,
      rating: 8.4,
      knownFor: ['Old Town Road', 'Montero', 'Industry Baby'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_69',
      name: 'The Kid LAROI',
      avatar: 'https://image.tmdb.org/t/p/w500/7y4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/7y4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Singer',
      type: 'musicArtist',
      followers: 25000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123524,
      rating: 8.2,
      knownFor: ['Stay', 'Without You', 'F*CK LOVE'],
      country: 'Australia',
      category: 'international'
    },
    {
      id: 'music_70',
      name: 'Tate McRae',
      avatar: 'https://image.tmdb.org/t/p/w500/8z5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8z5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 22000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123525,
      rating: 8.0,
      knownFor: ['You Broke Me First', 'She\'s All I Wanna Be', 'Greedy'],
      country: 'Canada',
      category: 'international'
    },
    {
      id: 'music_71',
      name: 'GAYLE',
      avatar: 'https://image.tmdb.org/t/p/w500/9a6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/9a6ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 18000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123526,
      rating: 7.8,
      knownFor: ['abcdefu', 'Ur Just Horny', 'Luv Starved'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_72',
      name: 'Stephen Sanchez',
      avatar: 'https://image.tmdb.org/t/p/w500/0b7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/0b7ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 15000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123527,
      rating: 7.9,
      knownFor: ['Until I Found You', 'Evangeline', 'Be More'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_73',
      name: 'JVKE',
      avatar: 'https://image.tmdb.org/t/p/w500/1c8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/1c8ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 20000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123528,
      rating: 8.1,
      knownFor: ['Golden Hour', 'This Is What Falling in Love Feels Like', 'Upside Down'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_74',
      name: 'PinkPantheress',
      avatar: 'https://image.tmdb.org/t/p/w500/2d9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/2d9ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Pop Singer',
      type: 'musicArtist',
      followers: 12000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123529,
      rating: 7.7,
      knownFor: ['Boy\'s a liar Pt. 2', 'Pain', 'Break It Off'],
      country: 'UK',
      category: 'international'
    },
    {
      id: 'music_75',
      name: 'Ice Spice',
      avatar: 'https://image.tmdb.org/t/p/w500/3e0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/3e0ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper',
      type: 'musicArtist',
      followers: 16000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123530,
      rating: 7.9,
      knownFor: ['Boy\'s a liar Pt. 2', 'Princess Diana', 'In Ha Mood'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_76',
      name: 'Coi Leray',
      avatar: 'https://image.tmdb.org/t/p/w500/4f1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/4f1ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper',
      type: 'musicArtist',
      followers: 14000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123531,
      rating: 7.6,
      knownFor: ['No More Parties', 'Players', 'Blick Blick'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_77',
      name: 'Latto',
      avatar: 'https://image.tmdb.org/t/p/w500/5g2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/5g2ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper',
      type: 'musicArtist',
      followers: 18000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123532,
      rating: 7.8,
      knownFor: ['Big Energy', 'Lottery', 'Put It On Da Floor'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_78',
      name: 'Megan Thee Stallion',
      avatar: 'https://image.tmdb.org/t/p/w500/6h3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/6h3ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper',
      type: 'musicArtist',
      followers: 26000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123533,
      rating: 8.3,
      knownFor: ['Savage', 'WAP', 'Body'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_79',
      name: 'Cardi B',
      avatar: 'https://image.tmdb.org/t/p/w500/7i4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/7i4ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper',
      type: 'musicArtist',
      followers: 30000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123534,
      rating: 8.5,
      knownFor: ['Bodak Yellow', 'WAP', 'I Like It'],
      country: 'USA',
      category: 'international'
    },
    {
      id: 'music_80',
      name: 'Nicki Minaj',
      avatar: 'https://image.tmdb.org/t/p/w500/8j5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      cover: 'https://image.tmdb.org/t/p/original/8j5ZDk71ZqjvJqQZqQZqQZqQZqQZ.jpg',
      description: 'Rapper & Singer',
      type: 'musicArtist',
      followers: 35000000,
      verified: true,
      isActive: true,
      projects: [],
      tmdbId: 123535,
      rating: 8.7,
      knownFor: ['Super Bass', 'Anaconda', 'Starships'],
      country: 'USA',
      category: 'international'
    }
  ]
};

// Helper function to get movies by category
export const getMoviesByCategory = (category: string): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === category);
};

// Helper function to get all Hollywood movies
export const getHollywoodMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === 'hollywood');
};

// Helper function to get all Bollywood movies
export const getBollywoodMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === 'bollywood');
};

// Helper function to get all World/Regional movies
export const getWorldMovies = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.movies.filter(movie => movie.category === 'world');
};

// Helper function to get all Hollywood actors
export const getHollywoodActors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actors.filter(actor => actor.category === 'hollywood');
};

// Helper function to get all Bollywood actors
export const getBollywoodActors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actors.filter(actor => actor.category === 'bollywood');
};

// Helper function to get all World/Regional actors
export const getWorldActors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actors.filter(actor => actor.category === 'world');
};

// Helper function to get all Hollywood actresses
export const getHollywoodActresses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actresses.filter(actress => actress.category === 'hollywood');
};

// Helper function to get all Bollywood actresses
export const getBollywoodActresses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actresses.filter(actress => actress.category === 'bollywood');
};

// Helper function to get all World/Regional actresses
export const getWorldActresses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.actresses.filter(actress => actress.category === 'world');
};

// Helper function to get all Hollywood directors
export const getHollywoodDirectors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.directors.filter(director => director.category === 'hollywood');
};

// Helper function to get all Bollywood directors
export const getBollywoodDirectors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.directors.filter(director => director.category === 'bollywood');
};

// Helper function to get all World/Regional directors
export const getWorldDirectors = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.directors.filter(director => director.category === 'world');
};

// Helper function to get all Hollywood production houses
export const getHollywoodProductionHouses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.productionHouses.filter(house => house.category === 'hollywood');
};

// Helper function to get all Bollywood production houses
export const getBollywoodProductionHouses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.productionHouses.filter(house => house.category === 'bollywood');
};

// Helper function to get all World/Regional production houses
export const getWorldProductionHouses = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.productionHouses.filter(house => house.category === 'world');
};

// Helper function to get all Bollywood music artists
export const getBollywoodMusicArtists = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.musicArtists.filter(artist => artist.category === 'bollywood');
};

// Helper function to get all international music artists
export const getInternationalMusicArtists = (): RealCommunityItem[] => {
  return comprehensiveCommunityData.musicArtists.filter(artist => artist.category === 'international');
};

export const getCommunityDataByType = (type: string): RealCommunityItem[] => {
  switch (type) {
    case 'movie':
      return comprehensiveCommunityData.movies;
    case 'actor':
      return comprehensiveCommunityData.actors;
    case 'actress':
      return comprehensiveCommunityData.actresses;
    case 'director':
      return comprehensiveCommunityData.directors;
    case 'productionHouse':
      return comprehensiveCommunityData.productionHouses;
    case 'musicArtist':
      return comprehensiveCommunityData.musicArtists;
    default:
      return [];
  }
}; 
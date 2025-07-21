import { tmdbService } from './tmdbApi';

// Only map actual celebrity names to their TMDB images
const CELEBRITY_MAPPING = {
  // Music Artists
  'Taylor Swift': 'Taylor Swift',
  'Beyoncé': 'Beyoncé',
  'Selena Gomez': 'Selena Gomez',
  'Ariana Grande': 'Ariana Grande',
  'Ed Sheeran': 'Ed Sheeran',
  'Drake': 'Drake',
  'The Weeknd': 'The Weeknd',
  'Billie Eilish': 'Billie Eilish',
  'Dua Lipa': 'Dua Lipa',
  'Post Malone': 'Post Malone',
  
  // Actors
  'Tom Hanks': 'Tom Hanks',
  'Leonardo DiCaprio': 'Leonardo DiCaprio',
  'Brad Pitt': 'Brad Pitt',
  'Johnny Depp': 'Johnny Depp',
  'Tom Cruise': 'Tom Cruise',
  'Robert Downey Jr.': 'Robert Downey Jr.',
  'Will Smith': 'Will Smith',
  'Denzel Washington': 'Denzel Washington',
  'Morgan Freeman': 'Morgan Freeman',
  'Al Pacino': 'Al Pacino',
  'Robert De Niro': 'Robert De Niro',
  'Jack Nicholson': 'Jack Nicholson',
  'Meryl Streep': 'Meryl Streep',
  'Emma Watson': 'Emma Watson',
  'Angelina Jolie': 'Angelina Jolie',
  'Scarlett Johansson': 'Scarlett Johansson',
  'Jennifer Lawrence': 'Jennifer Lawrence',
  'Sandra Bullock': 'Sandra Bullock',
  'Julia Roberts': 'Julia Roberts',
  'Charlize Theron': 'Charlize Theron',
  
  // Directors
  'Christopher Nolan': 'Christopher Nolan',
  'Steven Spielberg': 'Steven Spielberg',
  'Martin Scorsese': 'Martin Scorsese',
  'Quentin Tarantino': 'Quentin Tarantino',
  'James Cameron': 'James Cameron',
  'Ridley Scott': 'Ridley Scott',
  'Peter Jackson': 'Peter Jackson',
  'Christopher McQuarrie': 'Christopher McQuarrie',
  'Denis Villeneuve': 'Denis Villeneuve',
  'Greta Gerwig': 'Greta Gerwig',
  
  // Studios/Production Houses
  'Marvel Studios': 'Marvel Studios',
  'Disney': 'Disney',
  'Warner Bros.': 'Warner Bros.',
  'Universal Pictures': 'Universal Pictures',
  'Paramount Pictures': 'Paramount Pictures',
  'Sony Pictures': 'Sony Pictures',
  'Netflix': 'Netflix',
  'HBO': 'HBO',
  'Amazon Studios': 'Amazon Studios',
  'Apple TV+': 'Apple TV+',
  
  // Activists/Public Figures
  'Greta Thunberg': 'Greta Thunberg',
  'Malala Yousafzai': 'Malala Yousafzai',
  'Elon Musk': 'Elon Musk',
  'Mark Zuckerberg': 'Mark Zuckerberg',
  'Jeff Bezos': 'Jeff Bezos',
  'Bill Gates': 'Bill Gates',
  
  // System
  'Community Bot': 'EnterCircles',
  'EnterCircles': 'EnterCircles',
  'System': 'EnterCircles',
} as const;

// Cache for celebrity images
const celebrityImageCache = new Map<string, string>();

export interface CelebrityInfo {
  name: string;
  avatar: string;
  verified: boolean;
  role: string;
  tmdbId?: number;
}

class CelebrityService {
  private async fetchCelebrityImage(celebrityName: string): Promise<string> {
    try {
      // Search for the celebrity
      const searchResult = await tmdbService.searchActors(celebrityName, 1);
      
      if (searchResult.results && searchResult.results.length > 0) {
        const actor = searchResult.results[0];
        return tmdbService.getImageUrl(actor.profile_path, 'w500');
      }
      
      // Fallback to popular actors if search fails
      const popularActors = await tmdbService.getPopularActors(1);
      const randomActor = popularActors.results[Math.floor(Math.random() * popularActors.results.length)];
      return tmdbService.getImageUrl(randomActor.profile_path, 'w500');
    } catch (error) {
      console.error(`Error fetching celebrity image for ${celebrityName}:`, error);
      // Return a fallback image
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop';
    }
  }

  async getCelebrityAvatar(userName: string): Promise<string> {
    // Check cache first
    if (celebrityImageCache.has(userName)) {
      return celebrityImageCache.get(userName)!;
    }

    // Only fetch celebrity images for actual celebrity names
    const isCelebrity = CELEBRITY_MAPPING[userName as keyof typeof CELEBRITY_MAPPING];
    
    if (!isCelebrity) {
      // Return null to indicate we should use local image
      return '';
    }

    if (isCelebrity === 'EnterCircles') {
      // Return default avatar for system users
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop';
    }

    try {
      const avatarUrl = await this.fetchCelebrityImage(userName);
      celebrityImageCache.set(userName, avatarUrl);
      return avatarUrl;
    } catch (error) {
      console.error(`Error getting celebrity avatar for ${userName}:`, error);
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop';
    }
  }

  async getCelebrityInfo(userName: string): Promise<CelebrityInfo> {
    const isCelebrity = CELEBRITY_MAPPING[userName as keyof typeof CELEBRITY_MAPPING];
    
    if (!isCelebrity) {
      // Return null to indicate we should use local image and original name
      return {
        name: userName,
        avatar: '',
        verified: false,
        role: 'Community Member'
      };
    }

    if (isCelebrity === 'EnterCircles') {
      return {
        name: userName,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop',
        verified: true,
        role: 'System'
      };
    }

    const avatar = await this.getCelebrityAvatar(userName);
    
    // Determine role based on celebrity
    let role = 'Fan';
    if (userName === 'Christopher Nolan') role = 'Director';
    else if (userName === 'Taylor Swift') role = 'Artist';
    else if (userName === 'Tom Hanks' || userName === 'Leonardo DiCaprio' || 
             userName === 'Brad Pitt' || userName === 'Johnny Depp') role = 'Actor';
    else if (userName === 'Emma Watson' || userName === 'Meryl Streep' || 
             userName === 'Angelina Jolie') role = 'Actress';

    return {
      name: userName,
      avatar,
      verified: true,
      role
    };
  }

  // Preload celebrity images for better performance
  async preloadCelebrityImages(): Promise<void> {
    const userNames = Object.keys(CELEBRITY_MAPPING);
    
    const preloadPromises = userNames.map(async (userName) => {
      try {
        await this.getCelebrityAvatar(userName);
      } catch (error) {
        console.error(`Error preloading image for ${userName}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  // Get random celebrity for variety
  async getRandomCelebrity(): Promise<CelebrityInfo> {
    try {
      const popularActors = await tmdbService.getPopularActors(1);
      const randomActor = popularActors.results[Math.floor(Math.random() * popularActors.results.length)];
      
      return {
        name: randomActor.name,
        avatar: tmdbService.getImageUrl(randomActor.profile_path, 'w500'),
        verified: true,
        role: randomActor.known_for_department === 'Acting' ? 'Actor' : 'Director'
      };
    } catch (error) {
      console.error('Error getting random celebrity:', error);
      return {
        name: 'Celebrity',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop',
        verified: true,
        role: 'Actor'
      };
    }
  }
}

export const celebrityService = new CelebrityService();

// Export the mapping for reference
export { CELEBRITY_MAPPING }; 
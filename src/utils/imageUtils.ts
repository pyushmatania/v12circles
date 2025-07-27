// Import all images properly for Vite bundling
import akashMatania from '../images/akash-matania.JPG';
import adya from '../images/adya.JPG';
import alok from '../images/alok.jpg';
import ankit from '../images/ankit.jpg';
import biren from '../images/biren.jpg';
import ipsit from '../images/ipsit.jpg';
import kamlesh from '../images/kamlesh.jpg';
import praveen from '../images/praveen.jpg';
import soham from '../images/soham.jpg';
import circlesLogo from '../images/circles-logo-main.png';

// Import perk images
import perk1 from '../images/circles-perks/perk1.png';
import perk2 from '../images/circles-perks/perk2.png';
import perk3 from '../images/circles-perks/perk3.png';
import perk4 from '../images/circles-perks/perk4.png';
import perk5 from '../images/circles-perks/perk5.png';
import perk6 from '../images/circles-perks/perk6.png';

// 🚀 Enhanced fallback image generation for community items
export const generateCommunityFallbackImage = (name: string, type: string): string => {
  const colors = {
    actor: ['#3B82F6', '#1D4ED8', '#1E40AF'],
    actress: ['#EC4899', '#BE185D', '#9D174D'],
    director: ['#10B981', '#059669', '#047857'],
    movie: ['#F59E0B', '#D97706', '#B45309'],
    productionHouse: ['#8B5CF6', '#7C3AED', '#6D28D9'],
    musicArtist: ['#EF4444', '#DC2626', '#B91C1C']
  };
  
  const typeColors = colors[type as keyof typeof colors] || colors.actor;
  const color = typeColors[name.length % typeColors.length];
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}80;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <circle cx="100" cy="80" r="40" fill="rgba(255,255,255,0.1)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
      <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle">${type}</text>
    </svg>
  `)}`;
};

// Centralized image mapping
export const images = {
  // Profile images
  'akash-matania': akashMatania,
  'adya': adya,
  'alok': alok,
  'ankit': ankit,
  'biren': biren,
  'ipsit': ipsit,
  'kamlesh': kamlesh,
  'praveen': praveen,
  'soham': soham,
  
  // Logo
  'circles-logo': circlesLogo,
  
  // Perks
  'perk1': perk1,
  'perk2': perk2,
  'perk3': perk3,
  'perk4': perk4,
  'perk5': perk5,
  'perk6': perk6,
} as const;

// User avatar mapping
export const userAvatars = {
  'Akash Matania': akashMatania,
  'Adya Rath': adya,
  'Alok Tripathy': alok,
  'Ankit Singh': ankit,
  'Biren Dora': biren,
  'Ipsit Tripathy': ipsit,
  'Kamlesh Biswal': kamlesh,
  'Praveen Dehury': praveen,
  'Soham Bardhan': soham,
  'You': akashMatania,
  'Community Bot': circlesLogo,
  'EnterCircles': circlesLogo,
  'System': circlesLogo,
} as const;

// 🚀 Enhanced image validation and fallback system
export const getValidImageUrl = (originalUrl: string, name: string, type: string): string => {
  if (!originalUrl || originalUrl === '') {
    return generateCommunityFallbackImage(name, type);
  }
  
  // If it's a TMDB URL, we'll let OptimizedImage handle the fallback
  if (originalUrl.includes('image.tmdb.org')) {
    return originalUrl;
  }
  
  // If it's a local image, return as is
  if (originalUrl.startsWith('data:') || originalUrl.startsWith('/')) {
    return originalUrl;
  }
  
  // For other URLs, return the original URL and let OptimizedImage handle errors
  return originalUrl;
};

// 🚀 Enhanced user avatar with fallback
export const getUserAvatar = (name: string): string => {
  const avatar = userAvatars[name as keyof typeof userAvatars];
  if (avatar) {
    return avatar;
  }
  
  // Generate fallback avatar for unknown users
  const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
  const color = colors[name.length % colors.length];
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}80;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#userGrad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
    </svg>
  `)}`;
};

// Helper function to get image by key
export const getImage = (key: string): string => {
  return images[key as keyof typeof images] || akashMatania;
};

// Helper function to get perk image
export const getPerkImage = (index: number): string => {
  const perkKey = `perk${index}` as keyof typeof images;
  return images[perkKey] || perk1;
};

// 🚀 Optimized image preloading with caching and error handling
const imageCache = new Map<string, Promise<boolean>>();

export const preloadImage = (src: string): Promise<boolean> => {
  // Check cache first
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }
  
  const preloadPromise = new Promise<boolean>((resolve) => {
    if (!src || src.startsWith('data:')) {
      resolve(true);
      return;
    }
    
    const img = new Image();
    
    // Set crossOrigin for better caching
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
  
  // Cache the promise
  imageCache.set(src, preloadPromise);
  
  return preloadPromise;
};

// Export individual images for direct imports
export {
  akashMatania,
  adya,
  alok,
  ankit,
  biren,
  ipsit,
  kamlesh,
  praveen,
  soham,
  circlesLogo,
  perk1,
  perk2,
  perk3,
  perk4,
  perk5,
  perk6,
}; 
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

// Helper function to get user avatar
export const getUserAvatar = (name: string): string => {
  return userAvatars[name as keyof typeof userAvatars] || akashMatania;
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
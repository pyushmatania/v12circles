// 🚀 Optimized theme-aware text color utilities with caching
const textColorCache = new Map<string, string>();

export const getTextColor = (theme: 'light' | 'dark', variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
  const cacheKey = `${theme}-${variant}`;
  
  if (textColorCache.has(cacheKey)) {
    return textColorCache.get(cacheKey)!;
  }
  
  let color: string;
  
  if (theme === 'light') {
    switch (variant) {
      case 'primary':
        color = 'text-gray-900';
        break;
      case 'secondary':
        color = 'text-gray-700';
        break;
      case 'muted':
        color = 'text-gray-600';
        break;
      default:
        color = 'text-gray-900';
    }
  } else {
    switch (variant) {
      case 'primary':
        color = 'text-white';
        break;
      case 'secondary':
        color = 'text-gray-300';
        break;
      case 'muted':
        color = 'text-gray-400';
        break;
      default:
        color = 'text-white';
    }
  }
  
  textColorCache.set(cacheKey, color);
  return color;
};

// 🚀 Optimized background color utilities with caching
const bgColorCache = new Map<string, string>();

export const getBgColor = (theme: 'light' | 'dark', variant: 'card' | 'overlay' = 'card') => {
  const cacheKey = `${theme}-${variant}`;
  
  if (bgColorCache.has(cacheKey)) {
    return bgColorCache.get(cacheKey)!;
  }
  
  let color: string;
  
  if (theme === 'light') {
    switch (variant) {
      case 'card':
        color = 'bg-pink-100/90';
        break;
      case 'overlay':
        color = 'bg-pink-100/5';
        break;
      default:
        color = 'bg-pink-100/90';
    }
  } else {
    switch (variant) {
      case 'card':
        color = 'bg-white/5';
        break;
      case 'overlay':
        color = 'bg-black/20';
        break;
      default:
        color = 'bg-white/5';
    }
  }
  
  bgColorCache.set(cacheKey, color);
  return color;
};

export const getBorderColor = (theme: 'light' | 'dark') => {
  return theme === 'light' ? 'border-gray-200' : 'border-white/10';
};

export const getMainBgColor = (theme: 'light' | 'dark') => {
  return theme === 'light' ? 'bg-pink-100' : 'bg-gray-900';
}; 
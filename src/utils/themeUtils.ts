// Theme-aware text color utilities
export const getTextColor = (theme: 'light' | 'dark', variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
  if (theme === 'light') {
    switch (variant) {
      case 'primary':
        return 'text-gray-900';
      case 'secondary':
        return 'text-gray-700';
      case 'muted':
        return 'text-gray-600';
      default:
        return 'text-gray-900';
    }
  } else {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-gray-300';
      case 'muted':
        return 'text-gray-400';
      default:
        return 'text-white';
    }
  }
};

export const getBgColor = (theme: 'light' | 'dark', variant: 'card' | 'overlay' = 'card') => {
  if (theme === 'light') {
    switch (variant) {
      case 'card':
        return 'bg-pink-100/90';
      case 'overlay':
        return 'bg-pink-100/5';
      default:
        return 'bg-pink-100/90';
    }
  } else {
    switch (variant) {
      case 'card':
        return 'bg-white/5';
      case 'overlay':
        return 'bg-black/20';
      default:
        return 'bg-white/5';
    }
  }
};

export const getBorderColor = (theme: 'light' | 'dark') => {
  return theme === 'light' ? 'border-gray-200' : 'border-white/10';
};

export const getMainBgColor = (theme: 'light' | 'dark') => {
  return theme === 'light' ? 'bg-pink-100' : 'bg-gray-900';
}; 
// 🎯 Scroll Utilities for V12 Circles
// Handles scroll restoration and ensures proper scroll behavior

/**
 * 🎯 Scroll to top utility
 * Ensures the page scrolls to the top with smooth behavior
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

/**
 * 🎯 Scroll to top immediately (no animation)
 * Used for initial page loads
 */
export const scrollToTopImmediate = (): void => {
  window.scrollTo(0, 0);
};

/**
 * 🎯 Save current scroll position
 * Saves the current scroll position for later restoration
 */
export const saveScrollPosition = (key: string): void => {
  const scrollY = window.scrollY;
  sessionStorage.setItem(`scroll_${key}`, scrollY.toString());
};

/**
 * 🎯 Restore scroll position
 * Restores a previously saved scroll position
 */
export const restoreScrollPosition = (key: string, behavior: ScrollBehavior = 'smooth'): void => {
  const savedScrollY = sessionStorage.getItem(`scroll_${key}`);
  if (savedScrollY) {
    const scrollY = parseInt(savedScrollY, 10);
    window.scrollTo({
      top: scrollY,
      left: 0,
      behavior
    });
  }
};

/**
 * 🎯 Clear saved scroll position
 * Removes a saved scroll position from storage
 */
export const clearScrollPosition = (key: string): void => {
  sessionStorage.removeItem(`scroll_${key}`);
};

/**
 * 🎯 Initialize scroll restoration
 * Sets up global scroll behavior for the application
 */
export const initializeScrollRestoration = (): (() => void) => {
  // Ensure scroll starts from top on page load
  scrollToTopImmediate();
  
  // Handle browser back/forward navigation
  const handlePopState = () => {
    scrollToTopImmediate();
  };
  
  // Handle page visibility changes (when user returns to tab)
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        scrollToTopImmediate();
      }, 100);
    }
  };
  
  // Add event listeners
  window.addEventListener('popstate', handlePopState);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

/**
 * 🎯 Scroll to element utility
 * Smoothly scrolls to a specific element
 */
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      left: 0,
      behavior: 'smooth'
    });
  }
};

/**
 * 🎯 Scroll to element immediately
 * Instantly scrolls to a specific element without animation
 */
export const scrollToElementImmediate = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo(0, elementPosition);
  }
}; 
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

interface VirtualScrollConfig {
  itemHeight: number;
  overscan: number; // Items to render outside visible area
  buffer: number; // Items to keep in memory
  threshold: number; // When to load more items
  enableSmoothScrolling: boolean;
  enableInfiniteScroll: boolean;
}

interface VirtualScrollingProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onLoadMore?: () => Promise<T[]>;
  hasMore?: boolean;
  loading?: boolean;
  enableSmoothScrolling?: boolean;
  enableInfiniteScroll?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const VirtualScrolling = <T,>({
  items,
  itemHeight,
  overscan = 5,
  enableSmoothScrolling = true,
  enableInfiniteScroll = false,
  onLoadMore,
  renderItem,
  className = '',
  style,
  loadingComponent,
  emptyComponent,
  errorComponent
}: VirtualScrollingProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [allItems, setAllItems] = useState<T[]>(items);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      allItems.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, overscan, allItems.length]);

  // Get visible items
  const visibleItems = useMemo(
    () => allItems.slice(visibleRange.startIndex, visibleRange.endIndex),
    [allItems, visibleRange]
  );

  // Handle scroll with RAF throttling for smooth performance
  const handleScroll = useCallback(
    (e: Event) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const target = e.target as HTMLDivElement;
        setScrollTop(target.scrollTop);
      });
    },
    []
  );

  // Setup scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // Resize observer for container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      setContainerHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Infinite scroll logic
  useEffect(() => {
    if (!enableInfiniteScroll || !onLoadMore || isLoading) return;

    const shouldLoadMore = 
      visibleRange.endIndex > allItems.length * 0.8; // Default threshold

    if (shouldLoadMore) {
      loadMoreItems();
    }
  }, [visibleRange.endIndex, allItems.length, enableInfiniteScroll, onLoadMore, isLoading, loadMoreItems]);

  // Load more items
  const loadMoreItems = useCallback(async () => {
    if (!onLoadMore || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const newItems = await onLoadMore();
      if (newItems && Array.isArray(newItems)) {
        setAllItems(prev => [...prev, ...newItems]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more items'));
    } finally {
      setIsLoading(false);
    }
  }, [onLoadMore, isLoading]);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const container = containerRef.current;
    if (!container) return;

    const targetScrollTop = index * itemHeight;
    container.scrollTo({
      top: targetScrollTop,
      behavior: enableSmoothScrolling ? behavior : 'auto'
    });
  }, [itemHeight, enableSmoothScrolling]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollToItem(0);
  }, [scrollToItem]);

  // Get item position
  const getItemPosition = useCallback((index: number) => {
    return index * itemHeight;
  }, [itemHeight]);

  // Total height calculation
  const totalHeight = allItems.length * itemHeight;

  // Loading component
  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Loading more items...</span>
    </div>
  );

  // Empty component
  const defaultEmptyComponent = (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <span className="text-lg font-medium">No items found</span>
      <span className="text-sm">Try adjusting your search or filters</span>
    </div>
  );

  // Error component
  const defaultErrorComponent = (
    <div className="flex flex-col items-center justify-center py-12 text-red-500">
      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-lg font-medium">Error loading items</span>
      <span className="text-sm">{error?.message}</span>
      <button
        onClick={loadMoreItems}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  // Render loading state
  if (isLoading && allItems.length === 0) {
    return (
      <div className={className} style={style}>
        {loadingComponent || defaultLoadingComponent}
      </div>
    );
  }

  // Render empty state
  if (allItems.length === 0) {
    return (
      <div className={className} style={style}>
        {emptyComponent || defaultEmptyComponent}
      </div>
    );
  }

  // Render error state
  if (error && allItems.length === 0) {
    return (
      <div className={className} style={style}>
        {errorComponent || defaultErrorComponent}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Virtual scrolling container */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: '100%' }}
      >
        {/* Scrollable content with total height */}
        <div
          style={{
            height: totalHeight,
            position: 'relative'
          }}
        >
          {/* Visible items */}
          <AnimatePresence>
            {visibleItems.map((item, index) => {
              const globalIndex = visibleRange.startIndex + index;
              const top = getItemPosition(globalIndex);
              
              return (
                <motion.div
                  key={`${globalIndex}_${JSON.stringify(item)}`}
                  style={{
                    position: 'absolute',
                    top,
                    left: 0,
                    right: 0,
                    height: itemHeight
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut'
                  }}
                  className="will-change-transform"
                >
                  {renderItem(item, globalIndex)}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading indicator at bottom */}
          {isLoading && enableInfiniteScroll && (
            <motion.div
              style={{
                position: 'absolute',
                top: totalHeight,
                left: 0,
                right: 0,
                height: 80
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              {loadingComponent || defaultLoadingComponent}
            </motion.div>
          )}

          {/* Error indicator */}
          {error && enableInfiniteScroll && (
            <motion.div
              style={{
                position: 'absolute',
                top: totalHeight,
                left: 0,
                right: 0,
                height: 80
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              {errorComponent || defaultErrorComponent}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      {scrollTop > 1000 && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}

      {/* Performance monitoring (development only) */}
      {import.meta.env.DEV && (
        <div className="fixed top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity z-50">
          Items: {allItems.length} | Visible: {visibleItems.length} | Scroll: {Math.round(scrollTop)}px
        </div>
      )}
    </div>
  );
};

export default VirtualScrolling;

// Hook for virtual scrolling
export function useVirtualScrolling<T>(
  items: T[],
  config: VirtualScrollConfig
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { itemHeight, overscan } = config;

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  // Handle scroll with RAF throttling
  const handleScroll = useCallback(
    (e: Event) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Intersection observer for container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setContainerHeight(entries[0].contentRect.height);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Get visible items
  const visibleItems = useMemo(
    () => items.slice(visibleRange.startIndex, visibleRange.endIndex),
    [items, visibleRange]
  );

  return {
    containerRef,
    visibleItems,
    visibleRange,
    totalHeight: items.length * itemHeight,
    scrollTop
  };
} 
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

interface SmoothAnimationConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
  velocity?: number;
  restDelta?: number;
  restSpeed?: number;
}

// Ultra-smooth animations with 120fps support and GPU optimization
export const useSmoothAnimations = () => {
  const rafRef = useRef<number>();
  const frameTimeRef = useRef<number>(0);
  const targetFPSRef = useRef<number>(120);

  // Detect high refresh rate displays
  useEffect(() => {
    const detectRefreshRate = () => {
      let lastTime = 0;
      let frameCount = 0;
      const samples: number[] = [];

      const measureFrame = (currentTime: number) => {
        if (lastTime) {
          const delta = currentTime - lastTime;
          samples.push(1000 / delta);
          frameCount++;

          if (frameCount >= 10) {
            const avgFPS = samples.reduce((sum, fps) => sum + fps, 0) / samples.length;
            targetFPSRef.current = Math.min(120, Math.max(60, Math.round(avgFPS)));
            return;
          }
        }
        lastTime = currentTime;
        requestAnimationFrame(measureFrame);
      };

      requestAnimationFrame(measureFrame);
    };

    detectRefreshRate();
  }, []);

  // Ultra-smooth spring configuration for different use cases
  const springConfigs = useMemo(() => ({
    ultra: { damping: 35, stiffness: 400, mass: 0.8, restDelta: 0.001, restSpeed: 0.001 },
    smooth: { damping: 30, stiffness: 300, mass: 1, restDelta: 0.01, restSpeed: 0.01 },
    bouncy: { damping: 20, stiffness: 200, mass: 1.2, restDelta: 0.01, restSpeed: 0.01 },
    gentle: { damping: 40, stiffness: 150, mass: 1.5, restDelta: 0.01, restSpeed: 0.01 },
    snappy: { damping: 25, stiffness: 500, mass: 0.6, restDelta: 0.001, restSpeed: 0.001 }
  }), []);

  // Create optimized motion values with GPU acceleration
  const createSmoothMotionValue = useCallback((
    initialValue: number,
    config: SmoothAnimationConfig = springConfigs.smooth
  ) => {
    const motionValue = useMotionValue(initialValue);
    const spring = useSpring(motionValue, config);
    
    // Enable GPU acceleration for the motion value
    useEffect(() => {
      const unsubscribe = spring.onChange((value) => {
        // Trigger GPU layer promotion
        if (typeof value === 'number') {
          frameTimeRef.current = performance.now();
        }
      });

      return unsubscribe;
    }, [spring]);

    return { motionValue, spring };
  }, [springConfigs.smooth]);

  // Smooth scroll with momentum and easing
  const useSmoothScroll = useCallback((
    containerRef: React.RefObject<HTMLElement>,
    config: SmoothAnimationConfig = springConfigs.smooth
  ) => {
    const scrollY = useMotionValue(0);
    const smoothScrollY = useSpring(scrollY, config);
    const velocity = useRef(0);
    const lastScrollTime = useRef(0);
    const isScrolling = useRef(false);
    const momentumRaf = useRef<number>();

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Enable hardware acceleration
      container.style.willChange = 'transform';
      container.style.backfaceVisibility = 'hidden';
      container.style.perspective = '1000px';

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        
        const now = performance.now();
        const deltaTime = now - lastScrollTime.current;
        
        // Calculate velocity for momentum
        velocity.current = e.deltaY / Math.max(deltaTime, 16);
        lastScrollTime.current = now;
        
        const currentScroll = scrollY.get();
        const newScroll = currentScroll + e.deltaY * 0.8;
        
        // Clamp scroll value
        const maxScroll = container.scrollHeight - container.clientHeight;
        const clampedScroll = Math.max(0, Math.min(maxScroll, newScroll));
        
        scrollY.set(clampedScroll);
        isScrolling.current = true;
        
        // Clear existing momentum
        if (momentumRaf.current) {
          cancelAnimationFrame(momentumRaf.current);
        }
        
        // Add momentum scrolling
        const addMomentum = () => {
          if (Math.abs(velocity.current) > 0.1) {
            velocity.current *= 0.95; // Friction
            const currentScroll = scrollY.get();
            const newScroll = currentScroll + velocity.current * 8;
            const maxScroll = container.scrollHeight - container.clientHeight;
            const clampedScroll = Math.max(0, Math.min(maxScroll, newScroll));
            
            scrollY.set(clampedScroll);
            momentumRaf.current = requestAnimationFrame(addMomentum);
          } else {
            isScrolling.current = false;
          }
        };
        
        // Start momentum after a delay
        setTimeout(() => {
          if (isScrolling.current) {
            momentumRaf.current = requestAnimationFrame(addMomentum);
          }
        }, 100);
      };

      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.style.willChange = 'auto';
        container.style.backfaceVisibility = 'visible';
        container.style.perspective = 'none';
        if (momentumRaf.current) {
          cancelAnimationFrame(momentumRaf.current);
        }
      };
    }, [scrollY, springConfigs.smooth]);

    // Apply smooth scroll transform
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const unsubscribe = smoothScrollY.onChange((value) => {
        container.style.transform = `translateY(${-value}px) translateZ(0)`;
      });

      return unsubscribe;
    }, [smoothScrollY]);

    return { scrollY: smoothScrollY, rawScrollY: scrollY };
  }, [springConfigs.smooth]);

  // Parallax with depth layers
  const useParallaxDepth = useCallback((
    scrollY: MotionValue<number>,
    depth: number = 0.5
  ) => {
    return useTransform(scrollY, (value) => value * depth);
  }, []);

  // Smooth hover animations with GPU optimization
  const useSmoothHover = useCallback((
    config: SmoothAnimationConfig = springConfigs.snappy
  ) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const smoothX = useSpring(x, config);
    const smoothY = useSpring(y, config);
    const smoothScale = useSpring(scale, config);
    const smoothRotateX = useSpring(rotateX, config);
    const smoothRotateY = useSpring(rotateY, config);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Normalize to -1 to 1 range
      const normalizedX = deltaX / (rect.width / 2);
      const normalizedY = deltaY / (rect.height / 2);
      
      x.set(deltaX * 0.15);
      y.set(deltaY * 0.15);
      rotateX.set(-normalizedY * 15);
      rotateY.set(normalizedX * 15);
    }, [x, y, rotateX, rotateY]);

    const handleMouseEnter = useCallback(() => {
      scale.set(1.05);
    }, [scale]);

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
      scale.set(1);
      rotateX.set(0);
      rotateY.set(0);
    }, [x, y, scale, rotateX, rotateY]);

    return {
      x: smoothX,
      y: smoothY,
      scale: smoothScale,
      rotateX: smoothRotateX,
      rotateY: smoothRotateY,
      handleMouseMove,
      handleMouseEnter,
      handleMouseLeave
    };
  }, [springConfigs.snappy]);

  // Micro-interactions with precise timing
  const useMicroInteraction = useCallback((
    config: SmoothAnimationConfig = springConfigs.ultra
  ) => {
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, config);

    const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 0.9]);
    const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [1, 1.02, 0.98, 1]);
    const blur = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 0]);

    const trigger = useCallback(() => {
      progress.set(1);
      setTimeout(() => progress.set(0), 1000);
    }, [progress]);

    return {
      progress: smoothProgress,
      opacity,
      scale,
      blur,
      trigger
    };
  }, [springConfigs.ultra]);

  // Staggered animations for lists
  const useStaggeredAnimation = useCallback((
    items: any[],
    delay: number = 0.1,
    config: SmoothAnimationConfig = springConfigs.smooth
  ) => {
    const animations = useMemo(() => {
      return items.map((_, index) => {
        const progress = useMotionValue(0);
        const spring = useSpring(progress, {
          ...config,
          delay: index * delay * 1000
        });

        const y = useTransform(spring, [0, 1], [50, 0]);
        const opacity = useTransform(spring, [0, 1], [0, 1]);
        const scale = useTransform(spring, [0, 0.5, 1], [0.9, 1.02, 1]);

        return { progress, y, opacity, scale };
      });
    }, [items.length, delay, config]);

    const startAnimation = useCallback(() => {
      animations.forEach(({ progress }, index) => {
        setTimeout(() => {
          progress.set(1);
        }, index * delay * 1000);
      });
    }, [animations, delay]);

    return { animations, startAnimation };
  }, [springConfigs.smooth]);

  // Cinematic transitions
  const useCinematicTransition = useCallback((
    config: SmoothAnimationConfig = springConfigs.gentle
  ) => {
    const progress = useMotionValue(0);
    const smoothProgress = useSpring(progress, config);

    // Cinematic effects
    const clipPath = useTransform(
      smoothProgress,
      [0, 0.3, 0.7, 1],
      [
        'inset(0 100% 0 0)',
        'inset(0 70% 0 0)',
        'inset(0 30% 0 0)',
        'inset(0 0% 0 0)'
      ]
    );

    const filter = useTransform(
      smoothProgress,
      [0, 0.5, 1],
      ['blur(10px) brightness(0.5)', 'blur(2px) brightness(0.8)', 'blur(0px) brightness(1)']
    );

    const transform = useTransform(
      smoothProgress,
      [0, 1],
      ['scale(1.1) rotateY(-10deg)', 'scale(1) rotateY(0deg)']
    );

    return {
      progress: smoothProgress,
      clipPath,
      filter,
      transform,
      start: () => progress.set(1),
      reset: () => progress.set(0)
    };
  }, [springConfigs.gentle]);

  // Performance monitoring for animations
  const useAnimationPerformance = useCallback(() => {
    const metrics = useRef({
      frameDrops: 0,
      averageFPS: 0,
      lastFrameTime: 0,
      frameCount: 0
    });

    useEffect(() => {
      let animationId: number;
      
      const measureFrame = (currentTime: number) => {
        if (metrics.current.lastFrameTime) {
          const delta = currentTime - metrics.current.lastFrameTime;
          const fps = 1000 / delta;
          
          // Update running average
          metrics.current.frameCount++;
          metrics.current.averageFPS = 
            (metrics.current.averageFPS * (metrics.current.frameCount - 1) + fps) / metrics.current.frameCount;
          
          // Count frame drops (below 55fps on 60Hz, below 110fps on 120Hz)
          const targetFPS = targetFPSRef.current;
          if (fps < targetFPS * 0.9) {
            metrics.current.frameDrops++;
          }
        }
        
        metrics.current.lastFrameTime = currentTime;
        animationId = requestAnimationFrame(measureFrame);
      };

      animationId = requestAnimationFrame(measureFrame);

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, []);

    return metrics.current;
  }, []);

  return {
    springConfigs,
    createSmoothMotionValue,
    useSmoothScroll,
    useParallaxDepth,
    useSmoothHover,
    useMicroInteraction,
    useStaggeredAnimation,
    useCinematicTransition,
    useAnimationPerformance,
    targetFPS: targetFPSRef.current
  };
};

export default useSmoothAnimations; 
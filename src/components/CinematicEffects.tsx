import React, { useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from 'framer-motion';
import { useTheme } from './ThemeContext';

interface CinematicEffectsProps {
  children: React.ReactNode;
  enableParallax?: boolean;
  enableDepthOfField?: boolean;
  enableFilmGrain?: boolean;
  enableVignette?: boolean;
  intensity?: number;
  className?: string;
}

// Cinematic effects with depth and parallax
const CinematicEffects: React.FC<CinematicEffectsProps> = ({
  children,
  enableParallax = true,
  enableDepthOfField = true,
  enableFilmGrain = true,
  enableVignette = true,
  intensity = 0.8,
  className = ''
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth parallax transforms
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.7, 1, 1, 0.8]);

  // Depth layers with different speeds
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -500]);
  const midgroundY = useTransform(scrollY, [0, 1000], [0, -300]);
  const foregroundY = useTransform(scrollY, [0, 1000], [0, -100]);

  // Smooth springs for better performance
  const smoothParallaxY = useSpring(parallaxY, { damping: 30, stiffness: 200 });
  const smoothBackgroundY = useSpring(backgroundY, { damping: 25, stiffness: 150 });
  const smoothMidgroundY = useSpring(midgroundY, { damping: 35, stiffness: 250 });

  // Dynamic lighting based on scroll
  const lightingIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.6]);
  const shadowDepth = useTransform(scrollYProgress, [0, 1], [20, 60]);

  // Cinematic color grading
  const colorGrading = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [
      'sepia(0%) saturate(100%) hue-rotate(0deg) brightness(1)',
      'sepia(10%) saturate(110%) hue-rotate(5deg) brightness(1.05)',
      'sepia(15%) saturate(120%) hue-rotate(10deg) brightness(1.1)',
      'sepia(5%) saturate(100%) hue-rotate(0deg) brightness(0.95)'
    ]
  );

  // Advanced film grain effect
  const filmGrainSeed = useMemo(() => Math.random() * 1000, []);
  const filmGrainAnimation = useTransform(scrollY, (value) => {
    const offset = (value * 0.01 + filmGrainSeed) % 100;
    return `translateX(${offset}px) translateY(${offset * 0.5}px)`;
  });

  // Depth of field blur
  const depthBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 2, 2, 8]);
  const depthBlurTemplate = useMotionTemplate`blur(${depthBlur}px)`;

  // Vignette effect
  const vignetteIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.1, 0.4]);
  const vignetteTemplate = useMotionTemplate`radial-gradient(circle at center, transparent 40%, rgba(0,0,0,${vignetteIntensity}) 100%)`;

  // Dynamic ambient lighting
  const ambientLight = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      'radial-gradient(circle at 30% 40%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 70% 30%, rgba(30, 144, 255, 0.15) 0%, transparent 60%)',
      'radial-gradient(circle at 50% 70%, rgba(255, 140, 0, 0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 20% 80%, rgba(255, 20, 147, 0.12) 0%, transparent 55%)',
      'radial-gradient(circle at 80% 20%, rgba(124, 252, 0, 0.08) 0%, transparent 45%)'
    ]
  );

  // Floating particles system
  const particleElements = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const size = Math.random() * 4 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = 15 + Math.random() * 25;
      const delay = Math.random() * 10;
      const opacity = Math.random() * 0.6 + 0.2;

      return (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: theme === 'dark' 
              ? 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(0.5px)'
          }}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            opacity: [opacity, opacity * 0.3, opacity],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    });
  }, [theme]);

  // Cinematic letterbox bars
  const letterboxHeight = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 30, 30, 60]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background Depth Layer */}
      {enableParallax && (
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            y: smoothBackgroundY,
            scale: parallaxScale,
            opacity: parallaxOpacity
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: ambientLight,
              mixBlendMode: theme === 'dark' ? 'screen' : 'multiply'
            }}
          />
        </motion.div>
      )}

      {/* Midground Layer */}
      {enableParallax && (
        <motion.div
          className="absolute inset-0 -z-5"
          style={{
            y: smoothMidgroundY,
            filter: enableDepthOfField ? depthBlurTemplate : 'none'
          }}
        >
          {/* Subtle geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="hexPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <polygon
                    points="20,5 35,15 35,25 20,35 5,25 5,15"
                    fill="none"
                    stroke={theme === 'dark' ? 'white' : 'black'}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexPattern)" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Main Content with Parallax */}
      <motion.div
        className="relative z-10"
        style={{
          y: enableParallax ? smoothParallaxY : 0,
          filter: colorGrading
        }}
      >
        {children}
      </motion.div>

      {/* Foreground Effects */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          y: enableParallax ? foregroundY : 0
        }}
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particleElements}
        </div>

        {/* Vignette Effect */}
        {enableVignette && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: vignetteTemplate,
              opacity: intensity
            }}
          />
        )}

        {/* Film Grain */}
        {enableFilmGrain && (
          <motion.div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              transform: filmGrainAnimation,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '400px 400px',
              mixBlendMode: theme === 'dark' ? 'screen' : 'multiply'
            }}
          />
        )}

        {/* Dynamic Light Rays */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, 
                transparent 0deg, 
                rgba(255,255,255,0.1) 45deg, 
                transparent 90deg,
                rgba(255,255,255,0.05) 135deg,
                transparent 180deg,
                rgba(255,255,255,0.1) 225deg,
                transparent 270deg,
                rgba(255,255,255,0.05) 315deg,
                transparent 360deg)`,
              transform: `rotate(${scrollYProgress.get() * 360}deg)`,
              mixBlendMode: 'overlay'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Cinematic Letterbox */}
        <motion.div className="absolute inset-0 pointer-events-none z-30">
          <motion.div
            className="absolute top-0 left-0 right-0 bg-black"
            style={{ height: letterboxHeight }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black"
            style={{ height: letterboxHeight }}
          />
        </motion.div>

        {/* Edge Enhancement */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
      </motion.div>

      {/* Performance Optimization Layer */}
      <div className="absolute inset-0 -z-20" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
    </div>
  );
};

export default CinematicEffects; 
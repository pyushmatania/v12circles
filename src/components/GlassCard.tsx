import React, { useRef, useEffect } from 'react';
import { Star, Users, Gift, Film, Plane, ShoppingBag } from 'lucide-react';

// Import logo image
import circlesLogo from '../images/circles-logo-main.png';

interface Illustration {
  image: string;
  imageFallback?: string;
  title: string;
  description: string;
  backTitle: string;
  backSubtitle: string;
  backDescription: string;
}

interface GlassCardProps {
  illustration: Illustration;
  index: number;
  theme: string;
  flipped: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggleFlip?: () => void; // New prop for toggle functionality
}

const iconMap: Record<string, JSX.Element> = {
  'Name Credit': <Star className="w-7 h-7 text-yellow-400 mr-2" />, // or similar
  'Community Casting': <Users className="w-7 h-7 text-blue-400 mr-2" />,
  'Movie Item': <Gift className="w-7 h-7 text-pink-400 mr-2" />,
  'Premiere Access': <Film className="w-7 h-7 text-purple-400 mr-2" />,
  'Trip with Movie Stars': <Plane className="w-7 h-7 text-green-400 mr-2" />,
  'Exclusive Merch': <ShoppingBag className="w-7 h-7 text-orange-400 mr-2" />,
};

const GlassCard: React.FC<GlassCardProps> = ({ 
  illustration, 
  theme, 
  flipped, 
  onHoverStart, 
  onHoverEnd, 
  onToggleFlip 
}) => {
  const touchTimeoutRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Toggle flip state on mobile touch
    if (onToggleFlip) {
      onToggleFlip();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="group perspective-1000"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      role="button"
      tabIndex={0}
      aria-label={illustration.title}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onToggleFlip) {
            onToggleFlip();
          } else {
            onHoverStart();
          }
        }
      }}
      onKeyUp={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!onToggleFlip) {
            onHoverEnd();
          }
        }
      }}
    >
      <div
        className="relative w-full h-[650px] sm:h-[620px] md:h-[600px] rounded-2xl overflow-hidden cursor-pointer"
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="w-full h-full transition-all duration-3000 [transition-timing-function:cubic-bezier(0.23,1.12,0.32,1)]"
          style={{
            transform: flipped ? 'rotateY(172deg)' : 'rotateY(-8deg)',
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Front Side */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{ 
              backfaceVisibility: 'hidden',
              zIndex: 2
            }}
          >
            <img 
              src={illustration.image} 
              alt={illustration.title}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${
              theme === 'light'
                ? 'from-black/60 via-transparent to-transparent'
                : 'from-black/80 via-transparent to-transparent'
            } rounded-2xl`} />
            {/* Subtle Left Edge Reflection */}
            <div 
              className="absolute left-0 top-0 h-full w-1"
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                borderRadius: '8px 0 0 8px'
              }}
            />
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h4 className="text-xl font-bold mb-2 text-white drop-shadow-lg">
                {illustration.title}
              </h4>
              <p className="text-sm text-gray-200 drop-shadow-md leading-relaxed">
                {illustration.description}
              </p>
            </div>
          </div>
          {/* Back Side */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-2xl ${
              theme === 'light'
                ? 'bg-blue-600/80'
                : 'bg-purple-800/80'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              zIndex: 2
            }}
          >
            {/* Subtle Left Edge Reflection */}
            <div 
              className="absolute left-0 top-0 h-full w-1"
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                borderRadius: '8px 0 0 8px'
              }}
            />
            {/* Decorative Radial Gradient */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.10) 0%, transparent 70%)'}} />
            {/* Blurred front image as background */}
            <img 
              src={illustration.image} 
              alt={illustration.title}
              className="w-full h-full object-cover blur-sm opacity-40 rounded-2xl"
              style={{
                transform: 'translateZ(2px) scaleX(-1)'
              }}
              loading="lazy"
            />
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              theme === 'light'
                ? 'from-blue-600/60 to-purple-600/60'
                : 'from-purple-800/60 to-pink-800/60'
            } rounded-2xl`} 
            style={{
              transform: 'translateZ(3px)'
            }}
            />
            {/* Enhanced Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start p-10 text-left z-10">
              {/* VIP Badge */}
              <div className="absolute top-6 right-6 z-20">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-yellow-900 font-extrabold text-xs shadow-lg uppercase tracking-wider">VIP</span>
              </div>
              {/* Title with Icon and Sparkles */}
              <div className="flex items-center mb-2 relative">
                <span className="relative flex items-center">
                  <span className="animate-pulse absolute -top-2 -left-2 w-4 h-4 bg-yellow-200 rounded-full opacity-70 blur-sm" />
                  <span className="animate-ping absolute top-0 left-3 w-2 h-2 bg-yellow-400 rounded-full opacity-80" />
                  <span className="animate-pulse absolute top-3 left-5 w-2 h-2 bg-white rounded-full opacity-60" />
                  <span className="animate-glow">
                    {iconMap[illustration.backTitle]}
                  </span>
                </span>
                <div className="text-2xl md:text-3xl font-extrabold uppercase bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent tracking-tight ml-2" style={{textShadow: '0 2px 8px rgba(255,215,0,0.4), 0 1px 0 #fff'}}>
                  {illustration.backTitle}
                </div>
              </div>
              {/* Subtitle */}
              <div className="text-lg md:text-xl font-bold text-white mb-3">
                {illustration.backSubtitle}
              </div>
              {/* Divider */}
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 opacity-60 mb-4" />
              {/* Description */}
              <div className="text-white text-base md:text-lg font-normal leading-relaxed mb-8">
                {illustration.backDescription}
              </div>
              {/* Gold Inscription */}
              <div className="mt-auto w-full flex justify-end items-center gap-3">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <img src={circlesLogo} alt="Circle Logo" className="w-full h-full object-contain object-center" style={{filter: 'brightness(1.5) drop-shadow(0 0 12px #ffe066) drop-shadow(0 0 6px #ffd700) drop-shadow(0 0 20px rgba(255,215,0,0.6))'}} />
                  {/* Animated sparkles */}
                  <span className="absolute w-3 h-3 rounded-full bg-yellow-200 opacity-90 animate-ping" style={{top: '15%', left: '75%'}} />
                  <span className="absolute w-2 h-2 rounded-full bg-white opacity-80 animate-pulse" style={{top: '55%', left: '30%'}} />
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-yellow-300 opacity-80 animate-pulse" style={{top: '75%', left: '85%'}} />
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-70 animate-ping" style={{top: '25%', left: '20%'}} />
                </div>
                <span className="font-signature text-2xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent" style={{fontFamily: 'cursive, "Dancing Script", "Pacifico", sans-serif', letterSpacing: '3px', textShadow: '0 4px 12px rgba(255,215,0,0.6)'}}>Official Perk</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlassCard; 
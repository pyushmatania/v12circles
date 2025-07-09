import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Film, TrendingUp, Users, DollarSign, Sparkles, Globe, Calendar, Coins } from 'lucide-react';
import Typewriter from './Typewriter';
import AnimatedNumber from './AnimatedNumber';
import { useTheme } from './ThemeContext';

interface HeroProps {
  setCurrentView?: (view: 'home' | 'dashboard' | 'projects' | 'community') => void;
}

// Optimized stat data - removed heavy lottie animations
const mainStats = [
  {
    key: 'projects',
    label: 'Active Projects',
    value: 20,
    description: 'Films, Music & Series',
    growth: '+45%',
    icon: Film,
    color: 'text-purple-400'
  },
  {
    key: 'raised',
    label: 'Total Raised',
    value: 30,
    prefix: '₹',
    unit: 'Cr+',
    description: 'Across all projects',
    growth: '+127%',
    icon: DollarSign,
    color: 'text-green-400'
  },
  {
    key: 'investors',
    label: 'Total Investors',
    value: 40000,
    unit: '+',
    description: 'Active community',
    growth: '+89%',
    icon: Users,
    color: 'text-blue-400'
  },
  {
    key: 'returns',
    label: 'Avg Returns',
    value: 230,
    unit: '%',
    description: 'Quarterly average',
    growth: '+23%',
    icon: TrendingUp,
    color: 'text-yellow-400'
  }
];

// Simplified supporting stats
const supportingStats = [
  {
    icon: Globe,
    title: 'Global Reach',
    value: '15 Countries',
    description: 'Investors from around the world',
    color: 'text-emerald-400'
  },
  {
    icon: Calendar,
    title: 'Success Rate',
    value: '87%',
    description: 'Projects meeting funding goals',
    color: 'text-green-400'
  },
  {
    icon: Coins,
    title: 'Avg Investment',
    value: '₹25,000',
    description: 'Per investor per project',
    color: 'text-yellow-400'
  }
];

const Hero: React.FC<HeroProps> = ({ setCurrentView }) => {
  const { theme, currentGradient } = useTheme();
  const [coinDrop, setCoinDrop] = useState(false);
  const [statsInView, setStatsInView] = useState<{ [key: number]: boolean }>({});

  // Memoized gradient classes to prevent recalculation
  const gradientClasses = useMemo(() => {
    const gradients = [
      'from-green-500 to-blue-500',
      'from-orange-500 to-red-500', 
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-green-500',
      'from-purple-500 to-fuchsia-500'
    ];
    return gradients[currentGradient] || gradients[0];
  }, [currentGradient]);

  // Simple coin component without heavy SVG
  const Coin = () => (
    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-800 font-bold text-sm">
      ₹
    </div>
  );

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-12 md:pt-16 transform-gpu ${
      theme === 'light'
        ? 'animated-gradient-light'
        : 'animated-gradient-dark'
      }`}
      style={{ 
        willChange: 'transform',
        contain: 'layout style paint'
      }}
    >
      
      {/* Gradient Theme Indicator */}
      {theme === 'light' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-indicator animate-gradient-pulse flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4 animate-pulse" /> 
          {['Aurora Borealis', 'Sunset Dreams', 'Ocean Depths', 'Mystic Forest', 'Royal Purple', 'Solar Flare'][currentGradient]}
        </motion.div>
      )}
      
      {/* Enhanced Multi-Color Burst Orbs - Full OG Effect */}
      <div className="absolute inset-0 overflow-hidden transform-gpu will-change-transform">
        {/* Primary Burst Orb */}
        <div 
          className={`absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50 transition-all duration-[3000ms] ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-gradient-to-br from-green-400 via-emerald-400 to-cyan-400' :
                currentGradient === 1 ? 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400' :
                currentGradient === 2 ? 'bg-gradient-to-br from-blue-400 via-cyan-400 to-indigo-400' :
                currentGradient === 3 ? 'bg-gradient-to-br from-emerald-400 via-green-400 to-lime-400' :
                'bg-gradient-to-br from-purple-400 via-fuchsia-400 to-pink-400'
              : 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500'
          }`}
          style={{
            animation: 'float 20s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
        
        {/* Secondary Burst Orb */}
        <div 
          className={`absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-45 transition-all duration-[3000ms] ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-gradient-to-br from-blue-400 via-purple-400 to-violet-400' :
                currentGradient === 1 ? 'bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400' :
                currentGradient === 2 ? 'bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400' :
                currentGradient === 3 ? 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400' :
                'bg-gradient-to-br from-pink-400 via-purple-400 to-violet-400'
              : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500'
          }`}
          style={{
            animation: 'float 25s ease-in-out infinite 5s',
            willChange: 'transform'
          }}
        />

        {/* Tertiary Burst Orb */}
        <div 
          className={`absolute top-1/2 right-1/3 w-[20rem] h-[20rem] rounded-full blur-3xl opacity-40 transition-all duration-[3000ms] ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-400' :
                currentGradient === 1 ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400' :
                currentGradient === 2 ? 'bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400' :
                currentGradient === 3 ? 'bg-gradient-to-br from-green-400 via-teal-400 to-cyan-400' :
                'bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400'
              : 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500'
          }`}
          style={{
            animation: 'float 18s ease-in-out infinite 10s',
            willChange: 'transform'
          }}
        />

        {/* Quaternary Burst Orb */}
        <div 
          className={`absolute top-1/3 left-1/3 w-[16rem] h-[16rem] rounded-full blur-3xl opacity-35 transition-all duration-[3000ms] ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400' :
                currentGradient === 1 ? 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400' :
                currentGradient === 2 ? 'bg-gradient-to-br from-indigo-400 via-purple-400 to-violet-400' :
                currentGradient === 3 ? 'bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400' :
                'bg-gradient-to-br from-fuchsia-400 via-pink-400 to-rose-400'
              : 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500'
          }`}
          style={{
            animation: 'float 22s ease-in-out infinite 7s',
            willChange: 'transform'
          }}
        />

        {/* Center Burst Orb */}
        <div 
          className={`absolute top-1/2 left-1/2 w-[36rem] h-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-50 ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400' :
                currentGradient === 1 ? 'bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400' :
                currentGradient === 2 ? 'bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400' :
                currentGradient === 3 ? 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400' :
                'bg-gradient-to-br from-purple-400 via-violet-400 to-indigo-400'
              : 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600'
          }`}
          style={{
            animation: 'pulse 30s ease-in-out infinite',
            willChange: 'transform'
          }}
        />

        {/* Additional Floating Orbs for Enhanced Effect */}
        <div 
          className={`absolute top-1/6 right-1/6 w-[12rem] h-[12rem] rounded-full blur-2xl opacity-30 transition-all duration-[3000ms] ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400' :
                currentGradient === 1 ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-red-400' :
                currentGradient === 2 ? 'bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400' :
                currentGradient === 3 ? 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400' :
                'bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400'
              : 'bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500'
          }`}
          style={{
            animation: 'float 28s ease-in-out infinite 3s',
            willChange: 'transform'
          }}
        />

        <div 
          className={`absolute bottom-1/6 left-1/6 w-[14rem] h-[14rem] rounded-full blur-2xl opacity-25 transition-all duration-[3000ms] ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-gradient-to-br from-indigo-400 via-purple-400 to-violet-400' :
                currentGradient === 1 ? 'bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400' :
                currentGradient === 2 ? 'bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400' :
                currentGradient === 3 ? 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400' :
                'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400'
              : 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500'
          }`}
          style={{
            animation: 'float 32s ease-in-out infinite 12s',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Particle Dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full transition-all duration-[3000ms] ${
              theme === 'light' 
                ? currentGradient === 0 ? 'bg-green-400' :
                  currentGradient === 1 ? 'bg-orange-400' :
                  currentGradient === 2 ? 'bg-blue-400' :
                  currentGradient === 3 ? 'bg-emerald-400' :
                  'bg-purple-400'
                : 'bg-white'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* CSS Animations for Better Performance */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(100px, -80px) scale(1.2); }
            50% { transform: translate(-50px, 60px) scale(0.8); }
            75% { transform: translate(60px, -60px) scale(1.1); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
            50% { transform: translate(-50%, -50%) scale(1.1) rotate(15deg); }
          }
          
          /* Optimize scroll performance */
          * {
            scroll-behavior: smooth;
          }
          
          /* Reduce motion for users who prefer it */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
          style={{ willChange: 'transform' }}
        >
          {/* Enhanced Floating Badge with Gradient Awareness */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border font-medium mt-10 mb-6 sm:mb-8 backdrop-blur-md transition-all duration-[3000ms] text-sm sm:text-base ${
              theme === 'light'
                ? currentGradient === 0 ? 'bg-green-50/60 border-green-300/50 text-green-700 shadow-lg shadow-green-200/50' :
                  currentGradient === 1 ? 'bg-orange-50/60 border-orange-300/50 text-orange-700 shadow-lg shadow-orange-200/50' :
                  currentGradient === 2 ? 'bg-blue-50/60 border-blue-300/50 text-blue-700 shadow-lg shadow-blue-200/50' :
                  currentGradient === 3 ? 'bg-emerald-50/60 border-emerald-300/50 text-emerald-700 shadow-lg shadow-emerald-200/50' :
                  'bg-purple-50/60 border-purple-300/50 text-purple-700 shadow-lg shadow-purple-200/50'
                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300'
            }`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            <span className="hidden sm:inline">The Future of Entertainment Investment</span>
            <span className="sm:hidden">Future of Entertainment</span>
          </motion.div>

          <h1 className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <Typewriter
              text="Own the stories you love"
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                theme === 'light'
                  ? 'from-purple-600 via-pink-500 to-blue-600'
                  : 'from-purple-400 via-pink-500 to-cyan-500'
              }`}
            />
          </h1>
          
          <p className={`text-xl sm:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Transform from passive viewer to co-producer. Invest in movies, music, and series. 
            Earn returns, unlock exclusive perks, and shape the future of entertainment.
          </p>

          {/* Enhanced CTA Buttons with Gradient Awareness */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
            <motion.button
              onClick={() => {
                setCoinDrop(true);
                setTimeout(() => {
                  setCurrentView?.('projects');
                  setTimeout(() => setCoinDrop(false), 900);
                }, 600);
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative px-8 py-4 rounded-full text-white font-semibold text-xl overflow-hidden transition-all duration-300 hover:shadow-2xl w-full sm:w-auto flex items-center justify-center ${
                theme === 'light'
                  ? currentGradient === 0 ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-500/25' :
                    currentGradient === 1 ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/25' :
                    currentGradient === 2 ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-blue-500/25' :
                    currentGradient === 3 ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-emerald-500/25' :
                    'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:shadow-purple-500/25'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/25'
              }`}
            >
              {/* Coin drop animation */}
              <motion.div
                initial={false}
                animate={coinDrop ? { y: [ -60, 0, 8, 0 ], opacity: [1, 1, 1, 0] } : { y: -60, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0.8, 0.2, 1] }}
                style={{ position: 'absolute', left: '50%', top: '-2.5rem', zIndex: 20, transform: 'translateX(-50%)', pointerEvents: 'none' }}
              >
                <Coin />
              </motion.div>
              
              {/* Enhanced Animated Background - Glowing Orb */}
              <motion.div
                className={`absolute inset-0 rounded-full transition-all duration-[3000ms] ${
                  theme === 'light'
                    ? currentGradient === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      currentGradient === 1 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                      currentGradient === 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      currentGradient === 3 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                      'bg-gradient-to-r from-purple-500 to-fuchsia-500'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
                }`}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Enhanced Shimmer Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Button Content - Centered within the glowing orb */}
              <span className="relative z-10 flex items-center gap-3 justify-center">
                Start Investing
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
            </motion.button>

            <motion.button
              onClick={() => setCurrentView?.('projects')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center gap-3 px-8 py-4 border rounded-full font-semibold text-xl backdrop-blur-md transition-all duration-[3000ms] w-full sm:w-auto justify-center ${
                theme === 'light'
                  ? currentGradient === 0 ? 'border-green-300 text-green-700 bg-green-50/60 hover:bg-green-50/80 shadow-lg hover:shadow-xl' :
                    currentGradient === 1 ? 'border-orange-300 text-orange-700 bg-orange-50/60 hover:bg-orange-50/80 shadow-lg hover:shadow-xl' :
                    currentGradient === 2 ? 'border-blue-300 text-blue-700 bg-blue-50/60 hover:bg-blue-50/80 shadow-lg hover:shadow-xl' :
                    currentGradient === 3 ? 'border-emerald-300 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50/80 shadow-lg hover:shadow-xl' :
                    'border-purple-300 text-purple-700 bg-purple-50/60 hover:bg-purple-50/80 shadow-lg hover:shadow-xl'
                  : 'border-white/20 text-white bg-white/5 hover:bg-white/10'
              }`}
            >
                <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Explore Projects
            </motion.button>
          </div>

          {/* Scroll Indicator - perfectly centered below CTA buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mx-auto mt-8 z-20 flex justify-center"
            style={{ width: 'fit-content' }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-5 h-8 sm:w-6 sm:h-10 border-2 rounded-full flex justify-center items-start transition-all duration-[3000ms] bg-black/10 backdrop-blur-md ${
                theme === 'light' 
                  ? currentGradient === 0 ? 'border-green-400' :
                    currentGradient === 1 ? 'border-orange-400' :
                    currentGradient === 2 ? 'border-blue-400' :
                    currentGradient === 3 ? 'border-emerald-400' :
                    'border-purple-400'
                  : 'border-white/30'
              }`}
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-1 h-2 sm:h-3 rounded-full mt-2 transition-all duration-[3000ms] ${
                  theme === 'light' 
                    ? currentGradient === 0 ? 'bg-green-500' :
                      currentGradient === 1 ? 'bg-orange-500' :
                      currentGradient === 2 ? 'bg-blue-500' :
                      currentGradient === 3 ? 'bg-emerald-500' :
                      'bg-purple-500'
                    : 'bg-white/50'
                }`}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Platform Impact Section - Optimized */}
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium mt-32 mb-4 text-sm bg-white/10 backdrop-blur-sm border-white/20 text-white">
              Platform Impact
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
              Transforming Entertainment{' '}
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${gradientClasses}`}>
                Investment
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300">
              Real numbers from our growing community of creators and investors
            </p>
          </motion.div>

          {/* Main Stats - Responsive Grid with Gradient Effects */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {mainStats.map((stat, idx) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                onViewportEnter={() => setStatsInView((prev) => ({ ...prev, [idx]: true }))}
                style={{ willChange: 'transform' }}
                className={`group relative p-6 sm:p-8 py-8 sm:py-10 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${idx === 0 || idx === 3 ? '' : 'hover:scale-105'} ${
                  theme === 'light'
                    ? currentGradient === 0 ? 'bg-green-50/40 border-green-300/60 shadow-lg hover:shadow-xl' :
                      currentGradient === 1 ? 'bg-orange-50/40 border-orange-300/60 shadow-lg hover:shadow-xl' :
                      currentGradient === 2 ? 'bg-blue-50/40 border-blue-300/60 shadow-lg hover:shadow-xl' :
                      currentGradient === 3 ? 'bg-emerald-50/40 border-emerald-300/60 shadow-lg hover:shadow-xl' :
                      'bg-purple-50/40 border-purple-300/60 shadow-lg hover:shadow-xl'
                    : currentGradient === 0 ? 'bg-green-500/10 border-green-400/30 hover:border-green-400/50' :
                      currentGradient === 1 ? 'bg-orange-500/10 border-orange-400/30 hover:border-orange-400/50' :
                      currentGradient === 2 ? 'bg-blue-500/10 border-blue-400/30 hover:border-blue-400/50' :
                      currentGradient === 3 ? 'bg-emerald-500/10 border-emerald-400/30 hover:border-emerald-400/50' :
                      'bg-purple-500/10 border-purple-400/30 hover:border-purple-400/50'
                }`}
              >
                <div className={`relative z-10 text-center flex flex-col justify-center h-full`}>
                  <div className={`mb-3 sm:mb-4 ${idx === 0 || idx === 3 ? '' : 'group-hover:scale-110'} transition-transform duration-300 ${
                    currentGradient === 0 ? 'text-green-400' :
                    currentGradient === 1 ? 'text-orange-400' :
                    currentGradient === 2 ? 'text-blue-400' :
                    currentGradient === 3 ? 'text-emerald-400' :
                    'text-purple-400'
                  }`}>
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{stat.label}</div>
                  <div className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
                    <AnimatedNumber 
                      value={stat.value} 
                      format={(v) => `${stat.prefix || ''}${v.toLocaleString()}${stat.unit || ''}`}
                      inView={!!statsInView[idx]}
                    />
                  </div>
                  <div className="text-xs text-gray-300 mb-2">{stat.description}</div>
                  <div className="text-center">
                    <span className="text-green-400 font-medium">
                      {stat.growth}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Supporting Stats - Responsive Grid with Gradient Effects */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {supportingStats.map((metric, idx) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (mainStats.length + idx) * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                style={{ willChange: 'transform' }}
                className={`group relative p-6 sm:p-8 py-8 sm:py-10 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
                    : `${metric.color} border-white/20 hover:border-white/40`
                }`}
              >
                <div className={`relative z-10 text-center`}>
                  <div className={`mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 ${
                    metric.color.includes('green') ? 'text-green-400' :
                    metric.color.includes('blue') ? 'text-blue-400' :
                    metric.color.includes('purple') ? 'text-purple-400' :
                    metric.color.includes('orange') ? 'text-orange-400' :
                    'text-gray-400'
                  }`}>
                    <metric.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{metric.title}</div>
                  <div className="text-xl sm:text-2xl font-extrabold mb-2 text-white">{metric.value}</div>
                  <div className="text-xs text-white/60">{metric.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
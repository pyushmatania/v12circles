import * as React from 'react';
import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Music, Tv, Star, Clock, Play, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import PixelCard from './PixelCard';
import { Project } from '../types';
import ProjectDetailPage from './ProjectDetailPage';

// 🛡️ Type definitions for better type safety
interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onInvestClick?: (project: Project) => void;
  featured?: boolean;
  compact?: boolean;
  urgent?: boolean;
  layout?: 'netflix' | 'grid' | 'list';
}

type ProjectType = 'film' | 'music' | 'series';

/**
 * 🎯 ProjectCard - Optimized project display card with enhanced performance
 * @description Displays project information with hover effects and investment functionality
 */
const ProjectCard: React.FC<ProjectCardProps> = memo(({ 
  project, 
  onClick,
  onInvestClick,
  featured, 
  compact,
  urgent
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailPage, setShowDetailPage] = useState(false);

  // 🚀 Memoized card dimensions for better performance
  const cardDimensions = useMemo(() => ({
    width: featured ? 'w-96' : compact ? 'w-48' : 'w-72',
    aspectRatio: featured ? 'aspect-[16/10]' : 'aspect-[2/3]'
  }), [featured, compact]);

  // 🚀 Memoized project type configuration
  const projectTypeConfig = useMemo(() => {
    const configs = {
      film: {
        icon: Film,
        bgColor: 'bg-purple-500/80',
        borderColor: 'border-purple-400/50',
        shadowColor: 'shadow-purple-500/25'
      },
      music: {
        icon: Music,
        bgColor: 'bg-blue-500/80',
        borderColor: 'border-blue-400/50',
        shadowColor: 'shadow-blue-500/25'
      },
      series: {
        icon: Tv,
        bgColor: 'bg-green-500/80',
        borderColor: 'border-green-400/50',
        shadowColor: 'shadow-green-500/25'
      }
    };
    return configs[project.type as ProjectType] || configs.film;
  }, [project.type]);

  // 🚀 Memoized funding percentage
  const fundingPercentage = useMemo(() => {
    return typeof project.fundedPercentage === 'number' && project.fundedPercentage > 0
      ? project.fundedPercentage
      : 0;
  }, [project.fundedPercentage]);

  // 🚀 Memoized formatted amounts
  const formattedAmounts = useMemo(() => ({
    target: (project.targetAmount / 100000).toFixed(1),
    raised: (project.raisedAmount / 100000).toFixed(1)
  }), [project.targetAmount, project.raisedAmount]);

  // 🚀 Memoized formatted date
  const formattedDate = useMemo(() => {
    return project.createdAt ? new Date(project.createdAt).toLocaleDateString() : null;
  }, [project.createdAt]);

  // 🚀 Optimized click handlers
  const handleClick = useCallback(() => {
    setShowDetailPage(true);
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const handleInvestClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInvestClick) {
      onInvestClick(project);
    }
  }, [onInvestClick, project]);

  const handleCloseDetailPage = useCallback(() => {
    setShowDetailPage(false);
  }, []);

  // 🚀 Optimized keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // 🚀 Memoized hover handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // 🚀 Memoized poster image source
  const posterSrc = useMemo(() => {
    return featured ? project.poster.replace('SX300', 'SX1080') : project.poster;
  }, [featured, project.poster]);

  // 🚀 Memoized type badge component
  const TypeBadge = useMemo(() => (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${projectTypeConfig.bgColor} ${projectTypeConfig.borderColor} text-white shadow-lg ${projectTypeConfig.shadowColor}`}>
      <projectTypeConfig.icon className="w-3 h-3" />
      {!featured && project.type.toUpperCase()}
    </div>
  ), [projectTypeConfig, featured, project.type]);

  // 🚀 Memoized trending badge
  const TrendingBadge = useMemo(() => (
    featured && (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-md border border-orange-400/30 text-white shadow-lg shadow-orange-500/25">
        <TrendingUp className="w-3 h-3" />
        TRENDING
      </div>
    )
  ), [featured]);

  // 🚀 Memoized urgent badge
  const UrgentBadge = useMemo(() => (
    urgent && (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500/90 to-pink-500/90 backdrop-blur-md border border-red-400/30 text-white shadow-lg shadow-red-500/25 animate-pulse">
        <AlertTriangle className="w-3 h-3" />
        URGENT
      </div>
    )
  ), [urgent]);

  // 🚀 Memoized funding badge
  const FundingBadge = useMemo(() => (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-500/90 backdrop-blur-md border border-green-400/30 text-white shadow-lg shadow-green-500/25">
      <TrendingUp className="w-3 h-3" />
      {fundingPercentage}%
    </div>
  ), [fundingPercentage]);

  // 🚀 Memoized rating badge
  const RatingBadge = useMemo(() => (
    project.rating && (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-lg">
        <Star className="w-3 h-3 text-yellow-400 fill-current" />
        {project.rating}
      </div>
    )
  ), [project.rating]);

  // 🚀 Memoized date badge
  const DateBadge = useMemo(() => (
    formattedDate && (
      <div className="flex items-center gap-1 text-orange-400 font-medium text-xs bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full w-fit">
        <Calendar className="w-3 h-3" />
        {formattedDate}
      </div>
    )
  ), [formattedDate]);

  // 🚀 Memoized progress bar
  const ProgressBar = useMemo(() => (
    <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden mt-2">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${fundingPercentage}%` }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400 shadow"
      />
    </div>
  ), [fundingPercentage]);

  // 🚀 Memoized tags
  const ProjectTags = useMemo(() => (
    <div className="flex flex-wrap gap-1">
      {project.tags.slice(0, 3).map((tag, index) => (
        <span 
          key={index}
          className="px-2 py-1 text-xs rounded-full bg-white/30 text-white backdrop-blur-md border border-white/20 font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  ), [project.tags]);

  // 🚀 Memoized stats grid
  const StatsGrid = useMemo(() => (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="bg-black/40 p-2 rounded-lg backdrop-blur-sm">
        <span className="text-gray-300">Target</span>
        <div className="text-white font-semibold">
          ₹{formattedAmounts.target}L
        </div>
      </div>
      <div className="bg-black/40 p-2 rounded-lg backdrop-blur-sm">
        <span className="text-gray-300">Language</span>
        <div className="text-white font-semibold">{project.language}</div>
      </div>
    </div>
  ), [formattedAmounts.target, project.language]);

  // 🚀 Memoized invest button
  const InvestButton = useMemo(() => (
    onInvestClick && (
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={handleInvestClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white text-black rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors shadow-lg"
          aria-label={`Invest in ${project.title}`}
        >
          <Play className="w-4 h-4 fill-current" />
          Invest Now
        </button>
      </div>
    )
  ), [onInvestClick, handleInvestClick, project.title]);

  return (
    <PixelCard variant="pink" className={`relative flex-shrink-0 ${cardDimensions.width} snap-start`}> 
      <motion.div
        className="absolute inset-0 cursor-pointer group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${project.title}`}
      >
        <div className={`relative ${cardDimensions.aspectRatio} rounded-xl overflow-hidden bg-gray-800 shadow-2xl`}>
          {/* 🚀 Main Poster Image with Blur Effect on Hover */}
          <div className="relative w-full h-full">
        <img
              src={posterSrc}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110 blur-sm brightness-50' : 'scale-100 blur-0 brightness-100'
          }`}
          loading="lazy"
        />

        {/* Premium Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Subtle dark overlay over entire poster for better text readability */}
        <div className="absolute inset-0 bg-black/25" />
      </div>
          
          {/* 🚀 Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            <div className="flex flex-col gap-2">
              {TypeBadge}
              {TrendingBadge}
              {UrgentBadge}
            </div>
          </div>

          {/* 🚀 Top Right - Rating and Funding */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              {FundingBadge}
              {RatingBadge}
            </div>
          </div>

          {/* 🚀 Bottom Content - Always Visible */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20" style={{ bottom: '12px' }}>
            <div className="relative space-y-3 z-10">
              {/* Title and Basic Info */}
              <div>
                <h3 className={`!text-white font-bold leading-tight drop-shadow-2xl ${
                  featured ? 'text-xl' : 'text-lg'
                }`}>
                  {project.title}
                </h3>
                {!featured && (
                  <p className="!text-white font-semibold text-sm mt-1 line-clamp-2 drop-shadow-2xl">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Created Date */}
              {DateBadge}
            </div>
          </div>

          {/* 🚀 Hover Content - Enhanced with Better Readability */}
          <AnimatePresence>
            {isHovered && !featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 flex flex-col justify-end p-4 z-30 backdrop-blur-sm"
              >
                {/* Funding Details Panel */}
                <div className="mb-4 p-4 rounded-xl border border-green-400/10 bg-black/60 backdrop-blur-md shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 font-semibold text-sm">{fundingPercentage}% funded</span>
                    <span className="text-xs text-gray-300">Target: <span className="font-bold text-blue-300">₹{formattedAmounts.target}L</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Raised: <span className="font-bold text-green-300">₹{formattedAmounts.raised}L</span></span>
                    {formattedDate && (
                      <span className="text-xs text-orange-300">Created {formattedDate}</span>
                    )}
                  </div>
                  {ProgressBar}
                </div>
                {/* Enhanced Title and Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">{project.title}</h3>
                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 drop-shadow-md">
                      {project.description}
                    </p>
                  </div>
                  {/* Tags */}
                  {ProjectTags}
                  {/* Enhanced Stats */}
                  {StatsGrid}
                  {/* Action Buttons */}
                  {InvestButton}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {showDetailPage && (
        <ProjectDetailPage 
          project={project} 
          onClose={handleCloseDetailPage}
          onInvest={onInvestClick}
        />
      )}
    </PixelCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
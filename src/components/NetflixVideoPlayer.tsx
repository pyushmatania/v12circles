import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  Loader,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NetflixVideoPlayerProps {
  src?: string;
  poster?: string;
  title: string;
  description?: string;
  onPlay?: () => void;
  onPause?: () => void;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}

// Advanced video player with Netflix-level optimizations
const NetflixVideoPlayer: React.FC<NetflixVideoPlayerProps> = memo(({
  src,
  poster,
  title,
  description,
  onPlay,
  onPause,
  autoPlay = false,
  muted = false,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Smooth animations for controls
  const controlsOpacity = useSpring(0, { damping: 25, stiffness: 300 });
  const progressValue = useMotionValue(0);
  const volumeValue = useMotionValue(volume);

  // Advanced buffering and preloading
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Set up video with optimal settings
    video.preload = 'metadata';
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    
    // Enable hardware acceleration
    video.style.willChange = 'transform';
    video.style.backfaceVisibility = 'hidden';
    video.style.perspective = '1000px';

    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay) {
        video.play().catch(() => {
          // Auto-play failed, likely due to browser policy
          setIsPlaying(false);
        });
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      progressValue.set((video.currentTime / video.duration) * 100);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercentage = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercentage);
      }
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlayThrough = () => setIsBuffering(false);

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
      volumeValue.set(video.volume);
    };

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [src, autoPlay, onPlay, onPause, progressValue, volumeValue]);

  // Controls visibility management
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    controlsOpacity.set(1);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isHovered) {
        setShowControls(false);
        controlsOpacity.set(0);
      }
    }, 3000);
  }, [isPlaying, isHovered, controlsOpacity]);

  const handleMouseMove = useCallback(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (isPlaying) {
      setShowControls(false);
      controlsOpacity.set(0);
    }
  }, [isPlaying, controlsOpacity]);

  // Playback controls
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    video.muted = newVolume === 0;
  }, []);

  const handleSeek = useCallback((percentage: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newTime = (percentage / 100) * duration;
    video.currentTime = newTime;
  }, [duration]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  }, [duration]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen]);

  // Format time for display
  const formatTime = useCallback((time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full bg-black rounded-lg overflow-hidden group cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlayPause}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        muted={isMuted}
        playsInline
        style={{
          filter: isLoading ? 'blur(4px)' : 'none',
          transition: 'filter 0.3s ease'
        }}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <Loader className="w-8 h-8 text-white animate-spin" />
              <p className="text-white text-sm font-medium">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buffering Indicator */}
      <AnimatePresence>
        {isBuffering && !isLoading && (
          <motion.div
            className="absolute top-4 right-4 bg-black/70 rounded-full p-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Loader className="w-4 h-4 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Button */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-6 hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Controls */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-bold mb-1">{title}</h3>
                  {description && (
                    <p className="text-white/80 text-sm line-clamp-2">{description}</p>
                  )}
                </div>
                <motion.button
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                >
                  <Maximize className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="relative h-1 bg-white/30 rounded-full overflow-hidden">
                  {/* Buffer Bar */}
                  <div
                    className="absolute top-0 left-0 h-full bg-white/50 transition-all duration-300"
                    style={{ width: `${buffered}%` }}
                  />
                  {/* Progress Bar */}
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-150"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  {/* Seek Handle */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDrag={(_, info) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      if (rect) {
                        const percentage = Math.max(0, Math.min(100, (info.point.x / rect.width) * 100));
                        handleSeek(percentage);
                      }
                    }}
                  />
                </div>
                
                {/* Time Display */}
                <div className="flex justify-between items-center mt-2 text-xs text-white/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Play/Pause */}
                  <motion.button
                    className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                    )}
                  </motion.button>

                  {/* Skip Backward */}
                  <motion.button
                    className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      skip(-10);
                    }}
                  >
                    <SkipBack className="w-4 h-4 text-white" />
                  </motion.button>

                  {/* Skip Forward */}
                  <motion.button
                    className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      skip(10);
                    }}
                  >
                    <SkipForward className="w-4 h-4 text-white" />
                  </motion.button>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </motion.button>

                    {/* Volume Slider */}
                    <div className="w-20 h-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quality and Settings */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Settings className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Depth Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        
        {/* Film Grain Effect */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSI+CiAgICA8ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMSIvPgogICAgPGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPgogIDwvZmlsdGVyPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCIvPgo8L3N2Zz4K')] animate-pulse" />
      </div>
    </motion.div>
  );
});

NetflixVideoPlayer.displayName = 'NetflixVideoPlayer';

export default NetflixVideoPlayer; 
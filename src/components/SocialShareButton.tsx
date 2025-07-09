import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Twitter, Facebook, Linkedin, Link as LinkIcon, Instagram } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Project } from '../types';

interface SocialShareButtonProps {
  project: Project;
  compact?: boolean;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({ project, compact = false }) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const { theme } = useTheme();

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const shareUrl = `https://circles.app/projects/${project.id}`;
  const shareTitle = `Check out ${project.title} on Circles!`;
  const shareDescription = `I'm considering investing in ${project.title}. It's ${project.fundedPercentage}% funded and looking for backers! ${project.description.substring(0, 100)}...`;

  const shareOptions = [
    { 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareDescription)}&url=${encodeURIComponent(shareUrl)}`
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-blue-800 hover:bg-blue-900',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'bg-pink-600 hover:bg-pink-700',
      url: `https://instagram.com` // Instagram doesn't have a direct share URL, but we can include it as a UX enhancement
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${shareTitle}\n\n${shareDescription}\n\nInvest here: ${shareUrl}`
    ).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleShareMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center transition-all duration-300 ${
          compact ? 'p-2 rounded-lg' : 'gap-2 px-4 py-2 rounded-xl font-medium'
        } ${
          theme === 'light'
            ? 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-gray-100'
            : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/15'
        }`}
      >
        <Share2 className={`${compact ? 'w-5 h-5' : 'w-5 h-5'}`} />
        {!compact && <span>Share</span>}
      </motion.button>

      <AnimatePresence>
        {isShareMenuOpen && (
          <>
            {/* Backdrop for closing the menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsShareMenuOpen(false)}
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute z-50 right-0 mt-2 p-4 rounded-xl shadow-xl border ${
                theme === 'light' 
                  ? 'bg-white border-gray-200' 
                  : 'bg-gray-900 border-white/20'
              }`}
              style={{ width: compact ? '220px' : '280px' }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Share Project
                </h3>
                <button
                  onClick={() => setIsShareMenuOpen(false)}
                  className={`p-1 rounded-full ${
                    theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {/* Social Share Options */}
                <div className="flex justify-between mb-2">
                  {shareOptions.map((option) => (
                    <a
                      key={option.name}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full text-white ${option.color} transition-all duration-300 hover:scale-110`}
                      onClick={(e) => {
                        if (option.name === 'Instagram') {
                          e.preventDefault();
                          alert('Instagram sharing typically requires the Instagram app and a photo. Consider taking a screenshot or using the copy link option.');
                        }
                      }}
                    >
                      <option.icon className="w-5 h-5" />
                    </a>
                  ))}
                  <button
                    onClick={copyToClipboard}
                    className={`p-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300 hover:scale-110`}
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Project Preview */}
                <div className={`p-3 rounded-lg text-sm ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={project.poster} 
                      alt={project.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {project.title}
                    </div>
                  </div>
                  <p className={`line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {project.description}
                  </p>
                </div>

                {/* Copy Link Button */}
                <button
                  onClick={copyToClipboard}
                  className={`w-full py-2 mt-1 rounded-lg font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Copy shareable link
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Copied Toast */}
      <AnimatePresence>
        {showCopiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg ${
              theme === 'light'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShareButton;
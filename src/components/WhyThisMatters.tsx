import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, ArrowDownLeft, Users, LucideIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';

interface WhyThisMattersProps {
  onJoin?: () => void;
}

const WhyThisMatters: React.FC<WhyThisMattersProps> = ({ onJoin }) => {
  const { theme } = useTheme();

  const stories: Array<{
    icon: LucideIcon;
    text: string;
    description: string;
    gradient: string;
    highlight?: boolean;
  }> = [
    {
      icon: AlertTriangle,
      text: "Studios said no to bold stories.",
      description: "Risk-averse executives pass on innovative narratives that could change culture.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: ArrowDownLeft,
      text: "Streaming underpays indie artists.",
      description: "Platforms take massive cuts while creators struggle to make ends meet.",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: Users,
      text: "But fans made it go viral.",
      description: "Audiences have the power to turn unknown content into global phenomena.",
      gradient: "from-yellow-500 to-green-500"
    },
    {
      icon: Sparkles,
      text: "We built Circles so belief could turn into ownership.",
      description: "Transform your passion for great content into real stake in its success.",
      gradient: "from-green-500 to-blue-500",
      highlight: true
    }
  ];

  return (
    <section className={`py-24 ${
      theme === 'light' 
        ? 'animated-gradient-light' 
        : 'bg-gradient-to-b from-gray-900 to-black'
    } relative overflow-hidden`}>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className={`text-5xl md:text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-8`}>
            <Typewriter
              text="Why This Matters"
              className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            />
          </h2>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto`}>
            The entertainment industry is at a turning point. Here's the story of how we got here, and where we're going.
          </p>
        </motion.div>

        {/* Story Flow */}
        <div className="space-y-24">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative ${story.highlight ? 'transform scale-110' : ''}`}
            >
              
              {/* Quote Card */}
              <div className={`relative p-12 md:p-16 rounded-3xl backdrop-blur-xl border ${
                theme === 'light'
                  ? 'bg-white/40 border-white/60 shadow-lg'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
              } ${story.highlight ? (theme === 'light' ? 'shadow-xl' : 'border-white/40 shadow-2xl shadow-purple-500/20') : ''}`}>
                
                {/* Quote Icon */}
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${story.gradient} bg-opacity-20 mb-8`}>
                    {React.createElement(story.icon, { className: `w-8 h-8 ${theme === 'light' ? 'text-gray-900' : 'text-white'}` })}
                  </div>

                  {/* Main Quote */}
                  <blockquote className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 ${
                    story.highlight 
                      ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                      : (theme === 'light' ? 'text-gray-900' : 'text-white')
                  }`}>
                    "{story.text}"
                  </blockquote>

                  {/* Description */}
                  <p className={`text-xl md:text-2xl leading-relaxed max-w-4xl ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {story.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                {story.highlight && (
                  <>
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="absolute -top-1 -right-3 w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                    <div className="absolute -bottom-3 -left-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-cyan-500 rounded-full animate-pulse delay-1500"></div>
                  </>
                )}
              </div>

              {/* Connection Line */}
              {index < stories.length - 1 && (
                <div className="flex justify-center py-12">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                    className={`w-1 h-16 bg-gradient-to-b ${story.gradient} opacity-50`}
                    style={{ transformOrigin: 'top' }}
                  />
                </div>
              )}

            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <div className={`inline-flex flex-col items-center gap-6 p-8 rounded-2xl backdrop-blur-xl border ${
            theme === 'light'
              ? 'bg-white/40 border-white/60'
              : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
          }`}>
            <div className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Ready to own the culture you love?</div>
            <button
              onClick={() => {
                try { 
                  navigator.vibrate?.(50); 
                } catch {
                  // Vibration not supported or failed
                }
                onJoin?.();
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <span className="relative z-10 flex items-center gap-2">
                Join the Revolution
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="flex"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyThisMatters;
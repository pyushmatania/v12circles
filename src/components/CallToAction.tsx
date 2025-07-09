import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Film, Music, TrendingUp } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';

interface CallToActionProps {
  setCurrentView?: (view: 'home' | 'dashboard' | 'projects' | 'community') => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ setCurrentView }) => {
  const { theme } = useTheme();

  return (
    <section className={`py-16 md:py-24 relative overflow-hidden ${
      theme === 'light'
        ? 'animated-gradient-light'
        : 'bg-gradient-to-br from-purple-900 via-black to-blue-900'
    }`}>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border font-medium mb-8 ${
              theme === 'light'
                ? 'bg-white/60 border-purple-300/60 text-purple-700'
                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Ready to back the next blockbuster?
          </motion.div>

          <h2 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <Typewriter
              text="Own the stories you love"
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            />
          </h2>

          <p className={`text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Join thousands of fans who are already shaping the future of entertainment. 
            From passive viewer to co-producer—in one click.
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <motion.button
              onClick={() => setCurrentView?.('projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold text-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Investing
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button Animation Effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
              />
            </motion.button>

            <motion.button
              onClick={() => setCurrentView?.('projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center gap-3 px-8 py-4 border rounded-full font-semibold text-xl backdrop-blur-md transition-all duration-300 ${
                theme === 'light'
                  ? 'border-gray-300 text-gray-700 bg-white/60 hover:bg-white/80'
                  : 'border-white/20 text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              See What's Trending
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {/* Film Projects */}
          <div className={`group relative p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
            theme === 'light'
              ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20 hover:border-purple-500/40'
          }`}>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Film className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Film Projects</h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Back the next blockbuster</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>8 Active Projects</span>
                  <span className="text-purple-400 font-semibold">₹2.5Cr+ Raised</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Min. Investment</span>
                  <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹10,000</span>
                </div>
              </div>
              <button 
                onClick={() => setCurrentView?.('projects')}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group-hover:scale-105"
              >
                Browse Films
              </button>
            </div>
          </div>

          {/* Music Projects */}
          <div className={`group relative p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
            theme === 'light'
              ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 hover:border-blue-500/40'
          }`}>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Music className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Music Projects</h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Fund breakthrough artists</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>4 Active Albums</span>
                  <span className="text-blue-400 font-semibold">₹85L+ Raised</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Min. Investment</span>
                  <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹5,000</span>
                </div>
              </div>
              <button 
                onClick={() => setCurrentView?.('projects')}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 group-hover:scale-105"
              >
                Browse Music
              </button>
            </div>
          </div>
        </motion.div>

        {/* Final Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className={`max-w-4xl mx-auto p-8 rounded-2xl backdrop-blur-xl border ${
            theme === 'light'
              ? 'bg-white/40 border-white/60'
              : 'bg-gradient-to-r from-white/5 to-white/10 border-white/20'
          }`}>
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </motion.div>
            </div>
            
            <h3 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Don't just{' '}
              <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                consume
              </span>{' '}
              culture.
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Create
              </span>{' '}
              it.
            </h3>
            
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Every great story started with someone who believed in it. 
              Be that someone. Be part of the next cultural phenomenon.
            </p>

            <div className={`flex flex-wrap justify-center gap-4 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <span>✓ No crypto knowledge required</span>
              <span>✓ Start with just ₹10K</span>
              <span>✓ Real ownership, real returns</span>
              <span>✓ Join 1,200+ investors</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CallToAction;
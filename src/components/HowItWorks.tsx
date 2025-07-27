import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, TrendingUp, Users, Shield, Award } from 'lucide-react';
import { useTheme } from './ThemeContext';
import DecryptedText from './TextAnimations/DecryptedText/DecryptedText';

type ViewType = 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search';

interface HowItWorksProps {
  setCurrentView?: (view: ViewType) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ setCurrentView }) => {
  const { theme } = useTheme();
  const [coinDrop, setCoinDrop] = useState(false);

  const steps = [
    {
      icon: Search,
      title: "Discover Projects",
      description: "Browse curated films and music projects from emerging and established creators",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: CreditCard,
      title: "Invest Securely",
      description: "Start with as little as ₹5,000. Your investment is protected by blockchain technology",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Earn Returns",
      description: "Get a share of profits, exclusive perks, and early access to content",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a community of creators and investors shaping entertainment"
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Blockchain-backed investments with full transparency"
    },
    {
      icon: Award,
      title: "Exclusive Perks",
      description: "Get credits, merchandise, and behind-the-scenes access"
    }
  ];

  // Coin SVG (simple, gold)
  const Coin = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#FFD700" stroke="#F59E42" strokeWidth="4" />
      <circle cx="24" cy="24" r="14" fill="#FFF7CC" stroke="#F59E42" strokeWidth="3" />
      <text x="24" y="31" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#F59E42">₹</text>
    </svg>
  );

  return (
    <section className={`py-24 ${
      theme === 'light' 
        ? 'animated-gradient-light' 
        : 'bg-gradient-to-br from-gray-900 via-black to-purple-900'
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
          <h2 className={`text-5xl md:text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
            <DecryptedText
              text="How It Works"
              className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              animateOn="view"
              speed={120}
            />
          </h2>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto`}>
            Three simple steps to start investing in the entertainment you love
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`relative p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/40'
              }`}>
                
                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${step.color}`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {index + 1}
                    </div>
                  </div>

                  <h3 className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-4`}>
                    <DecryptedText
                      text={step.title}
                      className={theme === 'light' ? 'text-gray-900' : 'text-white'}
                      animateOn="view"
                      speed={80}
                    />
                  </h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} leading-relaxed`}>
                    <DecryptedText
                      text={step.description}
                      className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
                      animateOn="view"
                      speed={100}
                    />
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform -translate-y-1/2 z-20">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className={`text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-12`}>
            Why Choose{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group p-6 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white/40 border-white/60 hover:shadow-lg'
                    : 'bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-xl font-semibold mb-3`}>
                    {benefit.title}
                  </h4>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-sm leading-relaxed`}>
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className={`max-w-2xl mx-auto p-8 rounded-2xl backdrop-blur-xl border ${
            theme === 'light'
              ? 'bg-white/40 border-white/60'
              : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20'
          }`}>
            <h4 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
              Ready to Get Started?
            </h4>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-8`}>
              Join thousands of investors who are already backing the next generation of entertainment
            </p>
            <motion.button
              onClick={() => {
                setCoinDrop(true);
                setTimeout(() => {
                  setCoinDrop(false);
                  setCurrentView?.('projects');
                }, 1100);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden"
            >
              {/* Coin drop animation */}
              <motion.div
                initial={false}
                animate={coinDrop
                  ? {
                      y: [ -120, 0, -20, 0, 6, 0 ],
                      scale: [1.2, 1, 1.15, 1, 1.05, 1],
                      rotate: [0, 0, 12, -8, 0, 0],
                      opacity: [1, 1, 1, 1, 1, 0]
                    }
                  : { y: -120, opacity: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 1.1, times: [0, 0.5, 0.7, 0.85, 0.95, 1], ease: [0.4, 0.8, 0.2, 1] }}
                style={{ position: 'absolute', left: '50%', top: '-3.5rem', zIndex: 20, transform: 'translateX(-50%)', pointerEvents: 'none' }}
              >
                <Coin />
              </motion.div>
              <span>Start Investing Today</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
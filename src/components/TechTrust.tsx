import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Handshake, Building2, Lock, TrendingUp, MapPin } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';

const TechTrust: React.FC = () => {
  const { theme } = useTheme();

  const trustFactors = [
    {
      icon: Building2,
      title: "SEBI Registered",
      description: "Fully compliant with Indian securities regulations",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Lock,
      title: "Blockchain Secured",
      description: "Transparent and immutable investment records",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "40K+ Investors",
      description: "Growing community of entertainment enthusiasts",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Global Reach",
      description: "Investors from 15+ countries worldwide",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const achievements = [
    "₹30Cr+ Successfully Raised",
    "87% Project Success Rate",
    "230% Average Returns",
    "24/7 Customer Support"
  ];

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
          <h2 className={`text-5xl md:text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-8 flex items-center justify-center gap-3`}>
            <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
              <Handshake className="w-10 h-10 inline-block align-middle" />
            </span>
            <Typewriter
              text="Trusted by Thousands"
              className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            />
          </h2>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto`}>
            Join a secure, regulated platform backed by cutting-edge technology and trusted by investors worldwide.
          </p>
        </motion.div>

        {/* Trust Factors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {trustFactors.map((factor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/40'
              }`}
            >
              <div className="relative z-10 text-center">
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${factor.color} bg-opacity-20 mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <factor.icon className={`w-8 h-8 text-white`} />
                </motion.div>
                
                <h3 className={`text-xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {factor.title}
                </h3>
                <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {factor.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`p-8 rounded-2xl backdrop-blur-xl border ${
            theme === 'light'
              ? 'bg-white/40 border-white/60'
              : 'bg-gradient-to-r from-white/5 to-white/10 border-white/20'
          }`}
        >
          <div className="text-center mb-8">
            <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
              Platform{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Achievements
              </span>
            </h3>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Real numbers that showcase our commitment to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10"
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {achievement}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: star * 0.1, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
            4.9/5 Average Rating
          </p>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Based on 1,200+ investor reviews
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default TechTrust;
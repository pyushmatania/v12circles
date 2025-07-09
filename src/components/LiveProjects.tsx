import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Music, Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimatedNumber from './AnimatedNumber';
import { projects } from '../data/projects';
import ProjectDetailModal from './ProjectDetailModal';
import { Project } from '../types';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';
import useIsMobile from '../hooks/useIsMobile';


interface LiveProjectsProps {
  onViewAll?: () => void;
  onTrackInvestment?: () => void;
  onProjectSelect?: (project: Project, tab?: 'overview' | 'invest') => void;
}

const LiveProjects: React.FC<LiveProjectsProps> = ({ onViewAll, onTrackInvestment, onProjectSelect }) => {

  const { theme } = useTheme();
  const [statsInView, setStatsInView] = useState<{ [key: number]: boolean }>({});
  const sorted = [...projects].sort((a, b) => b.raisedAmount - a.raisedAmount);
  const isMobile = useIsMobile();
  const visibleProjects = isMobile ? sorted.slice(0, 3) : sorted.slice(0, 6);

  const handleProjectClick = (project: Project, tab: 'overview' | 'invest' = 'overview') => {
    if (onProjectSelect) {
      onProjectSelect(project, tab);
    }
  };

  const handleInvestClick = (project: Project) => {
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    handleProjectClick(project, 'invest');
  };



  return (
    <section className={`py-24 ${
      theme === 'light' 
        ? 'animated-gradient-light' 
        : 'bg-gradient-to-b from-black to-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl md:text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-8`}>
            <Typewriter
              text="Live Projects"
              className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
            />
          </h2>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto`}>
            Back the next blockbuster today. These projects are actively raising funds from fans like you.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-purple-500/20'
              }`}
            >
              {/* Background Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.poster.replace('SX300', 'SX1080')} 
                  alt={project.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 bg-black"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md ${
                    project.type === 'film' 
                      ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300' 
                      : 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                  }`}>
                    {project.type === 'film' ? (
                      <Film className="w-4 h-4" />
                    ) : (
                      <Music className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium uppercase">{project.type}</span>
                  </div>
                </div>

                {/* Time Left */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md bg-orange-500/20 border border-orange-500/30 text-orange-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{project.timeLeft}</span>
                  </div>
                </div>

                {/* Project Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                  <p className="text-gray-400 text-sm">
                    by {project.director || project.artist} • {project.genre}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        theme === 'light'
                          ? 'bg-white/60 text-gray-700 border-gray-300'
                          : 'bg-white/10 text-gray-300 border-white/20'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Funding Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Progress</span>
                    <span className={`text-sm font-bold ${
                      project.fundedPercentage >= 75 ? 'text-green-400' : 
                      project.fundedPercentage >= 50 ? 'text-yellow-400' : 'text-gray-300'
                    }`}>
                      {project.fundedPercentage}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-3 overflow-hidden ${
                    theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                  }`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.fundedPercentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`h-full rounded-full ${
                        project.type === 'film'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Funding Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Raised</span>
                    <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      ₹{(project.raisedAmount / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Target</span>
                    <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      ₹{(project.targetAmount / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>

                {/* Perks Preview */}
                <div className="mb-6">
                  <div className={`text-xs mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>INVESTOR PERKS</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{project.perks.slice(0, 2).join(', ')}</span>
                    {project.perks.length > 2 && (
                      <span className="text-purple-400">+{project.perks.length - 2} more</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleInvestClick(project)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 group ${
                    project.type === 'film'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                  } hover:scale-105 hover:shadow-lg`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Invest Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 p-8 rounded-2xl backdrop-blur-xl border ${
            theme === 'light'
              ? 'bg-white/40 border-white/60'
              : 'bg-gradient-to-r from-white/5 to-white/10 border-white/20'
          }`}
          onViewportEnter={() => setStatsInView({ 0: true, 1: true, 2: true, 3: true })}
        >
          <div className="text-center">
            <div className={`text-4xl font-extrabold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <AnimatedNumber value={47} format={(v)=>`₹${v}L+`} inView={!!statsInView[0]} />
            </div>
            <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total Raised</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-extrabold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}> 
              <AnimatedNumber value={12} inView={!!statsInView[1]} />
            </div>
            <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Active Projects</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-extrabold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}> 
              <AnimatedNumber value={1200} format={(v)=>`${v.toLocaleString()}+`} inView={!!statsInView[2]} />
            </div>
            <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Investors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-green-400 mb-2">
              <AnimatedNumber value={15} format={(v)=>`${v}%`} inView={!!statsInView[3]} />
            </div>
            <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Avg. Returns</div>
          </div>
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => {
              if (onViewAll) {
                onViewAll();
              } else {
                window.location.href = '/projects';
              }
            }}
            className={`group relative px-8 py-4 border rounded-full font-semibold text-lg backdrop-blur-md transition-all duration-300 hover:scale-105 ${
              theme === 'light'
                ? 'border-gray-300 text-gray-700 bg-white/60 hover:bg-white/80'
                : 'border-white/20 text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-2">
              View All Projects
              <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </span>
          </button>
        </motion.div>

      </div>


    </section>
  );
};

export default LiveProjects;
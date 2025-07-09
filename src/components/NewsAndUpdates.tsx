import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar, 
  ChevronDown, 
  Clock, 
  Newspaper, 
  Search, 
  ThumbsUp, 
  TrendingUp, 
  Film, 
  Music, 
  Tv, 
  User, 
  Bookmark, 
  ExternalLink 
} from 'lucide-react';
import { useTheme } from './ThemeContext';

// Mock news data
const newsData = [
  {
    id: '1',
    title: 'Shah Rukh Khan\'s "Pathaan 2" Breaks Funding Records on Circles',
    summary: 'The upcoming sequel to the blockbuster hit has raised ₹12.75 crores from fans in just 3 days, becoming the fastest-funded project on the platform.',
    category: 'Film',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '2 days ago',
    author: 'Priya Sharma',
    readTime: '4 min read',
    likes: 243,
    trending: true
  },
  {
    id: '2',
    title: 'A.R. Rahman\'s New Symphony Project Exceeds Funding Goal by 200%',
    summary: 'The maestro\'s innovative approach to funding his next album through fan investments has proven highly successful, with backers from 15+ countries.',
    category: 'Music',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '1 week ago',
    author: 'Rahul Krishnan',
    readTime: '5 min read',
    likes: 189,
    trending: true
  },
  {
    id: '3',
    title: 'Investor Interview: How I Earned 25% Returns on Regional Cinema',
    summary: 'Meet Arjun Reddy, who has turned his passion for South Indian cinema into a profitable investment portfolio through the Circles platform.',
    category: 'Investors',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '2 weeks ago',
    author: 'Kavya Nair',
    readTime: '8 min read',
    likes: 156,
    trending: false
  },
  {
    id: '4',
    title: 'Netflix Partners with Circles for Exclusive Web Series Funding',
    summary: 'The streaming giant announces a first-of-its-kind partnership that will allow fans to invest in upcoming Indian original series and share in their success.',
    category: 'Web Series',
    image: 'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '3 weeks ago',
    author: 'Dev Malhotra',
    readTime: '6 min read',
    likes: 312,
    trending: true
  },
  {
    id: '5',
    title: 'SEBI Introduces New Regulations for Entertainment Investments',
    summary: 'The regulatory body has announced updated guidelines that provide greater protection and transparency for retail investors in film and music projects.',
    category: 'Regulations',
    image: 'https://images.pexels.com/photos/4792/building-home-house-architecture.jpg?auto=compress&cs=tinysrgb&w=400',
    date: '1 month ago',
    author: 'Anjali Desai',
    readTime: '7 min read',
    likes: 98,
    trending: false
  },
  {
    id: '6',
    title: 'Blockchain Technology: The Future of Entertainment Investment',
    summary: 'How Circles is using blockchain to ensure transparent profit sharing and secure investor rights in the entertainment industry.',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '1 month ago',
    author: 'Vikram Singh',
    readTime: '9 min read',
    likes: 145,
    trending: false
  },
  {
    id: '7',
    title: 'Regional Cinema Investments Outperform Bollywood in Q2 2024',
    summary: 'Investment data reveals that regional language films are delivering higher returns than mainstream Bollywood projects this quarter.',
    category: 'Market Trends',
    image: 'https://images.pexels.com/photos/7234263/pexels-photo-7234263.jpeg?auto=compress&cs=tinysrgb&w=400',
    date: '1 month ago',
    author: 'Shreya Patel',
    readTime: '5 min read',
    likes: 87,
    trending: false
  }
];

// Mock industry updates
const industryUpdates = [
  {
    id: '1',
    title: 'Bollywood Box Office Records Strong Recovery Post-Pandemic',
    source: 'Business Insider',
    date: 'Yesterday'
  },
  {
    id: '2',
    title: 'OTT Platforms Invest ₹12,000 Crore in Indian Original Content',
    source: 'Economic Times',
    date: '3 days ago'
  },
  {
    id: '3',
    title: 'Film City Expansion to Boost Production Capacity by 40%',
    source: 'Variety India',
    date: '1 week ago'
  }
];

type NewsAndUpdatesProps = object;

const NewsAndUpdates: React.FC<NewsAndUpdatesProps> = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  const handleSaveArticle = (id: string) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter(articleId => articleId !== id));
    } else {
      setSavedArticles([...savedArticles, id]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'film': return <Film className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'web series': return <Tv className="w-4 h-4" />;
      case 'investors': return <User className="w-4 h-4" />;
      case 'market trends': return <TrendingUp className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'film': 
        return theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400';
      case 'music': 
        return theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400';
      case 'web series': 
        return theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400';
      case 'market trends': 
        return theme === 'light' ? 'bg-orange-100 text-orange-700' : 'bg-orange-900/30 text-orange-400';
      case 'investors': 
        return theme === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900/30 text-indigo-400';
      case 'regulations': 
        return theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-900/30 text-red-400';
      case 'technology': 
        return theme === 'light' ? 'bg-teal-100 text-teal-700' : 'bg-teal-900/30 text-teal-400';
      default: 
        return theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-gray-300';
    }
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(newsData.map(item => item.category.toLowerCase())))];

  // Filter news based on active category and search term
  const filteredNews = newsData.filter(news => {
    const matchesCategory = activeCategory === 'all' || news.category.toLowerCase() === activeCategory;
    const matchesSearch = searchTerm === '' || 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen pt-20 pb-[100px] transition-all duration-[3000ms] ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 to-white'
        : 'bg-gradient-to-br from-black via-gray-900 to-purple-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
            News & Updates
          </h1>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Stay informed with the latest entertainment industry trends and Circles updates
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search news and updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-purple-500 bg-white/50 text-gray-900'
                  : 'border-gray-600 focus:border-purple-500 bg-gray-800/50 text-white'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            />
          </div>
          
          <div className={`relative inline-block min-w-48 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl border ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-purple-500 bg-white/50 text-gray-900'
                  : 'border-gray-600 focus:border-purple-500 bg-gray-800/50 text-white'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Feed */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            {filteredNews.filter(news => news.trending).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Trending News
                  </span>
                </h2>
                
                {filteredNews.filter(news => news.trending)[0] && (
                  <div className={`group relative overflow-hidden rounded-2xl border ${
                    theme === 'light'
                      ? 'bg-white/60 border-gray-200 shadow-lg'
                      : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                  }`}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/2 h-64 md:h-auto relative">
                        <img 
                          src={filteredNews.filter(news => news.trending)[0].image} 
                          alt={filteredNews.filter(news => news.trending)[0].title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            getCategoryColor(filteredNews.filter(news => news.trending)[0].category)
                          }`}>
                            {getCategoryIcon(filteredNews.filter(news => news.trending)[0].category)}
                            <span>{filteredNews.filter(news => news.trending)[0].category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 md:w-1/2 flex flex-col">
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {filteredNews.filter(news => news.trending)[0].title}
                        </h3>
                        <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                          {filteredNews.filter(news => news.trending)[0].summary}
                        </p>
                        <div className="flex items-center gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                              {filteredNews.filter(news => news.trending)[0].date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                              {filteredNews.filter(news => news.trending)[0].readTime}
                            </span>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-500/20">
                                <User className="w-full h-full p-1.5 text-purple-400" />
                              </div>
                              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {filteredNews.filter(news => news.trending)[0].author}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleSaveArticle(filteredNews.filter(news => news.trending)[0].id)}
                                className={`p-2 rounded-full transition-colors ${
                                  savedArticles.includes(filteredNews.filter(news => news.trending)[0].id)
                                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                                    : (theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800')
                                }`}
                              >
                                <Bookmark className="w-5 h-5" />
                              </button>
                              <button className={`p-2 rounded-full transition-colors ${
                                theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'
                              }`}>
                                <ThumbsUp className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* News Grid */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                <span className="flex items-center gap-2">
                  <Newspaper className="w-6 h-6" />
                  Latest News
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews
                  .filter(news => !news.trending || (activeCategory !== 'all' || searchTerm !== ''))
                  .map((news, index) => (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`group rounded-xl border overflow-hidden ${
                        theme === 'light'
                          ? 'bg-white/60 border-gray-200 shadow-md'
                          : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                      }`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(news.category)}`}>
                            {getCategoryIcon(news.category)}
                            <span>{news.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className={`text-xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {news.title}
                        </h3>
                        <p className={`mb-4 line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                          {news.summary}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-500/20">
                              <User className="w-full h-full p-1 text-purple-400" />
                            </div>
                            <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                              {news.author}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                              {news.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <button className={`flex items-center gap-2 text-sm ${
                            theme === 'light' ? 'text-purple-600 hover:text-purple-700' : 'text-purple-400 hover:text-purple-300'
                          } transition-colors`}>
                            <span>Read full article</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleSaveArticle(news.id)}
                              className={`p-1 rounded-full transition-colors ${
                                savedArticles.includes(news.id)
                                  ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                                  : (theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800')
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                              <span className="text-sm">{news.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
              
              {/* No Results */}
              {filteredNews.length === 0 && (
                <div className={`p-12 rounded-xl border text-center ${
                  theme === 'light'
                    ? 'bg-white/60 border-gray-200'
                    : 'bg-gradient-to-br from-white/5 to-white/2 border-white/10'
                }`}>
                  <div className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    No articles found
                  </h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Try adjusting your search or filters to find what you're looking for
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Industry Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-xl border ${
                theme === 'light'
                  ? 'bg-white/60 border-gray-200 shadow-md'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
              }`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Industry Updates
                </h3>
              </div>
              <div className="p-6 space-y-5">
                {industryUpdates.map((update) => (
                  <div key={update.id}>
                    <h4 className={`font-medium mb-2 line-clamp-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {update.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {update.source}
                      </span>
                      <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {update.date}
                      </span>
                    </div>
                  </div>
                ))}
                <button className={`flex items-center gap-2 text-sm font-medium mt-4 ${
                  theme === 'light' ? 'text-purple-600 hover:text-purple-700' : 'text-purple-400 hover:text-purple-300'
                } transition-colors`}>
                  <span>View all industry updates</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Saved Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`rounded-xl border ${
                theme === 'light'
                  ? 'bg-white/60 border-gray-200 shadow-md'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
              }`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Saved Articles
                </h3>
              </div>
              <div className="p-6">
                {savedArticles.length > 0 ? (
                  <div className="space-y-4">
                    {savedArticles.map((id) => {
                      const article = newsData.find(news => news.id === id);
                      if (!article) return null;
                      return (
                        <div key={id} className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className={`font-medium text-sm mb-1 line-clamp-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleSaveArticle(id)}
                                className={`p-1 rounded-full transition-colors ${
                                  theme === 'light' ? 'text-purple-600 hover:bg-purple-100' : 'text-purple-400 hover:bg-purple-900/30'
                                }`}
                              >
                                <Bookmark className="w-3 h-3 fill-current" />
                              </button>
                              <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                                Saved {article.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <button className={`flex items-center gap-2 text-sm font-medium mt-4 ${
                      theme === 'light' ? 'text-purple-600 hover:text-purple-700' : 'text-purple-400 hover:text-purple-300'
                    } transition-colors`}>
                      <span>Manage saved articles</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Bookmark className={`w-12 h-12 mx-auto mb-3 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`} />
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
                      No saved articles yet
                    </p>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                      Click the bookmark icon on any article to save it for later
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* External Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`rounded-xl border ${
                theme === 'light'
                  ? 'bg-white/60 border-gray-200 shadow-md'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
              }`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  External Resources
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: 'SEBI Investment Guidelines', url: 'https://www.sebi.gov.in' },
                  { name: 'Film Industry Market Report', url: 'https://www.ficci.in' },
                  { name: 'Music Streaming Statistics', url: 'https://www.statista.com' }
                ].map((resource, index) => (
                  <a 
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <span>{resource.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsAndUpdates;
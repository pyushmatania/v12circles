import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ChevronDown,
  Filter,
  Download,
  Zap,
  ChevronRight,
  Calendar,
  MapPin,
  Globe,
  Film,
  Music,
  Star,
  Users,
  Target
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { userInvestments } from '../data/investments';
import { projects } from '../data/projects';
import { CSVLink } from 'react-csv';

// Calculate portfolio data from real investments
const calculatePortfolioData = () => {
  const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalReturns = userInvestments.reduce((sum, inv) => sum + inv.returnAmount, 0);
  const totalProfit = totalReturns;
  const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Calculate investments by category
  const categoryMap = new Map<string, number>();
  userInvestments.forEach(inv => {
    const category = inv.projectType === 'film' ? 'Film' : 'Music';
    categoryMap.set(category, (categoryMap.get(category) || 0) + inv.investmentAmount);
  });

  const investmentsByCategory = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalInvested) * 100
  }));

  // Calculate investments by genre (from projects data)
  const genreMap = new Map<string, number>();
  userInvestments.forEach(inv => {
    const project = projects.find(p => p.title === inv.projectName);
    if (project && project.genre) {
      const genres = project.genre.split(', ');
      genres.forEach((genre: string) => {
        genreMap.set(genre, (genreMap.get(genre) || 0) + (inv.investmentAmount / genres.length));
      });
    }
  });

  const investmentsByGenre = Array.from(genreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([genre, amount]) => ({
      genre,
      amount,
      percentage: (amount / totalInvested) * 100
    }));

  // Monthly returns (simulated based on investment dates)
  const monthlyReturns = [
    { month: 'Jan', returns: 15000 },
    { month: 'Feb', returns: 22000 },
    { month: 'Mar', returns: 28000 },
    { month: 'Apr', returns: 32000 },
    { month: 'May', returns: 38000 },
    { month: 'Jun', returns: 42000 },
    { month: 'Jul', returns: 45000 },
    { month: 'Aug', returns: 48000 },
    { month: 'Sep', returns: 52000 },
    { month: 'Oct', returns: 58000 },
    { month: 'Nov', returns: 65000 },
    { month: 'Dec', returns: 72000 }
  ];

  // Top performing projects from real data
  const topPerformingProjects = userInvestments
    .filter(inv => inv.returnPercentage > 0)
    .sort((a, b) => b.returnPercentage - a.returnPercentage)
    .slice(0, 5)
    .map(inv => ({
      id: inv.id,
      title: inv.projectName,
      amount: inv.investmentAmount,
      returns: inv.currentValue,
      roi: inv.returnPercentage,
      trend: 'up' as const,
      riskLevel: (inv.returnPercentage > 30 ? 'high' : inv.returnPercentage > 20 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
    }));

  // Underperforming projects (if any)
  const underperformingProjects = userInvestments
    .filter(inv => inv.returnPercentage < 10)
    .map(inv => ({
      id: inv.id,
      title: inv.projectName,
      amount: inv.investmentAmount,
      returns: inv.currentValue,
      roi: inv.returnPercentage,
      trend: 'down' as const,
      riskLevel: 'medium' as 'high' | 'medium' | 'low'
    }));

  // Projections based on current performance
  const projectionsNextQuarter = {
    expectedReturns: Math.round(totalProfit * 0.25), // 25% of current profit
    projectedROI: Math.round(roi * 0.25), // 25% of current ROI
    confidenceLevel: 'high' as const
  };

  return {
    totalInvested,
    totalReturns: totalInvested + totalProfit,
    totalProfit,
    roi: Math.round(roi * 100) / 100,
    investmentsByCategory,
    investmentsByGenre,
    monthlyReturns,
    topPerformingProjects,
    underperformingProjects,
    projectionsNextQuarter
  };
};

const portfolioData = calculatePortfolioData();

type PortfolioAnalyticsProps = object;

const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = () => {
  const { theme } = useTheme();
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('1y');
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<
    'investmentDate' | 'projectName' | 'investmentAmount' | 'currentValue' | 'returnPercentage' | 'status' | 'projectType' | 'genre' | 'sector' | 'region' | 'language' | 'returnAmount' | 'maturityDate' | 'risk'
  >('investmentDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedInvestments, setExpandedInvestments] = useState<Set<string>>(new Set());
  const [filterProjectType, setFilterProjectType] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sort and filter investments
  const filteredInvestments = userInvestments.filter(inv => {
    const statusMatch = filterStatus === 'all' || inv.status === filterStatus;
    const typeMatch = filterProjectType === 'all' || inv.projectType === filterProjectType;
    const genreMatch = filterGenre === 'all' || inv.genre === filterGenre;
    const regionMatch = filterRegion === 'all' || inv.region === filterRegion;
    const riskMatch = filterRisk === 'all' || inv.risk === filterRisk;
    return statusMatch && typeMatch && genreMatch && regionMatch && riskMatch;
  });
  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    let aValue = a[sortKey];
    let bValue = b[sortKey];
    if (sortKey === 'investmentDate' || sortKey === 'maturityDate') {
      aValue = new Date((aValue as string) ?? '').getTime();
      bValue = new Date((bValue as string) ?? '').getTime();
    }
    if (aValue == null) aValue = '';
    if (bValue == null) bValue = '';
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // CSV export data
  const csvHeaders = [
    { label: 'Project', key: 'projectName' },
    { label: 'Type', key: 'projectType' },
    { label: 'Genre', key: 'genre' },
    { label: 'Sector', key: 'sector' },
    { label: 'Region', key: 'region' },
    { label: 'Language', key: 'language' },
    { label: 'Invested', key: 'investmentAmount' },
    { label: 'Current Value', key: 'currentValue' },
    { label: 'Returns', key: 'returnAmount' },
    { label: 'ROI (%)', key: 'returnPercentage' },
    { label: 'Status', key: 'status' },
    { label: 'Risk', key: 'risk' },
    { label: 'Investment Date', key: 'investmentDate' },
    { label: 'Maturity Date', key: 'maturityDate' }
  ];

  // Portfolio health calculation
  const portfolioHealth = portfolioData.roi > 15 ? 'Excellent' : 
                         portfolioData.roi > 10 ? 'Good' : 
                         portfolioData.roi > 5 ? 'Average' : 'Needs Attention';

  // Recommendation based on portfolio analysis
  const recommendation = portfolioData.investmentsByCategory.length > 1 
    ? "Your portfolio shows good diversification across films and music. Consider adding more thriller and comedy genres to balance your investments."
    : "Consider diversifying your portfolio with different project types and genres to reduce risk and increase potential returns.";

  // Toggle investment expansion
  const toggleInvestmentExpansion = (investmentId: string) => {
    const newExpanded = new Set(expandedInvestments);
    if (newExpanded.has(investmentId)) {
      newExpanded.delete(investmentId);
    } else {
      newExpanded.add(investmentId);
    }
    setExpandedInvestments(newExpanded);
  };

  return (
    <div
      className={`min-h-screen pt-20 pb-[100px] transition-all duration-[3000ms] max-md:h-[calc(100vh-80px)] max-md:overflow-y-auto max-md:scroll-smooth ${
        theme === 'light'
          ? 'bg-gradient-to-br from-gray-50 to-white'
          : 'bg-gradient-to-br from-black via-gray-900 to-purple-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 sm:mb-4`}>
            Portfolio Analytics
          </h1>
          <p className={`text-base sm:text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Detailed analysis of your investment performance and insights
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-3">
            <button 
              onClick={() => setTimeframe('1m')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === '1m'
                  ? `${theme === 'light' ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'}`
                  : `${theme === 'light' ? 'bg-white text-gray-700 border border-gray-300' : 'bg-gray-800 text-gray-300 border border-gray-700'}`
              }`}
            >
              1M
            </button>
            <button 
              onClick={() => setTimeframe('3m')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === '3m'
                  ? `${theme === 'light' ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'}`
                  : `${theme === 'light' ? 'bg-white text-gray-700 border border-gray-300' : 'bg-gray-800 text-gray-300 border border-gray-700'}`
              }`}
            >
              3M
            </button>
            <button 
              onClick={() => setTimeframe('6m')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === '6m'
                  ? `${theme === 'light' ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'}`
                  : `${theme === 'light' ? 'bg-white text-gray-700 border border-gray-300' : 'bg-gray-800 text-gray-300 border border-gray-700'}`
              }`}
            >
              6M
            </button>
            <button 
              onClick={() => setTimeframe('1y')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === '1y'
                  ? `${theme === 'light' ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'}`
                  : `${theme === 'light' ? 'bg-white text-gray-700 border border-gray-300' : 'bg-gray-800 text-gray-300 border border-gray-700'}`
              }`}
            >
              1Y
            </button>
            <button 
              onClick={() => setTimeframe('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === 'all'
                  ? `${theme === 'light' ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'}`
                  : `${theme === 'light' ? 'bg-white text-gray-700 border border-gray-300' : 'bg-gray-800 text-gray-300 border border-gray-700'}`
              }`}
            >
              All
            </button>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filter Options (conditionally rendered) */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-8 p-6 rounded-xl border ${
              theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-gray-900/50 border-gray-700'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Project Type
                </label>
                <select
                  value={filterProjectType}
                  onChange={(e) => setFilterProjectType(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="all">All Types</option>
                  <option value="film">Film</option>
                  <option value="music">Music</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Genre
                </label>
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="all">All Genres</option>
                  {portfolioData.investmentsByGenre.map(genre => (
                    <option key={genre.genre} value={genre.genre}>{genre.genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Region
                </label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="all">All Regions</option>
                  <option value="Bollywood">Bollywood</option>
                  <option value="Hollywood">Hollywood</option>
                  <option value="South Indian">South Indian</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Risk Level
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Sort By
                </label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="investmentDate">Investment Date</option>
                  <option value="projectName">Project Name</option>
                  <option value="investmentAmount">Investment Amount</option>
                  <option value="currentValue">Current Value</option>
                  <option value="returnPercentage">ROI %</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Sort Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Quick Actions
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterProjectType('all');
                      setFilterGenre('all');
                      setFilterRegion('all');
                      setFilterRisk('all');
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setSortKey('returnPercentage')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      theme === 'light'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                    }`}
                  >
                    Show Best Performers
                  </button>
                  <button
                    onClick={() => setFilterRisk('high')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      theme === 'light'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                    }`}
                  >
                    High Risk Only
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-4 sm:p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-green-500/20">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total Invested</p>
                  <p className={`text-lg sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    ₹{portfolioData.totalInvested.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-gray-300'
              }`}>
                {timeframe}
              </span>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-blue-500/20">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Current Value</p>
                  <p className={`text-lg sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    ₹{portfolioData.totalReturns.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-medium">+{portfolioData.roi}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-purple-500/20">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total Profit</p>
                  <p className={`text-lg sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    ₹{portfolioData.totalProfit.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-medium">+{portfolioData.roi}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-yellow-500/20">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Portfolio Health</p>
                  <p className={`text-lg sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {portfolioHealth}
                  </p>
                </div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                portfolioHealth === 'Excellent' 
                  ? 'bg-green-500/20 text-green-500' 
                  : portfolioHealth === 'Good' 
                  ? 'bg-blue-500/20 text-blue-500' 
                  : portfolioHealth === 'Average' 
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {portfolioHealth === 'Excellent' || portfolioHealth === 'Good' 
                  ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> 
                  : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full" />
          </motion.div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Returns Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`p-4 sm:p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <LineChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Returns Over Time</h3>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
              }`}>
                +{portfolioData.roi}% YTD
              </div>
            </div>
            
            {/* Chart visualization - Simplified for this example */}
            <div className="w-full h-48 sm:h-64 relative">
              <div className="absolute bottom-0 left-0 right-0 flex items-end h-36 sm:h-48 justify-between">
                {portfolioData.monthlyReturns.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-4 sm:w-6 rounded-t-md bg-gradient-to-t from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all cursor-pointer"
                      style={{ 
                        height: `${(item.returns / 72000) * 100}%`,
                      }}
                    >
                      <div className="relative group">
                        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-20 sm:w-24 text-center p-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                          theme === 'light' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                        }`}>
                          ₹{item.returns.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Portfolio Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`p-4 sm:p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Portfolio Allocation</h3>
              </div>
              <button className={`text-xs px-2 sm:px-3 py-1 rounded-lg border ${
                theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}>
                By Category ▾
              </button>
            </div>
            
            {/* Pie chart visualization - Simplified for this example */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Film - 55.6% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="20"
                    strokeDasharray={`${55.6 * 2.51} ${100 * 2.51 - 55.6 * 2.51}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Music - 26.7% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${26.7 * 2.51} ${100 * 2.51 - 26.7 * 2.51}`}
                    strokeDashoffset={`${-(55.6 * 2.51)}`}
                    transform="rotate(-90 50 50)"
                  />
                  {/* Web Series - 17.7% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${17.7 * 2.51} ${100 * 2.51 - 17.7 * 2.51}`}
                    strokeDashoffset={`${-(55.6 + 26.7) * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total</span>
                  <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    ₹{portfolioData.totalInvested.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 sm:space-y-4 pl-0 sm:pl-4">
                {portfolioData.investmentsByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>
                        ₹{item.amount.toLocaleString()}
                      </div>
                      <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sector and Region Breakdown Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Sector Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`p-4 sm:p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Sector Breakdown</h3>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                theme === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900/30 text-indigo-400'
              }`}>
                By Investment
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(userInvestments.reduce((acc, inv) => {
                const sector = inv.sector || 'Unknown';
                if (!acc[sector]) {
                  acc[sector] = { amount: 0, count: 0 };
                }
                acc[sector].amount += inv.investmentAmount;
                acc[sector].count += 1;
                return acc;
              }, {} as Record<string, { amount: number; count: number }>))
              .sort((a, b) => b[1].amount - a[1].amount)
              .map(([sector, data]) => (
                <div key={sector} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                      {sector}
                    </span>
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {data.count} projects
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.amount / portfolioData.totalInvested) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      ₹{data.amount.toLocaleString()}
                    </span>
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {((data.amount / portfolioData.totalInvested) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Region Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className={`p-4 sm:p-6 rounded-2xl backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Region Breakdown</h3>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                theme === 'light' ? 'bg-teal-100 text-teal-700' : 'bg-teal-900/30 text-teal-400'
              }`}>
                By Market
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(userInvestments.reduce((acc, inv) => {
                const region = inv.region || 'Unknown';
                if (!acc[region]) {
                  acc[region] = { amount: 0, count: 0 };
                }
                acc[region].amount += inv.investmentAmount;
                acc[region].count += 1;
                return acc;
              }, {} as Record<string, { amount: number; count: number }>))
              .sort((a, b) => b[1].amount - a[1].amount)
              .map(([region, data]) => (
                <div key={region} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                      {region}
                    </span>
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {data.count} projects
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.amount / portfolioData.totalInvested) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      ₹{data.amount.toLocaleString()}
                    </span>
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {((data.amount / portfolioData.totalInvested) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Performing Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`p-6 rounded-2xl backdrop-blur-xl border mb-8 ${
            theme === 'light'
              ? 'bg-white/50 border-white/60 shadow-lg'
              : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <BarChart className="w-5 h-5 text-green-500" />
              </div>
              <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Top Performing Projects</h3>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
            }`}>
              {portfolioData.topPerformingProjects.length} Projects
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'}`}>
                  <th className={`pb-3 text-left font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Project</th>
                  <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Invested</th>
                  <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Current Value</th>
                  <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>ROI</th>
                  <th className={`pb-3 text-center font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Risk</th>
                  <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.topPerformingProjects.map((project, index) => (
                  <tr key={index} className={`${
                    theme === 'light' ? 'border-b border-gray-100' : 'border-b border-gray-800'
                  } ${index === portfolioData.topPerformingProjects.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="py-4">
                      <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {project.title}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        ₹{project.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        ₹{project.returns.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-green-500">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="font-medium">{project.roi}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        project.riskLevel === 'low' 
                          ? 'bg-green-100 text-green-700'
                          : project.riskLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        theme === 'light'
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                      }`}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Underperforming Projects */}
        {portfolioData.underperformingProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border mb-8 ${
              theme === 'light'
                ? 'bg-white/50 border-white/60 shadow-lg'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Underperforming Projects</h3>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-900/30 text-red-400'
              }`}>
                Needs Attention
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'}`}>
                    <th className={`pb-3 text-left font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Project</th>
                    <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Invested</th>
                    <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Current Value</th>
                    <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>ROI</th>
                    <th className={`pb-3 text-center font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Risk</th>
                    <th className={`pb-3 text-right font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.underperformingProjects.map((project, index) => (
                    <tr key={index} className={`${
                      theme === 'light' ? 'border-b border-gray-100' : 'border-b border-gray-800'
                    } ${index === portfolioData.underperformingProjects.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4">
                        <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {project.title}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          ₹{project.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          ₹{project.returns.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-red-500">
                          <TrendingDown className="w-4 h-4" />
                          <span className="font-medium">{Math.abs(project.roi)}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          project.riskLevel === 'low' 
                            ? 'bg-green-100 text-green-700'
                            : project.riskLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          theme === 'light'
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                        }`}>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Insights and Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`p-6 rounded-2xl backdrop-blur-xl border ${
            theme === 'light'
              ? 'bg-white/50 border-white/60 shadow-lg'
              : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              AI-Powered Insights & Recommendations
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Next Quarter Projections</h4>
              <div className={`p-4 rounded-xl ${
                theme === 'light' ? 'bg-white/80 border border-gray-200' : 'bg-gray-800/50 border border-gray-700'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Expected Returns</span>
                    <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      ₹{portfolioData.projectionsNextQuarter.expectedReturns.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Projected ROI</span>
                    <span className="font-medium text-green-500">
                      +{portfolioData.projectionsNextQuarter.projectedROI}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Confidence Level</span>
                    <span className={`font-medium capitalize ${
                      portfolioData.projectionsNextQuarter.confidenceLevel === 'high'
                        ? 'text-green-500'
                        : portfolioData.projectionsNextQuarter.confidenceLevel === 'medium'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}>
                      {portfolioData.projectionsNextQuarter.confidenceLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className={`font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Recommendations</h4>
              <div className={`p-4 rounded-xl ${
                theme === 'light' ? 'bg-white/80 border border-gray-200' : 'bg-gray-800/50 border border-gray-700'
              }`}>
                <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-4`}>
                  {recommendation}
                </p>
                <div className="flex justify-end">
                  <button className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                    theme === 'light'
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                  }`}>
                    <Zap className="w-4 h-4" />
                    <span>Get Personalized Advice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Investment Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Investment Timeline</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6">
              {userInvestments
                .sort((a, b) => new Date(a.investmentDate).getTime() - new Date(b.investmentDate).getTime())
                .map(inv => (
                  <div key={inv.id} className={`min-w-[220px] p-4 rounded-xl border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900/50 border-gray-700'} flex flex-col items-center`}>
                    <img src={inv.projectPoster} alt={inv.projectName} className="w-20 h-28 object-cover rounded-lg mb-2" />
                    <div className="font-semibold mb-1 text-center">{inv.projectName}</div>
                    <div className="text-xs mb-1 text-gray-500">{inv.projectType.toUpperCase()} | {inv.genre}</div>
                    <div className="text-xs mb-1 text-gray-500">Invested: ₹{inv.investmentAmount.toLocaleString()}</div>
                    <div className="text-xs mb-1 text-gray-500">Date: {new Date(inv.investmentDate).toLocaleDateString()}</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${inv.status === 'completed' ? 'bg-green-100 text-green-700' : inv.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{inv.status.toUpperCase()}</div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed Investment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>All Investments</h2>
            <CSVLink data={sortedInvestments} headers={csvHeaders} filename="portfolio.csv" className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">Export CSV</CSVLink>
          </div>
          <div className="space-y-4">
            {sortedInvestments.map(inv => {
              const isExpanded = expandedInvestments.has(inv.id);
              const project = projects.find(p => p.title === inv.projectName);
              
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl border transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-white border-gray-200 hover:border-purple-300'
                      : 'bg-gray-900/50 border-gray-700 hover:border-purple-500/50'
                  }`}
                >
                  {/* Main Investment Row */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                    onClick={() => toggleInvestmentExpansion(inv.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={inv.projectPoster} 
                          alt={inv.projectName} 
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {inv.projectName}
                            </h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inv.status === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : inv.status === 'active' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {inv.status.toUpperCase()}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inv.risk === 'low' 
                                ? 'bg-green-100 text-green-700'
                                : inv.risk === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {inv.risk.charAt(0).toUpperCase() + inv.risk.slice(1)} Risk
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              {inv.projectType === 'film' ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                              <span>{inv.projectType.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{inv.genre}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{inv.region}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              <span>{inv.language}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Invested</div>
                          <div className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            ₹{inv.investmentAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Current Value</div>
                          <div className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            ₹{inv.currentValue.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Returns</div>
                          <div className={`font-bold ${inv.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ₹{inv.returnAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>ROI</div>
                          <div className={`font-bold ${inv.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {inv.returnPercentage >= 0 ? '+' : ''}{inv.returnPercentage}%
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-4 pb-4 border-t ${
                      theme === 'light' ? 'border-gray-100' : 'border-gray-800'
                    }`}>
                      <div className="grid md:grid-cols-2 gap-6 pt-4">
                        {/* Project Details */}
                        <div>
                          <h4 className={`font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                            Project Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Sector</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{inv.sector}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Genre</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{inv.genre}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Region</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{inv.region}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Language</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{inv.language}</span>
                            </div>
                            {project && (
                              <>
                                <div className="flex justify-between">
                                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Director</span>
                                  <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{project.director}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Cast</span>
                                  <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{project.cast}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Budget</span>
                                  <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{project.budget?.toLocaleString() || 'N/A'}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Investment Timeline */}
                        <div>
                          <h4 className={`font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                            Investment Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Investment Date</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {new Date(inv.investmentDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Maturity Date</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {new Date(inv.maturityDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Duration</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {Math.ceil((new Date(inv.maturityDate).getTime() - new Date(inv.investmentDate).getTime()) / (1000 * 60 * 60 * 24))} days
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Days Remaining</span>
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {Math.max(0, Math.ceil((new Date(inv.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          theme === 'light'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                        }`}>
                          View Project Details
                        </button>
                        <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          theme === 'light'
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                        }`}>
                          Track Performance
                        </button>
                        <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          theme === 'light'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                        }`}>
                          Add to Watchlist
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
import React, { useState, useMemo } from 'react';
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
  Calendar,
  Globe,
  Film,
  Music,
  Star,
  Target,
  Gem,
  Coins,
  Calculator,
  Wallet,
  Briefcase,
  PiggyBank,
  Activity,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Clock,
  CheckCircle,
  Play,
  FileText
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { portfolioData as userInvestments } from '../data/portfolio';
import { projects } from '../data/projects';
import { CSVLink } from 'react-csv';

// Calculate portfolio data from real investments with enhanced filtering
const calculatePortfolioData = (filterType: string = 'all') => {
  // Filter investments based on type
  const filteredInvestments = filterType === 'all' 
    ? userInvestments 
    : userInvestments.filter(inv => inv.projectType === filterType);

  const totalInvested = filteredInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalReturns = filteredInvestments.reduce((sum, inv) => sum + inv.returnAmount, 0);
  const totalProfit = totalReturns;
  const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Calculate investments by category
  const categoryMap = new Map<string, number>();
  filteredInvestments.forEach(inv => {
    const category = inv.projectType === 'film' ? 'Film' : 
                    inv.projectType === 'music' ? 'Music' : 'Web Series';
    categoryMap.set(category, (categoryMap.get(category) || 0) + inv.investmentAmount);
  });

  const investmentsByCategory = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalInvested) * 100
  }));

  // Calculate investments by genre (from projects data)
  const genreMap = new Map<string, number>();
  filteredInvestments.forEach(inv => {
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
  const topPerformingProjects = filteredInvestments
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
  const underperformingProjects = filteredInvestments
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

type PortfolioAnalyticsProps = object;

const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = () => {
  const { theme } = useTheme();
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('1y');
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<
    'investmentDate' | 'projectName' | 'investmentAmount' | 'currentValue' | 'returnPercentage' | 'status' | 'projectType' | 'genre' | 'sector' | 'region' | 'language' | 'returnAmount' | 'maturityDate' | 'risk'>('investmentDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [filterProjectType, setFilterProjectType] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Calculate portfolio data based on current filter
  const portfolioData = useMemo(() => calculatePortfolioData(filterProjectType), [filterProjectType]);

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
    if (aValue> bValue) return sortOrder === 'asc' ? 1 : -1;
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
  const portfolioHealth = portfolioData.roi> 15 ? 'Excellent' : 
                         portfolioData.roi> 10 ? 'Good' : 
                         portfolioData.roi> 5 ? 'Average' : 'Needs Attention';

  // Recommendation based on portfolio analysis
  const recommendation = portfolioData.investmentsByCategory.length > 1 
    ? "Your portfolio shows good diversification across films and music. Consider adding more thriller and comedy genres to balance your investments."
    : "Consider diversifying your portfolio with different project types and genres to reduce risk and increase potential returns.";

  // Handle timeline changes
  const handleTimeframeChange = (newTimeframe: '1m' | '3m' | '6m' | '1y' | 'all') => {
    setTimeframe(newTimeframe);
    // Update data based on timeframe
    // This would typically filter data by date range
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilterProjectType(newFilter);
  };



  return (
    <div className={`min-h-screen pt-20 pb-[100px] transition-all duration-[3000ms] max-md:h-[calc(100vh-80px)] max-md:overflow-y-auto max-md:scroll-smooth ${
        theme === 'light'
          ? 'bg-gradient-to-br from-gray-50 to-white'
          : 'bg-gradient-to-br from-black via-gray-900 to-emerald-900'
      }`}>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10">
        {/* Header with Wall Street Theme */}
        <div className="mb-8 relative">

          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 relative">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
              <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              Portfolio Analytics
              <Gem className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            Wall Street-Grade Investment Analysis
            <PiggyBank className="w-5 h-5 text-emerald-400" />
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Total Projects</span>
                <Film className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{filteredInvestments.length}</div>
              <div className="text-xs text-amber-400">Active investments</div>
            </div>
          </div>

          <div className="relative p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Avg ROI</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">+{portfolioData.roi.toFixed(1)}%</div>
              <div className="text-xs text-emerald-400">Portfolio performance</div>
            </div>
          </div>

          <div className="relative p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-blue-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Top Performer</span>
                <Trophy className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white truncate">
                {portfolioData.topPerformingProjects[0]?.title || 'N/A'}
              </div>
              <div className="text-xs text-blue-400">
                +{portfolioData.topPerformingProjects[0]?.roi.toFixed(1)}% ROI
              </div>
            </div>
          </div>

          <div className="relative p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Portfolio Health</span>
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{portfolioHealth}</div>
              <div className="text-xs text-purple-400">Risk assessment</div>
            </div>
          </div>
        </div>

        {/* Simple Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'film', 'music', 'web-series'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                filterProjectType === filter
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {filter === 'web-series' ? 'Web Series' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Filter Bar with Trading Theme */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-3">
            <button 
              onClick={() => handleTimeframeChange('1m')} className={`relative px-4 py-2 rounded-xl transition-all duration-300 border font-medium ${
                timeframe === '1m'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20'
              }`}>
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                1M
              </span>
            </button>
            <button 
              onClick={() => handleTimeframeChange('3m')} className={`relative px-4 py-2 rounded-xl transition-all duration-300 border font-medium ${
                timeframe === '3m'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20'
              }`}>
              <span className="flex items-center gap-1">
                <BarChart className="w-4 h-4" />
                3M
              </span>
            </button>
            <button 
              onClick={() => handleTimeframeChange('6m')} className={`relative px-4 py-2 rounded-xl transition-all duration-300 border font-medium ${
                timeframe === '6m'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20'
              }`}>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                6M
              </span>
            </button>
            <button 
              onClick={() => handleTimeframeChange('1y')} className={`relative px-4 py-2 rounded-xl transition-all duration-300 border font-medium ${
                timeframe === '1y'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20'
              }`}>
              <span className="flex items-center gap-1">
                <Gem className="w-4 h-4" />
                1Y
              </span>
            </button>
            <button 
              onClick={() => handleTimeframeChange('all')} className={`relative px-4 py-2 rounded-xl transition-all duration-300 border font-medium ${
                timeframe === 'all'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20'
              }`}>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                All
              </span>
            </button>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filter Options with Wall Street Theme */}
        {showFilters && (
          <div className="relative mb-8 p-6 rounded-2xl border bg-white/5 border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-amber-500" />
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-amber-500/30 focus:border-amber-500 bg-white/5 text-white">
                  <option value="all" className="bg-gray-800 text-white">All Status</option>
                  <option value="active" className="bg-gray-800 text-white">Active</option>
                  <option value="completed" className="bg-gray-800 text-white">Completed</option>
                  <option value="pending" className="bg-gray-800 text-white">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <Film className="w-3 h-3 text-emerald-500" />
                  Project Type
                </label>
                <select
                  value={filterProjectType}
                  onChange={(e) => setFilterProjectType(e.target.value)} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border-emerald-500/30 focus:border-emerald-500 bg-white/5 text-white">
                  <option value="all" className="bg-gray-800 text-white">All Types</option>
                  <option value="film" className="bg-gray-800 text-white">Film</option>
                  <option value="music" className="bg-gray-800 text-white">Music</option>
                  <option value="web-series" className="bg-gray-800 text-white">Web Series</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <Star className="w-3 h-3 text-blue-500" />
                  Genre
                </label>
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 border-blue-500/30 focus:border-blue-500 bg-white/5 text-white">
                  <option value="all" className="bg-gray-800 text-white">All Genres</option>
                  {portfolioData.investmentsByGenre.map(genre => (
                    <option key={genre.genre} value={genre.genre} className="bg-gray-800 text-white">{genre.genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-purple-500" />
                  Region
                </label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/20 border-purple-500/30 focus:border-purple-500 bg-white/5 text-white">
                  <option value="all" className="bg-gray-800 text-white">All Regions</option>
                  <option value="Bollywood" className="bg-gray-800 text-white">Bollywood</option>
                  <option value="Hollywood" className="bg-gray-800 text-white">Hollywood</option>
                  <option value="South Indian" className="bg-gray-800 text-white">South Indian</option>
                  <option value="International" className="bg-gray-800 text-white">International</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <Target className="w-3 h-3 text-amber-500" />
                  Risk Level
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-amber-500/30 focus:border-amber-500 bg-white/5 text-white">
                  <option value="all" className="bg-gray-800 text-white">All Risk Levels</option>
                  <option value="low" className="bg-gray-800 text-white">Low Risk</option>
                  <option value="medium" className="bg-gray-800 text-white">Medium Risk</option>
                  <option value="high" className="bg-gray-800 text-white">High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <BarChart className="w-3 h-3 text-emerald-500" />
                  Sort By
                </label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border-emerald-500/30 focus:border-emerald-500 bg-white/5 text-white">
                  <option value="investmentDate" className="bg-gray-800 text-white">Investment Date</option>
                  <option value="projectName" className="bg-gray-800 text-white">Project Name</option>
                  <option value="investmentAmount" className="bg-gray-800 text-white">Investment Amount</option>
                  <option value="currentValue" className="bg-gray-800 text-white">Current Value</option>
                  <option value="returnPercentage" className="bg-gray-800 text-white">ROI %</option>
                  <option value="status" className="bg-gray-800 text-white">Status</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <ChevronDown className="w-3 h-3 text-blue-500" />
                  Sort Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 border-blue-500/30 focus:border-blue-500 bg-white/5 text-white">
                  <option value="desc" className="bg-gray-800 text-white">Descending</option>
                  <option value="asc" className="bg-gray-800 text-white">Ascending</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-500" />
                  Quick Actions
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterProjectType('all');
                      setFilterGenre('all');
                      setFilterRegion('all');
                      setFilterRisk('all');
                    }} className="px-3 py-2 rounded-xl text-xs transition-all duration-300 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20">
                    Clear All
                  </button>
                  <button
                    onClick={() => setSortKey('returnPercentage')} className="px-3 py-2 rounded-xl text-xs transition-all duration-300 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-500/50">
                    Sort by ROI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Charts with Trading Floor Theme */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Portfolio Performance Timeline */}
          <div className="relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white">Performance Timeline</h3>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30">
                +{portfolioData.roi}% YTD
              </div>
            </div>
            
            {/* Timeline visualization */}
            <div className="w-full h-48 sm:h-64 relative z-10">
              <div className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 px-4">
                {/* Timeline line */}
                <div className="absolute bottom-8 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-emerald-500/30"></div>
                
                {/* Performance milestones */}
                <div className="relative h-full flex items-end justify-between">
                  {[
                    { month: 'Jan', value: 15, milestone: 'First Investment', color: 'amber' },
                    { month: 'Mar', value: 28, milestone: 'Breakthrough', color: 'yellow' },
                    { month: 'Jun', value: 42, milestone: 'Peak Performance', color: 'emerald' },
                    { month: 'Sep', value: 52, milestone: 'Consolidation', color: 'blue' },
                    { month: 'Dec', value: 72, milestone: 'Year End', color: 'purple' }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center relative group">
                      {/* Performance dot */}
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 shadow-lg shadow-${item.color}-500/50 border-2 border-white/20 transition-all duration-300 group-hover:scale-125 group-hover:shadow-${item.color}-500/75 z-10`}></div>
                      
                      {/* Connection line */}
                      {index < 4 && (
                        <div className={`absolute top-1.5 left-1.5 w-full h-0.5 bg-gradient-to-r from-${item.color}-400/50 to-${item.color === 'yellow' ? 'emerald' : item.color === 'emerald' ? 'blue' : item.color === 'blue' ? 'purple' : 'amber'}-400/50`}></div>
                      )}
                      
                      {/* Value indicator */}
                      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-amber-500 to-yellow-500 text-white z-20 whitespace-nowrap">
                        ₹{item.value}k
                      </div>
                      
                      {/* Milestone label */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-2 text-center">
                        <div className="text-xs text-gray-400 font-medium">{item.month}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-16 leading-tight">{item.milestone}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Performance trend line */}
                <svg className="absolute bottom-8 left-4 right-4 h-36 sm:h-48 pointer-events-none">
                  <path
                    d="M 0 120 Q 60 100 120 80 T 240 60 T 360 40 T 480 20"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Portfolio Allocation */}
          <div className="relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white">Portfolio Allocation</h3>
              </div>
              <button className="text-xs px-2 sm:px-3 py-1 rounded-lg border bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20">
                By Category ▾
              </button>
            </div>
            
            {/* Pie chart visualization */}
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Film - 55.6% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
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
                    stroke="#10b981"
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
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${17.7 * 2.51} ${100 * 2.51 - 17.7 * 2.51}`}
                    strokeDashoffset={`${-(55.6 + 26.7) * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-white">
                    ₹{portfolioData.totalInvested.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 sm:space-y-4 pl-0 sm:pl-4">
                {portfolioData.investmentsByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-gray-300">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        ₹{item.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats with Wall Street Money Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />

                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                    <Wallet className="w-3 h-3 text-amber-500" />
                    Total Invested
                  </p>
                  <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    ₹{portfolioData.totalInvested.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-400 font-medium">Capital Deployed</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30">
                {timeframe}
              </span>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-full relative z-10 shadow-lg shadow-amber-500/30" />
          </div>

          <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />

                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                    <PiggyBank className="w-3 h-3 text-emerald-500" />
                    Current Value
                  </p>
                  <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    ₹{portfolioData.totalReturns.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-400 font-medium">Portfolio Worth</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-medium">+{portfolioData.roi}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-full relative z-10 shadow-lg shadow-emerald-500/30" />
          </div>

          <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />

                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                    <Calculator className="w-3 h-3 text-blue-500" />
                    Total Profit
                  </p>
                  <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                    ₹{portfolioData.totalProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-400 font-medium">Net Gains</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-blue-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-medium">+{portfolioData.roi}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full relative z-10 shadow-lg shadow-blue-500/30" />
          </div>

          <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Purple Diamond Emblem */}

            
            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />

                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-purple-500" />
                    Portfolio Health
                  </p>
                  <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {portfolioHealth}
                  </p>
                  <p className="text-xs text-purple-400 font-medium">Investment Grade</p>
                </div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                portfolioHealth === 'Excellent' 
                  ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30' 
                  : portfolioHealth === 'Good' 
                  ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30' 
                  : portfolioHealth === 'Average' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {portfolioHealth === 'Excellent' || portfolioHealth === 'Good' 
                  ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> 
                  : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full relative z-10 shadow-lg shadow-purple-500/30" />
          </div>
        </div>

        {/* Sector and Region Breakdown Charts with Wall Street Theme */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Sector Breakdown */}
          <div className="relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30">
                  <BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white">Sector Breakdown</h3>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/30">
                By Investment
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4 relative z-10">
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
                    <span className="font-medium text-gray-200 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      {sector}
                    </span>
                    <span className="text-sm text-gray-400">
                      {data.count} projects
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-amber-500/20 border border-amber-500/30">
                    <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 h-2 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/25"
                      style={{ width: `${(data.amount / portfolioData.totalInvested) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      ₹{data.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-400">
                      {((data.amount / portfolioData.totalInvested) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Region Breakdown */}
          <div className="relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            

            
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white">Region Breakdown</h3>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30">
                By Market
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4 relative z-10">
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
                    <span className="font-medium text-gray-200 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      {region}
                    </span>
                    <span className="text-sm text-gray-400">
                      {data.count} projects
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-emerald-500/20 border border-emerald-500/30">
                    <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 shadow-lg shadow-emerald-500/25"
                      style={{ width: `${(data.amount / portfolioData.totalInvested) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      ₹{data.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-400">
                      {((data.amount / portfolioData.totalInvested) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Projects with Wall Street Theme */}
        <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          

          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg text-white">Top Performing Projects</h3>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/30">
              Best ROI
            </div>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-500/20">
                  <th className="pb-3 text-left font-medium text-gray-400">Project</th>
                  <th className="pb-3 text-right font-medium text-gray-400">Invested</th>
                  <th className="pb-3 text-right font-medium text-gray-400">Returns</th>
                  <th className="pb-3 text-right font-medium text-gray-400">ROI</th>
                  <th className="pb-3 text-center font-medium text-gray-400">Risk</th>
                  <th className="pb-3 text-right font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.topPerformingProjects.map((project, index) => (
                  <tr key={index} className={`border-b border-amber-500/10 ${index === portfolioData.topPerformingProjects.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="py-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        {project.title}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="text-gray-300">
                        ₹{project.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="text-gray-300">
                        ₹{project.returns.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-emerald-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="font-medium">{project.roi}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        project.riskLevel === 'low' 
                          ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30'
                          : project.riskLevel === 'medium'
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="px-3 py-1 rounded-xl text-sm transition-all duration-300 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-500/50">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Underperforming Projects with Wall Street Theme */}
        {portfolioData.underperformingProjects.length> 0 && (
          <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-red-500/20 transition-all duration-300 group overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Warning Emblem */}

            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-bold text-lg text-white">Underperforming Projects</h3>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border border-red-500/30">
                Needs Attention
              </div>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-500/20">
                    <th className="pb-3 text-left font-medium text-gray-400">Project</th>
                    <th className="pb-3 text-right font-medium text-gray-400">Invested</th>
                    <th className="pb-3 text-right font-medium text-gray-400">Current Value</th>
                    <th className="pb-3 text-right font-medium text-gray-400">ROI</th>
                    <th className="pb-3 text-center font-medium text-gray-400">Risk</th>
                    <th className="pb-3 text-right font-medium text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.underperformingProjects.map((project, index) => (
                    <tr key={index} className={`border-b border-red-500/10 ${index === portfolioData.underperformingProjects.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4">
                        <div className="font-medium text-white flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          {project.title}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="text-gray-300">
                          ₹{project.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="text-gray-300">
                          ₹{project.returns.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-red-400">
                          <TrendingDown className="w-4 h-4" />
                          <span className="font-medium">{Math.abs(project.roi)}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          project.riskLevel === 'low' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30'
                            : project.riskLevel === 'medium'
                            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button className="px-3 py-1 rounded-xl text-sm transition-all duration-300 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border border-red-500/30 hover:border-red-500/50">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Insights and Recommendations with Wall Street Theme */}
        <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/20 transition-all duration-300 group overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          

          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg text-white">
              AI-Powered Insights & Recommendations
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div>
              <h4 className="font-medium mb-3 text-gray-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Next Quarter Projections
              </h4>
              <div className="relative p-4 rounded-xl bg-white/5 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-purple-400" />
                      Expected Returns
                    </span>
                    <span className="font-medium text-white">
                      ₹{portfolioData.projectionsNextQuarter.expectedReturns.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1">
                      <BarChart className="w-3 h-3 text-purple-400" />
                      Projected ROI
                    </span>
                    <span className="font-medium text-purple-400">
                      +{portfolioData.projectionsNextQuarter.projectedROI}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-purple-400" />
                      Confidence Level
                    </span>
                    <span className={`font-medium capitalize ${
                      portfolioData.projectionsNextQuarter.confidenceLevel === 'high'
                        ? 'text-emerald-400'
                        : portfolioData.projectionsNextQuarter.confidenceLevel === 'medium'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}>
                      {portfolioData.projectionsNextQuarter.confidenceLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-gray-200 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-400" />
                Recommendations
              </h4>
              <div className="relative p-4 rounded-xl bg-white/5 border border-blue-500/20 hover:border-blue-500/30 transition-all duration-300">
                <p className="text-gray-300 mb-4">
                  {recommendation}
                </p>
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 px-3 py-1 rounded-xl text-sm transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-500/50">
                    <Zap className="w-4 h-4" />
                    <span>Get Personalized Advice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Timeline with Wall Street Theme */}
        <div className="mb-12 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Investment Timeline</h2>
            <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/30">
              Chronological View
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex gap-6">
              {filteredInvestments
                .sort((a, b) => new Date(a.investmentDate).getTime() - new Date(b.investmentDate).getTime())
                .map(inv => (
                  <div key={inv.id} className="min-w-[220px] p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group">
                    <div className="relative">
                      <img src={inv.projectPoster} alt={inv.projectName} className="w-full h-28 object-cover rounded-lg mb-3" />
                      {/* Subtle dark overlay over poster for better text readability */}
                      <div className="absolute inset-0 bg-black/20 rounded-lg" />
                      
                      {/* Status Emblem */}
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 z-10 ${
                        inv.status === 'completed' 
                          ? 'bg-emerald-500/20 border-emerald-500/40' 
                          : inv.status === 'active' 
                          ? 'bg-blue-500/20 border-blue-500/40' 
                          : 'bg-amber-500/20 border-amber-500/40'
                      }`}>
                        {inv.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400 m-1" />}
                        {inv.status === 'active' && <Play className="w-4 h-4 text-blue-400 m-1" />}
                        {inv.status === 'pending' && <Clock className="w-4 h-4 text-amber-400 m-1" />}
                      </div>
                    </div>
                    
                    <div className="font-semibold mb-2 text-center text-white">{inv.projectName}</div>
                    <div className="text-xs mb-2 text-gray-400 text-center flex items-center justify-center gap-1">
                      {inv.projectType === 'film' ? <Film className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                      {inv.projectType.toUpperCase()} | {inv.genre}
                    </div>
                    <div className="text-xs mb-1 text-gray-400 text-center flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3 text-amber-400" />
                      Invested: ₹{inv.investmentAmount.toLocaleString()}
                    </div>
                    <div className="text-xs mb-2 text-gray-400 text-center flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      {new Date(inv.investmentDate).toLocaleDateString()}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full text-center font-medium ${
                      inv.status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : inv.status === 'active' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {inv.status.toUpperCase()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Detailed Investment Table with Wall Street Theme */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">All Investments</h2>
              <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30">
                Complete Portfolio ({sortedInvestments.length} projects)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CSVLink 
                data={sortedInvestments} 
                headers={csvHeaders} 
                filename="portfolio.csv" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300">
                <Download className="w-4 h-4" />
                Export CSV
              </CSVLink>
            </div>
          </div>

          {/* Investment Table */}
          <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="overflow-x-auto relative z-10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="pb-3 text-left font-medium text-gray-400">Project</th>
                    <th className="pb-3 text-center font-medium text-gray-400">Type</th>
                    <th className="pb-3 text-right font-medium text-gray-400">Invested</th>
                    <th className="pb-3 text-right font-medium text-gray-400">Current Value</th>
                    <th className="pb-3 text-right font-medium text-gray-400">Returns</th>
                    <th className="pb-3 text-right font-medium text-gray-400">ROI %</th>
                    <th className="pb-3 text-center font-medium text-gray-400">Status</th>
                    <th className="pb-3 text-center font-medium text-gray-400">Risk</th>
                    <th className="pb-3 text-center font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvestments.map((investment, index) => (
                    <tr key={investment.id} className={`border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-all duration-300 ${index === sortedInvestments.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={investment.projectPoster} 
                              alt={investment.projectName}
                              className="w-12 h-16 object-cover rounded-lg border border-emerald-500/20"
                            />
                            {/* Subtle dark overlay over table poster for better text readability */}
                            <div className="absolute inset-0 bg-black/20 rounded-lg" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{investment.projectName}</div>
                            <div className="text-xs text-gray-400">{investment.genre}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          investment.projectType === 'film' 
                            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30'
                            : investment.projectType === 'music'
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {investment.projectType === 'film' ? <Film className="w-3 h-3" /> : 
                           investment.projectType === 'music' ? <Music className="w-3 h-3" /> : 
                           <Play className="w-3 h-3" />}
                          {investment.projectType.toUpperCase()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="text-white font-medium">
                          ₹{investment.investmentAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="text-white font-medium">
                          ₹{investment.currentValue.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className={`font-medium ${investment.returnAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {investment.returnAmount >= 0 ? '+' : ''}₹{investment.returnAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className={`flex items-center justify-end gap-1 font-medium ${investment.returnPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {investment.returnPercentage >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          investment.status === 'completed' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30'
                            : investment.status === 'active' 
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {investment.status.toUpperCase()}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          investment.risk === 'low' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30'
                            : investment.risk === 'medium'
                            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {investment.risk.toUpperCase()}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="px-3 py-1 rounded-xl text-sm transition-all duration-300 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50">
                            Details
                          </button>
                          <button className="px-3 py-1 rounded-xl text-sm transition-all duration-300 bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;






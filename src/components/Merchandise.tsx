import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Filter, 
  Search, 
  Star, 
  Heart, 
  ShoppingCart, 
  Grid3X3, 
  List, 
  X,
  Shirt,
  Watch,
  Trophy,
  Crown,
  Tag,
  Clock,
  TrendingUp,
  Zap,
  Gift,
  Package
} from 'lucide-react';
import { useTheme } from './ThemeContext';

interface MerchandiseItem {
  id: string;
  title: string;
  category: 'apparel' | 'accessories' | 'collectibles' | 'limited-editions';
  price: number;
  originalPrice?: number;
  priceType: 'fixed' | 'auction' | 'free';
  image: string;
  description: string;
  availability: 'in-stock' | 'limited' | 'sold-out' | 'pre-order';
  rating: number;
  reviews: number;
  tags: string[];
  releaseDate: string;
  popularity: number;
  project?: string;
  isLimited?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

const Merchandise: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedPriceType, setSelectedPriceType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const { theme, currentGradient } = useTheme();

  // Real merchandise data with actual product images
  const merchandiseItems: MerchandiseItem[] = [
    {
      id: '1',
      title: 'Pathaan 2 Limited Edition T-Shirt',
      category: 'apparel',
      price: 1299,
      originalPrice: 1599,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium cotton t-shirt with exclusive Pathaan 2 artwork featuring Shah Rukh Khan',
      availability: 'limited',
      rating: 4.8,
      reviews: 234,
      tags: ['Bollywood', 'Action', 'Shah Rukh Khan', 'Limited', 'T-Shirt'],
      releaseDate: '2024-01-15',
      popularity: 95,
      project: 'Pathaan 2',
      isLimited: true,
      isTrending: true,
      isNew: true
    },
    {
      id: '2',
      title: 'RRR 2 Collector\'s Watch',
      category: 'accessories',
      price: 4999,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Luxury watch with RRR 2 themed design and engravings',
      availability: 'in-stock',
      rating: 4.9,
      reviews: 89,
      tags: ['Regional', 'Epic', 'Luxury', 'Collector', 'Watch'],
      releaseDate: '2024-02-01',
      popularity: 88,
      project: 'RRR 2',
      isLimited: true
    },
    {
      id: '3',
      title: 'Circles Premium Hoodie',
      category: 'apparel',
      price: 2199,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium hoodie for Circles platform investors with embroidered logo',
      availability: 'in-stock',
      rating: 4.6,
      reviews: 312,
      tags: ['Circles', 'Investor', 'Premium', 'Comfort', 'Hoodie'],
      releaseDate: '2024-01-01',
      popularity: 78,
      isTrending: true
    },
    {
      id: '4',
      title: 'KGF Chapter 3 Action Figure',
      category: 'collectibles',
      price: 3299,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Detailed action figure of Rocky Bhai from KGF Chapter 3',
      availability: 'pre-order',
      rating: 4.7,
      reviews: 67,
      tags: ['Action Figure', 'KGF', 'Rocky', 'Collectible'],
      releaseDate: '2024-03-15',
      popularity: 85,
      project: 'KGF Chapter 3',
      isNew: true
    },
    {
      id: '5',
      title: 'Pushpa 3 Golden Chain',
      category: 'limited-editions',
      price: 15999,
      priceType: 'auction',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Limited edition golden chain replica from Pushpa 3',
      availability: 'limited',
      rating: 4.9,
      reviews: 45,
      tags: ['Gold', 'Pushpa', 'Limited', 'Luxury', 'Jewelry'],
      releaseDate: '2024-03-01',
      popularity: 98,
      project: 'Pushpa 3: The Rampage',
      isLimited: true,
      isTrending: true,
      isNew: true
    },
    {
      id: '6',
      title: 'Sacred Games 3 Poster Set',
      category: 'collectibles',
      price: 0,
      priceType: 'free',
      image: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Free poster set for Sacred Games 3 investors',
      availability: 'in-stock',
      rating: 4.4,
      reviews: 445,
      tags: ['Free', 'Poster', 'Sacred Games', 'Netflix'],
      releaseDate: '2024-02-10',
      popularity: 70,
      project: 'Sacred Games 3'
    },
    {
      id: '7',
      title: 'Vikram 2 Tactical Cap',
      category: 'accessories',
      price: 899,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/404168/pexels-photo-404168.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tactical cap inspired by Vikram 2 with embroidered logo',
      availability: 'limited',
      rating: 4.8,
      reviews: 123,
      tags: ['Tactical', 'Vikram', 'Cap', 'Action'],
      releaseDate: '2024-02-20',
      popularity: 82,
      project: 'Vikram 2',
      isLimited: true
    },
    {
      id: '8',
      title: 'A.R. Rahman Symphony Vinyl Record',
      category: 'collectibles',
      price: 2499,
      priceType: 'auction',
      image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Limited edition vinyl record signed by A.R. Rahman',
      availability: 'limited',
      rating: 5.0,
      reviews: 156,
      tags: ['Music', 'Vinyl', 'Signed', 'Classical'],
      releaseDate: '2024-01-20',
      popularity: 92,
      project: 'A.R. Rahman: Symphony of India',
      isLimited: true,
      isTrending: true
    },
    {
      id: '9',
      title: 'John Wick 5 Coffee Mug',
      category: 'collectibles',
      price: 799,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Ceramic mug featuring artwork from John Wick 5',
      availability: 'in-stock',
      rating: 4.5,
      reviews: 58,
      tags: ['Action', 'Keanu Reeves', 'Mug'],
      releaseDate: '2024-03-05',
      popularity: 65,
      project: 'John Wick 5'
    },
    {
      id: '10',
      title: 'Avatar Voyager Backpack',
      category: 'accessories',
      price: 3599,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Durable backpack inspired by Avatar sequel',
      availability: 'pre-order',
      rating: 4.7,
      reviews: 34,
      tags: ['Avatar', 'Adventure', 'Bag'],
      releaseDate: '2024-04-01',
      popularity: 80,
      project: 'Avatar: The Seed Bearer',
      isNew: true
    },
    {
      id: '11',
      title: 'Mirzapur 4 Keychain',
      category: 'collectibles',
      price: 299,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/275783/pexels-photo-275783.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Metal keychain with Mirzapur logo',
      availability: 'in-stock',
      rating: 4.3,
      reviews: 77,
      tags: ['Mirzapur', 'Keychain'],
      releaseDate: '2024-02-25',
      popularity: 60,
      project: 'Mirzapur 4'
    },
    {
      id: '12',
      title: 'Kantara Forest Hat',
      category: 'apparel',
      price: 899,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/404168/pexels-photo-404168.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Adventure hat themed after Kantara locations',
      availability: 'in-stock',
      rating: 4.2,
      reviews: 54,
      tags: ['Kantara', 'Adventure', 'Hat'],
      releaseDate: '2024-03-18',
      popularity: 55,
      isNew: true
    },
    {
      id: '13',
      title: 'Marvel Multiverse Poster Pack',
      category: 'collectibles',
      price: 1299,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/1307348/pexels-photo-1307348.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Set of high quality posters from upcoming Marvel saga',
      availability: 'pre-order',
      rating: 4.9,
      reviews: 201,
      tags: ['Marvel', 'Poster', 'Limited'],
      releaseDate: '2024-04-15',
      popularity: 99,
      isLimited: true,
      isTrending: true
    },
    {
      id: '14',
      title: 'Game of Thrones Chess Set',
      category: 'limited-editions',
      price: 5999,
      priceType: 'auction',
      image: 'https://images.pexels.com/photos/277092/pexels-photo-277092.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Collector chess set featuring iconic GoT characters',
      availability: 'limited',
      rating: 4.8,
      reviews: 68,
      tags: ['Chess', 'GoT', 'Collector'],
      releaseDate: '2024-05-01',
      popularity: 85,
      project: 'Game of Thrones',
      isLimited: true
    },
    {
      id: '15',
      title: 'Circles Premium T-Shirt',
      category: 'apparel',
      price: 999,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comfortable cotton t-shirt with Circles logo design',
      availability: 'in-stock',
      rating: 4.5,
      reviews: 189,
      tags: ['Circles', 'T-Shirt', 'Cotton', 'Comfort'],
      releaseDate: '2024-01-10',
      popularity: 72
    },
    {
      id: '16',
      title: 'Bollywood Star Necklace',
      category: 'limited-editions',
      price: 8999,
      priceType: 'auction',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Elegant necklace with Bollywood star pendant',
      availability: 'limited',
      rating: 4.7,
      reviews: 34,
      tags: ['Jewelry', 'Bollywood', 'Necklace', 'Luxury'],
      releaseDate: '2024-02-15',
      popularity: 75,
      isLimited: true
    },
    {
      id: '17',
      title: 'Action Movie Sunglasses',
      category: 'accessories',
      price: 1499,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Stylish sunglasses inspired by action movies',
      availability: 'in-stock',
      rating: 4.3,
      reviews: 92,
      tags: ['Sunglasses', 'Action', 'Style'],
      releaseDate: '2024-03-10',
      popularity: 68
    },
    {
      id: '18',
      title: 'Circles Investor Cap',
      category: 'apparel',
      price: 699,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/404168/pexels-photo-404168.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium cap with embroidered Circles logo',
      availability: 'in-stock',
      rating: 4.4,
      reviews: 156,
      tags: ['Circles', 'Cap', 'Investor', 'Premium'],
      releaseDate: '2024-01-05',
      popularity: 70
    },
    {
      id: '19',
      title: 'Movie Star Bracelet',
      category: 'limited-editions',
      price: 3999,
      priceType: 'auction',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Elegant bracelet with movie star charms',
      availability: 'limited',
      rating: 4.6,
      reviews: 45,
      tags: ['Jewelry', 'Bracelet', 'Movie Star', 'Luxury'],
      releaseDate: '2024-02-20',
      popularity: 73,
      isLimited: true
    },
    {
      id: '20',
      title: 'Circles Premium Sweatshirt',
      category: 'apparel',
      price: 1799,
      priceType: 'fixed',
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comfortable sweatshirt perfect for casual wear',
      availability: 'in-stock',
      rating: 4.7,
      reviews: 234,
      tags: ['Circles', 'Sweatshirt', 'Comfort', 'Casual'],
      releaseDate: '2024-01-20',
      popularity: 81,
      isTrending: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: Package },
    { id: 'apparel', label: 'Apparel', icon: Shirt },
    { id: 'accessories', label: 'Accessories', icon: Watch },
    { id: 'collectibles', label: 'Collectibles', icon: Trophy },
    { id: 'limited-editions', label: 'Limited Editions', icon: Crown }
  ];

  const availabilityOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'in-stock', label: 'In Stock' },
    { id: 'limited', label: 'Limited Stock' },
    { id: 'pre-order', label: 'Pre-Order' },
    { id: 'sold-out', label: 'Sold Out' }
  ];

  const priceTypeOptions = [
    { id: 'all', label: 'All Types' },
    { id: 'fixed', label: 'Fixed Price' },
    { id: 'auction', label: 'Auction' },
    { id: 'free', label: 'Free Items' }
  ];

  const sortOptions = [
    { id: 'popularity', label: 'Most Popular' },
    { id: 'newest', label: 'Newest First' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'trending', label: 'Trending' }
  ];

  // Filter and sort items
  const filteredItems = merchandiseItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesAvailability = selectedAvailability === 'all' || item.availability === selectedAvailability;
    const matchesPriceType = selectedPriceType === 'all' || item.priceType === selectedPriceType;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesAvailability && matchesPriceType && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'trending':
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      default: // popularity
        return b.popularity - a.popularity;
    }
  });

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const toggleCart = (itemId: string) => {
    const newCart = new Set(cart);
    if (newCart.has(itemId)) {
      newCart.delete(itemId);
    } else {
      newCart.add(itemId);
    }
    setCart(newCart);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedAvailability('all');
    setSelectedPriceType('all');
    setPriceRange([0, 10000]);
    setSortBy('popularity');
    setSearchTerm('');
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'text-green-400';
      case 'limited': return 'text-yellow-400';
      case 'pre-order': return 'text-blue-400';
      case 'sold-out': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriceTypeIcon = (priceType: string) => {
    switch (priceType) {
      case 'auction': return <Clock className="w-4 h-4" />;
      case 'free': return <Gift className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen pt-20 pb-[100px] transition-all duration-[3000ms] ${
      theme === 'light'
        ? currentGradient === 0 ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50' :
          currentGradient === 1 ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50' :
          currentGradient === 2 ? 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50' :
          currentGradient === 3 ? 'bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50' :
          'bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900'
    }`}
    style={{
      backgroundImage: theme === 'light' 
        ? 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
        : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.25) 0%, transparent 70%)'
    }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`p-4 rounded-2xl transition-all duration-[3000ms] ${
                theme === 'light' 
                  ? currentGradient === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    currentGradient === 1 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    currentGradient === 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    currentGradient === 3 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                    'bg-gradient-to-r from-purple-500 to-fuchsia-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            >
              <ShoppingBag className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Exclusive{' '}
                <span className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-[3000ms] ${
                  theme === 'light'
                    ? currentGradient === 0 ? 'from-green-600 to-emerald-600' :
                      currentGradient === 1 ? 'from-orange-600 to-red-600' :
                      currentGradient === 2 ? 'from-blue-600 to-cyan-600' :
                      currentGradient === 3 ? 'from-emerald-600 to-green-600' :
                      'from-purple-600 to-fuchsia-600'
                    : 'from-purple-400 to-pink-400'
                }`}>
                  Merchandise
                </span>
              </h1>
              <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Official merchandise from your favorite projects and exclusive Circles gear
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package, label: 'Total Items', value: merchandiseItems.length.toString(), color: 'text-blue-400' },
              { icon: Crown, label: 'Limited Editions', value: merchandiseItems.filter(i => i.isLimited).length.toString(), color: 'text-yellow-400' },
              { icon: TrendingUp, label: 'Trending', value: merchandiseItems.filter(i => i.isTrending).length.toString(), color: 'text-green-400' },
              { icon: Zap, label: 'New Arrivals', value: merchandiseItems.filter(i => i.isNew).length.toString(), color: 'text-purple-400' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-4 rounded-xl backdrop-blur-xl border transition-all duration-[3000ms] ${
                  theme === 'light'
                    ? currentGradient === 0 ? 'bg-green-50/50 border-green-200/60' :
                      currentGradient === 1 ? 'bg-orange-50/50 border-orange-200/60' :
                      currentGradient === 2 ? 'bg-blue-50/50 border-blue-200/60' :
                      currentGradient === 3 ? 'bg-emerald-50/50 border-emerald-200/60' :
                      'bg-purple-50/50 border-purple-200/60'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <div className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search merchandise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none transition-all duration-[3000ms] ${
                theme === 'light'
                  ? currentGradient === 0 ? 'bg-white/70 border-green-200 focus:border-green-500 text-gray-900 placeholder-gray-500' :
                    currentGradient === 1 ? 'bg-white/70 border-orange-200 focus:border-orange-500 text-gray-900 placeholder-gray-500' :
                    currentGradient === 2 ? 'bg-white/70 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-500' :
                    currentGradient === 3 ? 'bg-white/70 border-emerald-200 focus:border-emerald-500 text-gray-900 placeholder-gray-500' :
                    'bg-white/70 border-purple-200 focus:border-purple-500 text-gray-900 placeholder-gray-500'
                  : 'bg-slate-800/70 border-slate-600 focus:border-purple-500 text-white placeholder-gray-400'
              }`}
            />
          </div>

          {/* View Mode Toggle */}
          <div className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-[3000ms] ${
            theme === 'light'
              ? currentGradient === 0 ? 'bg-white/70 border border-green-200' :
                currentGradient === 1 ? 'bg-white/70 border border-orange-200' :
                currentGradient === 2 ? 'bg-white/70 border border-blue-200' :
                currentGradient === 3 ? 'bg-white/70 border border-emerald-200' :
                'bg-white/70 border border-purple-200'
              : 'bg-slate-800/70 border border-slate-600'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' 
                  ? `${theme === 'light' 
                      ? currentGradient === 0 ? 'bg-green-600 text-white' :
                        currentGradient === 1 ? 'bg-orange-600 text-white' :
                        currentGradient === 2 ? 'bg-blue-600 text-white' :
                        currentGradient === 3 ? 'bg-emerald-600 text-white' :
                        'bg-purple-600 text-white'
                      : 'bg-purple-600 text-white'
                    }`
                  : `${theme === 'light' ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' 
                  ? `${theme === 'light' 
                      ? currentGradient === 0 ? 'bg-green-600 text-white' :
                        currentGradient === 1 ? 'bg-orange-600 text-white' :
                        currentGradient === 2 ? 'bg-blue-600 text-white' :
                        currentGradient === 3 ? 'bg-emerald-600 text-white' :
                        'bg-purple-600 text-white'
                      : 'bg-purple-600 text-white'
                    }`
                  : `${theme === 'light' ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-[3000ms] ${
              theme === 'light'
                ? currentGradient === 0 ? 'bg-white/70 border border-green-200 text-green-700 hover:bg-green-50/80' :
                  currentGradient === 1 ? 'bg-white/70 border border-orange-200 text-orange-700 hover:bg-orange-50/80' :
                  currentGradient === 2 ? 'bg-white/70 border border-blue-200 text-blue-700 hover:bg-blue-50/80' :
                  currentGradient === 3 ? 'bg-white/70 border border-emerald-200 text-emerald-700 hover:bg-emerald-50/80' :
                  'bg-white/70 border border-purple-200 text-purple-700 hover:bg-purple-50/80'
                : 'bg-slate-800/70 border border-slate-600 text-white hover:bg-slate-700/80'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {(selectedCategory !== 'all' || selectedAvailability !== 'all' || selectedPriceType !== 'all') && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-8 p-6 rounded-xl border transition-all duration-[3000ms] ${
                theme === 'light'
                  ? currentGradient === 0 ? 'bg-white/70 border-green-200' :
                    currentGradient === 1 ? 'bg-white/70 border-orange-200' :
                    currentGradient === 2 ? 'bg-white/70 border-blue-200' :
                    currentGradient === 3 ? 'bg-white/70 border-emerald-200' :
                    'bg-white/70 border-purple-200'
                  : 'bg-slate-800/70 border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Advanced Filters
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearFilters}
                    className={`${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-colors`}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className={`${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-[3000ms] ${
                      theme === 'light'
                        ? currentGradient === 0 ? 'bg-white/80 border-green-200 focus:border-green-500 text-gray-900' :
                          currentGradient === 1 ? 'bg-white/80 border-orange-200 focus:border-orange-500 text-gray-900' :
                          currentGradient === 2 ? 'bg-white/80 border-blue-200 focus:border-blue-500 text-gray-900' :
                          currentGradient === 3 ? 'bg-white/80 border-emerald-200 focus:border-emerald-500 text-gray-900' :
                          'bg-white/80 border-purple-200 focus:border-purple-500 text-gray-900'
                        : 'bg-slate-700/80 border-slate-600 focus:border-purple-500 text-white'
                    }`}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Availability
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-[3000ms] ${
                      theme === 'light'
                        ? currentGradient === 0 ? 'bg-white/80 border-green-200 focus:border-green-500 text-gray-900' :
                          currentGradient === 1 ? 'bg-white/80 border-orange-200 focus:border-orange-500 text-gray-900' :
                          currentGradient === 2 ? 'bg-white/80 border-blue-200 focus:border-blue-500 text-gray-900' :
                          currentGradient === 3 ? 'bg-white/80 border-emerald-200 focus:border-emerald-500 text-gray-900' :
                          'bg-white/80 border-purple-200 focus:border-purple-500 text-gray-900'
                        : 'bg-slate-700/80 border-slate-600 focus:border-purple-500 text-white'
                    }`}
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Type Filter */}
                <div>
                  <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Price Type
                  </label>
                  <select
                    value={selectedPriceType}
                    onChange={(e) => setSelectedPriceType(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-[3000ms] ${
                      theme === 'light'
                        ? currentGradient === 0 ? 'bg-white/80 border-green-200 focus:border-green-500 text-gray-900' :
                          currentGradient === 1 ? 'bg-white/80 border-orange-200 focus:border-orange-500 text-gray-900' :
                          currentGradient === 2 ? 'bg-white/80 border-blue-200 focus:border-blue-500 text-gray-900' :
                          currentGradient === 3 ? 'bg-white/80 border-emerald-200 focus:border-emerald-500 text-gray-900' :
                          'bg-white/80 border-purple-200 focus:border-purple-500 text-gray-900'
                        : 'bg-slate-700/80 border-slate-600 focus:border-purple-500 text-white'
                    }`}
                  >
                    {priceTypeOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-[3000ms] ${
                      theme === 'light'
                        ? currentGradient === 0 ? 'bg-white/80 border-green-200 focus:border-green-500 text-gray-900' :
                          currentGradient === 1 ? 'bg-white/80 border-orange-200 focus:border-orange-500 text-gray-900' :
                          currentGradient === 2 ? 'bg-white/80 border-blue-200 focus:border-blue-500 text-gray-900' :
                          currentGradient === 3 ? 'bg-white/80 border-emerald-200 focus:border-emerald-500 text-gray-900' :
                          'bg-white/80 border-purple-200 focus:border-purple-500 text-gray-900'
                        : 'bg-slate-700/80 border-slate-600 focus:border-purple-500 text-white'
                    }`}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-6">
                <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-[3000ms] ${
                selectedCategory === category.id
                  ? `${theme === 'light' 
                      ? currentGradient === 0 ? 'bg-green-600 text-white shadow-lg shadow-green-500/25' :
                        currentGradient === 1 ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25' :
                        currentGradient === 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' :
                        currentGradient === 3 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' :
                        'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    }`
                  : `${theme === 'light' 
                      ? currentGradient === 0 ? 'bg-white/70 border border-green-200 text-green-700 hover:bg-green-50/80' :
                        currentGradient === 1 ? 'bg-white/70 border border-orange-200 text-orange-700 hover:bg-orange-50/80' :
                        currentGradient === 2 ? 'bg-white/70 border border-blue-200 text-blue-700 hover:bg-blue-50/80' :
                        currentGradient === 3 ? 'bg-white/70 border border-emerald-200 text-emerald-700 hover:bg-emerald-50/80' :
                        'bg-white/70 border border-purple-200 text-purple-700 hover:bg-purple-50/80'
                      : 'bg-slate-800/70 border border-slate-600 text-gray-300 hover:bg-slate-700/80 hover:text-white'
                    }`
              }`}
            >
              <category.icon className="w-5 h-5" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {filteredItems.length} Items Found
          </h2>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Cart: {cart.size} items
            </span>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Favorites: {favorites.size} items
            </span>
          </div>
        </div>

        {/* Merchandise Grid/List */}
        {filteredItems.length > 0 ? (
          <div
            className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            } overflow-y-auto max-h-[70vh]`}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative rounded-2xl backdrop-blur-xl border overflow-hidden transition-all duration-500 hover:scale-105 ${
                  theme === 'light'
                    ? currentGradient === 0 ? 'bg-white/70 border-green-200/60 hover:shadow-xl hover:shadow-green-200/50' :
                      currentGradient === 1 ? 'bg-white/70 border-orange-200/60 hover:shadow-xl hover:shadow-orange-200/50' :
                      currentGradient === 2 ? 'bg-white/70 border-blue-200/60 hover:shadow-xl hover:shadow-blue-200/50' :
                      currentGradient === 3 ? 'bg-white/70 border-emerald-200/60 hover:shadow-xl hover:shadow-emerald-200/50' :
                      'bg-white/70 border-purple-200/60 hover:shadow-xl hover:shadow-purple-200/50'
                    : 'bg-gradient-to-br from-slate-800/70 to-slate-700/50 border-slate-600/60 hover:border-slate-500/80 hover:shadow-2xl hover:shadow-purple-500/20'
                } ${viewMode === 'list' ? 'flex gap-6 p-6' : 'flex flex-col'}`}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                  {item.isNew && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                  {item.isTrending && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      TRENDING
                    </span>
                  )}
                  {item.isLimited && (
                    <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                      LIMITED
                    </span>
                  )}
                </div>

                {/* Favorite & Cart Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 z-20">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                      favorites.has(item.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-gray-600 hover:bg-white/40'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleCart(item.id)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                      cart.has(item.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-gray-600 hover:bg-white/40'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>

                {/* Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-64'
                } ${viewMode === 'grid' ? 'rounded-t-2xl' : 'rounded-xl'}`}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Price Type Icon */}
                  <div className="absolute bottom-3 left-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-md text-xs font-medium ${
                      item.priceType === 'auction' ? 'bg-blue-500/20 text-blue-300' :
                      item.priceType === 'free' ? 'bg-green-500/20 text-green-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {getPriceTypeIcon(item.priceType)}
                      {item.priceType.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-6'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 line-clamp-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm mb-2 line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {item.rating}
                      </span>
                    </div>
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className={`px-2 py-1 text-xs rounded-full border ${
                          theme === 'light'
                            ? 'bg-white/60 text-gray-700 border-gray-300'
                            : 'bg-white/10 text-gray-300 border-white/20'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Availability */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {item.priceType === 'free' ? (
                        <span className="text-2xl font-bold text-green-400">FREE</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            ₹{item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className={`text-sm line-through ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${getAvailabilityColor(item.availability)}`}>
                      {item.availability.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      item.availability === 'sold-out'
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : item.priceType === 'auction'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                        : item.priceType === 'free'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                        : `${theme === 'light' 
                            ? currentGradient === 0 ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' :
                              currentGradient === 1 ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500' :
                              currentGradient === 2 ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
                              currentGradient === 3 ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500' :
                              'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                          } text-white`
                    }`}
                    disabled={item.availability === 'sold-out'}
                  >
                    {item.availability === 'sold-out' ? 'Sold Out' :
                     item.priceType === 'auction' ? 'Place Bid' :
                     item.priceType === 'free' ? 'Claim Free' :
                     item.availability === 'pre-order' ? 'Pre-Order' :
                     'Add to Cart'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              No merchandise found
            </h3>
            <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className={`px-6 py-3 rounded-lg transition-colors ${
                theme === 'light' 
                  ? currentGradient === 0 ? 'bg-green-600 hover:bg-green-700' :
                    currentGradient === 1 ? 'bg-orange-600 hover:bg-orange-700' :
                    currentGradient === 2 ? 'bg-blue-600 hover:bg-blue-700' :
                    currentGradient === 3 ? 'bg-emerald-600 hover:bg-emerald-700' :
                    'bg-purple-600 hover:bg-purple-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merchandise;
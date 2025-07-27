# V12 Circles - Elite Entertainment Investment Platform

A modern, high-performance React application for entertainment industry investments with real-time data integration.

## 🚀 Features

- **Real-time Entertainment Data**: Integration with TMDB and Spotify APIs
- **Investment Portfolio**: Track and manage entertainment investments  
- **Community Platform**: Connect with industry professionals and enthusiasts
- **Admin Dashboard**: Comprehensive content and user management
- **Responsive Design**: Optimized for all devices with modern UI/UX
- **Performance Optimized**: Advanced caching, lazy loading, and error boundaries

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion, GSAP
- **Data Visualization**: React CSV, Custom Charts
- **3D Graphics**: Three.js, React Three Fiber
- **Build Tool**: Vite
- **Linting**: ESLint
- **Error Tracking**: Sentry

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/your-repo/v12-circles.git
cd v12-circles

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run test         # Run tests
```

## 🗂️ Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin dashboard components
│   ├── auth/            # Authentication components
│   └── ...
├── data/                # Data files and API responses
├── hooks/               # Custom React hooks
├── services/            # API services and utilities
├── types/               # TypeScript type definitions
└── utils/               # Utility functions

omdb-fetcher/            # Data enrichment scripts
scripts/                 # Build and utility scripts
```

## 🎨 Key Components

- **Hero**: Landing page with dynamic animations
- **Dashboard**: Investment portfolio and analytics  
- **ProjectCatalog**: Browse and filter entertainment projects
- **Community**: Social features and user interactions
- **AdminDashboard**: Content management system

## 🔧 Configuration

### Environment Variables
```bash
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### API Integration
- **TMDB**: Movie and TV show data, cast information
- **Spotify**: Music artist data and album information
- **Sentry**: Error tracking and performance monitoring

## 🎪 Data Management

The project includes automated scripts for data enrichment:

```bash
# Generate enriched project data
npm run generate:projects

# Enhance projects with TMDB data
node scripts/enhanceProjectsWithTMDB.cjs

# Fetch community data
node scripts/fetchTMDBCommunityData.cjs
```

## 🎭 Performance Features

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with preloading
- **Memoization**: Optimized re-renders with React.memo
- **Error Boundaries**: Graceful error handling
- **Debug Tools**: Development debugging panel

## 🎬 TMDB Integration

Fetch real entertainment industry data:
- Popular movies and TV shows
- Cast and crew information  
- Production company details
- Ratings and reviews

## 🎵 Spotify Integration

Music industry features:
- Artist profiles and popularity
- Album and track information
- Genre categorization
- Trending artists

## 🔒 Admin Features

- User management
- Content moderation
- Analytics dashboard
- System settings
- Activity logging

## 🎯 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-optimized interactions
- Progressive Web App features
- Mobile-specific navigation

## 🎪 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🎭 Contact

For questions and support, please contact the development team.

---

**Built with ❤️ for the entertainment industry**
# V12 Circles - Lights, Camera, Ownership!

A modern, Instagram-style platform for investing in movies and connecting with the film industry community.

## TMDB API Integration

This project integrates with The Movie Database (TMDB) API to fetch real movie data, including:
- Popular movies and their details
- Actor and actress information
- Director profiles
- Production company data

### TMDB API Credentials

**API Key:** `00c8935eeb21058413bf54ae11048768`

**Access Token:** `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGM4OTM1ZWViMjEwNTg0MTNiZjU0YWUxMTA0ODc2OCIsIm5iZiI6MTc1MjIwNzkwMi44ODksInN1YiI6IjY4NzA5MjFlNWFiYmI2OWUzZDlhNTgxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7udmAb8IF7qfjyIxOLB1UguBBRUFgh04DvN2TLk6WMM`

**Base URL:** `https://api.themoviedb.org/3`

### API Usage

The TMDB API is used to:
- Fetch popular, top-rated, and now-playing movies
- Get actor/actress profiles and their known works
- Search for production companies
- Retrieve movie posters, backdrops, and other media assets

### Rate Limits

TMDB API has the following rate limits:
- 40 requests per 10 seconds for API key authentication
- 1000 requests per day for API key authentication
- Higher limits available with Bearer token authentication

## Features

- **Real Movie Data**: Integration with TMDB API for authentic movie information
- **Community Hub**: Instagram-style interface for connecting with movie communities
- **Investment Platform**: Invest in movies and track your portfolio
- **Social Features**: Chat, share, and interact with other investors and fans
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- TMDB API for movie data

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API services (including TMDB)
├── data/               # Static data and types
├── types/              # TypeScript type definitions
└── images/             # Static images and assets
```

## API Services

- `src/services/tmdbApi.ts` - TMDB API integration
- `src/hooks/useTMDBData.ts` - Custom hook for managing TMDB data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
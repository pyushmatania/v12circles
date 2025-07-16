export interface UserInvestment {
  id: string;
  projectId: string; // Reference to actual project ID
  projectName: string;
  projectPoster: string;
  investmentAmount: number;
  currentValue: number;
  returnAmount: number;
  returnPercentage: number;
  status: 'active' | 'completed' | 'pending' | 'matured' | 'cancelled';
  maturityDate: string;
  circleId: string;
  circleName: string;
  investmentDate: string;
  projectType: 'film' | 'music' | 'web-series';
  director?: string;
  artist?: string;
  genre?: string;
  sector?: 'Bollywood' | 'International' | 'Regional' | 'Hollywood';
  region?: string;
  language?: string;
  risk: 'low' | 'medium' | 'high';
  targetAmount?: number;
  raisedAmount?: number;
  fundedPercentage?: number;
}

export const portfolioData: UserInvestment[] = [
  // 5 Bollywood Movies
  {
    id: '1',
    projectId: '1',
    projectName: 'Sholay',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNmI1NTRmMWQtNDJlZC00MGIzLWEwYzctYTQwNTI2NWNjM2MwXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 50000,
    currentValue: 75000,
    returnAmount: 25000,
    returnPercentage: 50,
    status: 'active',
    maturityDate: '2024-12-15',
    circleId: 'classic-cinema',
    circleName: 'Classic Cinema Circle',
    investmentDate: '2024-01-15',
    projectType: 'film',
    director: 'Ramesh Sippy',
    genre: 'Action, Adventure, Comedy',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'low',
    targetAmount: 33700000,
    raisedAmount: 7800000,
    fundedPercentage: 23
  },
  {
    id: '2',
    projectId: '2',
    projectName: 'Dilwale Dulhania Le Jayenge',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMDQyMDI4ZGMtYjI5MS00YTk1LTk3ZDgtZTA3MzQ5YWQ4Y2Q4XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 75000,
    currentValue: 120000,
    returnAmount: 45000,
    returnPercentage: 60,
    status: 'active',
    maturityDate: '2024-11-20',
    circleId: 'romance-films',
    circleName: 'Romance Films Circle',
    investmentDate: '2024-02-10',
    projectType: 'film',
    director: 'Aditya Chopra',
    genre: 'Drama, Romance',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'low',
    targetAmount: 23800000,
    raisedAmount: 16700000,
    fundedPercentage: 70
  },
  {
    id: '3',
    projectId: '3',
    projectName: '3 Idiots',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 100000,
    currentValue: 180000,
    returnAmount: 80000,
    returnPercentage: 80,
    status: 'active',
    maturityDate: '2024-10-30',
    circleId: 'comedy-drama',
    circleName: 'Comedy Drama Circle',
    investmentDate: '2024-01-25',
    projectType: 'film',
    director: 'Rajkumar Hirani',
    genre: 'Comedy, Drama',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'low',
    targetAmount: 97300000,
    raisedAmount: 40900000,
    fundedPercentage: 42
  },
  {
    id: '4',
    projectId: '5',
    projectName: 'Dangal',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg',
    investmentAmount: 80000,
    currentValue: 140000,
    returnAmount: 60000,
    returnPercentage: 75,
    status: 'active',
    maturityDate: '2024-09-15',
    circleId: 'sports-drama',
    circleName: 'Sports Drama Circle',
    investmentDate: '2024-03-05',
    projectType: 'film',
    director: 'Nitesh Tiwari',
    genre: 'Action, Biography, Drama',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium',
    targetAmount: 74500000,
    raisedAmount: 18600000,
    fundedPercentage: 25
  },
  {
    id: '5',
    projectId: '6',
    projectName: 'Zindagi Na Milegi Dobara',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BOGIzYzg5NzItNDRkYS00NmIzLTk3NzQtZWYwY2VlZDhiYWQ4XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 60000,
    currentValue: 90000,
    returnAmount: 30000,
    returnPercentage: 50,
    status: 'active',
    maturityDate: '2024-08-25',
    circleId: 'friendship-films',
    circleName: 'Friendship Films Circle',
    investmentDate: '2024-02-20',
    projectType: 'film',
    director: 'Zoya Akhtar',
    genre: 'Comedy, Drama, Musical',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium',
    targetAmount: 68200000,
    raisedAmount: 34100000,
    fundedPercentage: 50
  },

  // 5 Hollywood Movies
  {
    id: '6',
    projectId: '45',
    projectName: 'Forrest Gump',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 45000,
    currentValue: 72000,
    returnAmount: 27000,
    returnPercentage: 60,
    status: 'completed',
    maturityDate: '2023-12-15',
    circleId: 'hollywood-drama',
    circleName: 'Hollywood Drama Circle',
    investmentDate: '2023-06-10',
    projectType: 'film',
    director: 'Robert Zemeckis',
    genre: 'Drama, Romance',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 37300000,
    raisedAmount: 28300000,
    fundedPercentage: 76
  },
  {
    id: '7',
    projectId: '48',
    projectName: 'The Matrix',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    investmentAmount: 65000,
    currentValue: 117000,
    returnAmount: 52000,
    returnPercentage: 80,
    status: 'completed',
    maturityDate: '2023-11-30',
    circleId: 'sci-fi-action',
    circleName: 'Sci-Fi Action Circle',
    investmentDate: '2023-05-15',
    projectType: 'film',
    director: 'Lana Wachowski, Lilly Wachowski',
    genre: 'Action, Sci-Fi',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 77000000,
    raisedAmount: 38500000,
    fundedPercentage: 50
  },
  {
    id: '8',
    projectId: '50',
    projectName: 'The Shawshank Redemption',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 55000,
    currentValue: 93500,
    returnAmount: 38500,
    returnPercentage: 70,
    status: 'completed',
    maturityDate: '2023-10-20',
    circleId: 'drama-films',
    circleName: 'Drama Films Circle',
    investmentDate: '2023-04-20',
    projectType: 'film',
    director: 'Frank Darabont',
    genre: 'Drama',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'low',
    targetAmount: 25000000,
    raisedAmount: 20000000,
    fundedPercentage: 80
  },
  {
    id: '9',
    projectId: '52',
    projectName: 'Pulp Fiction',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 70000,
    currentValue: 126000,
    returnAmount: 56000,
    returnPercentage: 80,
    status: 'completed',
    maturityDate: '2023-09-15',
    circleId: 'crime-drama',
    circleName: 'Crime Drama Circle',
    investmentDate: '2023-03-10',
    projectType: 'film',
    director: 'Quentin Tarantino',
    genre: 'Crime, Drama',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'high',
    targetAmount: 8500000,
    raisedAmount: 6800000,
    fundedPercentage: 80
  },
  {
    id: '10',
    projectId: '54',
    projectName: 'The Godfather',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 90000,
    currentValue: 162000,
    returnAmount: 72000,
    returnPercentage: 80,
    status: 'completed',
    maturityDate: '2023-08-30',
    circleId: 'classic-crime',
    circleName: 'Classic Crime Circle',
    investmentDate: '2023-02-15',
    projectType: 'film',
    director: 'Francis Ford Coppola',
    genre: 'Crime, Drama',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 6000000,
    raisedAmount: 5400000,
    fundedPercentage: 90
  },

  // Web Series
  {
    id: '11',
    projectId: 'ws1',
    projectName: 'Sacred Games',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BN2EyODc1MDAtNTg0ZC00MjRhLTg1NzctM2NjYTlmOGMwYWNiXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 120000,
    currentValue: 180000,
    returnAmount: 60000,
    returnPercentage: 50,
    status: 'active',
    maturityDate: '2024-06-15',
    circleId: 'crime-thriller-series',
    circleName: 'Crime Thriller Series Circle',
    investmentDate: '2024-01-10',
    projectType: 'web-series',
    director: 'Vikramaditya Motwane',
    genre: 'Crime, Drama, Thriller',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium',
    targetAmount: 50000000,
    raisedAmount: 25000000,
    fundedPercentage: 50
  },
  {
    id: '12',
    projectId: 'ws2',
    projectName: 'Mirzapur',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BZTFjMzMxZTUtYTMyNy00OWNhLTk4ODQtNGI1NjI1NjJhMzc3XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 95000,
    currentValue: 142500,
    returnAmount: 47500,
    returnPercentage: 50,
    status: 'active',
    maturityDate: '2024-07-20',
    circleId: 'action-crime-series',
    circleName: 'Action Crime Series Circle',
    investmentDate: '2024-02-05',
    projectType: 'web-series',
    director: 'Karan Anshuman',
    genre: 'Action, Crime, Drama',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium',
    targetAmount: 40000000,
    raisedAmount: 20000000,
    fundedPercentage: 50
  },
  {
    id: '13',
    projectId: 'ws3',
    projectName: 'Money Heist',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BODI0ZTljYTMtODQ1NC00NmI0LTk1YWUtN2FlNDM1MDExMDlhXkEyXkFqcGdeQXVyMTM0NTUzNDIy._V1_SX300.jpg',
    investmentAmount: 150000,
    currentValue: 240000,
    returnAmount: 90000,
    returnPercentage: 60,
    status: 'completed',
    maturityDate: '2023-12-01',
    circleId: 'international-thriller',
    circleName: 'International Thriller Circle',
    investmentDate: '2023-06-15',
    projectType: 'web-series',
    director: 'Álex Pina',
    genre: 'Action, Crime, Drama',
    sector: 'Hollywood',
    region: 'Spain',
    language: 'Spanish',
    risk: 'high',
    targetAmount: 80000000,
    raisedAmount: 48000000,
    fundedPercentage: 60
  },

  // Music Projects
  {
    id: '14',
    projectId: '1000',
    projectName: 'Chaiyya Chaiyya',
    projectPoster: 'https://i.scdn.co/image/ab67616d0000b273d4c98292bd7eb92599c88694',
    investmentAmount: 30000,
    currentValue: 45000,
    returnAmount: 15000,
    returnPercentage: 50,
    status: 'active',
    maturityDate: '2024-05-10',
    circleId: 'a-r-rahman-music',
    circleName: 'A.R. Rahman Music Circle',
    investmentDate: '2024-01-20',
    projectType: 'music',
    artist: 'A.R. Rahman',
    genre: 'Film Soundtrack',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'low',
    targetAmount: 13075334,
    raisedAmount: 11375540,
    fundedPercentage: 87
  },
  {
    id: '15',
    projectId: '1001',
    projectName: 'Jai Ho',
    projectPoster: 'https://i.scdn.co/image/ab67616d0000b2732f4d7c01664823cb4297ce21',
    investmentAmount: 25000,
    currentValue: 32500,
    returnAmount: 7500,
    returnPercentage: 30,
    status: 'active',
    maturityDate: '2024-04-15',
    circleId: 'oscar-winning-music',
    circleName: 'Oscar Winning Music Circle',
    investmentDate: '2024-02-15',
    projectType: 'music',
    artist: 'A.R. Rahman',
    genre: 'Film Soundtrack',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'low',
    targetAmount: 39986342,
    raisedAmount: 5198224,
    fundedPercentage: 13
  },
  {
    id: '16',
    projectId: '1002',
    projectName: 'Tere Bina',
    projectPoster: 'https://i.scdn.co/image/ab67616d0000b2730504fdf58bae8cd52dd13047',
    investmentAmount: 35000,
    currentValue: 49000,
    returnAmount: 14000,
    returnPercentage: 40,
    status: 'active',
    maturityDate: '2024-03-20',
    circleId: 'romantic-music',
    circleName: 'Romantic Music Circle',
    investmentDate: '2024-01-30',
    projectType: 'music',
    artist: 'A.R. Rahman',
    genre: 'Film Soundtrack',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium',
    targetAmount: 45840925,
    raisedAmount: 12835459,
    fundedPercentage: 28
  }
];

// Portfolio Service Class
export class PortfolioService {
  private static instance: PortfolioService;
  private investments: UserInvestment[] = portfolioData;

  private constructor() {}

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  public getAllInvestments(): UserInvestment[] {
    return this.investments;
  }

  public getActiveInvestments(): UserInvestment[] {
    return this.investments.filter(inv => inv.status === 'active');
  }

  public getCompletedInvestments(): UserInvestment[] {
    return this.investments.filter(inv => inv.status === 'completed');
  }

  public getInvestmentById(id: string): UserInvestment | undefined {
    return this.investments.find(inv => inv.id === id);
  }

  public getInvestmentsByType(type: 'film' | 'music' | 'web-series'): UserInvestment[] {
    return this.investments.filter(inv => inv.projectType === type);
  }

  public getInvestmentsBySector(sector: string): UserInvestment[] {
    return this.investments.filter(inv => inv.sector === sector);
  }

  public getTotalInvested(): number {
    return this.investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  }

  public getTotalCurrentValue(): number {
    return this.investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  }

  public getTotalReturns(): number {
    return this.investments.reduce((sum, inv) => sum + inv.returnAmount, 0);
  }

  public getAverageReturnPercentage(): number {
    if (this.investments.length === 0) return 0;
    const totalPercentage = this.investments.reduce((sum, inv) => sum + inv.returnPercentage, 0);
    return totalPercentage / this.investments.length;
  }

  public getInvestmentStats() {
    const totalInvested = this.getTotalInvested();
    const totalCurrentValue = this.getTotalCurrentValue();
    const totalReturns = this.getTotalReturns();
    const averageReturn = this.getAverageReturnPercentage();

    return {
      totalInvested,
      totalCurrentValue,
      totalReturns,
      averageReturn,
      totalInvestments: this.investments.length,
      activeInvestments: this.getActiveInvestments().length,
      completedInvestments: this.getCompletedInvestments().length
    };
  }

  public addInvestment(investment: UserInvestment): void {
    this.investments.push(investment);
  }

  public updateInvestment(id: string, updates: Partial<UserInvestment>): void {
    const index = this.investments.findIndex(inv => inv.id === id);
    if (index !== -1) {
      this.investments[index] = { ...this.investments[index], ...updates };
    }
  }

  public removeInvestment(id: string): void {
    this.investments = this.investments.filter(inv => inv.id !== id);
  }

  public getFormattedInvestments() {
    return this.investments.map(inv => ({
      ...inv,
      formattedInvestmentAmount: `₹${inv.investmentAmount.toLocaleString()}`,
      formattedCurrentValue: `₹${inv.currentValue.toLocaleString()}`,
      formattedReturnAmount: `₹${inv.returnAmount.toLocaleString()}`,
      formattedReturnPercentage: `${inv.returnPercentage}%`
    }));
  }
}

// Export the service instance
export const portfolioService = PortfolioService.getInstance();

// Export the raw data for backward compatibility
export const userInvestments = portfolioData; 
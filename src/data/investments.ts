export interface UserInvestment {
  id: string;
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
}

export const userInvestments: UserInvestment[] = [
  {
    id: '1',
    projectName: 'Sholay',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNmI1NTRmMWQtNDJlZC00MGIzLWEwYzctYTQwNTI2NWNjM2MwXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 50000,
    currentValue: 57500,
    returnAmount: 7500,
    returnPercentage: 15,
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
    risk: 'low'
  },
  {
    id: '2',
    projectName: 'Dilwale Dulhania Le Jayenge',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMDQyMDI4ZGMtYjI5MS00YTk1LTk3ZDgtZTA3MzQ5YWQ4Y2Q4XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 75000,
    currentValue: 105000,
    returnAmount: 30000,
    returnPercentage: 40,
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
    risk: 'low'
  },
  {
    id: '3',
    projectName: '3 Idiots',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 100000,
    currentValue: 142000,
    returnAmount: 42000,
    returnPercentage: 42,
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
    risk: 'low'
  },
  {
    id: '4',
    projectName: 'Dangal',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg',
    investmentAmount: 80000,
    currentValue: 100000,
    returnAmount: 20000,
    returnPercentage: 25,
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
    risk: 'medium'
  },
  {
    id: '5',
    projectName: 'Zindagi Na Milegi Dobara',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BOGIzYzg5NzItNDRkYS00NmIzLTk3NzQtZWYwY2VlZDhiYWQ4XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 60000,
    currentValue: 75000,
    returnAmount: 15000,
    returnPercentage: 25,
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
    risk: 'medium'
  },
  {
    id: '6',
    projectName: 'Gully Boy',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BOWFkY2M3NDctZGEzMS00M2VmLTgzMTAtZWFiNjVmZDc5NWFjXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 40000,
    currentValue: 43200,
    returnAmount: 3200,
    returnPercentage: 8,
    status: 'active',
    maturityDate: '2024-12-01',
    circleId: 'music-films',
    circleName: 'Music Films Circle',
    investmentDate: '2024-03-15',
    projectType: 'film',
    director: 'Zoya Akhtar',
    genre: 'Drama, Music, Romance',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium'
  },
  {
    id: '7',
    projectName: 'Andhadhun',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMjZiYTNkNjUtNzI3MC00YWJmLTljM2QtNTI3MTU3ODYzNWFjXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 35000,
    currentValue: 44800,
    returnAmount: 9800,
    returnPercentage: 28,
    status: 'active',
    maturityDate: '2024-07-20',
    circleId: 'thriller-films',
    circleName: 'Thriller Films Circle',
    investmentDate: '2024-01-30',
    projectType: 'film',
    director: 'Sriram Raghavan',
    genre: 'Crime, Mystery, Thriller',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'high'
  },
  {
    id: '8',
    projectName: 'Shape of You',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/4/45/Ed_Sheeran_-_Shape_of_You.png',
    investmentAmount: 25000,
    currentValue: 30000,
    returnAmount: 5000,
    returnPercentage: 20,
    status: 'completed',
    maturityDate: '2023-12-15',
    circleId: 'international-music',
    circleName: 'International Music Circle',
    investmentDate: '2023-06-10',
    projectType: 'music',
    artist: 'Ed Sheeran',
    genre: 'Pop',
    sector: 'International',
    region: 'UK',
    language: 'English',
    risk: 'low'
  },
  {
    id: '9',
    projectName: 'Despacito',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Luis_Fonsi_Despacito_cover_art.png',
    investmentAmount: 30000,
    currentValue: 42000,
    returnAmount: 12000,
    returnPercentage: 40,
    status: 'completed',
    maturityDate: '2023-11-30',
    circleId: 'latin-music',
    circleName: 'Latin Music Circle',
    investmentDate: '2023-05-15',
    projectType: 'music',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    genre: 'Latin Pop',
    sector: 'International',
    region: 'Puerto Rico',
    language: 'Spanish',
    risk: 'medium'
  },
  {
    id: '10',
    projectName: 'Uptown Funk',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Mark_Ronson_Uptown_Funk_ft._Bruno_Mars.png',
    investmentAmount: 45000,
    currentValue: 67500,
    returnAmount: 22500,
    returnPercentage: 50,
    status: 'completed',
    maturityDate: '2023-10-20',
    circleId: 'pop-music',
    circleName: 'Pop Music Circle',
    investmentDate: '2023-04-20',
    projectType: 'music',
    artist: 'Mark Ronson ft. Bruno Mars',
    genre: 'Funk, Pop',
    sector: 'International',
    region: 'USA',
    language: 'English',
    risk: 'low'
  },
  // ... (add at least 10 more diverse investments)
  {
    id: '11',
    projectName: 'Queen',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMjA2YjYwYzUtYjQwZi00YjQwLTg2YjMtYjQwYzYwYzYwYzYwXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_FMjpg_UX1000_.jpg',
    investmentAmount: 32000,
    currentValue: 35200,
    returnAmount: 3200,
    returnPercentage: 10,
    status: 'matured',
    maturityDate: '2024-06-01',
    circleId: 'women-centric',
    circleName: 'Women Centric Films',
    investmentDate: '2023-12-01',
    projectType: 'film',
    director: 'Vikas Bahl',
    genre: 'Adventure, Comedy, Drama',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium'
  },
  {
    id: '12',
    projectName: 'Sacred Games',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Sacred_Games_poster.jpg',
    investmentAmount: 55000,
    currentValue: 60500,
    returnAmount: 5500,
    returnPercentage: 10,
    status: 'active',
    maturityDate: '2024-11-01',
    circleId: 'web-series',
    circleName: 'Web Series Circle',
    investmentDate: '2024-03-01',
    projectType: 'web-series',
    director: 'Anurag Kashyap',
    genre: 'Crime, Drama, Thriller',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'high'
  },
  {
    id: '13',
    projectName: 'Money Heist',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Money_Heist_poster.jpg',
    investmentAmount: 70000,
    currentValue: 91000,
    returnAmount: 21000,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-04-01',
    circleId: 'international-web',
    circleName: 'International Web Series',
    investmentDate: '2023-09-01',
    projectType: 'web-series',
    director: 'Álex Pina',
    genre: 'Action, Crime, Drama',
    sector: 'International',
    region: 'Spain',
    language: 'Spanish',
    risk: 'medium'
  },
  {
    id: '14',
    projectName: 'Paatal Lok',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Paatal_Lok_poster.jpg',
    investmentAmount: 28000,
    currentValue: 33600,
    returnAmount: 5600,
    returnPercentage: 20,
    status: 'active',
    maturityDate: '2024-10-01',
    circleId: 'crime-web',
    circleName: 'Crime Web Series',
    investmentDate: '2024-02-01',
    projectType: 'web-series',
    director: 'Avinash Arun',
    genre: 'Crime, Drama, Thriller',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'high'
  },
  {
    id: '15',
    projectName: 'Narcos',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Narcos_season_3.png',
    investmentAmount: 65000,
    currentValue: 84500,
    returnAmount: 19500,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-03-01',
    circleId: 'crime-international',
    circleName: 'International Crime Series',
    investmentDate: '2023-08-01',
    projectType: 'web-series',
    director: 'Chris Brancato',
    genre: 'Biography, Crime, Drama',
    sector: 'International',
    region: 'USA',
    language: 'English',
    risk: 'medium'
  },
  {
    id: '16',
    projectName: 'Bahubali 2',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Baahubali_2_The_Conclusion_poster.jpg',
    investmentAmount: 90000,
    currentValue: 117000,
    returnAmount: 27000,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-02-01',
    circleId: 'regional-films',
    circleName: 'Regional Films Circle',
    investmentDate: '2023-07-01',
    projectType: 'film',
    director: 'S. S. Rajamouli',
    genre: 'Action, Drama, Fantasy',
    sector: 'Regional',
    region: 'India',
    language: 'Telugu',
    risk: 'medium'
  },
  {
    id: '17',
    projectName: 'KGF Chapter 2',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/9/9f/K.G.F_Chapter_2.jpg',
    investmentAmount: 85000,
    currentValue: 110500,
    returnAmount: 25500,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-01-01',
    circleId: 'regional-films',
    circleName: 'Regional Films Circle',
    investmentDate: '2023-06-01',
    projectType: 'film',
    director: 'Prashanth Neel',
    genre: 'Action, Crime, Drama',
    sector: 'Regional',
    region: 'India',
    language: 'Kannada',
    risk: 'medium'
  },
  {
    id: '18',
    projectName: 'Jai Bhim',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Jai_Bhim_film_poster.jpg',
    investmentAmount: 40000,
    currentValue: 48000,
    returnAmount: 8000,
    returnPercentage: 20,
    status: 'active',
    maturityDate: '2024-09-01',
    circleId: 'regional-films',
    circleName: 'Regional Films Circle',
    investmentDate: '2024-01-01',
    projectType: 'film',
    director: 'T. J. Gnanavel',
    genre: 'Crime, Drama',
    sector: 'Regional',
    region: 'India',
    language: 'Tamil',
    risk: 'high'
  },
  {
    id: '19',
    projectName: 'The Family Man',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/7/7e/The_Family_Man_poster.jpg',
    investmentAmount: 37000,
    currentValue: 42500,
    returnAmount: 5500,
    returnPercentage: 15,
    status: 'active',
    maturityDate: '2024-08-01',
    circleId: 'web-series',
    circleName: 'Web Series Circle',
    investmentDate: '2024-01-15',
    projectType: 'web-series',
    director: 'Raj & DK',
    genre: 'Action, Comedy, Drama',
    sector: 'Bollywood',
    region: 'India',
    language: 'Hindi',
    risk: 'medium'
  },
  {
    id: '20',
    projectName: 'Coco',
    projectPoster: 'https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg',
    investmentAmount: 60000,
    currentValue: 72000,
    returnAmount: 12000,
    returnPercentage: 20,
    status: 'completed',
    maturityDate: '2023-12-01',
    circleId: 'animation-films',
    circleName: 'Animation Films Circle',
    investmentDate: '2023-05-01',
    projectType: 'film',
    director: 'Lee Unkrich',
    genre: 'Animation, Adventure, Family',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'low'
  }
];

// Shared Investment Service
export class InvestmentService {
  private static instance: InvestmentService;
  private investments: UserInvestment[] = userInvestments;

  private constructor() {}

  public static getInstance(): InvestmentService {
    if (!InvestmentService.instance) {
      InvestmentService.instance = new InvestmentService();
    }
    return InvestmentService.instance;
  }

  // Get all investments
  public getAllInvestments(): UserInvestment[] {
    return this.investments;
  }

  // Get active investments only
  public getActiveInvestments(): UserInvestment[] {
    return this.investments.filter(inv => inv.status === 'active');
  }

  // Get completed investments only
  public getCompletedInvestments(): UserInvestment[] {
    return this.investments.filter(inv => inv.status === 'completed');
  }

  // Get investment by ID
  public getInvestmentById(id: string): UserInvestment | undefined {
    return this.investments.find(inv => inv.id === id);
  }

  // Get investments by type
  public getInvestmentsByType(type: 'film' | 'music' | 'web-series'): UserInvestment[] {
    return this.investments.filter(inv => inv.projectType === type);
  }

  // Get investments by sector
  public getInvestmentsBySector(sector: string): UserInvestment[] {
    return this.investments.filter(inv => inv.sector === sector);
  }

  // Calculate total invested amount
  public getTotalInvested(): number {
    return this.investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  }

  // Calculate total current value
  public getTotalCurrentValue(): number {
    return this.investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  }

  // Calculate total returns
  public getTotalReturns(): number {
    return this.investments.reduce((sum, inv) => sum + inv.returnAmount, 0);
  }

  // Calculate average return percentage
  public getAverageReturnPercentage(): number {
    const totalInvested = this.getTotalInvested();
    if (totalInvested === 0) return 0;
    return (this.getTotalReturns() / totalInvested) * 100;
  }

  // Get investment statistics
  public getInvestmentStats() {
    const totalInvested = this.getTotalInvested();
    const totalCurrentValue = this.getTotalCurrentValue();
    const totalReturns = this.getTotalReturns();
    const activeInvestments = this.getActiveInvestments().length;
    const completedInvestments = this.getCompletedInvestments().length;

    return {
      totalInvested,
      totalCurrentValue,
      totalReturns,
      activeInvestments,
      completedInvestments,
      averageReturnPercentage: this.getAverageReturnPercentage(),
      totalInvestments: this.investments.length
    };
  }

  // Add new investment
  public addInvestment(investment: UserInvestment): void {
    this.investments.push(investment);
  }

  // Update investment
  public updateInvestment(id: string, updates: Partial<UserInvestment>): void {
    const index = this.investments.findIndex(inv => inv.id === id);
    if (index !== -1) {
      this.investments[index] = { ...this.investments[index], ...updates };
    }
  }

  // Remove investment
  public removeInvestment(id: string): void {
    this.investments = this.investments.filter(inv => inv.id !== id);
  }

  // Get formatted investments for display
  public getFormattedInvestments() {
    return this.investments.map(inv => ({
      id: inv.id,
      title: inv.projectName,
      type: inv.projectType,
      category: inv.sector || 'Unknown',
      invested: inv.investmentAmount,
      currentValue: inv.currentValue,
      returns: inv.returnAmount,
      returnPercentage: inv.returnPercentage,
      status: inv.status === 'active' ? 'Active' : inv.status === 'completed' ? 'Completed' : 'Pending',
      poster: inv.projectPoster,
      releaseDate: inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : 'TBD',
      circleId: inv.circleId,
      circleName: inv.circleName,
      director: inv.director,
      artist: inv.artist,
      genre: inv.genre,
      risk: inv.risk
    }));
  }
}

// Export singleton instance
export const investmentService = InvestmentService.getInstance(); 
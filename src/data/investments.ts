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

export const userInvestments: UserInvestment[] = [
  {
    id: '1',
    projectId: '1',
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
    risk: 'medium',
    targetAmount: 68200000,
    raisedAmount: 34100000,
    fundedPercentage: 50
  },
  {
    id: '6',
    projectId: '7',
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
    risk: 'medium',
    targetAmount: 45000000,
    raisedAmount: 18000000,
    fundedPercentage: 40
  },
  {
    id: '7',
    projectId: '8',
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
    risk: 'high',
    targetAmount: 35000000,
    raisedAmount: 21000000,
    fundedPercentage: 60
  },
  {
    id: '8',
    projectId: '45',
    projectName: 'Forrest Gump',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 45000,
    currentValue: 54000,
    returnAmount: 9000,
    returnPercentage: 20,
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
    id: '9',
    projectId: '48',
    projectName: 'The Matrix',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 65000,
    currentValue: 91000,
    returnAmount: 26000,
    returnPercentage: 40,
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
    raisedAmount: 18500000,
    fundedPercentage: 24
  },
  {
    id: '10',
    projectId: '50',
    projectName: 'The Wolf of Wall Street',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_SX300.jpg',
    investmentAmount: 75000,
    currentValue: 97500,
    returnAmount: 22500,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2023-10-20',
    circleId: 'wall-street-films',
    circleName: 'Wall Street Films Circle',
    investmentDate: '2023-04-20',
    projectType: 'film',
    director: 'Martin Scorsese',
    genre: 'Biography, Comedy, Crime',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'low',
    targetAmount: 8600000,
    raisedAmount: 7600000,
    fundedPercentage: 88
  },
  {
    id: '11',
    projectId: '51',
    projectName: 'Titanic',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 90000,
    currentValue: 117000,
    returnAmount: 27000,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-06-01',
    circleId: 'epic-romance',
    circleName: 'Epic Romance Circle',
    investmentDate: '2023-12-01',
    projectType: 'film',
    director: 'James Cameron',
    genre: 'Drama, Romance',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'low',
    targetAmount: 81900000,
    raisedAmount: 19700000,
    fundedPercentage: 24
  },
  {
    id: '12',
    projectId: '52',
    projectName: 'Gladiator',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 55000,
    currentValue: 71500,
    returnAmount: 16500,
    returnPercentage: 30,
    status: 'active',
    maturityDate: '2024-11-01',
    circleId: 'epic-action',
    circleName: 'Epic Action Circle',
    investmentDate: '2024-03-01',
    projectType: 'film',
    director: 'Ridley Scott',
    genre: 'Action, Adventure, Drama',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 48600000,
    raisedAmount: 28700000,
    fundedPercentage: 59
  },
  {
    id: '13',
    projectId: '60',
    projectName: 'Avatar',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 85000,
    currentValue: 110500,
    returnAmount: 25500,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-04-01',
    circleId: 'sci-fi-fantasy',
    circleName: 'Sci-Fi Fantasy Circle',
    investmentDate: '2023-09-01',
    projectType: 'film',
    director: 'James Cameron',
    genre: 'Action, Adventure, Fantasy',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 37600000,
    raisedAmount: 20700000,
    fundedPercentage: 55
  },
  {
    id: '14',
    projectId: '138',
    projectName: 'Barbie',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BYjI3NDU0ZGYtYjA2YS00Y2RlLTgwZDAtYTE2YTM5ZjE1M2JlXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 42000,
    currentValue: 54600,
    returnAmount: 12600,
    returnPercentage: 30,
    status: 'active',
    maturityDate: '2024-10-01',
    circleId: 'comedy-fantasy',
    circleName: 'Comedy Fantasy Circle',
    investmentDate: '2024-02-01',
    projectType: 'film',
    director: 'Greta Gerwig',
    genre: 'Adventure, Comedy, Fantasy',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'low',
    targetAmount: 83700000,
    raisedAmount: 72800000,
    fundedPercentage: 87
  },
  {
    id: '15',
    projectId: '144',
    projectName: 'Wonka',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BM2Y1N2ZhNjctYjVhZC00MDg2LWFhNTItMzI3ZjAwZDhjYmFiXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 48000,
    currentValue: 62400,
    returnAmount: 14400,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-03-01',
    circleId: 'family-adventure',
    circleName: 'Family Adventure Circle',
    investmentDate: '2023-08-01',
    projectType: 'film',
    director: 'Paul King',
    genre: 'Adventure, Comedy, Family',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 78500000,
    raisedAmount: 19600000,
    fundedPercentage: 25
  },
  {
    id: '16',
    projectId: '157',
    projectName: 'The Last of Us',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 38000,
    currentValue: 49400,
    returnAmount: 11400,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-02-01',
    circleId: 'post-apocalyptic',
    circleName: 'Post-Apocalyptic Circle',
    investmentDate: '2023-07-01',
    projectType: 'film',
    director: 'Craig Mazin',
    genre: 'Action, Adventure, Drama',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'high',
    targetAmount: 18000000,
    raisedAmount: 1400000,
    fundedPercentage: 8
  },
  {
    id: '17',
    projectId: '165',
    projectName: 'The Bear',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BYWZhNDZiMzAtZmZlYS00MWFmLWE2MWEtNDAxZTZiN2U4Y2U2XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 28000,
    currentValue: 36400,
    returnAmount: 8400,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2024-01-01',
    circleId: 'comedy-drama',
    circleName: 'Comedy Drama Circle',
    investmentDate: '2023-06-01',
    projectType: 'film',
    director: 'Christopher Storer',
    genre: 'Comedy, Drama',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 100000000,
    raisedAmount: 96000000,
    fundedPercentage: 96
  },
  {
    id: '18',
    projectId: '201',
    projectName: 'Avatar: The Way of Water',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 120000,
    currentValue: 156000,
    returnAmount: 36000,
    returnPercentage: 30,
    status: 'active',
    maturityDate: '2024-09-01',
    circleId: 'sci-fi-fantasy',
    circleName: 'Sci-Fi Fantasy Circle',
    investmentDate: '2024-01-01',
    projectType: 'film',
    director: 'James Cameron',
    genre: 'Action, Adventure, Fantasy',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'low',
    targetAmount: 76000000,
    raisedAmount: 2300000,
    fundedPercentage: 3
  },
  {
    id: '19',
    projectId: '82',
    projectName: 'Breaking Bad',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 65000,
    currentValue: 84500,
    returnAmount: 19500,
    returnPercentage: 30,
    status: 'active',
    maturityDate: '2024-08-01',
    circleId: 'crime-drama',
    circleName: 'Crime Drama Circle',
    investmentDate: '2024-01-15',
    projectType: 'film',
    director: 'Vince Gilligan',
    genre: 'Crime, Drama, Thriller',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'medium',
    targetAmount: 86800000,
    raisedAmount: 29500000,
    fundedPercentage: 34
  },
  {
    id: '20',
    projectId: '100',
    projectName: 'Better Call Saul',
    projectPoster: 'https://m.media-amazon.com/images/M/MV5BNDdjNTEzMjMtYjM3Mi00NzQ3LWFlNWMtZjdmYWU3ZDkzMjk1XkEyXkFqcGc@._V1_SX300.jpg',
    investmentAmount: 55000,
    currentValue: 71500,
    returnAmount: 16500,
    returnPercentage: 30,
    status: 'completed',
    maturityDate: '2023-12-01',
    circleId: 'crime-drama',
    circleName: 'Crime Drama Circle',
    investmentDate: '2023-05-01',
    projectType: 'film',
    director: 'Vince Gilligan',
    genre: 'Crime, Drama',
    sector: 'Hollywood',
    region: 'USA',
    language: 'English',
    risk: 'low',
    targetAmount: 83200000,
    raisedAmount: 83200000,
    fundedPercentage: 100
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
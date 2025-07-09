export interface Project {
  id: string;
  title: string;
  type: string;
  category: string;
  language: string;
  status: string;
  fundedPercentage: number;
  targetAmount: number;
  raisedAmount: number;
  createdAt: string;
  updatedAt: string;
  poster: string;
  description: string;
  director?: string;
  genre: string;
  tags: string[];
  perks: string[];
  rating: number;
  trailer: string;
  movie?: string;
  keyPeople: any[];
  actor?: string;
  actress?: string;
  productionHouse?: string;
  targetAmountHuman?: string;
  raisedAmountHuman?: string;
  keyCommunityData?: Array<{
    id: string;
    movieId: string;
    movieName: string;
    productionHouse: string;
    keyPeople: any[];
    actor: string;
    actress: string;
    director: string;
  }>;
  disabled: boolean;
  featured?: boolean;
  budget?: number;
  cast?: string;
  artist?: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  project?: string;
  projectId?: string;
} 
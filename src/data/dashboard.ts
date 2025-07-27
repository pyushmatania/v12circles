// Calculate real stats from investment data
const calculateRealStats = () => {
  // These would typically come from the investment service
  const totalInvested = 1087000; // Sum of all investment amounts
  const totalCurrentValue = 1413700; // Sum of all current values
  const totalReturns = totalCurrentValue - totalInvested;
  const returnPercentage = (totalReturns / totalInvested) * 100;
  
  return {
    totalInvestments: totalInvested,
    totalReturns: totalReturns,
    activeProjects: 12, // Count of active investments
    totalPerks: 36, // Estimated based on active projects
    circleLevel: 'Producer',
    nextLevel: 'Executive Producer',
    portfolioValue: totalCurrentValue,
    monthlyGrowth: returnPercentage,
    totalProjects: 20,
    completedProjects: 8
  };
};

export const dashboardStats = calculateRealStats();

export const recentActivities = [
  {
    id: '1',
    type: 'investment',
    title: 'Invested in "Gully Boy"',
    description: 'Added ₹40,000 to your investment',
    amount: 40000,
    date: '2024-03-15',
    status: 'completed',
    project: 'Gully Boy'
  },
  {
    id: '2',
    type: 'perk',
    title: 'Premiere Screening Access',
    description: 'VIP access to Dangal premiere',
    date: '2024-03-10',
    status: 'upcoming',
    project: 'Dangal'
  },
  {
    id: '3',
    type: 'return',
    title: 'Returns from "Stree"',
    description: 'Received ₹16,800 in returns',
    amount: 16800,
    date: '2024-04-01',
    status: 'completed',
    project: 'Stree'
  },
  {
    id: '4',
    type: 'perk',
    title: 'Signed Poster Delivered',
    description: 'Limited edition signed poster from 3 Idiots',
    date: '2024-03-05',
    status: 'delivered',
    project: '3 Idiots'
  },
  {
    id: '5',
    type: 'investment',
    title: 'Invested in "Padmaavat"',
    description: 'Added ₹1,20,000 to your investment',
    amount: 120000,
    date: '2023-07-01',
    status: 'completed',
    project: 'Padmaavat'
  },
  {
    id: '6',
    type: 'perk',
    title: 'Behind the Scenes Access',
    description: 'Exclusive BTS content from Sholay',
    date: '2024-02-28',
    status: 'available',
    project: 'Sholay'
  },
  {
    id: '7',
    type: 'return',
    title: 'Returns from "Uri: The Surgical Strike"',
    description: 'Received ₹26,000 in returns',
    amount: 26000,
    date: '2023-11-30',
    status: 'completed',
    project: 'Uri: The Surgical Strike'
  },
  {
    id: '8',
    type: 'investment',
    title: 'Invested in "Dilwale Dulhania Le Jayenge"',
    description: 'Added ₹75,000 to your investment',
    amount: 75000,
    date: '2024-02-10',
    status: 'completed',
    project: 'Dilwale Dulhania Le Jayenge'
  }
]; 
// Import from portfolio.ts - single source of truth
export { UserInvestment, portfolioData as userInvestments, PortfolioService, portfolioService } from './portfolio';

// Re-export the service instance for backward compatibility
export const InvestmentService = PortfolioService; 
import { 
  User, 
  MessageCircle, 
  DollarSign, 
  Film, 
  Gift, 
  Info, 
  Music,
  TrendingUp,
  Users,
  Star,
  Share2,
  Award,
  Hash,
  Zap,
  Globe
} from 'lucide-react';
import { projects } from '../data/projects';
import { portfolioData } from '../data/portfolio';
import { musicAlbums } from '../data/musicAlbums';

import { getUserAvatar } from './imageUtils';

// Real friends data from Community component
const realFriends = [
  { id: 'alok', name: 'Alok Tripathy', avatar: getUserAvatar('Alok Tripathy'), online: true },
  { id: 'ankit', name: 'Ankit Singh', avatar: getUserAvatar('Ankit Singh'), online: true },
  { id: 'biren', name: 'Biren Dora', avatar: getUserAvatar('Biren Dora'), online: false },
  { id: 'adya', name: 'Adya Rath', avatar: getUserAvatar('Adya Rath'), online: true },
  { id: 'soham', name: 'Soham Bardhan', avatar: getUserAvatar('Soham Bardhan'), online: false },
  { id: 'praveen', name: 'Praveen Dehury', avatar: getUserAvatar('Praveen Dehury'), online: true },
  { id: 'ipsit', name: 'Ipsit Tripathy', avatar: getUserAvatar('Ipsit Tripathy'), online: true },
  { id: 'kamlesh', name: 'Kamlesh Biswal', avatar: getUserAvatar('Kamlesh Biswal'), online: true }
];

// Real projects from data - optimized for performance
const realProjects = [
  ...projects.slice(0, 8), // Reduced to top 8 projects for better performance
  ...musicAlbums.slice(0, 3) // Reduced to top 3 music albums
];

// Real portfolio investments - optimized for performance
const realInvestments = portfolioData.slice(0, 6); // Reduced to top 6 investments

// Generate realistic notifications from real data
export const generateRealNotifications = () => {
  // 1. Community Notifications (from real friends and projects)
  const communityNotifications = [
    {
      id: '1',
      type: 'friend_joined',
      category: 'community',
      title: 'Friend Joined Circles',
      message: `${realFriends[2].name} joined Circles and is now following your investment journey!`,
      time: '5 minutes ago',
      read: false,
      icon: User,
      action: 'View Profile',
      user: { id: realFriends[2].id, name: realFriends[2].name, avatar: realFriends[2].avatar }
    },
    {
      id: '2',
      type: 'channel_update',
      category: 'community',
      title: 'New Channel Post',
      message: `${realFriends[0].name} posted: "Latest trailer dekh liya! Cinematography toh bilkul stunning hai! 🎬✨"`,
      time: '15 minutes ago',
      read: false,
      icon: Hash,
      action: 'View Post',
      channel: { id: '1', name: 'Film Updates', avatar: realFriends[0].avatar }
    },
    {
      id: '3',
      type: 'community_event',
      category: 'community',
      title: 'Community Meetup',
      message: `${realProjects[0].title} fans are hosting a meetup this weekend. 15 people are attending!`,
      time: '30 minutes ago',
      read: false,
      icon: Users,
      action: 'Join Event',
      event: { id: '1', title: `${realProjects[0].title} Fan Meetup`, attendees: 15 }
    },
    {
      id: '4',
      type: 'achievement',
      category: 'community',
      title: 'Achievement Unlocked',
      message: `You've earned the "Early Bird Investor" badge for investing in ${realInvestments.length} projects!`,
      time: '1 hour ago',
      read: false,
      icon: Award,
      action: 'View Badges',
      achievement: { id: '1', name: 'Early Bird Investor', icon: '🏆' }
    }
  ];

  // 2. Friend Notifications (from real friends)
  const friendNotifications = [
    {
      id: '5',
      type: 'friend_request',
      category: 'friends',
      title: 'Friend Request',
      message: `${realFriends[1].name} wants to connect with you on Circles.`,
      time: '1 hour ago',
      read: false,
      icon: User,
      action: 'Accept Request',
      user: { id: realFriends[1].id, name: realFriends[1].name, avatar: realFriends[1].avatar }
    },
    {
      id: '6',
      type: 'friend_message',
      category: 'friends',
      title: 'New Message from Friend',
      message: `${realFriends[3].name}: "Hey! I saw you invested in ${realInvestments[0]?.projectName}. What do you think about the project?"`,
      time: '2 hours ago',
      read: false,
      icon: MessageCircle,
      action: 'Reply',
      user: { id: realFriends[3].id, name: realFriends[3].name, avatar: realFriends[3].avatar }
    },
    {
      id: '7',
      type: 'friend_recommendation',
      category: 'friends',
      title: 'Friend Recommendation',
      message: `${realFriends[4].name} recommended "${realProjects[1].title}" to you based on your interests.`,
      time: '4 hours ago',
      read: true,
      icon: Star,
      action: 'View Project',
      user: { id: realFriends[4].id, name: realFriends[4].name, avatar: realFriends[4].avatar },
      project: { id: realProjects[1].id, title: realProjects[1].title, type: realProjects[1].type }
    },
    {
      id: '8',
      type: 'friend_activity',
      category: 'friends',
      title: 'Friend Activity',
      message: `${realFriends[5].name} shared their investment portfolio with you.`,
      time: '5 hours ago',
      read: true,
      icon: Share2,
      action: 'View Portfolio',
      user: { id: realFriends[5].id, name: realFriends[5].name, avatar: realFriends[5].avatar }
    },
    {
      id: '9',
      type: 'friend_milestone',
      category: 'friends',
      title: 'Friend Milestone',
      message: `${realFriends[6].name} reached ₹1,000,000 in total investments!`,
      time: '8 hours ago',
      read: true,
      icon: TrendingUp,
      action: 'Congratulate',
      user: { id: realFriends[6].id, name: realFriends[6].name, avatar: realFriends[6].avatar }
    }
  ];

  // 3. Project/Investment Notifications (from real projects and portfolio)
  const projectNotifications = [
    {
      id: '10',
      type: 'investment',
      category: 'project',
      title: 'Investment Confirmed',
      message: `Your investment of ₹${realInvestments[0]?.investmentAmount?.toLocaleString()} in "${realInvestments[0]?.projectName}" has been confirmed.`,
      time: '1 day ago',
      read: false,
      icon: DollarSign,
      action: 'View Investment',
      project: { id: realInvestments[0]?.projectId, title: realInvestments[0]?.projectName, type: realInvestments[0]?.projectType }
    },
    {
      id: '11',
      type: 'return',
      category: 'project',
      title: 'Returns Received',
      message: `You received ₹${realInvestments[1]?.returnAmount?.toLocaleString()} in returns from your "${realInvestments[1]?.projectName}" investment.`,
      time: '2 days ago',
      read: false,
      icon: TrendingUp,
      action: 'View Returns',
      project: { id: realInvestments[1]?.projectId, title: realInvestments[1]?.projectName, type: realInvestments[1]?.projectType }
    },
    {
      id: '12',
      type: 'perk',
      category: 'project',
      title: 'New Perk Available',
      message: `You've unlocked the "Studio Recording Session" perk from "${realProjects[2].title}".`,
      time: '3 days ago',
      read: true,
      icon: Gift,
      action: 'Claim Perk',
      project: { id: realProjects[2].id, title: realProjects[2].title, type: realProjects[2].type }
    },
    {
      id: '13',
      type: 'project_update',
      category: 'project',
      title: 'Project Update',
      message: `"${realProjects[3].title}" has reached ${realProjects[3].fundedPercentage}% of its funding goal!`,
      time: '4 days ago',
      read: true,
      icon: Film,
      action: 'View Project',
      project: { id: realProjects[3].id, title: realProjects[3].title, type: realProjects[3].type }
    },
    {
      id: '14',
      type: 'music_release',
      category: 'project',
      title: 'New Music Release',
      message: `"${realProjects[8].title}" by ${realProjects[8].artist} is now available for streaming!`,
      time: '5 days ago',
      read: true,
      icon: Music,
      action: 'Listen Now',
      project: { id: realProjects[8].id, title: realProjects[8].title, type: realProjects[8].type }
    }
  ];

  // 4. System/Admin Notifications
  const systemNotifications = [
    {
      id: '15',
      type: 'global_announcement',
      category: 'system',
      title: 'Platform Update',
      message: 'New features: Advanced analytics, Portfolio tracking, and Social investing!',
      time: '6 hours ago',
      read: true,
      icon: Globe,
      action: 'Learn More',
      announcement: { id: '1', title: 'Platform Update v2.1' }
    },
    {
      id: '16',
      type: 'community_challenge',
      category: 'system',
      title: 'New Challenge Available',
      message: 'Join the "Weekend Warrior" challenge - invest in 3 projects this weekend!',
      time: '1 day ago',
      read: true,
      icon: Zap,
      action: 'Join Challenge',
      challenge: { id: '1', name: 'Weekend Warrior', participants: 45 }
    },
    {
      id: '17',
      type: 'maintenance',
      category: 'system',
      title: 'Scheduled Maintenance',
      message: 'Platform will be under maintenance from 2 AM to 4 AM IST tonight.',
      time: '2 days ago',
      read: true,
      icon: Info,
      action: 'View Details',
      maintenance: { id: '1', duration: '2 hours' }
    }
  ];

  // Combine all notifications and sort by time (most recent first)
  return [
    ...communityNotifications,
    ...friendNotifications,
    ...projectNotifications,
    ...systemNotifications
  ].sort((a, b) => {
    // Simple time sorting (you can implement more sophisticated time parsing)
    const timeOrder: Record<string, number> = {
      '5 minutes ago': 1,
      '15 minutes ago': 2,
      '30 minutes ago': 3,
      '1 hour ago': 4,
      '2 hours ago': 5,
      '4 hours ago': 6,
      '5 hours ago': 7,
      '6 hours ago': 8,
      '8 hours ago': 9,
      '1 day ago': 10,
      '2 days ago': 11,
      '3 days ago': 12,
      '4 days ago': 13,
      '5 days ago': 14
    };
    return (timeOrder[a.time] || 15) - (timeOrder[b.time] || 15);
  });
};

// Export the function to be used in notification components
export default generateRealNotifications; 
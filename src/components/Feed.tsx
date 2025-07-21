import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal,
  Smile,
  Share2,
  Image,
  Video,
  X,
  MapPin,
  Mic,
  BarChart3,
} from 'lucide-react';
import { getUserAvatar } from '../utils/imageUtils';
import OptimizedImage from './OptimizedImage';
import { celebrityService, CelebrityInfo } from '../services/celebrityService';
import './Feed.css';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  text: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    role: string;
  };
  timestamp: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  reactions: { emoji: string; count: number }[];
  hashtags?: string[];
  mentions?: string[];
  location?: string;
  poll?: {
    question: string;
    options: string[];
    votes: Record<string, number>;
  };
}

const EMOJIS = ['❤️', '🔥', '😍', '😎', '🥳', '🎉', '✨', '💫', '👏', '🙌', '🚀', '💎', '🎯', '🏆', '⭐'];

const generateMockPosts = (): Post[] => {
  const posts: Post[] = [
    // Community Posts (Friends)
    {
      id: 'community-1',
      user: {
        name: 'Alok Tripathy',
        avatar: getUserAvatar('Alok Tripathy'),
        verified: true,
        role: 'Investor'
      },
      timestamp: '2 hours ago',
      content: 'Latest trailer dekh liya! Cinematography toh bilkul stunning hai! Release ka wait nahi ho raha! 🎬✨',
      likes: 24,
      comments: [
        {
          id: 'c1',
          user: {
            name: 'Ankit Singh',
            avatar: getUserAvatar('Ankit Singh'),
            verified: false
          },
          text: 'Same here! Can\'t wait for the release! 🔥',
          timestamp: '1 hour ago',
          likes: 5
        }
      ],
      shares: 3,
      isLiked: false,
      isBookmarked: false,
      reactions: [
        { emoji: '❤️', count: 24 },
        { emoji: '🔥', count: 12 }
      ]
    },
    {
      id: 'community-2',
      user: {
        name: 'Ankit Singh',
        avatar: getUserAvatar('Ankit Singh'),
        verified: false,
        role: 'Fan'
      },
      timestamp: '4 hours ago',
      content: 'Behind-the-scenes footage dekh ke pata chalta hai kitna effort lagta hai movies banane mein! Respect to entire team! 👏',
      likes: 18,
      comments: [
        {
          id: 'c2',
          user: {
            name: 'Biren Dora',
            avatar: getUserAvatar('Biren Dora'),
            verified: true
          },
          text: 'Thank you! The team really puts their heart into it! 💪',
          timestamp: '3 hours ago',
          likes: 8
        }
      ],
      shares: 2,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '👏', count: 18 },
        { emoji: '💯', count: 7 }
      ]
    },
    {
      id: 'community-3',
      user: {
        name: 'Biren Dora',
        avatar: getUserAvatar('Biren Dora'),
        verified: true,
        role: 'Director'
      },
      timestamp: '6 hours ago',
      content: 'CGI budget meri pure life savings se zyada hai, phir bhi dragon 2005 ka lag raha hai 😂🐉 Kya ho gaya hai!',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop'
      },
      likes: 156,
      comments: [
        {
          id: 'c3',
          user: {
            name: 'Adya Rath',
            avatar: getUserAvatar('Adya Rath'),
            verified: false
          },
          text: 'Haha! Budget problems are real! 😅',
          timestamp: '5 hours ago',
          likes: 23
        }
      ],
      shares: 18,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '😂', count: 156 },
        { emoji: '💀', count: 89 },
        { emoji: '🐉', count: 23 }
      ]
    },
    {
      id: 'community-4',
      user: {
        name: 'Adya Rath',
        avatar: getUserAvatar('Adya Rath'),
        verified: false,
        role: 'Film Critic'
      },
      timestamp: '8 hours ago',
      content: 'Me: "Bas ek episode dekhungi"\nNetflix: *automatic next episode*\nMe at 3 AM: "Main yahan kaise aa gayi?" 🤡',
      likes: 234,
      comments: [
        {
          id: 'c4',
          user: {
            name: 'Soham Bardhan',
            avatar: getUserAvatar('Soham Bardhan'),
            verified: true
          },
          text: 'This is so relatable! 😭',
          timestamp: '7 hours ago',
          likes: 45
        }
      ],
      shares: 34,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '😭', count: 234 },
        { emoji: '🤡', count: 67 },
        { emoji: '📺', count: 45 }
      ]
    },
    {
      id: 'community-5',
      user: {
        name: 'Soham Bardhan',
        avatar: getUserAvatar('Soham Bardhan'),
        verified: true,
        role: 'Actor'
      },
      timestamp: '10 hours ago',
      content: 'POV: Trying to explain the Marvel multiverse to your parents 🕷️🦸‍♂️\nThem: "So there are multiple Spider-Mans?"\nMe: "It\'s quite complicated..." 😅',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop'
      },
      likes: 189,
      comments: [
        {
          id: 'c5',
          user: {
            name: 'Praveen Dehury',
            avatar: getUserAvatar('Praveen Dehury'),
            verified: false
          },
          text: 'My parents still don\'t get it! 😂',
          timestamp: '9 hours ago',
          likes: 34
        }
      ],
      shares: 27,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '😅', count: 189 },
        { emoji: '🕷️', count: 134 },
        { emoji: '🤯', count: 56 }
      ]
    },
    {
      id: 'community-6',
      user: {
        name: 'Praveen Dehury',
        avatar: getUserAvatar('Praveen Dehury'),
        verified: false,
        role: 'Screenwriter'
      },
      timestamp: '12 hours ago',
      content: 'That moment when you realize the movie\'s plot twist was spoiled in the trailer 🤦‍♀️ Marketing team, we need to have a serious discussion!',
      likes: 298,
      comments: [
        {
          id: 'c6',
          user: {
            name: 'Kamlesh Biswal',
            avatar: getUserAvatar('Kamlesh Biswal'),
            verified: true
          },
          text: 'Marketing team be like: "Oops! 😅"',
          timestamp: '11 hours ago',
          likes: 67
        }
      ],
      shares: 73,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '🤦‍♀️', count: 298 },
        { emoji: '😤', count: 87 },
        { emoji: '🎬', count: 45 }
      ]
    },
    {
      id: 'community-7',
      user: {
        name: 'Kamlesh Biswal',
        avatar: getUserAvatar('Kamlesh Biswal'),
        verified: true,
        role: 'Producer'
      },
      timestamp: '14 hours ago',
      content: 'Budget planning mein problem aa rahi hai! Hero ka fee itna zyada hai ki baaki sab compromise karna padega 😅',
      likes: 145,
      comments: [
        {
          id: 'c7',
          user: {
            name: 'Alok Tripathy',
            avatar: getUserAvatar('Alok Tripathy'),
            verified: true
          },
          text: 'Hero fees are getting out of hand! 💰',
          timestamp: '13 hours ago',
          likes: 23
        }
      ],
      shares: 23,
      isLiked: false,
      isBookmarked: false,
      reactions: [
        { emoji: '😅', count: 145 },
        { emoji: '💰', count: 89 },
        { emoji: '🎭', count: 34 }
      ]
    },
    {
      id: 'community-8',
      user: {
        name: 'Ipsit Tripathy',
        avatar: getUserAvatar('Ipsit Tripathy'),
        verified: true,
        role: 'Fitness Trainer'
      },
      timestamp: '1 hour ago',
      content: 'NEW PR ALERT! 💪 Deadlift 200kg touch kar liya! Body transformation journey mein ek aur milestone! Gym bros, consistency is key! 🏋️‍♂️🔥',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
      },
      likes: 245,
      comments: [
        {
          id: 'c8',
          user: {
            name: 'Alok Tripathy',
            avatar: getUserAvatar('Alok Tripathy'),
            verified: true
          },
          text: 'Inspiring! Keep it up! 💪',
          timestamp: '30 min ago',
          likes: 45
        }
      ],
      shares: 67,
      isLiked: true,
      isBookmarked: true,
      reactions: [
        { emoji: '💪', count: 245 },
        { emoji: '🔥', count: 167 },
        { emoji: '🏋️‍♂️', count: 89 }
      ]
    },

    // Celebrity Posts (Real Celebrities with TMDB Images)
    {
      id: 'celebrity-1',
      user: {
        name: 'Christopher Nolan',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Director'
      },
      timestamp: '3 hours ago',
      content: 'Behind the scenes of our latest project. The dedication of this crew is absolutely incredible! 🎬✨ #Filmmaking #BehindTheScenes',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop'
      },
      likes: 2847,
      comments: [
        {
          id: 'c9',
          user: {
            name: 'Tom Hardy',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'Incredible work as always, Chris! 🔥',
          timestamp: '2 hours ago',
          likes: 156
        }
      ],
      shares: 234,
      isLiked: false,
      isBookmarked: false,
      reactions: [
        { emoji: '❤️', count: 1847 },
        { emoji: '🔥', count: 567 },
        { emoji: '😍', count: 234 }
      ]
    },
    {
      id: 'celebrity-2',
      user: {
        name: 'Taylor Swift',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Music Artist'
      },
      timestamp: '5 hours ago',
      content: 'Studio session vibes 🎤 New music coming soon! Can\'t wait to share this journey with you all 💕 #NewMusic #StudioLife',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
      },
      likes: 15432,
      comments: [
        {
          id: 'c10',
          user: {
            name: 'Selena Gomez',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'I\'m so excited for this! 🎵💖',
          timestamp: '4 hours ago',
          likes: 892
        }
      ],
      shares: 1234,
      isLiked: true,
      isBookmarked: true,
      reactions: [
        { emoji: '❤️', count: 8923 },
        { emoji: '🎵', count: 3456 },
        { emoji: '💕', count: 2341 }
      ]
    },
    {
      id: 'celebrity-3',
      user: {
        name: 'Marvel Studios',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Production House'
      },
      timestamp: '7 hours ago',
      content: 'Phase 5 is just getting started! 🚀 The future of the MCU is brighter than ever. Stay tuned for more epic announcements! #Marvel #MCU #Phase5',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop'
      },
      likes: 45678,
      comments: [
        {
          id: 'c11',
          user: {
            name: 'Robert Downey Jr.',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'The legacy continues! 🦸‍♂️',
          timestamp: '6 hours ago',
          likes: 2341
        }
      ],
      shares: 3456,
      isLiked: false,
      isBookmarked: false,
      reactions: [
        { emoji: '🚀', count: 12345 },
        { emoji: '🦸‍♂️', count: 9876 },
        { emoji: '🔥', count: 7654 }
      ]
    },
    {
      id: 'celebrity-4',
      user: {
        name: 'Leonardo DiCaprio',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Actor'
      },
      timestamp: '9 hours ago',
      content: 'Environmental conservation is not just a passion, it\'s a necessity. 🌍 Let\'s work together to protect our planet for future generations. #ClimateAction #Conservation',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      },
      likes: 12345,
      comments: [
        {
          id: 'c12',
          user: {
            name: 'Greta Thunberg',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'Thank you for using your platform for this important cause! 🌱',
          timestamp: '8 hours ago',
          likes: 567
        }
      ],
      shares: 890,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '🌍', count: 4567 },
        { emoji: '🌱', count: 2345 },
        { emoji: '❤️', count: 3456 }
      ]
    },
    {
      id: 'celebrity-5',
      user: {
        name: 'Beyoncé',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Music Artist'
      },
      timestamp: '13 hours ago',
      content: 'Renaissance World Tour was absolutely magical! 🎤✨ Thank you to every single person who came out and made this tour unforgettable. The energy was everything! #RenaissanceTour #BeyHive',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
      },
      likes: 98765,
      comments: [
        {
          id: 'c13',
          user: {
            name: 'Jay-Z',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'Proud of you, Queen! 👑',
          timestamp: '12 hours ago',
          likes: 1234
        }
      ],
      shares: 5678,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '👑', count: 23456 },
        { emoji: '✨', count: 12345 },
        { emoji: '🎤', count: 9876 }
      ]
    },
    {
      id: 'celebrity-6',
      user: {
        name: 'Tom Cruise',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Actor'
      },
      timestamp: '15 hours ago',
      content: 'Mission: Impossible - Dead Reckoning Part Two filming is going incredible! The stunts this time are absolutely insane! 🚁💥 #MissionImpossible #Stunts',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
      },
      likes: 23456,
      comments: [
        {
          id: 'c14',
          user: {
            name: 'Christopher McQuarrie',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'You\'re absolutely fearless, Tom! 🚁',
          timestamp: '14 hours ago',
          likes: 1234
        }
      ],
      shares: 2345,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '🚁', count: 8765 },
        { emoji: '💥', count: 6543 },
        { emoji: '🔥', count: 5432 }
      ]
    },

    // More Celebrity Posts
    {
      id: 'celebrity-7',
      user: {
        name: 'Steven Spielberg',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Director'
      },
      timestamp: '1 day ago',
      content: 'Every film is a new adventure. The magic of storytelling never gets old. 🎬✨ #Filmmaking #Storytelling #Cinema',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop'
      },
      likes: 15678,
      comments: [
        {
          id: 'c15',
          user: {
            name: 'Tom Hanks',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'Working with you was always an honor, Steven! 🎭',
          timestamp: '23 hours ago',
          likes: 892
        }
      ],
      shares: 1234,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '🎬', count: 5678 },
        { emoji: '✨', count: 3456 },
        { emoji: '❤️', count: 2345 }
      ]
    },
    {
      id: 'celebrity-8',
      user: {
        name: 'Ariana Grande',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Music Artist'
      },
      timestamp: '1 day ago',
      content: 'New album vibes are hitting different this time! 🎤💕 Can\'t wait to share this journey with you all! #NewMusic #StudioVibes #ArianaGrande',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
      },
      likes: 23456,
      comments: [
        {
          id: 'c16',
          user: {
            name: 'Billie Eilish',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'So excited for this! Your voice is everything! 🎵',
          timestamp: '22 hours ago',
          likes: 1234
        }
      ],
      shares: 2345,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '🎤', count: 8765 },
        { emoji: '💕', count: 6543 },
        { emoji: '🎵', count: 5432 }
      ]
    },
    {
      id: 'celebrity-9',
      user: {
        name: 'Disney',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Production House'
      },
      timestamp: '2 days ago',
      content: 'The magic continues! ✨ New animated adventures coming your way! #Disney #Animation #Magic',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop'
      },
      likes: 34567,
      comments: [
        {
          id: 'c17',
          user: {
            name: 'Emma Watson',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'Disney magic is forever! 🏰✨',
          timestamp: '1 day ago',
          likes: 1567
        }
      ],
      shares: 3456,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '✨', count: 12345 },
        { emoji: '🏰', count: 9876 },
        { emoji: '🎭', count: 7654 }
      ]
    },
    {
      id: 'celebrity-10',
      user: {
        name: 'Elon Musk',
        avatar: '', // Will be fetched from TMDB
        verified: true,
        role: 'Entrepreneur'
      },
      timestamp: '2 days ago',
      content: 'The future of transportation is electric! 🚗⚡ #Tesla #ElectricVehicles #Innovation',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      },
      likes: 45678,
      comments: [
        {
          id: 'c18',
          user: {
            name: 'Bill Gates',
            avatar: '', // Will be fetched from TMDB
            verified: true
          },
          text: 'Great work on sustainable technology! 🌱',
          timestamp: '1 day ago',
          likes: 2345
        }
      ],
      shares: 5678,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '🚗', count: 15678 },
        { emoji: '⚡', count: 12345 },
        { emoji: '🌱', count: 9876 }
      ]
    }
  ];
  
  return posts;
};

interface FeedProps {
  isExperienceView?: boolean;
}

const Feed: React.FC<FeedProps> = ({ isExperienceView = false }) => {
  // Use only Instagram feed's own theme - no parent theme inheritance
  const [posts, setPosts] = useState<Post[]>([]);
  const [celebrityInfo, setCelebrityInfo] = useState<Map<string, CelebrityInfo>>(new Map());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>({});
  const observer = useRef<IntersectionObserver>();

  // Post creation state
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [showPostEmojiPicker, setShowPostEmojiPicker] = useState(false);
  const [postLocation, setPostLocation] = useState('');
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);

  // Load initial posts and celebrity images
  useEffect(() => {
    const loadPostsWithCelebrities = async () => {
    const allPosts = generateMockPosts();
      
      // Load celebrity images for all users in posts
      const celebrityInfoMap = new Map<string, CelebrityInfo>();
      
      for (const post of allPosts) {
        if (!celebrityInfoMap.has(post.user.name)) {
          try {
            const info = await celebrityService.getCelebrityInfo(post.user.name);
            celebrityInfoMap.set(post.user.name, info);
          } catch (error) {
            console.error(`Error loading celebrity info for ${post.user.name}:`, error);
            // Fallback to default
            celebrityInfoMap.set(post.user.name, {
              name: post.user.name,
              avatar: getUserAvatar(post.user.name),
              verified: post.user.verified,
              role: post.user.role
            });
          }
        }
      }
      
      setCelebrityInfo(celebrityInfoMap);
      
      // Update posts with celebrity info
      const updatedPosts = allPosts.map(post => {
        const celebrityInfo = celebrityInfoMap.get(post.user.name);
        return {
          ...post,
          user: {
            ...post.user,
            name: celebrityInfo?.name || post.user.name,
            avatar: celebrityInfo?.avatar || post.user.avatar, // Use local image if celebrity avatar is empty
            verified: celebrityInfo?.verified || post.user.verified,
            role: celebrityInfo?.role || post.user.role
          }
        };
      });
      
    // Load first 5 posts initially
      setPosts(updatedPosts.slice(0, 5));
    // Set hasMore based on total posts
      setHasMore(updatedPosts.length > 5);
    };
    
    loadPostsWithCelebrities();
  }, []);

  const loadMorePosts = useCallback(async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get all available posts
    const allPosts = generateMockPosts();
    
    // Check if we've loaded all posts
    if (posts.length >= allPosts.length) {
      setHasMore(false);
      setLoading(false);
      return;
    }
    
    // Get next batch of posts (5 posts at a time)
    const nextBatch = allPosts.slice(posts.length, posts.length + 5);
    
    // Update posts with celebrity info
    const updatedNextBatch = nextBatch.map(post => {
      const celebInfo = celebrityInfo.get(post.user.name);
      return {
        ...post,
        user: {
          ...post.user,
          name: celebInfo?.name || post.user.name,
          avatar: celebInfo?.avatar || post.user.avatar, // Use local image if celebrity avatar is empty
          verified: celebInfo?.verified || post.user.verified,
          role: celebInfo?.role || post.user.role
        }
      };
    });
    
    setPosts(prev => [...prev, ...updatedNextBatch]);
    setLoading(false);
    
    // Check if we've reached the end
    if (posts.length + nextBatch.length >= allPosts.length) {
      setHasMore(false);
    }
  }, [posts.length, celebrityInfo]);

  // Intersection Observer for infinite scroll
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMorePosts]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleReaction = (postId: string, emoji: string) => {
    setUserReactions(prev => {
      const current = prev[postId] || [];
      const newReactions = current.includes(emoji) 
        ? current.filter(e => e !== emoji)
        : [...current, emoji];
      
      return { ...prev, [postId]: newReactions };
    });

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const existingReaction = post.reactions.find(r => r.emoji === emoji);
        const newReactions = existingReaction
          ? post.reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + (userReactions[postId]?.includes(emoji) ? -1 : 1) }
                : r
            )
          : [...post.reactions, { emoji, count: 1 }];
        
        return { ...post, reactions: newReactions };
      }
      return post;
    }));

    setShowEmojiPicker(null);
  };

  const addComment = (postId: string) => {
    if (!commentText.trim()) return;

    const celebInfo = celebrityInfo.get('You');
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        name: 'You',
        avatar: celebInfo?.avatar || getUserAvatar('You'),
        verified: false
      },
      text: commentText,
      timestamp: 'Just now',
      likes: 0
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setCommentText('');
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Post creation functions
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedMedia(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setMediaPreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the removed URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const addEmojiToPost = (emoji: string) => {
    setPostContent(prev => prev + emoji);
    setShowPostEmojiPicker(false);
  };

  const extractHashtagsAndMentions = (content: string) => {
    const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    const mentions = content.match(/@\w+/g)?.map(mention => mention.slice(1)) || [];
    return { hashtags, mentions };
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      audioRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const createPost = () => {
    if (!postContent.trim() && selectedMedia.length === 0 && !audioBlob) return;

    const { hashtags, mentions } = extractHashtagsAndMentions(postContent);
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: {
        name: 'You',
        avatar: getUserAvatar('You'),
        verified: false,
        role: 'Community Member'
      },
      timestamp: 'Just now',
      content: postContent,
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      reactions: [],
      hashtags: hashtags.length > 0 ? hashtags : undefined,
      mentions: mentions.length > 0 ? mentions : undefined,
      location: postLocation || undefined,
      poll: showPollCreator && pollQuestion ? {
        question: pollQuestion,
        options: pollOptions.filter(opt => opt.trim()),
        votes: {}
      } : undefined
    };

    // Add media if selected
    if (selectedMedia.length > 0) {
      const firstMedia = selectedMedia[0];
      newPost.media = {
        type: firstMedia.type.startsWith('image/') ? 'image' : 'video',
        url: mediaPreview[0],
        thumbnail: firstMedia.type.startsWith('video/') ? mediaPreview[0] : undefined
      };
    }

    setPosts(prev => [newPost, ...prev]);
    
    // Reset form
    setPostContent('');
    setSelectedMedia([]);
    setMediaPreview([]);
    setPostLocation('');
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setAudioBlob(null);
    setShowPostCreator(false);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };

  return (
    <div className={`feed ${isExperienceView ? 'experience-view' : ''}`}>
      {/* Post Creator */}
      {(
        <motion.div 
          className="post-creator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="post-creator-header">
            <div className="post-creator-user">
              <OptimizedImage
                src={celebrityInfo.get('You')?.avatar || getUserAvatar('You')}
                alt="Your avatar"
                width={40}
                height={40}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">You</div>
                <div className="user-role">Community Member</div>
              </div>
            </div>
            <motion.button
              className="create-post-btn"
              onClick={() => setShowPostCreator(!showPostCreator)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPostCreator ? 'Cancel' : 'Create Post'}
            </motion.button>
          </div>

          <AnimatePresence>
            {showPostCreator && (
              <motion.div
                className="post-creator-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <textarea
                  className="post-textarea"
                  placeholder="What's on your mind? #hashtag @mention"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                />

                {/* Media Preview */}
                {mediaPreview.length > 0 && (
                  <div className="media-preview">
                    {mediaPreview.map((preview, index) => (
                      <div key={index} className="media-item">
                        <img src={preview} alt="Preview" />
                        <button
                          className="remove-media-btn"
                          onClick={() => removeMedia(index)}
                        >
                          <X size={16} />
            </button>
          </div>
                    ))}
        </div>
                )}

                {/* Audio Preview */}
                {audioBlob && (
                  <div className="audio-preview">
                    <audio controls src={URL.createObjectURL(audioBlob)} />
                    <button
                      className="remove-audio-btn"
                      onClick={() => setAudioBlob(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Poll Creator */}
                {showPollCreator && (
                  <div className="poll-creator">
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="poll-question"
                    />
                    {pollOptions.map((option, index) => (
                      <div key={index} className="poll-option">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updatePollOption(index, e.target.value)}
                          className="poll-option-input"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            className="remove-poll-option-btn"
                            onClick={() => removePollOption(index)}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 4 && (
                      <button
                        className="add-poll-option-btn"
                        onClick={addPollOption}
                      >
                        Add Option
                      </button>
                    )}
                  </div>
                )}

                {/* Post Creator Actions */}
                <div className="post-creator-actions">
                  <div className="action-buttons">
                    <motion.button
                      className="action-btn"
                      onClick={() => mediaInputRef.current?.click()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Add Media"
                    >
                      <Image size={20} />
                    </motion.button>
                    <motion.button
                      className="action-btn"
                      onClick={() => mediaInputRef.current?.click()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Add Video"
                    >
                      <Video size={20} />
                    </motion.button>
                    <motion.button
                      className="action-btn"
                      onClick={() => setShowPostEmojiPicker(!showPostEmojiPicker)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Add Emoji"
                    >
                      <Smile size={20} />
                    </motion.button>
                    <motion.button
                      className="action-btn"
                      onClick={() => setShowPollCreator(!showPollCreator)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Create Poll"
                    >
                      <BarChart3 size={20} />
                    </motion.button>
                    <motion.button
                      className="action-btn"
                      onClick={isRecording ? stopRecording : startRecording}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={isRecording ? "Stop Recording" : "Record Audio"}
                      style={{ color: isRecording ? '#ef4444' : undefined }}
                    >
                      <Mic size={20} />
                    </motion.button>
                    <motion.button
                      className="action-btn"
                      onClick={() => setPostLocation(prompt('Enter location:') || '')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Add Location"
                    >
                      <MapPin size={20} />
                    </motion.button>
                  </div>

                  <motion.button
                    className="post-btn"
                    onClick={createPost}
                    disabled={!postContent.trim() && selectedMedia.length === 0 && !audioBlob}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={16} />
                    Post
                  </motion.button>
                </div>

                {/* Hidden file input */}
                <input
                  ref={mediaInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                  style={{ display: 'none' }}
                />

                {/* Post Emoji Picker */}
                <AnimatePresence>
                  {showPostEmojiPicker && (
                    <motion.div
                      className="emoji-picker"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="emoji-grid">
                        {EMOJIS.map((emoji, idx) => (
                          <motion.button
                            key={emoji}
                            className="emoji-btn"
                            onClick={() => addEmojiToPost(emoji)}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="posts-container">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostElementRef : null}
            className="post-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -2,
              transition: { duration: 0.2 }
            }}
          >
            {/* Post Header */}
            <div className="post-header">
              <div className="post-user">
                <OptimizedImage
                  src={post.user.avatar}
                  alt={post.user.name}
                  width={40}
                  height={40}
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">
                    {post.user.name}
                    {post.user.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="user-role">{post.user.role}</div>
                </div>
              </div>
              <button className="more-btn">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <div className="post-content">
              <p className="post-text">{post.content}</p>
              {post.media && (
                <div className="post-media">
                  {post.media.type === 'image' ? (
                    <OptimizedImage
                      src={post.media.url}
                      alt="Post content"
                      width={600}
                      height={600}
                      className="post-image"
                    />
                  ) : (
                    <div className="post-video">
                      <video
                        src={post.media.url}
                        poster={post.media.thumbnail}
                        controls
                        className="video-player"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <div className="action-buttons">
                <motion.button 
                  className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={24} fill={post.isLiked ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button 
                  className="action-btn"
                  onClick={() => toggleComments(post.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageCircle size={24} />
                </motion.button>
                <motion.button 
                  className="action-btn"
                  onClick={() => setShowEmojiPicker(showEmojiPicker === post.id ? null : post.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Smile size={24} />
                </motion.button>
                <motion.button 
                  className="action-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={24} />
                </motion.button>
              </div>
              <motion.button 
                className={`bookmark-btn ${post.isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => handleBookmark(post.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bookmark size={24} fill={post.isBookmarked ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Reactions */}
            {post.reactions.length > 0 && (
              <div className="post-reactions">
                {post.reactions.slice(0, 3).map((reaction, idx) => (
                  <span key={idx} className="reaction-badge">
                    {reaction.emoji} {reaction.count}
                  </span>
                ))}
                {post.reactions.length > 3 && (
                  <span className="more-reactions">+{post.reactions.length - 3}</span>
                )}
              </div>
            )}

            {/* Likes Count */}
            <div className="likes-count">
              {post.likes.toLocaleString()} likes
            </div>

            {/* Comments Preview */}
            {post.comments.length > 0 && (
              <div className="comments-preview">
                {post.comments.slice(0, 2).map(comment => (
                  <div key={comment.id} className="comment-preview">
                    <span className="comment-user">{comment.user.name}</span>
                    <span className="comment-text">{comment.text}</span>
                  </div>
                ))}
                {post.comments.length > 2 && (
                  <button 
                    className="view-comments-btn"
                    onClick={() => toggleComments(post.id)}
                  >
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className="post-timestamp">{post.timestamp}</div>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker === post.id && (
                <motion.div
                  className="emoji-picker"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="emoji-grid">
                    {EMOJIS.map((emoji, idx) => (
                      <motion.button
                        key={emoji}
                        className={`emoji-btn ${userReactions[post.id]?.includes(emoji) ? 'selected' : ''}`}
                        onClick={() => handleReaction(post.id, emoji)}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments[post.id] && (
                <motion.div
                  className="comments-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="comments-list">
                    {post.comments.map((comment, idx) => (
                      <motion.div 
                        key={comment.id} 
                        className="comment"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <OptimizedImage
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          width={36}
                          height={36}
                          className="comment-avatar"
                        />
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-user">{comment.user.name}</span>
                            {comment.user.verified && <span className="verified-badge small">✓</span>}
                            <span className="comment-time">{comment.timestamp}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Add Comment */}
                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="comment-input"
                    />
                    <motion.button 
                      className="send-btn"
                      onClick={() => addComment(post.id)}
                      disabled={!commentText.trim()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Send size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <motion.div 
            className="loading-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="loading-spinner"></div>
            <p>Loading more posts...</p>
          </motion.div>
        )}

        {/* End of Feed */}
        {!hasMore && posts.length > 0 && (
          <motion.div 
            className="end-of-feed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center p-8">
              <motion.div 
                className="text-4xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🎬
              </motion.div>
              <h3 className="text-xl font-bold mb-2">You've reached the end!</h3>
              <p className="text-gray-400 mb-4">No more posts to show right now.</p>
              <p className="text-sm text-gray-500">Check back later for more amazing content from our community! ✨</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed; 
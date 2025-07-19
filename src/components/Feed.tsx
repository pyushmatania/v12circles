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
} from 'lucide-react';
import { getUserAvatar } from '../utils/imageUtils';
import OptimizedImage from './OptimizedImage';
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
}

const EMOJIS = ['❤️', '🔥', '😍', '😎', '🥳', '🎉', '✨', '💫', '👏', '🙌', '🚀', '💎', '🎯', '🏆', '⭐'];

const generateMockPosts = (): Post[] => {
  const posts: Post[] = [
    // Community Posts
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

    // Celebrity Posts
    {
      id: 'celebrity-1',
      user: {
        name: 'Christopher Nolan',
        avatar: getUserAvatar('Christopher Nolan'),
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
            avatar: getUserAvatar('Tom Hardy'),
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
        avatar: getUserAvatar('Taylor Swift'),
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
            avatar: getUserAvatar('Selena Gomez'),
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
        avatar: getUserAvatar('Marvel Studios'),
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
            avatar: getUserAvatar('Robert Downey Jr.'),
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
        avatar: getUserAvatar('Leonardo DiCaprio'),
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
            avatar: getUserAvatar('Greta Thunberg'),
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
        avatar: getUserAvatar('Beyoncé'),
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
            avatar: getUserAvatar('Jay-Z'),
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
        avatar: getUserAvatar('Tom Cruise'),
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
            avatar: getUserAvatar('Christopher McQuarrie'),
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

    // Behind the Scenes Fun Posts
    {
      id: 'bts-1',
      user: {
        name: 'Alok Tripathy',
        avatar: '/src/images/alok.jpg',
        verified: true,
        role: 'Actor'
      },
      timestamp: '2 hours ago',
      content: 'Behind the scenes moment: Director says "Action!" and I completely forget my lines! 😅 The entire crew was like "Alok, bro, you okay?" 🤦‍♂️ #ActorLife #BTS #BlondeMoment',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop'
      },
      likes: 892,
      comments: [
        {
          id: 'c15',
          user: {
            name: 'Biren Dora',
            avatar: '/src/images/biren.jpg',
            verified: true
          },
          text: 'Happens to the best of us! 😂 That\'s why we do multiple takes!',
          timestamp: '1 hour ago',
          likes: 67
        }
      ],
      shares: 45,
      isLiked: false,
      isBookmarked: false,
      reactions: [
        { emoji: '😂', count: 567 },
        { emoji: '🤦‍♂️', count: 234 },
        { emoji: '🎭', count: 91 }
      ]
    },
    {
      id: 'bts-2',
      user: {
        name: 'Soham Bardhan',
        avatar: '/src/images/soham.jpg',
        verified: true,
        role: 'Actor'
      },
      timestamp: '4 hours ago',
      content: 'Set pr prank war chal raha hai! Today I put fake spiders in everyone\'s coffee cups! 🕷️☕ The makeup artist literally jumped 3 feet high! 😂 #SetPranks #ActorLife #SpiderPrank',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop'
      },
      likes: 1245,
      comments: [
        {
          id: 'c16',
          user: {
            name: 'Adya Rath',
            avatar: '/src/images/adya.JPG',
            verified: false
          },
          text: 'You\'re going to pay for this! 😤 Wait till I get my revenge!',
          timestamp: '3 hours ago',
          likes: 89
        }
      ],
      shares: 123,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '🕷️', count: 456 },
        { emoji: '😂', count: 567 },
        { emoji: '☕', count: 222 }
      ]
    },
    {
      id: 'bts-3',
      user: {
        name: 'Biren Dora',
        avatar: '/src/images/biren.jpg',
        verified: true,
        role: 'Director'
      },
      timestamp: '6 hours ago',
      content: 'Location scouting mein ek din pure jungle mein lost ho gaya! GPS bhi kaam nahi kar raha tha! 🗺️🌲 Finally 3 hours baad signal mila! Lesson learned: Always carry a compass! 😅 #LocationScouting #LostInJungle #DirectorLife',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      },
      likes: 1567,
      comments: [
        {
          id: 'c17',
          user: {
            name: 'Kamlesh Biswal',
            avatar: '/src/images/kamlesh.jpg',
            verified: true
          },
          text: 'Biren, you\'re lucky you found your way back! Next time take me with you! 🧭',
          timestamp: '5 hours ago',
          likes: 123
        }
      ],
      shares: 234,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '🗺️', count: 345 },
        { emoji: '🌲', count: 234 },
        { emoji: '😅', count: 567 }
      ]
    },
    {
      id: 'bts-4',
      user: {
        name: 'Adya Rath',
        avatar: '/src/images/adya.JPG',
        verified: false,
        role: 'Film Critic'
      },
      timestamp: '8 hours ago',
      content: 'Set visit ke time ek scene mein hero ko 15 baar "I love you" bolna pada! Take 15 mein finally perfect hua! 😂 Director bhi frustrated ho gaya! #SetVisit #MultipleTakes #ActorStruggles',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
      },
      likes: 2341,
      comments: [
        {
          id: 'c18',
          user: {
            name: 'Ankit Singh',
            avatar: '/src/images/ankit.jpg',
            verified: false
          },
          text: 'That\'s why I stick to action scenes! No dialogue problems! 💪',
          timestamp: '7 hours ago',
          likes: 156
        }
      ],
      shares: 345,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '💕', count: 789 },
        { emoji: '😂', count: 567 },
        { emoji: '🎬', count: 234 }
      ]
    },
    {
      id: 'bts-5',
      user: {
        name: 'Kamlesh Biswal',
        avatar: '/src/images/kamlesh.jpg',
        verified: true,
        role: 'Producer'
      },
      timestamp: '10 hours ago',
      content: 'Budget meeting mein CFO ne bola "Kamlesh, yeh scene bahut expensive hai!" Maine kaha "But sir, audience ko pasand aayega!" 😅 Result: Scene approved! 🎉 #ProducerLife #BudgetNegotiations #CreativeCompromise',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
      },
      likes: 1892,
      comments: [
        {
          id: 'c19',
          user: {
            name: 'Praveen Dehury',
            avatar: '/src/images/praveen.jpg',
            verified: false
          },
          text: 'That\'s some smooth talking! 😎 Producer skills on point!',
          timestamp: '9 hours ago',
          likes: 234
        }
      ],
      shares: 456,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '💰', count: 567 },
        { emoji: '😎', count: 345 },
        { emoji: '🎉', count: 234 }
      ]
    },
    {
      id: 'bts-6',
      user: {
        name: 'Ankit Singh',
        avatar: '/src/images/ankit.jpg',
        verified: false,
        role: 'Fan'
      },
      timestamp: '12 hours ago',
      content: 'Set visit ke time hero ne mujhe autograph diya! But signature itna messy tha ki maine pucha "Sir, yeh kya likha hai?" 😂 Hero bhi confused ho gaya! #FanMoment #AutographFail #StarStruck',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop'
      },
      likes: 3456,
      comments: [
        {
          id: 'c20',
          user: {
            name: 'Ipsit Tripathy',
            avatar: '/src/images/ipsit.jpg',
            verified: true
          },
          text: 'Haha! That\'s why I always ask for a clear signature! 😄',
          timestamp: '11 hours ago',
          likes: 189
        }
      ],
      shares: 567,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '✍️', count: 456 },
        { emoji: '😂', count: 789 },
        { emoji: '⭐', count: 234 }
      ]
    },
    {
      id: 'bts-7',
      user: {
        name: 'Praveen Dehury',
        avatar: '/src/images/praveen.jpg',
        verified: false,
        role: 'Screenwriter'
      },
      timestamp: '14 hours ago',
      content: 'Script writing session mein 3 AM tak baitha! Coffee 5 cups pi li! ☕😵‍💫 Finally perfect dialogue mil gaya! But ab neend nahi aa rahi! 😴 #ScreenwriterLife #CoffeeAddict #LateNightWriting',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop'
      },
      likes: 2789,
      comments: [
        {
          id: 'c21',
          user: {
            name: 'Alok Tripathy',
            avatar: '/src/images/alok.jpg',
            verified: true
          },
          text: 'Worth it! That dialogue is going to be iconic! 🔥',
          timestamp: '13 hours ago',
          likes: 345
        }
      ],
      shares: 234,
      isLiked: false,
      isBookmarked: true,
      reactions: [
        { emoji: '☕', count: 456 },
        { emoji: '😵‍💫', count: 234 },
        { emoji: '✍️', count: 567 }
      ]
    },
    {
      id: 'bts-8',
      user: {
        name: 'Ipsit Tripathy',
        avatar: '/src/images/ipsit.jpg',
        verified: true,
        role: 'Fitness Trainer'
      },
      timestamp: '16 hours ago',
      content: 'Set pr fitness routine maintain karna mushkil hai! But today I convinced the entire crew to do 10 push-ups between takes! 💪 Even the director joined! 😂 #FitnessOnSet #HealthyCrew #PushUpChallenge',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
      },
      likes: 1892,
      comments: [
        {
          id: 'c22',
          user: {
            name: 'Soham Bardhan',
            avatar: '/src/images/soham.jpg',
            verified: true
          },
          text: 'My arms are still sore! But feeling great! 💪',
          timestamp: '15 hours ago',
          likes: 234
        }
      ],
      shares: 345,
      isLiked: true,
      isBookmarked: false,
      reactions: [
        { emoji: '💪', count: 567 },
        { emoji: '🔥', count: 345 },
        { emoji: '🏋️‍♂️', count: 234 }
      ]
    },
    {
      id: 'bts-9',
      user: {
        name: 'Akash Matania',
        avatar: '/src/images/akash-matania.JPG',
        verified: true,
        role: 'Cinematographer'
      },
      timestamp: '18 hours ago',
      content: 'Camera setup mein 2 hours lag gaye! Perfect lighting chahiye thi! 🌟 Finally setup complete hua, aur tab tak hero ko bathroom jaana pada! 😅 #CinematographyLife #PerfectLighting #ActorProblems',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      },
      likes: 1456,
      comments: [
        {
          id: 'c23',
          user: {
            name: 'Biren Dora',
            avatar: '/src/images/biren.jpg',
            verified: true
          },
          text: 'That\'s filmmaking for you! Timing is everything! ⏰',
          timestamp: '17 hours ago',
          likes: 123
        }
      ],
      shares: 234,
      isLiked: false,
      isBookmarked: false,
      reactions: [
        { emoji: '📷', count: 345 },
        { emoji: '🌟', count: 234 },
        { emoji: '😅', count: 456 }
      ]
    },
    {
      id: 'bts-10',
      user: {
        name: 'Adya Rath',
        avatar: '/src/images/adya.JPG',
        verified: false,
        role: 'Film Critic'
      },
      timestamp: '20 hours ago',
      content: 'Behind the scenes: Heroine ko emotional scene mein real tears nahi aa rahe the! Director ne onion kaatne ko bola! 🧅😭 Result: Perfect shot! But poor heroine ko 1 hour tak aansu aate rahe! 😂 #MethodActing #OnionTears #PerfectShot',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
      },
      likes: 3123,
      comments: [
        {
          id: 'c24',
          user: {
            name: 'Soham Bardhan',
            avatar: '/src/images/soham.jpg',
            verified: true
          },
          text: 'Been there, done that! Onion is every actor\'s best friend! 😭',
          timestamp: '19 hours ago',
          likes: 456
        }
      ],
      shares: 567,
      isLiked: true,
      isBookmarked: true,
      reactions: [
        { emoji: '🧅', count: 789 },
        { emoji: '😭', count: 567 },
        { emoji: '🎭', count: 234 }
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
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>({});
  const observer = useRef<IntersectionObserver>();

  // Load initial posts
  useEffect(() => {
    const allPosts = generateMockPosts();
    // Load first 5 posts initially
    setPosts(allPosts.slice(0, 5));
    // Set hasMore based on total posts
    setHasMore(allPosts.length > 5);
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
    
    setPosts(prev => [...prev, ...nextBatch]);
    setLoading(false);
    
    // Check if we've reached the end
    if (posts.length + nextBatch.length >= allPosts.length) {
      setHasMore(false);
    }
  }, [posts.length]);

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

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        name: 'You',
        avatar: getUserAvatar('You'),
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

  return (
    <div className={`feed ${isExperienceView ? 'experience-view' : ''}`}>
      {!isExperienceView && (
        <div className="feed-header">
          <h1 className="feed-title">Community Feed</h1>
          <div className="feed-actions">
            <button className="action-btn">
              <Share2 size={24} />
            </button>
          </div>
        </div>
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
import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Crown, 
  Camera, 
  Video,
  Image,
  Send,
  Settings,
  Bell,
  MoreHorizontal,
  Bookmark,
  Play,
  Clock,
  MapPin,
  Gift,
  CheckCircle,
  ShoppingBag,
  Activity,
  BarChart3,
  Hash,
  Ticket,
  ArrowLeft,
  Film,
  ChevronLeft,
  ChevronRight,
  Music,
  Plus,
  Phone,
  MoreVertical,
  Paperclip,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import useIsMobile from '../hooks/useIsMobile';
import Merchandise from './Merchandise';
import { comprehensiveCommunityData, type RealCommunityItem } from '../data/comprehensiveCommunityData';
import OptimizedImage from './OptimizedImage';
import { getSpotifyArtistData } from '../data/spotifyArtistImages';
import { getUserAvatar } from '../utils/imageUtils';

// 🛡️ Type definitions for better type safety
interface FeedPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    role: string;
  };
  timestamp: string;
  content: string;
  media?: { type: 'image' | 'video'; url: string };
  reactions: { emoji: string; count: number }[];
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isActive: boolean;
  lastActivity: string;
  category: 'announcements' | 'discussion' | 'creative' | 'fan' | 'behind-scenes';
}

// Add at the top, after imports
const getLocalAvatar = (name: string) => {
  return getUserAvatar(name);
};

/**
 * 🎯 Enter Circles - The Ultimate Community Experience
 * @description Where creators, investors, and fans unite in the most vibrant entertainment community
 */
const Community: React.FC = memo(() => {
  // Comprehensive Community Data
  const movies = comprehensiveCommunityData.movies;
  const actors = comprehensiveCommunityData.actors;
  const actresses = comprehensiveCommunityData.actresses;
  const directors = comprehensiveCommunityData.directors;
  const productionHouses = comprehensiveCommunityData.productionHouses;
  const musicArtists = comprehensiveCommunityData.musicArtists;



  // Hierarchical community state
  const [selectedCategory, setSelectedCategory] = useState<'productionHouse' | 'movie' | 'director' | 'actor' | 'actress' | 'musicArtist'>('movie');
  const [selectedItem, setSelectedItem] = useState<RealCommunityItem | null>(null);
  const [isItemSelected, setIsItemSelected] = useState(false);

  // Check for selected item from Dashboard navigation
  useEffect(() => {
    const selectedCommunityItem = localStorage.getItem('selectedCommunityItem');
    if (selectedCommunityItem) {
      try {
        const { item, category } = JSON.parse(selectedCommunityItem);
        setSelectedItem(item);
        setSelectedCategory(category);
        setIsItemSelected(true);
        // Clear the localStorage after using it
        localStorage.removeItem('selectedCommunityItem');
      } catch (error) {
        console.error('Error parsing selected community item:', error);
        localStorage.removeItem('selectedCommunityItem');
      }
    }
  }, []);
  
  // Static data integration - no API calls
  const [mergedMusicArtists, setMergedMusicArtists] = useState<RealCommunityItem[]>([]);
  const [isLoadingSpotifyArtists, setIsLoadingSpotifyArtists] = useState(false);

  
  // Original state for when item is selected
  const [activeTab, setActiveTab] = useState<'feed' | 'channels' | 'friends' | 'media' | 'perks' | 'merch'>('feed');
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postVideo, setPostVideo] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('announcements');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, {user:string; message:string; time:string; avatar:string}[]>>({
    announcements: [
      { user: 'Alok Tripathy', message: 'Bhai, latest behind-the-scenes footage dekh liya! 🔥 Kya mast hai yaar!', time: '2:30 PM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'Ankit Singh', message: 'Action sequences toh bilkul zabardast hai! VFX team ne kaam kar diya!', time: '2:32 PM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: '🚨 BREAKING: New trailer kal 12 PM IST pe aa raha hai! 🚨 Sab ready ho jao!', time: '3:15 PM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Adya Rath', message: 'Finally! Main toh bas yahi wait kar rahi thi 😭 Ab toh excitement control nahi ho raha!', time: '3:16 PM', avatar: getUserAvatar('Adya Rath') }
    ],
    'investor-hall': [
      { user: 'Soham Bardhan', message: 'Q3 numbers are looking exceptionally strong! 📈 The market response has been phenomenal across all segments.', time: '1:45 PM', avatar: getUserAvatar('Soham Bardhan') },
      { user: 'Praveen Dehury', message: 'The international market response has been absolutely phenomenal 🌍 We\'ve achieved remarkable global reach.', time: '1:47 PM', avatar: getUserAvatar('Praveen Dehury') },
      { user: 'Kamlesh Biswal', message: 'Streaming platforms mein diversify karna chahiye kya? 🤔 Netflix, Amazon sab mein ja sakte hain!', time: '2:10 PM', avatar: getUserAvatar('Kamlesh Biswal') },
      { user: 'Alok Tripathy', message: 'Netflix deal almost final ho gaya hai! 🎬 Ab toh international audience bhi milegi!', time: '2:12 PM', avatar: getUserAvatar('Alok Tripathy') }
    ],
    'creator-talks': [
      { user: 'Ankit Singh', message: 'Bhai log, low light scenes mein color grading mein problem aa rahi hai kya? 🎨 Koi solution batao!', time: '11:30 AM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: 'I recommend using a warmer LUT and slightly increasing the shadows. This should provide the perfect balance for low light scenarios.', time: '11:32 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Adya Rath', message: 'New RED camera footage toh bilkul insane hai! 📹 Quality dekh ke hi pata chalta hai!', time: '12:15 PM', avatar: getUserAvatar('Adya Rath') },
              { user: 'Soham Bardhan', message: 'I still prefer film grain over digital noise 🎞️ It provides a more authentic cinematic feel.', time: '12:17 PM', avatar: getUserAvatar('Soham Bardhan') }
    ],
    'fan-zone': [
      { user: 'Praveen Dehury', message: 'IS ANYONE ELSE COMPLETELY SHOCKED BY THAT ENDING?! 😭😭😭 I\'m still processing what just happened!', time: '10:45 AM', avatar: getUserAvatar('Praveen Dehury') },
      { user: 'Kamlesh Biswal', message: 'Plot twist ne toh mujhe bilkul SHOOK kar diya! 🤯 Kya direction thi yaar!', time: '10:47 AM', avatar: getUserAvatar('Kamlesh Biswal') },
      { user: 'Alok Tripathy', message: 'Cinematography ke baare mein baat karein? 🤌✨ Kya shots the yaar!', time: '11:00 AM', avatar: getUserAvatar('Alok Tripathy') },
              { user: 'Ankit Singh', message: 'Main toh second watch plan kar raha hun! 🍿 Pehli baar miss ho gaya kuch!', time: '11:02 AM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: 'The VFX team deserves all the awards! 🏆 Their work was absolutely outstanding.', time: '11:30 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Ipsit Tripathy', message: 'Action sequences mein hero ka body transformation dekh ke motivation mil gaya! 💪 Gym jana padega!', time: '11:45 AM', avatar: getUserAvatar('Ipsit Tripathy') }
    ],
    polls: [
      { user: 'Community Bot', message: '📊 POLL: Agle genre mein kya explore karein?\nA) Sci-Fi Thriller 🚀\nB) Romantic Comedy 💕\nC) Historical Drama 🏛️\nD) Horror Mystery 👻\n\nReact karke vote karo!', time: '9:00 AM', avatar: getUserAvatar('Community Bot') },
      { user: 'Adya Rath', message: 'Definitely Sci-Fi! 🚀 Space mein kuch different karna chahiye!', time: '9:15 AM', avatar: getUserAvatar('Adya Rath') },
      { user: 'Soham Bardhan', message: 'Horror Mystery sounds quite intriguing 👻 The suspense element would be excellent.', time: '9:20 AM', avatar: getUserAvatar('Soham Bardhan') },
      { user: 'Community Bot', message: '📊 POLL RESULTS: Best Movie Snack?\n🍿 Popcorn - 67%\n🍫 Chocolate - 18%\n🥤 Soda - 10%\n🍕 Pizza - 5%\n\nPopcorn jeet gaya! 🎉', time: '2:00 PM', avatar: getUserAvatar('Community Bot') },
      { user: 'Praveen Dehury', message: 'Pizza gang is absolutely devastated 😂🍕 Popcorn supremacy reigns supreme!', time: '2:05 PM', avatar: getUserAvatar('Praveen Dehury') }
    ],
    'behind-scenes': [
      { user: 'Kamlesh Biswal', message: 'Set pe 4 AM ka scene kaisa hota hai, yeh dekho ☕😴 Coffee toh zaroori hai!', time: '4:00 AM', avatar: getUserAvatar('Kamlesh Biswal') },
      { user: 'Alok Tripathy', message: 'Makeup team abhi magic kar rahi hai ✨💄 Transformation dekh ke hi pata chalta hai!', time: '5:30 AM', avatar: getUserAvatar('Alok Tripathy') },
              { user: 'Ankit Singh', message: 'Stunt sequence perfect ho gaya! 🎬🔥 Kya coordination thi!', time: '6:45 AM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: 'The catering truck has arrived! 🚚🍕 This should provide much-needed energy for the crew.', time: '7:00 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Adya Rath', message: 'Golden hour shots bilkul incredible lag rahe hain 🌅 Natural lighting best hai!', time: '7:15 AM', avatar: getUserAvatar('Adya Rath') },
      { user: 'Ipsit Tripathy', message: 'Stunt doubles ko proper warm-up karwana chahiye! 💪 Flexibility aur strength dono important hai!', time: '7:30 AM', avatar: getUserAvatar('Ipsit Tripathy') }
    ]
  });


  const friendsList = [
    { id: 'alok', name: 'Alok Tripathy', avatar: getUserAvatar('Alok Tripathy'), online: true },
    { id: 'ankit', name: 'Ankit Singh', avatar: getUserAvatar('Ankit Singh'), online: true },
    { id: 'biren', name: 'Biren Dora', avatar: getUserAvatar('Biren Dora'), online: false },
    { id: 'adya', name: 'Adya Rath', avatar: getUserAvatar('Adya Rath'), online: true },
    { id: 'soham', name: 'Soham Bardhan', avatar: getUserAvatar('Soham Bardhan'), online: false },
    { id: 'praveen', name: 'Praveen Dehury', avatar: getUserAvatar('Praveen Dehury'), online: true },
    { id: 'ipsit', name: 'Ipsit Tripathy', avatar: getUserAvatar('Ipsit Tripathy'), online: true },
    { id: 'kamlesh', name: 'Kamlesh Biswal', avatar: getUserAvatar('Kamlesh Biswal'), online: true }
  ];
  const [selectedFriend, setSelectedFriend] = useState<string>(friendsList[0].id);
  const [previewChannel, setPreviewChannel] = useState<string | null>(null);
  const [previewFriend, setPreviewFriend] = useState<string | null>(null);
  const previewTimeout = useRef<number | null>(null);
  const [friendInput, setFriendInput] = useState('');
  const [friendTyping, setFriendTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedPostForEmoji, setSelectedPostForEmoji] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>({});
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  
  // Swipe functionality state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const [friendChats, setFriendChats] = useState<Record<string, {user:string; message:string; time:string; avatar?:string}[]>>({
    alok: [
      { user: 'Alok Tripathy', message: 'Bhai, new Marvel trailer dekha kya?! 🤯 Kya mast hai yaar!', time: '10:30 AM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'You', message: 'Haan bhai! Multiverse toh bilkul crazy ho gaya hai 😱 Kya direction hai!', time: '10:32 AM', avatar: getUserAvatar('You') },
      { user: 'Alok Tripathy', message: 'Spider-Man ko dekh ke main toh chillaya tha! 🕷️ Neighbors ko laga kya hua hai!', time: '10:33 AM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'You', message: 'Same yaar! Main bhi excited ho gaya tha 😂 Premiere mein saath chalenge?', time: '10:35 AM', avatar: getUserAvatar('You') },
      { user: 'Alok Tripathy', message: 'Bilkul bhai! Tickets book kar deta hun 🎬 First day first show!', time: '10:36 AM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'You', message: 'Perfect! Popcorn aur excitement dono ready rahenge 🎫', time: '10:37 AM', avatar: getUserAvatar('You') }
    ],
          ankit: [
        { user: 'Ankit Singh', message: 'Yaar, new camera setup dekh liya?! 📸 Bilkul professional level ka hai!', time: '2:15 PM', avatar: getUserAvatar('Ankit Singh') },
        { user: 'You', message: 'Dikha dikha! 👀 Kya mast equipment hai!', time: '2:16 PM', avatar: getUserAvatar('You') },
        { user: 'Ankit Singh', message: 'DM mein pics bhej deta hun 📱 Quality dekh ke hi pata chalega!', time: '2:17 PM', avatar: getUserAvatar('Ankit Singh') },
        { user: 'You', message: 'Bhai, yeh toh Hollywood level ka setup hai! 🔥 Kya investment hai!', time: '2:20 PM', avatar: getUserAvatar('You') },
        { user: 'Ankit Singh', message: 'Haan na! Ab YouTube channel start karna padega 📹 Content toh ready hai!', time: '2:21 PM', avatar: getUserAvatar('Ankit Singh') },
        { user: 'You', message: 'Main toh subscribe kar raha hun! 😂 Success guaranteed hai!', time: '2:22 PM', avatar: getUserAvatar('You') }
      ],
    biren: [
      { user: 'Biren Dora', message: 'Hello! It\'s been quite a while since we last spoke 👋 How have you been?', time: '9:45 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'You', message: 'Biren! New job kaisa chal raha hai? Sab badhiya?', time: '9:50 AM', avatar: getUserAvatar('You') },
      { user: 'Biren Dora', message: 'It\'s been excellent! Working on some fascinating projects 💼 The learning curve has been quite steep.', time: '9:52 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'You', message: 'That\'s awesome! Jaldi milte hain ☕ Coffee toh banti hai!', time: '9:55 AM', avatar: getUserAvatar('You') },
      { user: 'Biren Dora', message: 'Absolutely! How about this weekend? We can discuss everything in detail.', time: '9:56 AM', avatar: getUserAvatar('Biren Dora') }
    ],
    adya: [
      { user: 'Adya Rath', message: 'GIRL! Show mein kya hua tha, dekh liya kya?! 😱 Kya drama tha!', time: '8:30 PM', avatar: getUserAvatar('Adya Rath') },
      { user: 'You', message: 'NOOO! Spoiler mat de! Main episode 3 pe hun 😭', time: '8:32 PM', avatar: getUserAvatar('You') },
              { user: 'Adya Rath', message: 'Oops sorry! But OMG, tum toh ride pe ho! 🎢 Kya twist hai!', time: '8:33 PM', avatar: getUserAvatar('Adya Rath') },
      { user: 'You', message: 'Ab toh scared aur excited dono ho gaya hun 😅', time: '8:35 PM', avatar: getUserAvatar('You') },
              { user: 'Adya Rath', message: 'Trust me, aaj raat ke liye schedule clear kar lo 📺 Worth it hai!', time: '8:36 PM', avatar: getUserAvatar('Adya Rath') }
    ],
    soham: [
      { user: 'Soham Bardhan', message: 'Remember that stunt sequence from yesterday? 🤸‍♂️ The one where we almost fell off the building?', time: '6:00 PM', avatar: getUserAvatar('Soham Bardhan') },
              { user: 'You', message: 'Kaise bhool sakta hun! Mummy abhi bhi gusse mein hai 😅', time: '6:02 PM', avatar: getUserAvatar('You') },
              { user: 'Soham Bardhan', message: 'It was calculated! Well, mostly... 😅 Sometimes you have to take risks for the perfect shot.', time: '6:03 PM', avatar: getUserAvatar('Soham Bardhan') },
        { user: 'You', message: 'Calculated my foot! 😂 Tu toh pagal hai!', time: '6:05 PM', avatar: getUserAvatar('You') },
        { user: 'Soham Bardhan', message: 'What they don\'t know won\'t hurt them 🤫 Your mother doesn\'t need to know everything.', time: '6:06 PM', avatar: getUserAvatar('Soham Bardhan') }
    ],
          praveen: [
        { user: 'Praveen Dehury', message: 'Portfolio returns dekh ke toh khushi ka thikana nahi raha! 🚀', time: '7:00 AM', avatar: getUserAvatar('Praveen Dehury') },
        { user: 'You', message: 'Bhai, ab toh treat banta hai! 🥳', time: '7:02 AM', avatar: getUserAvatar('You') },
        { user: 'Praveen Dehury', message: 'Jaldi milte hain! Coffee on me ☕', time: '7:03 AM', avatar: getUserAvatar('Praveen Dehury') }
      ],
    ipsit: [
              { user: 'Ipsit Tripathy', message: 'Bhai! Gym mein new PR banaya! 💪 Deadlift 200kg touch kar liya! Feeling absolutely pumped!', time: '6:30 AM', avatar: getUserAvatar('Ipsit Tripathy') },
              { user: 'You', message: 'Wah bhai! Kya beast ban gaya hai! 🔥 Protein shake zaroor piya hoga!', time: '6:32 AM', avatar: getUserAvatar('You') },
              { user: 'Ipsit Tripathy', message: 'Haan yaar! Whey protein + banana smoothie! 🥛🍌 Abhi bhi energy level peak pe hai!', time: '6:33 AM', avatar: getUserAvatar('Ipsit Tripathy') },
        { user: 'You', message: 'Mujhe bhi gym join karna chahiye! Motivation de do! 💪', time: '6:35 AM', avatar: getUserAvatar('You') },
        { user: 'Ipsit Tripathy', message: 'Bilkul bhai! Kal saath chalenge! 🏋️‍♂️ Chest day hai! Bench press karenge!', time: '6:36 AM', avatar: getUserAvatar('Ipsit Tripathy') },
        { user: 'You', message: 'Deal! But pehle proper form sikhana padega! 😅', time: '6:38 AM', avatar: getUserAvatar('You') },
        { user: 'Ipsit Tripathy', message: 'No worries! Main proper trainer hun! 🎯 Form over weight, always! Safety first!', time: '6:40 AM', avatar: getUserAvatar('Ipsit Tripathy') }
    ],
          kamlesh: [
        { user: 'Kamlesh Biswal', message: 'Bhai! New project mil gaya! 🎬 Production house ne contact kiya hai!', time: '5:30 PM', avatar: getUserAvatar('Kamlesh Biswal') },
        { user: 'You', message: 'Wah! Kya project hai? Details bata! 🎉', time: '5:32 PM', avatar: getUserAvatar('You') },
        { user: 'Kamlesh Biswal', message: 'Web series hai! 10 episodes! Budget bhi decent hai! 💰', time: '5:33 PM', avatar: getUserAvatar('Kamlesh Biswal') },
        { user: 'You', message: 'Congratulations! 🎊 Party toh banti hai!', time: '5:35 PM', avatar: getUserAvatar('You') },
        { user: 'Kamlesh Biswal', message: 'Bilkul! Weekend pe sab milenge! 🍕 Pizza aur success celebration!', time: '5:36 PM', avatar: getUserAvatar('Kamlesh Biswal') }
      ]
  });
  
  // Enhanced mock feed data with 15+ funny and realistic posts
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
          {
        id: '1',
        user: {
          name: 'Alok Tripathy',
          avatar: getUserAvatar('Alok Tripathy'),
          verified: true,
          role: 'Investor'
        },
      timestamp: '2 hours ago',
      content: 'Latest trailer dekh liya! Cinematography toh bilkul stunning hai! Release ka wait nahi ho raha! 🎬✨',
      reactions: [{ emoji: '❤️', count: 24 }, { emoji: '🔥', count: 12 }],
      comments: 8,
      shares: 3
    },
          {
        id: '2',
        user: {
          name: 'Ankit Singh',
          avatar: getUserAvatar('Ankit Singh'),
          verified: false,
          role: 'Fan'
        },
      timestamp: '4 hours ago',
      content: 'Behind-the-scenes footage dekh ke pata chalta hai kitna effort lagta hai movies banane mein! Respect to entire team! 👏',
      reactions: [{ emoji: '👏', count: 18 }, { emoji: '💯', count: 7 }],
      comments: 5,
      shares: 2
    },
          {
        id: '3',
        user: {
          name: 'Biren Dora',
          avatar: getUserAvatar('Biren Dora'),
          verified: true,
          role: 'Director'
        },
      timestamp: '6 hours ago',
      content: 'CGI budget meri pure life savings se zyada hai, phir bhi dragon 2005 ka lag raha hai 😂🐉 Kya ho gaya hai!',
      reactions: [{ emoji: '😂', count: 156 }, { emoji: '💀', count: 89 }, { emoji: '🐉', count: 23 }],
      comments: 42,
      shares: 18
    },
          {
        id: '4',
              user: {
        name: 'Adya Rath',
        avatar: getUserAvatar('Adya Rath'),
        verified: false,
        role: 'Film Critic'
      },
      timestamp: '8 hours ago',
      content: 'Me: "Bas ek episode dekhungi"\nNetflix: *automatic next episode*\nMe at 3 AM: "Main yahan kaise aa gayi?" 🤡',
      reactions: [{ emoji: '😭', count: 234 }, { emoji: '🤡', count: 67 }, { emoji: '📺', count: 45 }],
      comments: 78,
      shares: 34
    },
          {
        id: '5',
        user: {
          name: 'Soham Bardhan',
          avatar: getUserAvatar('Soham Bardhan'),
          verified: true,
          role: 'Actor'
        },
      timestamp: '10 hours ago',
      content: 'POV: Trying to explain the Marvel multiverse to your parents 🕷️🦸‍♂️\nThem: "So there are multiple Spider-Mans?"\nMe: "It\'s quite complicated..." 😅',
      reactions: [{ emoji: '😅', count: 189 }, { emoji: '🕷️', count: 134 }, { emoji: '🤯', count: 56 }],
      comments: 91,
      shares: 27
    },
          {
        id: '6',
        user: {
          name: 'Praveen Dehury',
          avatar: getUserAvatar('Praveen Dehury'),
          verified: false,
          role: 'Screenwriter'
        },
      timestamp: '12 hours ago',
      content: 'That moment when you realize the movie\'s plot twist was spoiled in the trailer 🤦‍♀️ Marketing team, we need to have a serious discussion!',
      reactions: [{ emoji: '🤦‍♀️', count: 298 }, { emoji: '😤', count: 87 }, { emoji: '🎬', count: 45 }],
      comments: 156,
      shares: 73
    },
    {
      id: '7',
      user: {
        name: 'Kamlesh Biswal',
        avatar: getUserAvatar('Kamlesh Biswal'),
        verified: true,
        role: 'Producer'
      },
      timestamp: '14 hours ago',
      content: 'Budget planning mein problem aa rahi hai! Hero ka fee itna zyada hai ki baaki sab compromise karna padega 😅',
      reactions: [{ emoji: '😅', count: 145 }, { emoji: '💰', count: 89 }, { emoji: '🎭', count: 34 }],
      comments: 67,
      shares: 23
    },
    {
      id: '8',
      user: {
        name: 'Alok Tripathy',
        avatar: getUserAvatar('Alok Tripathy'),
        verified: false,
        role: 'Cinematographer'
      },
      timestamp: '16 hours ago',
      content: 'Golden hour shots perfect ho gaye! 🌅 Natural lighting se better kuch nahi hota! Camera setup bhi zabardast hai!',
      reactions: [{ emoji: '🌅', count: 178 }, { emoji: '📸', count: 92 }, { emoji: '✨', count: 45 }],
      comments: 34,
      shares: 12
    },
    {
      id: '9',
      user: {
        name: 'Ankit Singh',
        avatar: getUserAvatar('Ankit Singh'),
        verified: true,
        role: 'VFX Artist'
      },
      timestamp: '18 hours ago',
      content: '3D modeling mein 12 hours lag gaye! Ab render time bhi 8 hours! Coffee toh zaroori hai ☕😴',
      reactions: [{ emoji: '☕', count: 234 }, { emoji: '😴', count: 156 }, { emoji: '💻', count: 78 }],
      comments: 89,
      shares: 45
    },
    {
      id: '10',
      user: {
        name: 'Biren Dora',
        avatar: getUserAvatar('Biren Dora'),
        verified: false,
        role: 'Sound Engineer'
      },
      timestamp: '20 hours ago',
      content: 'Recording the background score today! The orchestra is absolutely perfect! 🎵�� The composition is truly exceptional.',
      reactions: [{ emoji: '🎵', count: 167 }, { emoji: '🎼', count: 89 }, { emoji: '🎶', count: 56 }],
      comments: 45,
      shares: 23
    },
    {
      id: '11',
      user: {
        name: 'Adya Rath',
        avatar: getUserAvatar('Adya Rath'),
        verified: true,
        role: 'Costume Designer'
      },
      timestamp: '22 hours ago',
      content: 'Hero ka costume design complete! Fabric selection mein 2 din lag gaye! Perfect match mil gaya! 👗✨',
      reactions: [{ emoji: '👗', count: 145 }, { emoji: '✨', count: 89 }, { emoji: '🎭', count: 34 }],
      comments: 56,
      shares: 18
    },
    {
      id: '12',
      user: {
        name: 'Soham Bardhan',
        avatar: getUserAvatar('Soham Bardhan'),
        verified: false,
        role: 'Stunt Coordinator'
      },
      timestamp: '24 hours ago',
      content: 'Stunt sequence practice mein hero ko injury ho gaya! Ab 2 din rest! Safety first! 🤸‍♂️��️',
      reactions: [{ emoji: '🤸‍♂️', count: 123 }, { emoji: '🛡️', count: 67 }, { emoji: '💪', count: 45 }],
      comments: 78,
      shares: 34
    },
    {
      id: '13',
      user: {
        name: 'Praveen Dehury',
        avatar: getUserAvatar('Praveen Dehury'),
        verified: true,
        role: 'Makeup Artist'
      },
      timestamp: '26 hours ago',
      content: 'Heroine ka makeup test perfect ho gaya! Natural look with glamour! 💄✨ Transformation amazing hai!',
      reactions: [{ emoji: '💄', count: 189 }, { emoji: '✨', count: 134 }, { emoji: '👸', count: 67 }],
      comments: 89,
      shares: 45
    },
          {
        id: '14',
        user: {
          name: 'Kamlesh Biswal',
          avatar: getUserAvatar('Kamlesh Biswal'),
          verified: false,
          role: 'Location Manager'
        },
      timestamp: '28 hours ago',
      content: 'Shooting location final ho gaya! Beach scene ke liye perfect spot mil gaya! 🏖️🌊 Permission bhi mil gayi!',
      reactions: [{ emoji: '🏖️', count: 156 }, { emoji: '🌊', count: 89 }, { emoji: '📸', count: 45 }],
      comments: 67,
      shares: 23
    },
    {
      id: '15',
      user: {
        name: 'Alok Tripathy',
        avatar: getUserAvatar('Alok Tripathy'),
        verified: true,
        role: 'Editor'
      },
      timestamp: '30 hours ago',
      content: 'First cut ready! 3 hours ka footage ko 2.5 hours mein edit kiya! Pacing perfect hai! ✂️🎬',
      reactions: [{ emoji: '✂️', count: 134 }, { emoji: '🎬', count: 89 }, { emoji: '⏱️', count: 56 }],
      comments: 78,
      shares: 34
    },
    {
      id: '16',
      user: {
        name: 'Ipsit Tripathy',
        avatar: getUserAvatar('Ipsit Tripathy'),
        verified: true,
        role: 'Fitness Trainer'
      },
      timestamp: '1 hour ago',
      content: 'NEW PR ALERT! 💪 Deadlift 200kg touch kar liya! Body transformation journey mein ek aur milestone! Gym bros, consistency is key! 🏋️‍♂️🔥',
      reactions: [{ emoji: '💪', count: 245 }, { emoji: '🔥', count: 167 }, { emoji: '🏋️‍♂️', count: 89 }],
      comments: 123,
      shares: 67
    }
  ]);


  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Use TMDB community data with Spotify for music artists
  const getCommunityData = (): Record<string, RealCommunityItem[]> => {
    return {
      productionHouse: productionHouses,
      movie: movies,
      director: directors,
      actor: actors,
      actress: actresses,
      musicArtist: mergedMusicArtists.length > 0 ? mergedMusicArtists : musicArtists
    };
  };

  const communityData = getCommunityData();
  const currentCategoryItems = communityData[selectedCategory] || [];
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(currentCategoryItems.length / itemsPerPage);
  const paginatedItems = currentCategoryItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Static music artist data processing - no API calls
  useEffect(() => {
    const processMusicArtists = () => {
      setIsLoadingSpotifyArtists(true);
      
      try {
        // Process local music artists with saved Spotify images
        const processedData = musicArtists.map(artist => {
          const spotifyData = getSpotifyArtistData(artist.name);
          
          if (spotifyData) {
            // Use saved Spotify data if available
            return {
              ...artist,
              avatar: spotifyData.imageUrl,
              cover: spotifyData.imageUrl,
              description: spotifyData.genres?.slice(0, 3).join(', ') || artist.description,
              followers: spotifyData.followers || artist.followers,
              verified: spotifyData.verified,
              rating: (spotifyData.popularity || 50) / 10,
              knownFor: spotifyData.genres?.slice(0, 3) || artist.knownFor
            };
          } else {
            // Use high-quality placeholder images for artists not found in Spotify
            return {
              ...artist,
              avatar: artist.avatar.includes('tmdb.org') || artist.avatar.includes('placeholder') || !artist.avatar
                ? `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=face&auto=format&q=80`
                : artist.avatar,
              cover: artist.cover.includes('tmdb.org') || artist.cover.includes('placeholder') || !artist.cover
                ? `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&auto=format&q=80`
                : artist.cover
            };
          }
        });
        
        // Set final processed data
        setMergedMusicArtists(processedData);
        
      } catch (error) {
        console.error('Error processing music artist data:', error);
      } finally {
        setIsLoadingSpotifyArtists(false);
      }
    };
    
    processMusicArtists();
  }, [musicArtists]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  // Define tabs for navigation
  const tabs = [
    { id: 'feed', label: 'Feed', icon: MessageCircle },
    { id: 'channels', label: 'Channels', icon: Hash },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'perks', label: 'Perks', icon: Gift },
    { id: 'merch', label: 'Merch', icon: ShoppingBag }
  ];

  // Send message to selected channel
  const sendChannelMessage = () => {
    if (!newMessage.trim()) return;
    try { 
      navigator.vibrate?.(30); 
    } catch {
      // Vibration not supported or failed
    }
    const msg = {
      user: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: getUserAvatar('You')
    };
    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [...(prev[selectedChannel] || []), msg]
    }));
    setNewMessage('');
    setTimeout(() => {
      const reply = {
        user: 'Friend',
        message: 'Got it!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: getUserAvatar('Praveen Dehury')
      };
      setMessages(prev => ({
        ...prev,
        [selectedChannel]: [...(prev[selectedChannel] || []), reply]
      }));
    }, 3000);
  };

  // Send message to selected friend
  const sendFriendMessage = () => {
    if (!friendInput.trim()) return;
    try { 
      navigator.vibrate?.(30); 
    } catch {
      // Vibration not supported or failed
    }
    const msg = {
      user: 'You',
      message: friendInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: getUserAvatar('You')
    };
    setFriendChats(prev => ({
      ...prev,
      [selectedFriend]: [...(prev[selectedFriend] || []), msg]
    }));
    setFriendInput('');
    setFriendTyping(true);
    setTimeout(() => {
      const friend = friendsList.find(f => f.id === selectedFriend);
      if (friend) {
        const reply = {
          user: friend.name,
          message: 'Auto reply!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: friend.avatar
        };
        setFriendChats(prev => ({
          ...prev,
          [selectedFriend]: [...(prev[selectedFriend] || []), reply]
        }));
      }
      setFriendTyping(false);
    }, 2000);
  };

  const startPreview = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    if (previewTimeout.current) clearTimeout(previewTimeout.current);
    previewTimeout.current = setTimeout(() => setter(id), 500);
  };

  const endPreview = (
    setter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    if (previewTimeout.current) {
      clearTimeout(previewTimeout.current);
      previewTimeout.current = null;
    }
    setter(null);
  };



  // Enhanced emoji functions
  const handleEmojiReaction = (postId: string, emoji: string) => {
    setUserReactions(prev => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], emoji] : [emoji]
    }));
    
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const existingReaction = post.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...post,
            reactions: post.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...post,
            reactions: [...post.reactions, { emoji, count: 1 }]
          };
        }
      }
      return post;
    }));
  };

  const toggleEmojiPicker = (postId: string) => {
    setSelectedPostForEmoji(selectedPostForEmoji === postId ? null : postId);
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Swipe functionality handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart && Math.abs(e.targetTouches[0].clientX - touchStart) > 10) {
      setIsSwiping(true);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    
    setIsSwiping(false);
  };

  const channels = [
    { id: 'announcements', name: 'announcements', icon: '📢', unread: 3 },
    { id: 'investor-hall', name: 'investor-hall', icon: '💰', unread: 8 },
    { id: 'creator-talks', name: 'creator-talks', icon: '🎬', unread: 2 },
    { id: 'fan-zone', name: 'fan-zone', icon: '🎉', unread: 15 },
    { id: 'polls', name: 'polls', icon: '📊', unread: 1 },
    { id: 'behind-scenes', name: 'behind-the-scenes', icon: '🎭', unread: 5 }
  ];

  // Enhanced channel data with more details
  const enhancedChannels: Channel[] = [
    {
      id: 'announcements',
      name: '📢 Announcements',
      description: 'Official updates and breaking news',
      memberCount: 1247,
      isActive: true,
      lastActivity: '2 minutes ago',
      category: 'announcements'
    },
    {
      id: 'investor-hall',
      name: '💰 Investor Hall',
      description: 'Financial discussions and market insights',
      memberCount: 892,
      isActive: true,
      lastActivity: '15 minutes ago',
      category: 'discussion'
    },
    {
      id: 'creator-talks',
      name: '🎨 Creator Talks',
      description: 'Technical discussions and creative insights',
      memberCount: 1567,
      isActive: true,
      lastActivity: '8 minutes ago',
      category: 'creative'
    },
    {
      id: 'fan-zone',
      name: '🎭 Fan Zone',
      description: 'Fan theories and community discussions',
      memberCount: 2341,
      isActive: true,
      lastActivity: '5 minutes ago',
      category: 'fan'
    },
    {
      id: 'behind-scenes',
      name: '🎬 Behind Scenes',
      description: 'Exclusive behind-the-scenes content',
      memberCount: 987,
      isActive: true,
      lastActivity: '1 minute ago',
      category: 'behind-scenes'
    },
    {
      id: 'polls',
      name: '📊 Community Polls',
      description: 'Vote on community decisions and preferences',
      memberCount: 3456,
      isActive: true,
      lastActivity: '3 minutes ago',
      category: 'fan'
    }
  ];



  return (
    <div
      className={`relative min-h-screen pt-16 pb-[100px] ${
        theme === 'light'
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
          : 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900'
      }`}
      style={{
        backgroundImage: theme === 'light' 
          ? 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.25) 0%, transparent 70%)'
      }}
    >
      {/* Enhanced Background Effects - Consistent with Browse/Details */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Dynamic Blue/Purple Floating Orbs */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-indigo-500/25 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute top-1/3 right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [0, 25, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gradient-to-br from-indigo-500/25 to-purple-500/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            y: [0, 35, 0],
            x: [0, -30, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 270, 360]
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/15 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, -40, 0],
            x: [0, 15, 0],
            scale: [1, 0.8, 1],
            rotate: [0, -90, -180]
          }}
          transition={{ 
            duration: 16, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 8
          }}
          className="absolute bottom-1/4 right-10 w-36 h-36 bg-gradient-to-br from-indigo-400/15 to-blue-400/20 rounded-full blur-2xl"
        />
        
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${theme === 'light' ? '#3b82f6' : '#93c5fd'} 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Enhanced Gradient Overlays */}
        <div className={`absolute inset-0 ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-blue-50/10 via-transparent to-indigo-50/40' 
            : 'bg-gradient-to-br from-blue-950/30 via-transparent to-indigo-950/50'
        }`} />
        
        {/* Additional Cinematic Effects */}
        <div className={`absolute inset-0 ${
          theme === 'light'
            ? 'bg-gradient-to-t from-blue-100/20 via-transparent to-transparent'
            : 'bg-gradient-to-t from-blue-900/30 via-transparent to-transparent'
        }`} />
        <div className={`absolute inset-0 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-transparent via-indigo-50/10 to-transparent'
            : 'bg-gradient-to-r from-transparent via-indigo-900/20 to-transparent'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Category Selector - Instagram Stories Style */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
              Explore Your Circles
            </h2>
            <p className={`text-gray-500 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Dive into exclusive communities of creators, investors, and fans
            </p>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory justify-center">
            {[
              { id: 'movie', label: 'Movies', icon: '🎬', color: 'from-blue-500 to-indigo-500', shape: 'square' },
              { id: 'productionHouse', label: 'Studios', icon: '🏢', color: 'from-indigo-500 to-purple-500', shape: 'square' },
              { id: 'director', label: 'Directors', icon: '🎥', color: 'from-purple-500 to-blue-600', shape: 'round' },
              { id: 'actor', label: 'Actors', icon: '👨‍🎭', color: 'from-blue-600 to-indigo-600', shape: 'round' },
              { id: 'actress', label: 'Actresses', icon: '👩‍🎭', color: 'from-indigo-600 to-purple-600', shape: 'round' },
              { id: 'musicArtist', label: 'Music Artists', icon: '🎤', color: 'from-purple-600 to-blue-500', shape: 'round' }
            ].map((category) => {
              const isSelected = selectedCategory === category.id;
              const isPerson = category.shape === 'round';
              
              return (
                <div
                  key={category.id}
                  className="flex flex-col items-center gap-3 snap-center"
                >
              <button
                    onClick={() => {
                      setSelectedCategory(category.id as any);
                      setSelectedItem(null);
                      setIsItemSelected(false);
                    }}
                    className={`relative w-20 h-20 p-1 transition-all duration-300 group overflow-hidden ${
                      isPerson ? 'rounded-full' : 'rounded-2xl'
                    } ${
                      isSelected
                        ? `bg-gradient-to-r ${category.color} shadow-2xl shadow-blue-500/40`
                        : `${theme === 'light' 
                            ? 'bg-white/80 border-2 border-blue-200 hover:border-indigo-400 shadow-lg hover:shadow-xl' 
                            : 'bg-slate-800/80 border-2 border-blue-700 hover:border-indigo-500 shadow-lg hover:shadow-xl'
                          }`
                    }`}
                  >
                    {/* Instagram-style gradient ring for selected state */}
                    {isSelected && (
        <motion.div
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`absolute inset-0 bg-gradient-to-r ${category.color} ${
                          isPerson ? 'rounded-full' : 'rounded-2xl'
                        } p-0.5 z-10`}
                      >
                        <div className={`w-full h-full ${
                          theme === 'light' ? 'bg-white' : 'bg-slate-900'
                        } ${isPerson ? 'rounded-full' : 'rounded-xl'}`} />
        </motion.div>
                    )}
                    
                    {/* Shimmer Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                      isPerson ? 'rounded-full' : 'rounded-2xl'
                    }`} />
                    
                    {/* Icon Container */}
                    <div className={`w-full h-full flex items-center justify-center relative z-20 ${
                      isPerson ? 'rounded-full' : 'rounded-xl'
                    } ${
                      isSelected 
                        ? 'bg-gradient-to-br from-white/20 to-white/5' 
                        : theme === 'light' 
                          ? 'bg-gradient-to-br from-slate-50 to-slate-100' 
                          : 'bg-gradient-to-br from-slate-700 to-slate-800'
                    }`}>
                      <span className={`text-2xl ${
                        isSelected ? 'filter drop-shadow-lg' : ''
                      }`}>{category.icon}</span>
                    </div>
                    
                    {/* Active indicator dot */}
                    {isSelected && (
        <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg z-30"
                      />
                    )}
                  </button>
                  
                  {/* Category Label */}
                  <span 
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isSelected 
                        ? theme === 'light' 
                          ? 'text-slate-900' 
                          : 'text-white'
                        : theme === 'light' 
                          ? 'text-slate-600' 
                          : 'text-slate-400'
                    }`}
                  >
                    {category.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Grid - Instagram Stories Style */}
        {!isItemSelected && (
        <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {selectedCategory === 'movie' && 'Popular Movies'}
                {selectedCategory === 'productionHouse' && 'Production Houses'}
                {selectedCategory === 'director' && 'Famous Directors'}
                {selectedCategory === 'actor' && 'Leading Actors'}
                {selectedCategory === 'actress' && 'Leading Actresses'}
                {selectedCategory === 'musicArtist' && (
                  <div className="flex items-center justify-center gap-2">
                    <Music className="w-6 h-6 text-green-500" />
                    <span>Music Artists</span>
                    {isLoadingSpotifyArtists && (
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                )}
              </h3>
              <p className={`text-gray-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {selectedCategory === 'musicArtist' ? (
                  <div className="flex flex-col items-center gap-2">
                    <span>Curated collection with real Spotify data</span>
                    {isLoadingSpotifyArtists && (
                      <span className="text-blue-500 text-xs">(Processing music artists...)</span>
                    )}
                    {!isLoadingSpotifyArtists && (
                      <span className="text-green-500 text-xs">✓ Real Spotify images loaded</span>
                    )}
                  </div>
                ) : (
                  'Tap to join a community'
                )}
              </p>
            </div>
                        {/* Carousel-style Arrow Navigation + Data Grid Wrapper */}
            <div className="relative">
              {/* Left Arrow - Hidden on mobile */}
              <motion.button
                onClick={() => setCurrentPage((p) => p === 0 ? totalPages - 1 : p - 1)}
                disabled={totalPages === 1}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`hidden md:block absolute -left-6 top-[150px] md:top-[180px] lg:top-[200px] z-10 group p-4 rounded-full backdrop-blur-sm border transition-all duration-300 shadow-lg ${
                  totalPages === 1
                    ? 'opacity-50 cursor-not-allowed bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50'
                    : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border-purple-300/30 dark:border-purple-600/30 hover:shadow-xl hover:shadow-purple-500/25'
                }`}
              >
                <motion.div
                  animate={currentPage === 0 ? {} : { x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronLeft className={`w-7 h-7 ${
                    currentPage === 0 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300'
                  }`} />
        </motion.div>
                {currentPage !== 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                  />
                )}
              </motion.button>

              {/* Right Arrow - Hidden on mobile */}
              <motion.button
                onClick={() => setCurrentPage((p) => p === totalPages - 1 ? 0 : p + 1)}
                disabled={totalPages === 1}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`hidden md:block absolute -right-6 top-[150px] md:top-[180px] lg:top-[200px] z-10 group p-4 rounded-full backdrop-blur-sm border transition-all duration-300 shadow-lg ${
                  totalPages === 1
                    ? 'opacity-50 cursor-not-allowed bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50'
                    : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border-pink-300/30 dark:border-pink-600/30 hover:shadow-xl hover:shadow-pink-500/25'
                }`}
              >
        <motion.div
                  animate={currentPage >= totalPages - 1 ? {} : { x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronRight className={`w-7 h-7 ${
                    currentPage >= totalPages - 1 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300'
                  }`} />
                </motion.div>
                {currentPage < totalPages - 1 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-pink-400/50"
                  />
                )}
              </motion.button>

              {/* Data Grid with Smooth Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 min-h-[400px] ${isSwiping ? 'select-none' : ''}`}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{
                    transform: isSwiping ? 'scale(0.98)' : 'scale(1)',
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  {/* Loading state - only show if no items available */}
                  {selectedCategory === 'musicArtist' && isLoadingSpotifyArtists && paginatedItems.length === 0 && (
                    Array.from({ length: 10 }).map((_, _index) => (
                      <div key={`loading-${_index}`} className="flex flex-col items-center justify-center gap-3 min-h-[200px] md:min-h-[300px]">
                        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    ))
                  )}

                  {/* General loading state for empty categories */}
                  {paginatedItems.length === 0 && !isLoadingSpotifyArtists && (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 min-h-[300px] md:min-h-[400px]">
                      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <div className="text-center">
                        <p className={`text-lg font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          Loading {selectedCategory}...
                        </p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Please wait while we fetch the data
                        </p>
                      </div>
                    </div>
                  )}
                  

                  
                  {/* Regular items - always show if available */}
                  {paginatedItems.map((item) => {
                    const isPerson = selectedCategory === 'director' || selectedCategory === 'actor' || selectedCategory === 'actress' || selectedCategory === 'musicArtist';
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col items-center gap-3"
                      >
                        <button
                          onClick={() => {
                            // For Spotify music artists, open Spotify link if available
                            if (selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && item.spotifyUrl) {
                              window.open(item.spotifyUrl, '_blank');
                              return;
                            }
                            setSelectedItem(item);
                            setIsItemSelected(true);
                          }}
                          title={selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') ? 'Click to open Spotify profile' : 'Click to view details'}
                          className={`group relative aspect-square w-full max-w-[120px] overflow-hidden transition-all duration-300 ${
                            isPerson 
                              ? 'rounded-full' 
                              : 'rounded-2xl'
                          } ${
                theme === 'light'
                              ? 'bg-white shadow-lg hover:shadow-xl border border-red-200 hover:border-rose-400'
                              : 'bg-slate-800 shadow-lg hover:shadow-xl border border-red-700 hover:border-rose-500'
                          } ${selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') ? 'cursor-pointer hover:scale-105' : ''} ${isMobile ? 'touch-manipulation' : ''}`}
                        >
                          {/* Instagram-style gradient border for active users */}
                          {item.isActive && (
                            <div className={`absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 ${
                              isPerson ? 'rounded-full' : 'rounded-2xl'
                            } p-0.5 z-10`}>
                              <div className={`w-full h-full ${
                                theme === 'light' ? 'bg-white' : 'bg-slate-800'
                              } ${isPerson ? 'rounded-full' : 'rounded-xl'}`} />
                            </div>
                          )}
                          
                          {/* Background Image */}
                          <OptimizedImage 
                            src={item.avatar || getUserAvatar('Community Bot')}
                            alt={item.name}
                            width={120}
                            height={120}
                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 relative z-20 ${
                              isPerson ? 'rounded-full' : 'rounded-2xl'
                            } ${item.isActive ? 'p-0.5' : ''}`}
                          />
                          
                          {/* Overlay for non-person items */}
                          {!isPerson && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-30 rounded-2xl" />
                          )}
                          
                          {/* Verified Badge */}
                          {item.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          
                          {/* Spotify Badge for Music Artists */}
                          {selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && (
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                              <Music className="w-3 h-3 text-white" />
                            </div>
                          )}
                          
                          {/* Active Status Indicator */}
                          {item.isActive && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg z-40" />
                          )}
                          
                          {/* Content overlay for movies/studios */}
                          {!isPerson && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 z-30">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="w-3 h-3 text-gray-300" />
                                <span className="text-gray-300 text-xs">{item.followers?.toLocaleString()}</span>
          </div>
                            </div>
                          )}
                        </button>
                        
                        {/* Item Info */}
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <h4 className={`text-sm font-semibold truncate max-w-[100px] ${
                              theme === 'light' ? 'text-slate-900' : 'text-white'
                            }`}>
                              {item.name}
                            </h4>
                            {item.verified && !isPerson && (
                              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className={`text-xs ${
                            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {item.description}
                          </p>
                          {isPerson && (
                            <div className="flex items-center justify-center gap-1 text-xs">
                              <Users className={`w-3 h-3 ${
                                theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                              }`} />
                              <span className={`${
                                theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                {item.followers?.toLocaleString()}
                              </span>
                            </div>
                          )}
                          
                          {/* Spotify Link for Music Artists */}
                          {selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && (
                            <div className="flex items-center justify-center gap-1 text-xs">
                              <Music className={`w-3 h-3 ${
                                theme === 'light' ? 'text-green-500' : 'text-green-400'
                              }`} />
                              <span className={`${
                                theme === 'light' ? 'text-green-600' : 'text-green-400'
                              }`}>
                                Spotify
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
        </motion.div>
              </AnimatePresence>
              {/* Page Counter with Mobile Swipe Indicator */}
              <div className="w-full flex flex-col items-center mt-2 gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {currentPage + 1} / {totalPages}
                </span>
                {isMobile && totalPages > 1 && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <span>Swipe to navigate</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        

        {/* Selected Item Community Display */}
        {isItemSelected && selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl backdrop-blur-xl border mb-12 group"
            style={{
              background: theme === 'light' 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
              borderColor: theme === 'light' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.1)'
            }}
          >
            {/* Cover Image with Parallax Effect */}
            <div className="relative h-64 overflow-hidden">
              <OptimizedImage 
                src={selectedItem.cover || selectedItem.avatar || getUserAvatar('Community Bot')}
                alt={selectedItem.name}
                width={400}
                height={256}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Back Button */}
              <motion.button
                onClick={() => {
                  setSelectedItem(null);
                  setIsItemSelected(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              
              {/* Floating Social Icons */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 flex gap-2"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <MessageCircle className="w-5 h-5 text-white" />
              </div>
              </motion.div>
              
              {/* Item Info Overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-6 mb-6"
                >
                      <div className="relative">
                    <OptimizedImage 
                      src={selectedItem.avatar || getUserAvatar('Community Bot')}
                      alt={selectedItem.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
                    />
                    {selectedItem.verified && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    />
                </div>
                  <div className="flex-1">
                    <h2 className="text-white text-3xl font-black mb-2 drop-shadow-lg">{selectedItem.name}</h2>
                    <p className="text-gray-200 text-lg leading-relaxed">{selectedItem.description}</p>
                </div>
                </motion.div>
                
                {/* Enhanced Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-8 text-sm"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  >
                    <Users className="w-5 h-5 text-purple-300" />
                    <span className="text-white font-semibold">{selectedItem.followers?.toLocaleString()} followers</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  >
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">{selectedItem.projects?.length || 0} projects</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  >
                    <Clock className="w-5 h-5 text-blue-300" />
                    <span className="text-white font-semibold">Active now</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                  >
                    {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
                  </motion.div>
                </motion.div>
            </div>
          </div>

          {/* Enhanced Projects & Stats Info */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Enhanced Projects */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Film className="w-4 h-4 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Projects
                </h3>
                </motion.div>
                <div className="space-y-4">
                  {selectedItem.projects?.slice(0, 5).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="group relative p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                      <div className="relative">
                          <motion.img 
                            src={project.poster}
                            alt={project.title}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 group-hover:border-purple-500/50 transition-colors duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                            className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          />
                          </div>
                        <div className="flex-1">
                          <div className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {project.title}
                        </div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {project.genre}
                        </div>
                      </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30 hover:border-purple-500/50 transition-colors duration-300"
                        >
                          <Play className="w-4 h-4 text-purple-400" />
                        </motion.button>
                    </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Enhanced Stats */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Community Stats
                </h3>
                </motion.div>
                <div className="space-y-4">
                  {[
                    { label: 'Followers', value: selectedItem.followers?.toLocaleString() || '0', icon: Users },
                    { label: 'Projects', value: selectedItem.projects?.length || 0, icon: Film },
                    { label: 'Verified', value: selectedItem.verified ? 'Yes' : 'No', icon: CheckCircle },
                    { label: 'Active', value: selectedItem.isActive ? 'Online' : 'Offline', icon: Activity }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: -5 }}
                      className="group relative p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                            <stat.icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            {stat.label}
                      </span>
                        </div>
                        <span className={`text-sm font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {stat.value}
                      </span>
                    </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`flex items-center gap-2 p-2 rounded-2xl backdrop-blur-xl border mb-8 overflow-x-auto justify-around md:justify-start ${
            theme === 'light'
              ? 'bg-white/80 border border-gray-200 shadow-lg'
              : 'bg-slate-800/80 border border-slate-700 shadow-lg'
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'feed' | 'channels' | 'friends' | 'media' | 'perks' | 'merch')}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : `${theme === 'light' 
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Create Post */}
              <div className={`relative p-6 rounded-2xl backdrop-blur-xl border ${
                theme === 'light'
                  ? 'bg-white/80 border border-gray-200 shadow-lg'
                  : 'bg-slate-800/80 border border-slate-700 shadow-lg'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={getUserAvatar('You')}
                    alt="Your avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                  />
                  <input
                    type="text"
                    placeholder="Share your thoughts with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500/50 focus:shadow-lg ${
                      theme === 'light'
                        ? 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                        : 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        theme === 'light'
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Image className="w-5 h-5" />
                      <span>Photo</span>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={photoInputRef}
                      onChange={(e) => setPostImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <button
                      onClick={() => videoInputRef.current?.click()}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        theme === 'light'
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                      <span>Video</span>
                    </button>
                    <input
                      type="file"
                      accept="video/*"
                      ref={videoInputRef}
                      onChange={(e) => setPostVideo(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      theme === 'light'
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                    }`}>
                      <BarChart3 className="w-5 h-5" />
                      <span>Poll</span>
                    </button>
                  {postImage && (
                    <img src={URL.createObjectURL(postImage)} alt="preview" className="w-24 h-24 object-cover rounded-lg border border-blue-500/30" />
                  )}
                  {postVideo && (
                    <video src={URL.createObjectURL(postVideo)} className="w-24 h-24 rounded-lg border border-blue-500/30" controls />
                  )}
                  </div>
                  <button
                    onClick={() => {
                      // Handle post creation
                      if (newPost.trim() || postImage || postVideo) {
                        const newPostObj: FeedPost = {
                          id: Date.now().toString(),
                          user: {
                            name: 'You',
                            avatar: getUserAvatar('You'),
                            verified: false,
                            role: 'Investor'
                          },
                          timestamp: 'Just now',
                          content: newPost,
                          reactions: [],
                          comments: 0,
                          shares: 0
                        };
                        setFeedPosts(prev => [newPostObj, ...prev]);
                        setNewPost('');
                        setPostImage(null);
                        setPostVideo(null);
                      }
                    }}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                      newPost.trim() || postImage || postVideo
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 border border-gray-400'
                    }`}
                  >
                    <span>Post</span>
                  </button>
                </div>
              </div>

              {/* Feed Posts */}
              <div className="space-y-6">
                {feedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative p-6 rounded-2xl backdrop-blur-xl border ${
                      theme === 'light'
                        ? 'bg-white/80 border border-gray-200 shadow-lg hover:shadow-xl'
                        : 'bg-slate-800/80 border border-slate-700 shadow-lg hover:shadow-xl'
                    } transition-all duration-300`}
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.user.avatar || getUserAvatar(post.user.name)}
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {post.user.name}
                            </span>
                            {post.user.verified && (
                              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.user.role.includes('Actor') || post.user.role.includes('Director') ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              post.user.role.includes('Producer') ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                              'bg-purple-100 text-purple-700 border border-purple-200'
                            }`}>
                              {post.user.role}
                            </span>
                          </div>
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {post.timestamp}
                          </div>
                        </div>
                      </div>
                      <button className={`p-2 rounded-lg transition-all duration-300 ${
                        theme === 'light'
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                      }`}>
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className={`mb-4 leading-relaxed ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                      {post.content}
                    </div>

                    {/* Media Content */}
                    {post.media && (
                      <div className="mb-4">
                        <div className="relative rounded-xl overflow-hidden border border-blue-500/20">
                          <img 
                            src={post.media.url}
                            alt="Post media"
                            className="w-full h-64 object-cover"
                          />
                          {post.media.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all duration-300 border border-white/30">
                                <Play className="w-8 h-8 text-white ml-1" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="flex items-center gap-2 mb-4">
                      {post.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 ${
                            theme === 'light'
                              ? 'bg-blue-100 hover:bg-blue-200 border border-blue-200'
                              : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                          }`}
                        >
                          <span className="text-lg">{reaction.emoji}</span>
                          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            {reaction.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Engagement Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-6">
                        <button className={`flex items-center gap-2 transition-all duration-300 ${
                          theme === 'light'
                            ? 'text-gray-600 hover:text-blue-600'
                            : 'text-gray-400 hover:text-blue-400'
                        }`}>
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">Like</span>
                        </button>
                        <button className={`flex items-center gap-2 transition-all duration-300 ${
                          theme === 'light'
                            ? 'text-gray-600 hover:text-indigo-600'
                            : 'text-gray-400 hover:text-indigo-400'
                        }`}>
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{post.comments} Comments</span>
                        </button>
                        <button className={`flex items-center gap-2 transition-all duration-300 ${
                          theme === 'light'
                            ? 'text-gray-600 hover:text-purple-600'
                            : 'text-gray-400 hover:text-purple-400'
                        }`}>
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">{post.shares} Shares</span>
                        </button>
                      </div>
                      <button className={`transition-all duration-300 ${
                        theme === 'light'
                          ? 'text-gray-600 hover:text-blue-600'
                          : 'text-gray-400 hover:text-blue-400'
                      }`}>
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Channels Tab */}
          {activeTab === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {/* Channel List */}
              <div className={`col-span-1 lg:col-span-1 p-6 rounded-2xl backdrop-blur-xl border ${
                theme === 'light'
                  ? 'bg-white/80 border border-gray-200 shadow-lg'
                  : 'bg-slate-800/80 border border-slate-700 shadow-lg'
              }`}>
                <h3 className={`font-bold text-lg mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Channels
                </h3>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                        selectedChannel === channel.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : `${theme === 'light' 
                              ? 'text-gray-700 hover:bg-gray-100' 
                              : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{channel.icon}</span>
                        <span className="font-medium">#{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <span className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg">
                          {channel.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className={`col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-2xl backdrop-blur-xl border ${
                theme === 'light'
                  ? 'light-glass-header'
                  : 'bg-white/10 border-white/20'
              } ${isMobile ? 'pb-24' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    #{selectedChannel}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'light'
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'light'
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                    }`}>
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <AnimatePresence mode="wait" key={selectedChannel}>
                  <motion.div
                    key={selectedChannel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 mb-6 h-96 overflow-y-auto"
                  >
                    {(messages[selectedChannel] || []).map((msg, index) => (
                      <div key={index} className="flex gap-3">
                        <img
                          src={msg.avatar || getUserAvatar(msg.user)}
                          alt={msg.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {msg.user}
                            </span>
                            <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                              {msg.time}
                            </span>
                          </div>
                          <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}> 
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Message Input */}
                <div className="flex gap-3 sticky bottom-0 pb-4 bg-inherit">
                  <input
                    type="text"
                    placeholder={`Message #${selectedChannel}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendChannelMessage();
                      }
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500/50 ${
                      theme === 'light'
                        ? 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                        : 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400'
                    }`}
                  />
                  <button
                    onClick={sendChannelMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6"
            >
              {/* Friends List Panel */}
              <div
                className={`col-span-1 md:col-span-1 p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light' ? 'bg-white/80 border border-gray-200 shadow-lg' : 'bg-slate-800/80 border border-slate-700 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Friends</h3>
                  <button className={`p-2 rounded-lg transition-all duration-300 ${
                    theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Friend Requests Badge */}
                <div className={`mb-4 p-3 rounded-xl ${
                  theme === 'light' ? 'bg-orange-50 border border-orange-200' : 'bg-orange-900/20 border border-orange-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-orange-800' : 'text-orange-300'}`}>
                      Friend Requests
                    </span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      theme === 'light' ? 'bg-orange-500 text-white' : 'bg-orange-600 text-white'
                    }`}>
                      3
                    </span>
                  </div>
                </div>

                {/* Online Status Filter */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <button className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${
                      theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
                    }`}>
                      Online
                    </button>
                    <button className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${
                      theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-700'
                    }`}>
                      All
                    </button>
                  </div>
                </div>

                {/* Friends List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {friendsList.map(friend => (
                    <button
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        selectedFriend === friend.id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : theme === 'light'
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="relative">
                        <img 
                  src={friend.avatar || getUserAvatar(friend.name || '')} 
                  alt={friend.name} 
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(friend.name || '');
                  }}
                />
                        {friend.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{friend.name}</div>
                        <div className={`text-xs ${friend.online ? 'text-green-500' : 'text-gray-500'}`}>
                          {friend.online ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Add Friend Button */}
                <button className={`w-full mt-4 p-3 rounded-xl border-2 border-dashed transition-all duration-300 ${
                  theme === 'light' 
                    ? 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50' 
                    : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Friend</span>
                  </div>
                </button>
              </div>

              {/* Chat Panel */}
              <div
                className={`col-span-1 md:col-span-3 lg:col-span-4 p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light' ? 'bg-white/80 border border-gray-200 shadow-lg' : 'bg-slate-800/80 border border-slate-700 shadow-lg'
                } ${isMobile ? 'pb-24' : ''}`}
              >
                {/* Mobile Friend Selection */}
                {isMobile && (
                  <div className="flex gap-3 overflow-x-auto pb-4 pt-4 -mx-2 px-2 scrollbar-hide snap-x snap-mandatory">
                    {friendsList.map(friend => (
                      <button
                        key={friend.id}
                        onClick={() => setSelectedFriend(friend.id)}
                        onTouchStart={() => startPreview(friend.id, setPreviewFriend)}
                        onTouchEnd={() => endPreview(setPreviewFriend)}
                        onMouseDown={() => startPreview(friend.id, setPreviewFriend)}
                        onMouseUp={() => endPreview(setPreviewFriend)}
                        onMouseLeave={() => endPreview(setPreviewFriend)}
                        className={`relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden transition-all duration-300 snap-center ${
                          selectedFriend === friend.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img 
                  src={friend.avatar || getUserAvatar(friend.name || '')} 
                  alt={friend.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(friend.name || '');
                  }}
                />
                        {previewFriend === friend.id && (
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded bg-black text-white whitespace-nowrap">
                            {friend.name}
                          </div>
                        )}
                        {friend.online && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                        alt={friendsList.find(f => f.id === selectedFriend)?.name}
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                      {friendsList.find(f => f.id === selectedFriend)?.online && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {friendsList.find(f => f.id === selectedFriend)?.name}
                      </h3>
                      <p className={`text-sm ${friendsList.find(f => f.id === selectedFriend)?.online ? 'text-green-500' : 'text-gray-500'}`}>
                        {friendsList.find(f => f.id === selectedFriend)?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chat Actions */}
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-700'
                    }`}>
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-700'
                    }`}>
                      <Video className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-700'
                    }`}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <AnimatePresence mode="wait" key={selectedFriend}>
                  <motion.div
                    key={selectedFriend}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 mb-6 h-96 overflow-y-auto"
                  >
                    {(friendChats[selectedFriend] || []).map((msg, index) => (
                      <div key={index} className="flex gap-3">
                        <img 
                  src={msg.avatar || getUserAvatar(msg.user || '')} 
                  alt={msg.user} 
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(msg.user || '');
                  }}
                />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{msg.user}</span>
                            <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>{msg.time}</span>
                          </div>
                          <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{msg.message}</div>
                        </div>
                      </div>
                    ))}
                    {friendTyping && (
                      <div className="flex gap-3">
                        <img 
                  src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '');
                  }}
                />
                        <div className="flex items-center text-sm italic text-gray-500">Typing...</div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Message Input */}
                <div className="flex gap-3 sticky bottom-0 pb-4 bg-inherit">
                  <button className={`p-3 rounded-xl transition-all duration-300 ${
                    theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}>
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={friendInput}
                    onChange={(e) => setFriendInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendFriendMessage();
                      }
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-blue-500/50 ${
                      theme === 'light'
                        ? 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                        : 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400'
                    }`}
                  />
                  <button
                    onClick={sendFriendMessage}
                    disabled={!friendInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Media Filters */}
              <div className="flex gap-4">
                {['All', 'Photos', 'Videos', 'Audio'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      filter === 'All'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : `${theme === 'light' ? 'bg-white/50 text-gray-700 hover:bg-white/80' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600 hover:text-white'}`
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Masonry Style Media Grid */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {[
                  // People - Real images
                  { url: '/images/praveen.jpg', height: 'h-64', category: 'People' },
                  { url: '/images/ankit.jpg', height: 'h-80', category: 'People' },
                  { url: '/images/soham.jpg', height: 'h-72', category: 'People' },
                  
                  // Pets
                  { url: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-96', category: 'Pets' },
                  { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-56', category: 'Pets' },
                  { url: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-88', category: 'Pets' },
                  
                  // Nature
                  { url: 'https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-64', category: 'Nature' },
                  { url: 'https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-80', category: 'Nature' },
                  { url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-72', category: 'Nature' },
                  
                  // More People - Real images
                  { url: '/images/kamlesh.jpg', height: 'h-96', category: 'People' },
                  { url: '/images/alok.jpg', height: 'h-56', category: 'People' },
                  { url: '/images/biren.jpg', height: 'h-88', category: 'People' },
                  
                  // More Pets
                  { url: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-64', category: 'Pets' },
                  { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-80', category: 'Pets' },
                  { url: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-72', category: 'Pets' },
                  
                  // More Nature
                  { url: 'https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-96', category: 'Nature' },
                  { url: 'https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-56', category: 'Nature' },
                  { url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-88', category: 'Nature' }
                ].map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative ${image.height} rounded-xl overflow-hidden group cursor-pointer bg-gray-800 mb-4 break-inside-avoid`}
                  >
                    <img 
                      src={image.url}
                      alt={`${image.category} ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{
                        filter: 'grayscale(30%) contrast(110%) brightness(90%)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-black/60 rounded-lg" />
                      <div className="relative p-2">
                        <div className="text-white text-sm font-medium">{image.category} {index + 1}</div>
                        <div className="text-gray-300 text-xs">Aesthetic Collection</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Perks Tab */}
          {activeTab === 'perks' && (
            <motion.div
              key="perks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {[
                { title: 'Premiere Screening Access', description: 'VIP access to the movie premiere', status: 'Available', type: 'event', icon: Ticket },
                { title: 'Signed Poster Collection', description: 'Limited edition signed posters', status: 'Claimed', type: 'merchandise', icon: Gift },
                { title: 'Behind-the-Scenes Footage', description: 'Exclusive BTS content access', status: 'Available', type: 'content', icon: Camera },
                { title: 'Producer Credit', description: 'Your name in the end credits', status: 'Active', type: 'credit', icon: Crown },
                { title: 'Set Visit Experience', description: 'Visit the movie set during filming', status: 'Upcoming', type: 'experience', icon: MapPin },
                { title: 'Cast Meet & Greet', description: 'Personal meeting with the cast', status: 'Available', type: 'experience', icon: Users }
              ].map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl backdrop-blur-xl border ${
                    theme === 'light'
                      ? 'light-glass-header hover:shadow-lg hover:shadow-purple-200/50'
                      : 'bg-white/10 border-white/20 hover:border-white/30'
                  } transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      perk.status === 'Available' ? 'bg-green-500/20' :
                      perk.status === 'Claimed' ? 'bg-purple-500/20' :
                      perk.status === 'Active' ? 'bg-blue-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      <perk.icon className={`w-6 h-6 ${
                        perk.status === 'Available' ? 'text-green-400' :
                        perk.status === 'Claimed' ? 'text-purple-400' :
                        perk.status === 'Active' ? 'text-blue-400' :
                        'text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {perk.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          perk.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                          perk.status === 'Claimed' ? 'bg-purple-500/20 text-purple-400' :
                          perk.status === 'Active' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {perk.status}
                        </span>
                      </div>
                      <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {perk.description}
                      </p>
                      {perk.status === 'Available' && (
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white text-sm font-medium hover:from-purple-400 hover:to-blue-400 transition-all duration-300">
                          Claim Perk
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Merch Tab */}
          {activeTab === 'merch' && (
            <motion.div
              key="merch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Merchandise />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Performance Monitoring Panel */}
      
    </div>
  );
});

Community.displayName = 'Community';

export default Community;
import React, { useState, useRef } from 'react';
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
  Plus,
  CheckCircle,
  ShoppingBag,
  Activity,
  BarChart3,
  Hash,
  Ticket,
  ArrowLeft,
  Film,
  Star,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import useIsMobile from '../hooks/useIsMobile';
import Merchandise from './Merchandise';
import { Project } from '../types';
import { realCommunityData, getCommunityDataByType, type RealCommunityItem } from '../data/realCommunityData';

// Enhanced interfaces for hierarchical community structure
interface CommunityItem extends RealCommunityItem {}

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
}

const Community: React.FC = () => {
  // Hierarchical community state
  const [selectedCategory, setSelectedCategory] = useState<'productionHouse' | 'movie' | 'director' | 'actor' | 'actress'>('movie');
  const [selectedItem, setSelectedItem] = useState<CommunityItem | null>(null);
  const [isItemSelected, setIsItemSelected] = useState(false);
  
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
      { user: 'Priya Sharma', message: 'Just saw the latest behind-the-scenes footage! 🔥', time: '2:30 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Dev Malhotra', message: 'The action sequences look incredible!', time: '2:32 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Rahul Krishnan', message: '🚨 BREAKING: New trailer drops tomorrow at 12 PM IST! 🚨', time: '3:15 PM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Kavya Nair', message: 'Finally! Been waiting for this since forever 😭', time: '3:16 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' }
    ],
    'investor-hall': [
      { user: 'Vikram Singh', message: 'Q3 numbers are looking strong! 📈', time: '1:45 PM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Meera Patel', message: 'The international market response has been phenomenal 🌍', time: '1:47 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Arjun Reddy', message: 'Should we diversify into streaming platforms? 🤔', time: '2:10 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Ananya Gupta', message: 'Netflix deal is almost finalized! 🎬', time: '2:12 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' }
    ],
    'creator-talks': [
      { user: 'Rohan Joshi', message: 'Anyone else struggling with color grading in low light scenes? 🎨', time: '11:30 AM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Shreya Kapoor', message: 'Try using a warmer LUT and bump up the shadows slightly', time: '11:32 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Karan Malhotra', message: 'The new RED camera footage is insane! 📹', time: '12:15 PM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Pooja Sharma', message: 'Still prefer film grain over digital noise 🎞️', time: '12:17 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' }
    ],
    'fan-zone': [
      { user: 'Neha Agarwal', message: 'WHO ELSE IS CRYING OVER THAT ENDING?! 😭😭😭', time: '10:45 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Rajesh Kumar', message: 'The plot twist had me SHOOK 🤯', time: '10:47 AM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Tanya Mehta', message: 'Can we talk about that cinematography though? 🤌✨', time: '11:00 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Sameer Jain', message: 'Already planning my second watch! 🍿', time: '11:02 AM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Amit Verma', message: 'The VFX team deserves all the awards! 🏆', time: '11:30 AM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' }
    ],
    polls: [
      { user: 'Community Bot', message: '📊 POLL: Which genre should we explore next?\nA) Sci-Fi Thriller 🚀\nB) Romantic Comedy 💕\nC) Historical Drama 🏛️\nD) Horror Mystery 👻\n\nVote by reacting!', time: '9:00 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Priya Sharma', message: 'Definitely going with Sci-Fi! 🚀', time: '9:15 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Dev Malhotra', message: 'Horror Mystery sounds intriguing 👻', time: '9:20 AM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Community Bot', message: '📊 POLL RESULTS: Best Movie Snack?\n🍿 Popcorn - 67%\n🍫 Chocolate - 18%\n🥤 Soda - 10%\n🍕 Pizza - 5%\n\nPopcorn wins! 🎉', time: '2:00 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Kavya Nair', message: 'Pizza gang in shambles 😂🍕', time: '2:05 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' }
    ],
    'behind-scenes': [
      { user: 'Vikram Singh', message: 'Here\'s what 4 AM on set looks like ☕😴', time: '4:00 AM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Meera Patel', message: 'The makeup team is working magic right now ✨💄', time: '5:30 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Arjun Reddy', message: 'Just nailed that stunt sequence! 🎬🔥', time: '6:45 AM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Ananya Gupta', message: 'The catering truck is here! 🚚🍕', time: '7:00 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'Rohan Joshi', message: 'Golden hour shots are looking incredible 🌅', time: '7:15 AM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' }
    ]
  });


  const friendsList = [
    { id: 'priya', name: 'Priya Sharma', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100', online: true },
    { id: 'dev', name: 'Dev Malhotra', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100', online: true },
    { id: 'rahul', name: 'Rahul Krishnan', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100', online: false },
    { id: 'kavya', name: 'Kavya Nair', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100', online: true },
    { id: 'arjun', name: 'Arjun Reddy', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100', online: false },
    { id: 'meera', name: 'Meera Patel', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100', online: true }
  ];
  const [selectedFriend, setSelectedFriend] = useState<string>(friendsList[0].id);
  const [previewChannel, setPreviewChannel] = useState<string | null>(null);
  const [previewFriend, setPreviewFriend] = useState<string | null>(null);
  const previewTimeout = useRef<number | null>(null);
  const [friendInput, setFriendInput] = useState('');
  const [friendTyping, setFriendTyping] = useState(false);
  const [friendChats, setFriendChats] = useState<Record<string, {user:string; message:string; time:string; avatar?:string}[]>>({
    priya: [
      { user: 'Priya Sharma', message: 'Yooo did you see the new Marvel trailer?! 🤯', time: '10:30 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'OMG YES! The multiverse is getting crazy 😱', time: '10:32 AM' },
      { user: 'Priya Sharma', message: 'I literally screamed when I saw Spider-Man 🕷️', time: '10:33 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Same! My neighbors probably think I\'m crazy lol', time: '10:35 AM' },
      { user: 'Priya Sharma', message: 'Wanna catch the premiere together? 🎬', time: '10:36 AM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Absolutely! I\'ll book the tickets 🎫', time: '10:37 AM' }
    ],
    dev: [
      { user: 'Dev Malhotra', message: 'Brooo the new camera setup is INSANE 📸', time: '2:15 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Show me show me! 👀', time: '2:16 PM' },
      { user: 'Dev Malhotra', message: 'Check your DMs, sent you the pics 📱', time: '2:17 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Dude this is professional level stuff! 🔥', time: '2:20 PM' },
      { user: 'Dev Malhotra', message: 'Right?! Time to start that YouTube channel 📹', time: '2:21 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'I\'m subscribing already! 😂', time: '2:22 PM' }
    ],
    rahul: [
      { user: 'Rahul Krishnan', message: 'Hey! Long time no see 👋', time: '9:45 AM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Rahul! How\'s the new job going?', time: '9:50 AM' },
      { user: 'Rahul Krishnan', message: 'Pretty good! Working on some cool projects 💼', time: '9:52 AM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'That\'s awesome! We should catch up soon ☕', time: '9:55 AM' },
      { user: 'Rahul Krishnan', message: 'Definitely! How about this weekend?', time: '9:56 AM', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' }
    ],
    kavya: [
      { user: 'Kavya Nair', message: 'GIRL! Did you see what happened on the show?! 😱', time: '8:30 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'NOOO don\'t spoil it! I\'m only on episode 3 😭', time: '8:32 PM' },
      { user: 'Kavya Nair', message: 'Oops sorry! But OMG you\'re in for a ride 🎢', time: '8:33 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Now I\'m scared AND excited 😅', time: '8:35 PM' },
      { user: 'Kavya Nair', message: 'Trust me, clear your schedule for tonight 📺', time: '8:36 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Already ordered pizza and got my blanket ready 🍕', time: '8:37 PM' }
    ],
    arjun: [
      { user: 'Arjun Reddy', message: 'Dude, remember that crazy stunt from yesterday? 🤸‍♂️', time: '6:00 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'The one where you almost flew off the building? 😂', time: '6:02 PM' },
      { user: 'Arjun Reddy', message: 'Hey! It was calculated! Mostly... 😅', time: '6:03 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Your mom would kill you if she knew 😱', time: '6:05 PM' },
      { user: 'Arjun Reddy', message: 'What she doesn\'t know won\'t hurt her 🤫', time: '6:06 PM', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'You\'re insane but I respect it 😎', time: '6:07 PM' }
    ],
    meera: [
      { user: 'Meera Patel', message: 'Bestie! Coffee date tomorrow? ☕', time: '7:15 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Yes please! I need to vent about work 😩', time: '7:17 PM' },
      { user: 'Meera Patel', message: 'Uh oh, what happened now? 🤔', time: '7:18 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'Long story... I\'ll tell you everything tomorrow', time: '7:20 PM' },
      { user: 'Meera Patel', message: 'Bringing tissues and chocolate 🍫', time: '7:21 PM', avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { user: 'You', message: 'You\'re the best! 💕', time: '7:22 PM' }
    ]
  });
  
  // Enhanced mock feed data with 15+ funny and realistic posts
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: '1',
      user: {
        name: 'Priya Sharma',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Investor'
      },
      timestamp: '2 hours ago',
      content: 'Just watched the latest trailer! The cinematography is absolutely stunning. Can\'t wait for the release! 🎬✨',
      reactions: [{ emoji: '❤️', count: 24 }, { emoji: '🔥', count: 12 }],
      comments: 8,
      shares: 3
    },
    {
      id: '2',
      user: {
        name: 'Dev Malhotra',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Fan'
      },
      timestamp: '4 hours ago',
      content: 'The behind-the-scenes footage shows how much effort goes into making these movies. Respect to the entire team! 👏',
      reactions: [{ emoji: '👏', count: 18 }, { emoji: '💯', count: 7 }],
      comments: 5,
      shares: 2
    },
    {
      id: '3',
      user: {
        name: 'Rahul Krishnan',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Director'
      },
      timestamp: '6 hours ago',
      content: 'When the CGI budget is higher than my entire life savings but somehow they still made the dragon look like it\'s from 2005 😂🐉',
      reactions: [{ emoji: '😂', count: 156 }, { emoji: '💀', count: 89 }, { emoji: '🐉', count: 23 }],
      comments: 42,
      shares: 18
    },
    {
      id: '4',
      user: {
        name: 'Kavya Nair',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Film Critic'
      },
      timestamp: '8 hours ago',
      content: 'Me: "I\'ll just watch one episode"\nNetflix: *plays next episode automatically*\nMe at 3 AM: "How did I get here?" 🤡',
      reactions: [{ emoji: '😭', count: 234 }, { emoji: '🤡', count: 67 }, { emoji: '📺', count: 45 }],
      comments: 78,
      shares: 34
    },
    {
      id: '5',
      user: {
        name: 'Arjun Reddy',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Actor'
      },
      timestamp: '10 hours ago',
      content: 'POV: You\'re trying to explain the Marvel multiverse to your parents 🕷️🦸‍♂️\nThem: "So there are multiple Spider-Mans?"\nMe: "It\'s complicated..." 😅',
      reactions: [{ emoji: '😅', count: 189 }, { emoji: '🕷️', count: 134 }, { emoji: '🤯', count: 56 }],
      comments: 91,
      shares: 27
    },
    {
      id: '6',
      user: {
        name: 'Meera Patel',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Screenwriter'
      },
      timestamp: '12 hours ago',
      content: 'That moment when you realize the movie\'s plot twist was spoiled in the trailer 🤦‍♀️ Marketing team, we need to talk!',
      reactions: [{ emoji: '🤦‍♀️', count: 298 }, { emoji: '😤', count: 87 }, { emoji: '🎬', count: 45 }],
      comments: 156,
      shares: 73
    },
    {
      id: '7',
      user: {
        name: 'Vikram Singh',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Producer'
      },
      timestamp: '14 hours ago',
      content: 'Fun fact: The catering budget for our last film was bigger than the entire budget of some indie films 🍕🎭 #FilmLife',
      reactions: [{ emoji: '🍕', count: 167 }, { emoji: '😂', count: 134 }, { emoji: '🎭', count: 89 }],
      comments: 67,
      shares: 23
    },
    {
      id: '8',
      user: {
        name: 'Ananya Gupta',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Makeup Artist'
      },
      timestamp: '16 hours ago',
      content: 'When the actor says "just make me look natural" but you know they mean "make me look like I have perfect skin, no pores, and was born with contour" 💄✨',
      reactions: [{ emoji: '💄', count: 245 }, { emoji: '✨', count: 178 }, { emoji: '😏', count: 92 }],
      comments: 123,
      shares: 45
    },
    {
      id: '9',
      user: {
        name: 'Rohan Joshi',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Cinematographer'
      },
      timestamp: '18 hours ago',
      content: 'Director: "Can you make this look cinematic?"\nMe: *adds lens flares and desaturates everything*\nDirector: "Perfect!" 🎥😎',
      reactions: [{ emoji: '🎥', count: 198 }, { emoji: '😎', count: 145 }, { emoji: '✨', count: 67 }],
      comments: 89,
      shares: 34
    },
    {
      id: '10',
      user: {
        name: 'Shreya Kapoor',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Sound Engineer'
      },
      timestamp: '20 hours ago',
      content: 'That awkward moment when you\'re mixing audio and realize the "romantic" scene has construction noise in the background 🚧💕',
      reactions: [{ emoji: '🚧', count: 156 }, { emoji: '😅', count: 234 }, { emoji: '🎧', count: 78 }],
      comments: 67,
      shares: 29
    },
    {
      id: '11',
      user: {
        name: 'Karan Malhotra',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Stunt Coordinator'
      },
      timestamp: '22 hours ago',
      content: 'Actor: "I want to do my own stunts!"\nInsurance company: "Absolutely not."\nMe: *creates the most elaborate stunt double plan* 🎬🤸‍♂️',
      reactions: [{ emoji: '🤸‍♂️', count: 189 }, { emoji: '😂', count: 267 }, { emoji: '🎬', count: 45 }],
      comments: 134,
      shares: 56
    },
    {
      id: '12',
      user: {
        name: 'Pooja Sharma',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Costume Designer'
      },
      timestamp: '1 day ago',
      content: 'When the period drama is set in 1800s but the lead actress refuses to wear anything without a zipper 👗⚡ #PeriodDramaProblems',
      reactions: [{ emoji: '👗', count: 178 }, { emoji: '😤', count: 89 }, { emoji: '⚡', count: 234 }],
      comments: 98,
      shares: 67
    },
    {
      id: '13',
      user: {
        name: 'Amit Verma',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'VFX Artist'
      },
      timestamp: '1 day ago',
      content: 'Client: "Can you just fix it in post?"\nMe: *dies inside* 💀\nAlso me: "Sure, no problem!" 😭 #VFXLife',
      reactions: [{ emoji: '💀', count: 345 }, { emoji: '😭', count: 234 }, { emoji: '🎨', count: 67 }],
      comments: 189,
      shares: 78
    },
    {
      id: '14',
      user: {
        name: 'Neha Agarwal',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Script Supervisor'
      },
      timestamp: '1 day ago',
      content: 'Actor in take 1: *holds coffee in right hand*\nActor in take 15: *coffee magically teleports to left hand*\nMe: "CUT! Continuity!" ☕📝',
      reactions: [{ emoji: '☕', count: 167 }, { emoji: '📝', count: 123 }, { emoji: '🤦‍♀️', count: 89 }],
      comments: 78,
      shares: 34
    },
    {
      id: '15',
      user: {
        name: 'Rajesh Kumar',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Music Director'
      },
      timestamp: '1 day ago',
      content: 'Producer: "We need the music to sound like Hans Zimmer but with a Bollywood twist and also make it go viral on TikTok"\nMe: 🎵🤔💫',
      reactions: [{ emoji: '🎵', count: 234 }, { emoji: '🤔', count: 156 }, { emoji: '💫', count: 89 }],
      comments: 145,
      shares: 67
    },
    {
      id: '16',
      user: {
        name: 'Tanya Mehta',
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: false,
        role: 'Location Manager'
      },
      timestamp: '2 days ago',
      content: 'Director: "I want to shoot in a castle"\nBudget: "Best I can do is a community center with fairy lights"\nMe: *makes magic happen* ✨🏰',
      reactions: [{ emoji: '✨', count: 198 }, { emoji: '🏰', count: 134 }, { emoji: '🎬', count: 78 }],
      comments: 89,
      shares: 45
    },
    {
      id: '17',
      user: {
        name: 'Sameer Jain',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        role: 'Film Distributor'
      },
      timestamp: '2 days ago',
      content: 'When you\'re trying to explain to your family why you invested in a movie about a talking fish 🐠💰 "It\'s artistic, mom!" 🎭',
      reactions: [{ emoji: '🐠', count: 167 }, { emoji: '💰', count: 234 }, { emoji: '🎭', count: 89 }],
      comments: 123,
      shares: 56
    }
  ]);


  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Use real community data
  const getCommunityData = (): Record<string, RealCommunityItem[]> => {
    return {
      productionHouse: getCommunityDataByType('productionHouse'),
      movie: getCommunityDataByType('movie'),
      director: getCommunityDataByType('director'),
      actor: getCommunityDataByType('actor'),
      actress: getCommunityDataByType('actress')
    };
  };

  const communityData = getCommunityData();
  const currentCategoryItems = communityData[selectedCategory] || [];

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
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50'
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
        avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50'
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
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50'
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

  // Mock circles data with key people and detailed info
  const myCircles = [
    {
      id: 'pathaan-circle',
      name: 'Pathaan Universe',
      type: 'film',
      category: 'Bollywood',
      members: 15420,
      activeMembers: 2847,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      cover: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Official community for Shah Rukh Khan\'s action franchise',
      keyPeople: [
        { name: 'Shah Rukh Khan', role: 'Lead Actor', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Deepika Padukone', role: 'Lead Actress', verified: true, avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Siddharth Anand', role: 'Director', verified: true, avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'John Abraham', role: 'Antagonist', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' }
      ],
      movieInfo: {
        budget: '₹250 Crores',
        releaseDate: 'January 25, 2023',
        boxOffice: '₹1050 Crores',
        rating: '8.2/10',
        genre: 'Action, Thriller, Spy'
      },
      lastActivity: '2 minutes ago',
      unreadMessages: 12,
      isJoined: true,
      level: 'Producer'
    },
    {
      id: 'ar-rahman-circle',
      name: 'A.R. Rahman Music Circle',
      type: 'music',
      category: 'Classical Fusion',
      members: 8950,
      activeMembers: 1234,
      avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
      cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Celebrating the Mozart of Madras and his musical journey',
      keyPeople: [
        { name: 'A.R. Rahman', role: 'Composer', verified: true, avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Hariharan', role: 'Vocalist', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Shreya Ghoshal', role: 'Vocalist', verified: true, avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Ustad Zakir Hussain', role: 'Percussionist', verified: true, avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' }
      ],
      movieInfo: {
        albums: '150+ Albums',
        awards: '6 National Awards, 2 Oscars',
        genres: 'Classical, Fusion, World Music',
        collaborations: '200+ Artists',
        experience: '30+ Years'
      },
      lastActivity: '5 minutes ago',
      unreadMessages: 5,
      isJoined: true,
      level: 'Executive'
    },
    {
      id: 'rrr-circle',
      name: 'RRR Epic Universe',
      type: 'film',
      category: 'Regional',
      members: 22100,
      activeMembers: 4567,
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      cover: 'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Rise, Roar, Revolt - The epic that conquered the world',
      keyPeople: [
        { name: 'S.S. Rajamouli', role: 'Director', verified: true, avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Ram Charan', role: 'Alluri Sitarama Raju', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Jr. NTR', role: 'Komaram Bheem', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Alia Bhatt', role: 'Sita', verified: true, avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' }
      ],
      movieInfo: {
        budget: '₹550 Crores',
        releaseDate: 'March 25, 2022',
        boxOffice: '₹1387 Crores',
        rating: '8.8/10',
        awards: 'Oscar Winner, Golden Globe'
      },
      lastActivity: '1 hour ago',
      unreadMessages: 0,
      isJoined: true,
      level: 'Backer'
    },
    {
      id: 'spider-man-circle',
      name: 'Spider-Verse Community',
      type: 'film',
      category: 'Hollywood',
      members: 34500,
      activeMembers: 6789,
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      cover: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Your friendly neighborhood Spider-Man multiverse',
      keyPeople: [
        { name: 'Tom Holland', role: 'Spider-Man', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Zendaya', role: 'MJ', verified: true, avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Jon Watts', role: 'Director', verified: true, avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' }
      ],
      movieInfo: {
        budget: '$200 Million',
        releaseDate: 'December 17, 2021',
        boxOffice: '$1.9 Billion',
        rating: '8.4/10',
        genre: 'Superhero, Action, Adventure'
      },
      lastActivity: '30 minutes ago',
      unreadMessages: 3,
      isJoined: true,
      level: 'Supporter'
    },
    {
      id: 'taylor-swift-circle',
      name: 'Swifties United',
      type: 'music',
      category: 'Pop',
      members: 67890,
      activeMembers: 12345,
      avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
      cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'The ultimate Taylor Swift fan community',
      keyPeople: [
        { name: 'Taylor Swift', role: 'Artist', verified: true, avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Jack Antonoff', role: 'Producer', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Aaron Dessner', role: 'Producer', verified: true, avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' }
      ],
      movieInfo: {
        albums: '10 Studio Albums',
        awards: '12 Grammy Awards',
        tours: 'Eras Tour 2023-2024',
        fanbase: '200M+ Followers',
        achievements: 'Billionaire Artist'
      },
      lastActivity: '15 minutes ago',
      unreadMessages: 8,
      isJoined: true,
      level: 'VIP'
    },
    {
      id: 'stranger-things-circle',
      name: 'Hawkins Community',
      type: 'webseries',
      category: 'Sci-Fi Horror',
      members: 45670,
      activeMembers: 8901,
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      cover: 'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Exploring the Upside Down with fellow fans',
      keyPeople: [
        { name: 'The Duffer Brothers', role: 'Creators', verified: true, avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Millie Bobby Brown', role: 'Eleven', verified: true, avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'Finn Wolfhard', role: 'Mike Wheeler', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' },
        { name: 'David Harbour', role: 'Jim Hopper', verified: true, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50' }
      ],
      movieInfo: {
        seasons: '4 Seasons',
        episodes: '42 Episodes',
        platform: 'Netflix',
        rating: '8.7/10',
        awards: 'Emmy Nominations'
      },
      lastActivity: '45 minutes ago',
      unreadMessages: 2,
      isJoined: true,
      level: 'Member'
    }
  ];

  const channels = [
    { id: 'announcements', name: 'announcements', icon: '📢', unread: 3 },
    { id: 'investor-hall', name: 'investor-hall', icon: '💰', unread: 8 },
    { id: 'creator-talks', name: 'creator-talks', icon: '🎬', unread: 2 },
    { id: 'fan-zone', name: 'fan-zone', icon: '🎉', unread: 15 },
    { id: 'polls', name: 'polls', icon: '📊', unread: 1 },
    { id: 'behind-scenes', name: 'behind-the-scenes', icon: '🎭', unread: 5 }
  ];



  const currentItem = selectedItem || currentCategoryItems[0];

  return (
    <div
      className={`relative min-h-screen pt-16 pb-[100px] ${
        theme === 'light'
          ? 'bg-gradient-to-br from-slate-50 via-white to-indigo-50'
          : 'bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950'
      }`}
      style={{
        backgroundImage: theme === 'light' 
          ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
      }}
    >
      {/* Enhanced Background Effects - Consistent with Browse/Details */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute top-1/3 right-20 w-40 h-40 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [0, 25, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl"
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${theme === 'light' ? '#1e293b' : '#e2e8f0'} 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Gradient Overlays */}
        <div className={`absolute inset-0 ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-white/5 via-transparent to-indigo-50/30' 
            : 'bg-gradient-to-br from-slate-900/20 via-transparent to-indigo-950/40'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Enhanced Header with Social Focus */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6 p-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          >
            <Users className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 font-semibold">15,420+ Active Members</span>
          </motion.div>
          
          <h1 className={`text-5xl md:text-7xl font-black mb-4 ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-slate-800 via-indigo-700 to-slate-900 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-white via-indigo-200 to-slate-100 bg-clip-text text-transparent'
          }`}>
            Community Hub
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Where fans, investors, and creators connect. Share moments, discuss projects, and build lasting relationships in the entertainment universe.
          </p>
          
          {/* Live Activity Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">Live Community Activity</span>
          </motion.div>
        </motion.div>

        {/* Category Selector - Instagram Stories Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Choose Your Community
            </h2>
            <p className={`text-gray-500 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Select a category to explore communities
            </p>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory justify-center">
            {[
              { id: 'movie', label: 'Movies', icon: '🎬', color: 'from-indigo-500 to-purple-500', shape: 'square' },
              { id: 'productionHouse', label: 'Studios', icon: '🏢', color: 'from-blue-500 to-cyan-500', shape: 'square' },
              { id: 'director', label: 'Directors', icon: '🎥', color: 'from-emerald-500 to-teal-500', shape: 'round' },
              { id: 'actor', label: 'Actors', icon: '👨‍🎭', color: 'from-amber-500 to-orange-500', shape: 'round' },
              { id: 'actress', label: 'Actresses', icon: '👩‍🎭', color: 'from-rose-500 to-pink-500', shape: 'round' }
            ].map((category, index) => {
              const isSelected = selectedCategory === category.id;
              const isPerson = category.shape === 'round';
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col items-center gap-3 snap-center"
                >
                  <motion.button
                    onClick={() => {
                      setSelectedCategory(category.id as any);
                      setSelectedItem(null);
                      setIsItemSelected(false);
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-20 p-1 transition-all duration-300 group overflow-hidden ${
                      isPerson ? 'rounded-full' : 'rounded-2xl'
                    } ${
                      isSelected
                        ? `bg-gradient-to-r ${category.color} shadow-2xl shadow-indigo-500/40`
                        : `${theme === 'light' 
                            ? 'bg-white/80 border-2 border-slate-200 hover:border-indigo-300 shadow-lg hover:shadow-xl' 
                            : 'bg-slate-800/80 border-2 border-slate-700 hover:border-indigo-500 shadow-lg hover:shadow-xl'
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
                  </motion.button>
                  
                  {/* Category Label */}
                  <motion.span 
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isSelected 
                        ? theme === 'light' 
                          ? 'text-slate-900' 
                          : 'text-white'
                        : theme === 'light' 
                          ? 'text-slate-600' 
                          : 'text-slate-400'
                    }`}
                    animate={{ 
                      scale: isSelected ? 1.05 : 1,
                      fontWeight: isSelected ? 600 : 500
                    }}
                  >
                    {category.label}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Items Grid - Instagram Stories Style */}
        {!isItemSelected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="text-center mb-6">
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {selectedCategory === 'movie' && 'Popular Movies'}
                {selectedCategory === 'productionHouse' && 'Production Houses'}
                {selectedCategory === 'director' && 'Famous Directors'}
                {selectedCategory === 'actor' && 'Leading Actors'}
                {selectedCategory === 'actress' && 'Leading Actresses'}
              </h3>
              <p className={`text-gray-500 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Tap to join a community
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentCategoryItems.map((item, index) => {
                const isPerson = selectedCategory === 'director' || selectedCategory === 'actor' || selectedCategory === 'actress';
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <motion.button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsItemSelected(true);
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative aspect-square w-full max-w-[120px] overflow-hidden transition-all duration-300 ${
                        isPerson 
                          ? 'rounded-full' 
                          : 'rounded-2xl'
                      } ${
                        theme === 'light'
                          ? 'bg-white shadow-lg hover:shadow-xl border border-slate-200 hover:border-indigo-300'
                          : 'bg-slate-800 shadow-lg hover:shadow-xl border border-slate-700 hover:border-indigo-500'
                      }`}
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
                      <img 
                        src={item.avatar}
                        alt={item.name}
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
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg z-40"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      {/* Active Status Indicator */}
                      {item.isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg z-40"
                        />
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
                    </motion.button>
                    
                    {/* Item Info */}
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <h4 className={`text-sm font-semibold truncate max-w-[100px] ${
                          theme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {item.name}
                        </h4>
                        {item.verified && !isPerson && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
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
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
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
              <motion.img 
                src={selectedItem.cover || selectedItem.avatar}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
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
                    <motion.img 
                      src={selectedItem.avatar}
                      alt={selectedItem.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
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
              ? 'light-glass-header'
              : 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/20'
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'feed' | 'channels' | 'friends' | 'media' | 'perks' | 'merch')}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  : `${theme === 'light' 
                      ? 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-gray-900 border border-transparent hover:border-purple-500/30' 
                      : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-white border border-transparent hover:border-purple-500/30'}`
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className="hidden md:inline relative z-10">{tab.label}</span>
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
              <div className={`relative p-6 rounded-2xl backdrop-blur-xl border overflow-hidden group ${
                theme === 'light'
                  ? 'light-glass-header'
                  : 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/20'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50"
                    alt="Your avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                  />
                  <input
                    type="text"
                    placeholder="Share your thoughts with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/20 ${
                      theme === 'light'
                        ? 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                        : 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/30 text-white placeholder-gray-400'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 overflow-hidden group ${
                        theme === 'light'
                          ? 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20'
                          : 'text-gray-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-white'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <Image className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Photo</span>
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
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 overflow-hidden group ${
                        theme === 'light'
                          ? 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20'
                          : 'text-gray-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-white'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <Video className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Video</span>
                    </button>
                    <input
                      type="file"
                      accept="video/*"
                      ref={videoInputRef}
                      onChange={(e) => setPostVideo(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <button className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 overflow-hidden group ${
                      theme === 'light'
                        ? 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20'
                        : 'text-gray-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-white'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <BarChart3 className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Poll</span>
                    </button>
                  {postImage && (
                    <img src={URL.createObjectURL(postImage)} alt="preview" className="w-24 h-24 object-cover rounded-lg border border-purple-500/30" />
                  )}
                  {postVideo && (
                    <video src={URL.createObjectURL(postVideo)} className="w-24 h-24 rounded-lg border border-purple-500/30" controls />
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
                            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
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
                    className={`relative px-6 py-2 rounded-xl font-medium transition-all duration-300 overflow-hidden group ${
                      newPost.trim() || postImage || postVideo
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40'
                        : 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-gray-400 border border-purple-500/30'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10">Post</span>
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
                    className={`relative p-6 rounded-2xl backdrop-blur-xl border overflow-hidden group ${
                      theme === 'light'
                        ? 'light-glass-header hover:shadow-lg hover:shadow-purple-200/50'
                        : 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/20 hover:border-purple-500/30'
                    } transition-all duration-300`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {post.user.name}
                            </span>
                            {post.user.verified && (
                              <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.user.role.includes('Actor') || post.user.role.includes('Director') ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30' :
                              post.user.role.includes('Producer') ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 text-pink-300 border border-pink-500/30' :
                              'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {post.user.role}
                            </span>
                          </div>
                          <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {post.timestamp}
                          </div>
                        </div>
                      </div>
                      <button className={`relative p-2 rounded-lg transition-all duration-300 overflow-hidden group ${
                        theme === 'light'
                          ? 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20'
                          : 'text-gray-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-white'
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <MoreHorizontal className="w-5 h-5 relative z-10" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className={`mb-4 leading-relaxed relative z-10 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                      {post.content}
                    </div>

                    {/* Media Content */}
                    {post.media && (
                      <div className="mb-4 relative z-10">
                        <div className="relative rounded-xl overflow-hidden border border-purple-500/20">
                          <img 
                            src={post.media.url}
                            alt="Post media"
                            className="w-full h-64 object-cover"
                          />
                          {post.media.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button className="relative w-16 h-16 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:from-purple-500/30 hover:via-pink-500/30 hover:to-blue-500/30 transition-all duration-300 overflow-hidden group border border-white/30">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <Play className="w-8 h-8 text-white ml-1 relative z-10" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      {post.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          className={`relative flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 overflow-hidden group ${
                            theme === 'light'
                              ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 border border-purple-500/20'
                              : 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 border border-purple-500/20'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <span className="text-lg relative z-10">{reaction.emoji}</span>
                          <span className={`text-sm font-medium relative z-10 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            {reaction.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Engagement Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-purple-500/10 relative z-10">
                      <div className="flex items-center gap-6">
                        <button className={`relative flex items-center gap-2 transition-all duration-300 overflow-hidden group ${
                          theme === 'light'
                            ? 'text-gray-600 hover:text-purple-600'
                            : 'text-gray-400 hover:text-purple-400'
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <Heart className="w-5 h-5 relative z-10" />
                          <span className="text-sm relative z-10">Like</span>
                        </button>
                        <button className={`relative flex items-center gap-2 transition-all duration-300 overflow-hidden group ${
                          theme === 'light'
                            ? 'text-gray-600 hover:text-pink-600'
                            : 'text-gray-400 hover:text-pink-400'
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <MessageCircle className="w-5 h-5 relative z-10" />
                          <span className="text-sm relative z-10">{post.comments} Comments</span>
                        </button>
                        <button className={`relative flex items-center gap-2 transition-all duration-300 overflow-hidden group ${
                          theme === 'light'
                            ? 'text-gray-600 hover:text-blue-600'
                            : 'text-gray-400 hover:text-blue-400'
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <Share2 className="w-5 h-5 relative z-10" />
                          <span className="text-sm relative z-10">{post.shares} Shares</span>
                        </button>
                      </div>
                      <button className={`relative transition-all duration-300 overflow-hidden group ${
                        theme === 'light'
                          ? 'text-gray-600 hover:text-purple-600'
                          : 'text-gray-400 hover:text-purple-400'
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <Bookmark className="w-5 h-5 relative z-10" />
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
              <div className={`relative col-span-1 lg:col-span-1 p-6 rounded-2xl backdrop-blur-xl border overflow-hidden group ${
                theme === 'light'
                  ? 'light-glass-header'
                  : 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/20'
              } hidden md:block`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <h3 className={`font-bold text-lg mb-4 relative z-10 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Channels
                </h3>
                <div className="space-y-2 relative z-10">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`relative w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 overflow-hidden group ${
                        selectedChannel === channel.id
                          ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                          : `${theme === 'light' 
                              ? 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 border border-transparent hover:border-purple-500/30' 
                              : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-pink-500/20 hover:to-blue-500/20 hover:text-white border border-transparent hover:border-purple-500/30'}`
                      }`}
                    >
                      {selectedChannel === channel.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <span className="text-lg">{channel.icon}</span>
                        {!isMobile && <span className="font-medium">#{channel.name}</span>}
                      </div>
                      {channel.unread > 0 && (
                        <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-purple-500/50 relative z-10">
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
                {isMobile && (
                  <div className="flex gap-3 overflow-x-auto pb-4 pt-4 -mx-2 px-2 scrollbar-hide snap-x snap-mandatory">
                    {channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        onTouchStart={() => startPreview(channel.id, setPreviewChannel)}
                        onTouchEnd={() => endPreview(setPreviewChannel)}
                        onMouseDown={() => startPreview(channel.id, setPreviewChannel)}
                        onMouseUp={() => endPreview(setPreviewChannel)}
                        onMouseLeave={() => endPreview(setPreviewChannel)}
                        className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 snap-center ${
                          selectedChannel === channel.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                      >
                        <span className="text-xl">{channel.icon}</span>
                        {previewChannel === channel.id && (
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded bg-black text-white whitespace-nowrap">
                            #{channel.name}
                          </div>
                        )}
                        {channel.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                            {channel.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    #{selectedChannel}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'light'
                        ? 'text-gray-600 hover:bg-white/50'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'light'
                        ? 'text-gray-600 hover:bg-white/50'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
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
                          src={msg.avatar}
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
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500/50 ${
                      theme === 'light'
                        ? 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                        : 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                    }`}
                  />
                  <button
                    onClick={sendChannelMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <div
                className={`col-span-1 lg:col-span-1 p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light' ? 'light-glass-header' : 'bg-white/10 border-white/20'
                } hidden md:block`}
              >
                <h3 className={`font-bold text-lg mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Friends</h3>
                <div className="space-y-2">
                  {friendsList.map(friend => (
                    <button
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        selectedFriend === friend.id
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : theme === 'light'
                          ? 'text-gray-700 hover:bg-white/50'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full object-cover" />
                      {!isMobile && <span className="font-medium">{friend.name}</span>}
                      {friend.online && <span className="ml-auto w-3 h-3 bg-green-400 rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light' ? 'light-glass-header' : 'bg-white/10 border-white/20'
                } ${isMobile ? 'pb-24' : ''}`}
              >
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
                          selectedFriend === friend.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                      >
                        <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Chat with {friendsList.find(f => f.id === selectedFriend)?.name}</h3>
                </div>
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
                        <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full object-cover" />
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
                        <img src={friendsList.find(f => f.id === selectedFriend)?.avatar} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex items-center text-sm italic text-gray-500">Typing...</div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-3 sticky bottom-0 pb-4 bg-inherit">
                  <input
                    type="text"
                    placeholder="Message"
                    value={friendInput}
                    onChange={(e) => setFriendInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendFriendMessage();
                      }
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500/50 ${
                      theme === 'light'
                        ? 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                        : 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                    }`}
                  />
                  <button
                    onClick={sendFriendMessage}
                    disabled={!friendInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : `${theme === 'light' ? 'bg-white/50 text-gray-700 hover:bg-white/80' : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'}`
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Masonry Style Media Grid */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {[
                  // People - Unique images
                  { url: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=face', height: 'h-64', category: 'People' },
                  { url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=face', height: 'h-80', category: 'People' },
                  { url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=face', height: 'h-72', category: 'People' },
                  
                  // Pets
                  { url: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-96', category: 'Pets' },
                  { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-56', category: 'Pets' },
                  { url: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-88', category: 'Pets' },
                  
                  // Nature
                  { url: 'https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-64', category: 'Nature' },
                  { url: 'https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-80', category: 'Nature' },
                  { url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-72', category: 'Nature' },
                  
                  // More People - Different unique images
                  { url: 'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=face', height: 'h-96', category: 'People' },
                  { url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=face', height: 'h-56', category: 'People' },
                  { url: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=face', height: 'h-88', category: 'People' },
                  
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
                      <div className="text-white text-sm font-medium">{image.category} {index + 1}</div>
                      <div className="text-gray-300 text-xs">Aesthetic Collection</div>
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
    </div>
  );
};

export default Community;
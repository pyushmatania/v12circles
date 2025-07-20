import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Send, 
  Smile, 
  Paperclip, 
  Video, 
  Image as ImageIcon,
  Users, 
  Hash, 
  Bell, 
  Settings, 
  Search, 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  Camera, 
  Gift, 
  Ticket, 
  Crown, 
  MapPin,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Zap,
  Globe,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Info,
  ShoppingBag,
  Music,
  ChevronLeft,
  ChevronRight,
  Activity,
  Film,
  Phone,
  MoreVertical
} from 'lucide-react';
import { ThemeContext } from './ThemeProvider';
import { getTextColor } from '../utils/themeUtils';
import { getUserAvatar } from '../utils/imageUtils';
import Feed from './Feed';
import { useTheme } from './ThemeContext';
import useIsMobile from '../hooks/useIsMobile';
import Merchandise from './Merchandise';
import { comprehensiveCommunityData, type RealCommunityItem } from '../data/comprehensiveCommunityData';
import OptimizedImage from './OptimizedImage';
import { getSpotifyArtistData } from '../data/spotifyArtistImages';
import './CommunityGenZ.css';
import DecryptedText from './TextAnimations/DecryptedText/DecryptedText';
import Typewriter from './Typewriter';





/**
 * 🎯 Enter Circles - The Ultimate Community Experience
 * @description Where creators, investors, and fans unite in the most vibrant entertainment community
 */
const Community: React.FC = () => {
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
  const [transitioningItemId, setTransitioningItemId] = useState<string | null>(null);

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
  const [previewFriend, setPreviewFriend] = useState<string | null>(null);
  const previewTimeout = useRef<number | null>(null);
  const [friendInput, setFriendInput] = useState('');
  const [friendTyping, setFriendTyping] = useState(false);
  
  // Swipe functionality state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Full experience view functionality
  const [isExperienceView, setIsExperienceView] = useState(false);
  const [wasExperienceViewClosed, setWasExperienceViewClosed] = useState(false);
  const channelsHeaderRef = useRef<HTMLDivElement>(null);
  const friendsHeaderRef = useRef<HTMLDivElement>(null);
  const feedHeaderRef = useRef<HTMLDivElement>(null);
  
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
  const itemsPerPage = isMobile ? 12 : 36; // 2x6 on mobile, 6x6 on desktop
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





  // Swipe functionality handlers - moved after variable definitions
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

    // Access currentPage and totalPages from the current scope
    const communityData = getCommunityData();
    const currentCategoryItems = communityData[selectedCategory] || [];
    const itemsPerPage = isMobile ? 12 : 36; // Define itemsPerPage here
    const totalPages = Math.ceil(currentCategoryItems.length / itemsPerPage);

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    
    setIsSwiping(false);
  };

  // Scroll detection for experience view - for channels, friends, and feed tabs
  useEffect(() => {
            const handleScroll = () => {
      // Don't trigger experience view if it was recently closed
      if (wasExperienceViewClosed) {
        return;
      }
      
      // Check for experience view based on current active tab
      let headerRef = null;
      
      if (activeTab === 'feed' && feedHeaderRef.current) {
        headerRef = feedHeaderRef.current;
      } else if (activeTab === 'channels' && channelsHeaderRef.current) {
        headerRef = channelsHeaderRef.current;
      } else if (activeTab === 'friends' && friendsHeaderRef.current) {
        headerRef = friendsHeaderRef.current;
      }
      
      // Only check for experience view if we have a valid header reference
      if (headerRef) {
        const headerRect = headerRef.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Only trigger experience view when:
        // 1. The header has scrolled up past the top of the viewport
        // 2. The section is still visible in the viewport
        // 3. User has scrolled down significantly (at least 200px from top)
        if (headerRect.top <= 0 && 
            headerRect.bottom > 0 && 
            window.scrollY > 200 && 
            !isExperienceView) {
          // Add entrance effects with a small delay for better UX
          setTimeout(() => {
            setIsExperienceView(true);
          }, 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExperienceView, activeTab, wasExperienceViewClosed]);

  // Handle closing experience view
  const closeExperienceView = () => {
    setIsExperienceView(false);
    setWasExperienceViewClosed(true);
    // Scroll back to a safe position to prevent immediate re-triggering
    setTimeout(() => {
      window.scrollTo({
        top: Math.max(0, window.scrollY - 100),
        behavior: 'smooth'
      });
    }, 100);
    // Reset the flag after 3 seconds to allow normal scrolling again
    setTimeout(() => {
      setWasExperienceViewClosed(false);
    }, 3000);
  };

  // Prevent page scroll when experience view is active
  useEffect(() => {
    if (isExperienceView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isExperienceView]);

  const channels = [
    { id: 'announcements', name: 'announcements', icon: '📢', unread: 3 },
    { id: 'investor-hall', name: 'investor-hall', icon: '💰', unread: 8 },
    { id: 'creator-talks', name: 'creator-talks', icon: '🎬', unread: 2 },
    { id: 'fan-zone', name: 'fan-zone', icon: '🎉', unread: 15 },
    { id: 'polls', name: 'polls', icon: '📊', unread: 1 },
    { id: 'behind-scenes', name: 'behind-the-scenes', icon: '🎭', unread: 5 }
  ];



  // Temporarily disabled floating emojis to prevent crashes
  // const [floatingEmojis, setFloatingEmojis] = useState<Array<{id:number, emoji:string, left:number, size:number, duration:number}>>([]);
  // const emojiIdRef = useRef(0);
  
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFloatingEmojis((prev) => [
  //       ...prev,
  //       {
  //         id: emojiIdRef.current++,
  //         emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  //         left: Math.random() * 90 + 5, // 5% to 95%
  //         size: Math.random() * 1.5 + 1, // 1rem to 2.5rem
  //         duration: Math.random() * 4 + 6 // 6s to 10s
  //       }
  //     ].slice(-20)); // keep max 20
  //   }, 900);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="community-page relative min-h-screen w-full bg-black text-white border-0">
      {/* Clean Instagram-style background */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Black overlay for navigation area - only on Community page */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-black z-40"></div>

      <div className="w-full px-6 py-8 relative z-10 pl-20 lg:pl-24 pr-20 lg:pr-24 max-w-7xl mx-auto mt-8 md:mt-12 lg:mt-16 border-0">
        
        {/* Main Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-main">
            Community
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Connect, share, and grow with fellow creators, investors, and fans
          </p>
        </div>

        {/* Category Selector - Full Width */}
        <div className="mb-8">
          <div className="text-center mb-8 mt-12">
            <h2 className="feed-title text-5xl font-bold mb-4">
                Explore Your Circles
              </h2>
            <p className="text-gray-400 text-xl">
              Dive into exclusive communities of creators, investors, and fans
            </p>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory justify-center w-full max-w-6xl mx-auto px-4">
            {[
              { id: 'movie', label: 'Movies', icon: '🎬', categoryClass: 'movies-category', shape: 'square' },
              { id: 'productionHouse', label: 'Studios', icon: '🏢', categoryClass: 'studios-category', shape: 'square' },
              { id: 'director', label: 'Directors', icon: '🎥', categoryClass: 'directors-category', shape: 'round' },
              { id: 'actor', label: 'Actors', icon: '👨‍🎭', categoryClass: 'actors-category', shape: 'round' },
              { id: 'actress', label: 'Actresses', icon: '👩‍🎭', categoryClass: 'actresses-category', shape: 'round' },
              { id: 'musicArtist', label: 'Music Artists', icon: '🎤', categoryClass: 'music-category', shape: 'round' }
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
                    className={`category-button relative w-24 h-24 p-1 transition-all duration-300 group overflow-hidden ${
                      isPerson ? 'rounded-full' : 'rounded-2xl'
                    } ${
                      isSelected
                        ? `${category.categoryClass} shadow-2xl`
                        : 'bg-gray-900/80 border-2 border-gray-700 hover:border-gray-500 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Instagram-style gradient ring for selected state */}
                    {isSelected && (
        <motion.div
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`absolute inset-0 ${category.categoryClass} ${
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
                        : 'bg-gradient-to-br from-gray-800 to-gray-900'
                    }`}>
                      <span className={`text-3xl transition-all duration-300 ${
                        isSelected 
                          ? 'filter drop-shadow-lg scale-110 animate-pulse' 
                          : 'group-hover:scale-110'
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
                    className={`text-base font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'text-white drop-shadow-lg scale-110' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {category.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Grid - Full Width */}
        {!isItemSelected && (
        <div className="mb-8">
            <div className="text-center mb-8 max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-white">
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
              <p className="text-gray-400 text-lg">
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
            <div className="relative max-w-6xl mx-auto">
              {/* Left Arrow - Hidden on mobile */}
              <motion.button
                onClick={() => setCurrentPage((p) => p === 0 ? totalPages - 1 : p - 1)}
                disabled={totalPages === 1}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`hidden md:block absolute -left-16 top-[150px] md:top-[180px] lg:top-[200px] z-10 group p-4 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl ${
                  totalPages === 1
                    ? 'opacity-50 cursor-not-allowed bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50'
                    : 'bg-gradient-to-r from-black/80 via-gray-900/70 to-black/80 hover:from-black/90 hover:via-gray-800/80 hover:to-black/90 border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20'
                }`}
              >
                <motion.div
                  animate={currentPage === 0 ? {} : { x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronLeft className={`w-7 h-7 ${
                    currentPage === 0 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-white/80 group-hover:text-white'
                  }`} />
        </motion.div>
                {currentPage !== 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                  />
                )}
              </motion.button>

              {/* Right Arrow - Hidden on mobile */}
              <motion.button
                onClick={() => setCurrentPage((p) => p === totalPages - 1 ? 0 : p + 1)}
                disabled={totalPages === 1}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`hidden md:block absolute -right-16 top-[150px] md:top-[180px] lg:top-[200px] z-10 group p-4 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl ${
                  totalPages === 1
                    ? 'opacity-50 cursor-not-allowed bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50'
                    : 'bg-gradient-to-l from-black/80 via-gray-900/70 to-black/80 hover:from-black/90 hover:via-gray-800/80 hover:to-black/90 border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-pink-500/20'
                }`}
              >
        <motion.div
                  animate={currentPage >= totalPages - 1 ? {} : { x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronRight className={`w-7 h-7 ${
                    currentPage >= totalPages - 1 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-white/80 group-hover:text-white'
                  }`} />
                </motion.div>
                {currentPage < totalPages - 1 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-white/30"
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
                                     className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 min-h-[400px] justify-items-center ${isSwiping ? 'select-none' : ''}`}
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
                    Array.from({ length: isMobile ? 12 : 36 }).map((_, _index) => (
                      <div key={`loading-${_index}`} className="flex flex-col items-center justify-center gap-3 min-h-[200px] md:min-h-[300px]">
                        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-r from-gray-700 to-gray-600 animate-pulse" />
                        <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
                        <div className="w-16 h-3 bg-gray-700 rounded animate-pulse" />
                      </div>
                    ))
                  )}

                  {/* General loading state for empty categories */}
                  {paginatedItems.length === 0 && !isLoadingSpotifyArtists && (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 min-h-[300px] md:min-h-[400px]">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-300">
                          Loading {selectedCategory}...
                        </p>
                        <p className="text-sm text-gray-400">
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
                        <div 
                          onClick={() => {
                            // For Spotify music artists, open Spotify link if available
                            if (selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && item.spotifyUrl) {
                              window.open(item.spotifyUrl, '_blank');
                              return;
                            }
                            
                            // Start transition effect for this specific item
                            setTransitioningItemId(item.id);
                            
                            // After 1 second, open the element
                            setTimeout(() => {
                              setSelectedItem(item);
                              setIsItemSelected(true);
                              setTransitioningItemId(null);
                            }, 1000);
                          }}
                          title={selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') ? 'Click to open Spotify profile' : 'Click to view details'}
                          className={`community-card p-2 cursor-pointer ${
                            isPerson ? 'rounded-full' : 'rounded-2xl'
                          } ${
                            selectedCategory === 'movie' ? 'movie-card' :
                            selectedCategory === 'productionHouse' ? 'studio-card' :
                            selectedCategory === 'director' ? 'director-card' :
                            selectedCategory === 'actor' ? 'actor-card' :
                            selectedCategory === 'actress' ? 'actress-card' :
                            selectedCategory === 'musicArtist' ? 'music-card' : ''
                          } ${transitioningItemId === item.id ? 'transitioning' : ''}`}
                        >
                          <div className={`group relative aspect-square w-full max-w-[180px] overflow-hidden transition-all duration-300 ${
                            isPerson 
                              ? 'rounded-full' 
                              : 'rounded-2xl'
                          } ${isMobile ? 'touch-manipulation' : ''}`}
                          >
                          {/* Instagram-style gradient border for active users */}
                          {item.isActive && (
                            <div className={`absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 ${
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
                            className={`w-full h-full object-cover transition-transform duration-300 relative z-20 ${
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
                        </div>
                        </div>
                        
                        {/* Item Info */}
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <h4 className="text-base font-semibold truncate max-w-[120px] text-white">
                              {item.name}
                            </h4>
                            {item.verified && !isPerson && (
                              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {item.description}
                          </p>
                                                      {isPerson && (
                              <div className="flex items-center justify-center gap-1 text-sm">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-500">
                                  {item.followers?.toLocaleString()}
                                </span>
                              </div>
                            )}
                          
                          {/* Spotify Link for Music Artists */}
                                                      {selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && (
                              <div className="flex items-center justify-center gap-1 text-sm">
                                <Music className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">
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
                <span className="text-sm text-gray-400 font-medium">
                  {currentPage + 1} / {totalPages}
                </span>
                {isMobile && totalPages > 1 && (
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <span className="swipe-hint">Swipe to navigate</span>
                                          <div className="flex gap-1">
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
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
            className="relative overflow-hidden rounded-3xl bg-gray-900/80 border border-gray-700 mb-12 group"
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
              
              {/* Item Info Overlay - Two Column Layout */}
              <div className="absolute bottom-8 left-8 right-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-8 items-center mb-6"
                >
                  {/* Left Column - Image */}
                  <div className="flex items-center gap-6">
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
                    <div>
                      <h2 className="text-white text-2xl font-black mb-2 drop-shadow-lg">{selectedItem.name}</h2>
                      <p className="text-gray-200 text-sm leading-relaxed">{selectedItem.description}</p>
                    </div>
                  </div>
                  
                  {/* Right Column - Magical Handwritten Animation */}
                  <div className="flex items-center justify-center w-full h-full min-h-[120px]">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="magical-handwriting-container w-full h-full flex items-center justify-center"
                    >
                      <div className="magical-handwriting magical-typewriter">
                        {selectedItem.name}
                      </div>
                    </motion.div>
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

        {/* Redesigned Tab Navigation */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl">
              <div className="flex gap-1">
          {tabs.map((tab) => (
                  <motion.button
              key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'feed' | 'channels' | 'friends' | 'media' | 'perks' | 'merch')}
                    className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeTab === tab.id && (
            <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2">
                      <tab.icon className={`w-4 h-4 transition-all duration-300 ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-400'
                      }`} />
                      <span className="font-medium">{tab.label}</span>
                  </div>
                  </motion.button>
                      ))}
                    </div>
                      </div>
                    </div>
              </div>

        {/* Tab Content */}
        <div className="transition-all duration-500">
          <AnimatePresence mode="wait">

          {/* Feed Tab - Instagram Style */}
          {activeTab === 'feed' && (
              <motion.div
              key="feed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto"
              >
              {/* Feed header for experience view detection */}
              <div ref={feedHeaderRef} className="feed-header relative">
                <h1 className="feed-title">Community Feed</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
              <Feed isExperienceView={false} />
            </motion.div>
          )}

          {/* Channels Tab - Instagram Style */}
          {activeTab === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div ref={channelsHeaderRef} className="feed-header relative">
                <h1 className="feed-title">Channels</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Split Layout: Channels List + Chat */}
              <div className="flex gap-8 h-[calc(100vh-80px)]">
                {/* Left Side: Channels List */}
                <div className="w-1/3 bg-white/2 rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <h3 className="font-medium text-white text-xl mb-2">Channels</h3>
                    <p className="text-sm text-gray-400">{channels.length} channels available</p>
                            </div>
                  
                  <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                    {channels.map((channel, index) => (
              <motion.div
                      key={channel.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                        selectedChannel === channel.id
                            ? 'bg-purple-500/10' 
                            : ''
                        }`}
                        onClick={() => setSelectedChannel(channel.id)}
                      >
                        <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                              {channel.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-white text-sm">#{channel.name}</h3>
                              <p className="text-xs text-gray-400">1.2k members</p>
                            </div>
                      </div>
                      {channel.unread > 0 && (
                            <span className="px-2 py-1 bg-purple-500 rounded-full text-white text-xs font-medium">
                          {channel.unread}
                        </span>
                      )}
                        </div>
                        <div className="text-xs text-gray-400 truncate mt-2">
                          Latest: Community updates...
                        </div>
                      </motion.div>
                  ))}
                </div>
              </div>

                {/* Right Side: Chat Interface */}
                <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden">
                  {selectedChannel ? (
                    <>
                      {/* Chat Header */}
                      <div className="flex items-center justify-between p-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                            {channels.find(c => c.id === selectedChannel)?.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              #<DecryptedText 
                                text={selectedChannel} 
                                speed={30} 
                                maxIterations={8} 
                                sequential={true} 
                                revealDirection="start"
                                animateOn="hover"
                                className="text-white"
                                encryptedClassName="text-purple-400"
                              />
                  </h3>
                            <p className="text-xs text-gray-400">1.2k members</p>
                          </div>
                        </div>
                  <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Bell className="w-4 h-4 text-gray-400" />
                    </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Settings className="w-4 h-4 text-gray-400" />
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
                          className="p-8 space-y-5 overflow-y-auto h-[calc(100%-200px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300"
                  >
                    {(messages[selectedChannel] || []).map((msg, index) => (
                            <div key={index} className="flex items-start gap-3">
                        <img
                          src={msg.avatar || getUserAvatar(msg.user)}
                          alt={msg.user}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                              <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-white text-sm">{msg.user}</span>
                                  <span className="text-xs text-gray-400">{msg.time}</span>
                          </div>
                                <div className="text-sm text-gray-300">{msg.message}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Message Input */}
                      <div className="flex gap-4 p-8 pb-40">
                  <input
                    type="text"
                          placeholder={`Message #${selectedChannel}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendChannelMessage();
                      }
                    }}
                          className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8"
                  />
                  <button
                    onClick={sendChannelMessage}
                    disabled={!newMessage.trim()}
                          className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                          Send
                  </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-medium mb-2">Select a Channel</h3>
                        <p className="text-gray-400 text-sm">Choose a channel from the list to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

                    {/* Friends Tab - Instagram Style */}
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto"
            >
                                          {/* Feed-style Header */}
              <div ref={friendsHeaderRef} className="feed-header relative">
                <h1 className="feed-title">Friends</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                  </div>
                </div>

              {/* Split Layout: Friends List + Chat */}
              <div className="flex gap-8 h-[calc(100vh-80px)]">
                {/* Left Side: Friends List */}
                <div className="w-1/3 bg-white/2 rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <h3 className="font-medium text-white text-xl mb-2">Friends</h3>
                    <p className="text-sm text-gray-400">{friendsList.length} friends online</p>
                </div>

                  <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                    {friendsList.map((friend, index) => (
                      <motion.div
                      key={friend.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                        selectedFriend === friend.id
                            ? 'bg-purple-500/10' 
                            : ''
                        }`}
                        onClick={() => setSelectedFriend(friend.id)}
                        onMouseEnter={() => startPreview(friend.id, setPreviewFriend)}
                        onMouseLeave={() => endPreview(setPreviewFriend)}
                      >
                        <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                  src={friend.avatar || getUserAvatar(friend.name || '')} 
                  alt={friend.name} 
                              className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(friend.name || '');
                  }}
                />
                        {friend.online && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                        )}
                      </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white text-sm">
                              <Typewriter 
                                text={friend.name} 
                                speed={80}
                                className="text-white"
                              />
                            </h3>
                            <p className={`text-xs ${friend.online ? 'text-green-400' : 'text-gray-400'}`}>
                          {friend.online ? 'Online' : 'Offline'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(friendChats[friend.id] || []).length} messages
                            </p>
                        </div>
                      </div>
                      </motion.div>
                  ))}
                </div>
              </div>

                {/* Right Side: Chat Interface */}
                <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden">
                  {selectedFriend ? (
                    <>
                {/* Chat Header */}
                      <div className="flex items-center justify-between p-8">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                        alt={friendsList.find(f => f.id === selectedFriend)?.name}
                              className="w-12 h-12 rounded-full object-cover" 
                      />
                      {friendsList.find(f => f.id === selectedFriend)?.online && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                      )}
                    </div>
                    <div>
                            <h3 className="font-medium text-white text-lg">
                              <Typewriter 
                                text={friendsList.find(f => f.id === selectedFriend)?.name || ''} 
                                speed={80}
                                className="text-white"
                              />
                      </h3>
                            <p className={`text-sm ${friendsList.find(f => f.id === selectedFriend)?.online ? 'text-green-400' : 'text-gray-400'}`}>
                        {friendsList.find(f => f.id === selectedFriend)?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chat Actions */}
                  <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Phone className="w-4 h-4 text-gray-400" />
                    </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Video className="w-4 h-4 text-gray-400" />
                    </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
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
                          className="p-8 space-y-5 overflow-y-auto h-[calc(100%-200px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300"
                  >
                    {(friendChats[selectedFriend] || []).map((msg, index) => (
                            <div key={index} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] ${msg.user === 'You' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'} rounded-lg p-3`}>
                                {msg.user !== 'You' && (
                                  <div className="flex items-center gap-2 mb-2">
                        <img 
                  src={msg.avatar || getUserAvatar(msg.user || '')} 
                  alt={msg.user} 
                                      className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(msg.user || '');
                  }}
                />
                                    <span className="font-medium text-xs">{msg.user}</span>
                                    <span className="text-xs opacity-60">{msg.time}</span>
                          </div>
                                )}
                                <div className="text-sm">{msg.message}</div>
                        </div>
                      </div>
                    ))}
                    {friendTyping && (
                            <div className="flex justify-start">
                              <div className="bg-white/10 text-white rounded-lg p-3">
                                <div className="flex items-center gap-2">
                        <img 
                  src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                                    className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '');
                  }}
                />
                                  <div className="text-sm italic opacity-60">Typing...</div>
                                </div>
                              </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Message Input */}
                      <div className="flex gap-4 p-8 pb-40">
                        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <Paperclip className="w-5 h-5 text-gray-400" />
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
                          className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8"
                  />
                  <button
                    onClick={sendFriendMessage}
                    disabled={!friendInput.trim()}
                          className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-medium mb-2">Select a Friend</h3>
                        <p className="text-gray-400 text-sm">Choose a friend from the list to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Media Tab - Instagram Style */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div className="feed-header">
                <h1 className="feed-title">Media</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Instagram-style Filters */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {['All', 'Photos', 'Videos', 'Audio', 'Behind Scenes'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                      filter === 'All'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Instagram-style Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  // People - Real images
                  { url: getUserAvatar('Praveen Dehury'), height: 'h-64', category: 'People', likes: 234, comments: 12 },
                  { url: getUserAvatar('Ankit Singh'), height: 'h-80', category: 'People', likes: 189, comments: 8 },
                  { url: getUserAvatar('Soham Bardhan'), height: 'h-72', category: 'People', likes: 456, comments: 23 },
                  
                  // Pets
                  { url: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-96', category: 'Pets', likes: 789, comments: 45 },
                  { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-56', category: 'Pets', likes: 123, comments: 6 },
                  { url: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-88', category: 'Pets', likes: 567, comments: 34 },
                  
                  // Nature
                  { url: 'https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-64', category: 'Nature', likes: 890, comments: 67 },
                  { url: 'https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-80', category: 'Nature', likes: 345, comments: 18 },
                  { url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-72', category: 'Nature', likes: 678, comments: 29 },
                  
                  // More People - Real images
                  { url: getUserAvatar('Kamlesh Biswal'), height: 'h-96', category: 'People', likes: 234, comments: 15 },
                  { url: getUserAvatar('Alok Tripathy'), height: 'h-56', category: 'People', likes: 456, comments: 22 },
                  { url: getUserAvatar('Biren Dora'), height: 'h-88', category: 'People', likes: 789, comments: 41 }
                ].map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative ${image.height} rounded-xl overflow-hidden group cursor-pointer bg-gray-800`}
                  >
                    <img 
                      src={image.url}
                      alt={`${image.category} ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{
                        filter: 'grayscale(30%) contrast(110%) brightness(90%)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <div className="text-sm font-medium">{image.category} {index + 1}</div>
                          <div className="text-xs text-gray-300">{image.likes} likes • {image.comments} comments</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Perks Tab - Instagram Style */}
          {activeTab === 'perks' && (
            <motion.div
              key="perks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div className="feed-header">
                <h1 className="feed-title">Perks</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Instagram-style Perks Grid */}
              <div className="grid md:grid-cols-2 gap-6">
              {[
                  { title: 'Premiere Screening Access', description: 'VIP access to the movie premiere', status: 'Available', type: 'event', icon: Ticket, color: 'from-purple-500 to-pink-500' },
                  { title: 'Signed Poster Collection', description: 'Limited edition signed posters', status: 'Claimed', type: 'merchandise', icon: Gift, color: 'from-green-500 to-blue-500' },
                  { title: 'Behind-the-Scenes Footage', description: 'Exclusive BTS content access', status: 'Available', type: 'content', icon: Camera, color: 'from-orange-500 to-red-500' },
                  { title: 'Producer Credit', description: 'Your name in the end credits', status: 'Active', type: 'credit', icon: Crown, color: 'from-yellow-500 to-orange-500' },
                  { title: 'Set Visit Experience', description: 'Visit the movie set during filming', status: 'Upcoming', type: 'experience', icon: MapPin, color: 'from-blue-500 to-purple-500' },
                  { title: 'Cast Meet & Greet', description: 'Personal meeting with the cast', status: 'Available', type: 'experience', icon: Users, color: 'from-pink-500 to-red-500' }
              ].map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative p-6 rounded-2xl bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Instagram-style gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${perk.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${perk.color} bg-opacity-20`}>
                        <perk.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-white">
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
                        <p className="text-sm mb-4 text-gray-300">
                        {perk.description}
                      </p>
                      {perk.status === 'Available' && (
                          <button className={`px-4 py-2 bg-gradient-to-r ${perk.color} rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all duration-300`}>
                          Claim Perk
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </motion.div>
          )}

          {/* Merch Tab - Instagram Style */}
          {activeTab === 'merch' && (
            <motion.div
              key="merch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div className="feed-header">
                <h1 className="feed-title">Merch</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Instagram-style Merch Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Movie Poster', price: '$29.99', image: 'https://images.pexels.com/photos/2387866/pexels-photo-2387866.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Posters', likes: 234 },
                  { name: 'T-Shirt Collection', price: '$49.99', image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Clothing', likes: 456 },
                  { name: 'Hoodie', price: '$79.99', image: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Clothing', likes: 789 },
                  { name: 'Coffee Mug', price: '$19.99', image: 'https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', likes: 123 },
                  { name: 'Phone Case', price: '$24.99', image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', likes: 567 },
                  { name: 'Sticker Pack', price: '$9.99', image: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', likes: 890 }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative bg-white/10 rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <span className="text-green-400 font-bold">{item.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{item.category}</span>
                        <span className="text-sm text-gray-400">{item.likes} likes</span>
                      </div>
                      <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300">
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
              </div>
      </div>
      
      {/* Full Experience View Overlay */}
      <AnimatePresence>
        {isExperienceView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="fixed inset-0 bg-black z-50"
          >
            {/* Experience Header */}
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute top-0 left-0 right-0 p-8 bg-black/80 backdrop-blur-md border-b border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="feed-title text-3xl">
                    {activeTab === 'channels' ? (
                      <Typewriter 
                        text="Channels" 
                        speed={100}
                        className="text-white"
                      />
                    ) : activeTab === 'friends' ? (
                      <Typewriter 
                        text="Friends" 
                        speed={100}
                        className="text-white"
                      />
                    ) : (
                      <Typewriter 
                        text="Community Feed" 
                        speed={100}
                        className="text-white"
                      />
                    )}
                  </h1>
                  <p className="text-sm text-gray-400 mt-2">Scroll left/right to navigate</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Quick Navigation Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex items-center gap-2"
                  >
                    {activeTab === 'feed' && (
                      <>
                        <motion.button
                          onClick={() => setActiveTab('channels')}
                          className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Hash className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('friends')}
                          className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Users className="w-4 h-4 text-white" />
                        </motion.button>
                      </>
                    )}
                    {activeTab === 'channels' && (
                      <>
                        <motion.button
                          onClick={() => setActiveTab('feed')}
                          className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageCircle className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('friends')}
                          className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Users className="w-4 h-4 text-white" />
                        </motion.button>
                      </>
                    )}
                    {activeTab === 'friends' && (
                      <>
                        <motion.button
                          onClick={() => setActiveTab('feed')}
                          className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageCircle className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('channels')}
                          className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Hash className="w-4 h-4 text-white" />
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                  <p className="text-sm text-gray-400">Click X to close</p>
                  <motion.button
                    onClick={closeExperienceView}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Experience Content */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="pt-24 h-full"
            >
              {activeTab === 'channels' && (
                <div className="flex gap-8 h-full p-8">
                  {/* Left Side: Channels List */}
                  <div className="w-1/3 bg-white/2 rounded-2xl overflow-hidden">
                    <div className="p-8">
                      <h3 className="font-medium text-white text-xl mb-2">Channels</h3>
                      <p className="text-sm text-gray-400">{channels.length} channels available</p>
                    </div>
                    
                    <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                      {channels.map((channel, index) => (
                        <motion.div
                          key={channel.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                            selectedChannel === channel.id ? 'bg-purple-500/10' : ''
                          }`}
                          onClick={() => setSelectedChannel(channel.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                                {channel.icon}
                              </div>
                              <div>
                                <h3 className="font-medium text-white text-sm">
                                  #<DecryptedText 
                                    text={channel.name} 
                                    speed={30} 
                                    maxIterations={8} 
                                    sequential={true} 
                                    revealDirection="start"
                                    animateOn="hover"
                                    className="text-white"
                                    encryptedClassName="text-purple-400"
                                  />
                                </h3>
                                <p className="text-xs text-gray-400">1.2k members</p>
                              </div>
                            </div>
                            {channel.unread > 0 && (
                              <span className="px-2 py-1 bg-purple-500 rounded-full text-white text-xs font-medium">
                                {channel.unread}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 truncate mt-2">
                            Latest: Community updates...
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Chat Interface */}
                  <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden">
                    {selectedChannel ? (
                      <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                              {channels.find(c => c.id === selectedChannel)?.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-white">#{selectedChannel}</h3>
                              <p className="text-xs text-gray-400">1.2k members</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <Bell className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <Settings className="w-4 h-4 text-gray-400" />
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
                            className="p-8 space-y-5 overflow-y-auto h-[calc(100%-200px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300"
                          >
                            {(messages[selectedChannel] || []).map((msg, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <img
                                  src={msg.avatar || getUserAvatar(msg.user)}
                                  alt={msg.user}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-white text-sm">{msg.user}</span>
                                    <span className="text-xs text-gray-400">{msg.time}</span>
                                  </div>
                                  <div className="text-sm text-gray-300">{msg.message}</div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        </AnimatePresence>

                        {/* Message Input */}
                        <div className="flex gap-4 p-8 pb-8">
                          <input
                            type="text"
                            placeholder={`Message #${selectedChannel}...`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                sendChannelMessage();
                              }
                            }}
                            className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8"
                          />
                          <button
                            onClick={sendChannelMessage}
                            disabled={!newMessage.trim()}
                            className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Send
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-white font-medium mb-2">Select a Channel</h3>
                          <p className="text-gray-400 text-sm">Choose a channel from the list to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'friends' && (
                <div className="flex gap-8 h-full p-8">
                  {/* Left Side: Friends List */}
                  <div className="w-1/3 bg-white/2 rounded-2xl overflow-hidden">
                    <div className="p-8">
                      <h3 className="font-medium text-white text-xl mb-2">Friends</h3>
                      <p className="text-sm text-gray-400">{friendsList.length} friends online</p>
                    </div>
                    
                    <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                      {friendsList.map((friend, index) => (
                        <motion.div
                          key={friend.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                            selectedFriend === friend.id ? 'bg-purple-500/10' : ''
                          }`}
                          onClick={() => setSelectedFriend(friend.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img 
                                src={friend.avatar || getUserAvatar(friend.name || '')} 
                                alt={friend.name} 
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {friend.online && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-white text-sm">
                                <DecryptedText 
                                  text={friend.name} 
                                  speed={30} 
                                  maxIterations={8} 
                                  sequential={true} 
                                  revealDirection="start"
                                  animateOn="hover"
                                  className="text-white"
                                  encryptedClassName="text-purple-400"
                                />
                              </h3>
                              <p className={`text-xs ${friend.online ? 'text-green-400' : 'text-gray-400'}`}>
                                {friend.online ? 'Online' : 'Offline'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {(friendChats[friend.id] || []).length} messages
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Chat Interface */}
                  <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden">
                    {selectedFriend ? (
                      <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-8">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img 
                                src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                                alt={friendsList.find(f => f.id === selectedFriend)?.name}
                                className="w-12 h-12 rounded-full object-cover" 
                              />
                              {friendsList.find(f => f.id === selectedFriend)?.online && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-white text-lg">
                                <DecryptedText 
                                  text={friendsList.find(f => f.id === selectedFriend)?.name || ''} 
                                  speed={30} 
                                  maxIterations={8} 
                                  sequential={true} 
                                  revealDirection="start"
                                  animateOn="hover"
                                  className="text-white"
                                  encryptedClassName="text-purple-400"
                                />
                              </h3>
                              <p className={`text-sm ${friendsList.find(f => f.id === selectedFriend)?.online ? 'text-green-400' : 'text-gray-400'}`}>
                                {friendsList.find(f => f.id === selectedFriend)?.online ? 'Online' : 'Offline'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Chat Actions */}
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <Phone className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <Video className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
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
                            className="p-8 space-y-5 overflow-y-auto h-[calc(100%-200px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300"
                          >
                            {(friendChats[selectedFriend] || []).map((msg, index) => (
                              <div key={index} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${msg.user === 'You' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'} rounded-lg p-3`}>
                                  {msg.user !== 'You' && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <img 
                                        src={msg.avatar || getUserAvatar(msg.user || '')} 
                                        alt={msg.user} 
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                      <span className="font-medium text-xs">{msg.user}</span>
                                      <span className="text-xs opacity-60">{msg.time}</span>
                                    </div>
                                  )}
                                  <div className="text-sm">{msg.message}</div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        </AnimatePresence>

                        {/* Message Input */}
                        <div className="flex gap-4 p-8 pb-8">
                          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Paperclip className="w-5 h-5 text-gray-400" />
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
                            className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8"
                          />
                          <button
                            onClick={sendFriendMessage}
                            disabled={!friendInput.trim()}
                            className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-white font-medium mb-2">Select a Friend</h3>
                          <p className="text-gray-400 text-sm">Choose a friend from the list to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'feed' && (
                <div className="h-full p-8">
                  {/* Full Feed Experience */}
                  <div className="h-full bg-white/2 rounded-2xl overflow-hidden">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                      <Feed isExperienceView={true} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
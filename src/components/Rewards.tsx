import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Medal, Box, Gem, Badge, Users, Crown, CheckCircle } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';
import ProfileCard from './Components/ProfileCard/ProfileCard';
import GlassCard from './GlassCard';

const circlesIllustrations = [
  {
    image: "/circles-perks/perk1.png",
    title: "Creative Collaboration",
    description: "Connect with creators and shape the future of entertainment",
    backTitle: "Name Credit",
    backSubtitle: "Your name on the big screen",
    backDescription: "Get officially credited in the movie your support gets permanent recognition alongside the creators."
  },
  {
    image: "/circles-perks/perk2.png",
    title: "Investment Growth",
    description: "Watch your investments grow alongside creative success",
    backTitle: "Community Casting",
    backSubtitle: "Help decide who gets the spotlight",
    backDescription: "Vote on cast members, suggest talent, and influence who lands key roles in select indie or experimental projects."
  },
  {
    image: "/circles-perks/perk3.png",
    title: "Community Building",
    description: "Join exclusive circles of passionate investors and creators",
    backTitle: "Movie Item",
    backSubtitle: "Own a piece of the story",
    backDescription: "Receive exclusive props, costumes, or memorabilia used on set — something no fan can buy off a shelf."
  },
  {
    image: "/circles-perks/perk4.png",
    title: "Exclusive Access",
    description: "Get behind-the-scenes access to your favorite projects",
    backTitle: "Premiere Access",
    backSubtitle: "Be the first to watch it",
    backDescription: "Get early invites to virtual or real-world premieres and private screenings before the world sees it."
  },
  {
    image: "/circles-perks/perk5.png",
    title: "Revenue Sharing",
    description: "Earn returns while supporting the arts you love",
    backTitle: "Trip with Movie Stars",
    backSubtitle: "Hang out where the magic happens",
    backDescription: "Win or unlock experiences to travel with the crew or spend a day on set with the stars."
  },
  {
    image: "/circles-perks/perk6.png",
    title: "Global Network",
    description: "Connect with entertainment enthusiasts worldwide",
    backTitle: "Exclusive Merch",
    backSubtitle: "Limited drops just for backers",
    backDescription: "Receive rare collectibles, apparel, and themed kits — designed only for those who invested in the film"
  }
];

const Rewards: React.FC = () => {
  const { theme } = useTheme();
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const rewardTiers = [
    {
      title: "🎬 Supporter",
      minAmount: "₹10K",
      color: "from-gray-500 to-gray-600",
      icon: <Medal className="w-6 h-6" />,
      perks: [
        "Digital certificate of investment",
        "Early access to trailer",
        "Exclusive project updates",
        "Digital poster collection"
      ]
    },
    {
      title: "🌟 Backer",
      minAmount: "₹25K",
      color: "from-blue-500 to-cyan-500",
      icon: <Box className="w-6 h-6" />,
      perks: [
        "All Supporter perks",
        "Name in credits",
        "Community casting vote",
        "Fan voting board access"
      ],
      popular: true
    },
    {
      title: "📽️ Producer",
      minAmount: "₹75K",
      color: "from-purple-500 to-pink-500",
      icon: <Gem className="w-6 h-6" />,
      perks: [
        "All Backer perks",
        "Leaderboard shoutout",
        "Limited edition digital art",
        "VIP Q&A with Creators"
      ]
    },
    {
      title: "👑 Executive Producer",
      minAmount: "₹1.5L+",
      color: "from-yellow-500 to-orange-500",
      icon: <Badge className="w-6 h-6" />,
      perks: [
        "All Producer perks",
        "Trip with the stars",
        "1-on-1 meetings",
        "VIP set visits"
      ]
    }
  ];

  const tierIcons = [
    <Medal className="w-8 h-8 text-yellow-500" />, // Supporter
    <Users className="w-8 h-8 text-blue-400" />, // Backer
    <Gem className="w-8 h-8 text-purple-500" />, // Producer
    <Crown className="w-9 h-9 text-orange-400" />, // Executive
  ];

  // Helper for custom object position
  const getObjectPosition = (index: number) => {
    if (index === 0) return 'center 10%';
    if (index === 3) return 'center 90%';
    return 'center';
  };

  return (
    <section className={`py-24 ${
      theme === 'light' 
        ? 'animated-gradient-light' 
        : 'bg-gradient-to-b from-gray-900 to-black'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className={`text-5xl md:text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-8`}>
            <Typewriter
              text="Rewards & Perks"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
            />
          </h2>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto`}>
            More than just returns. Get exclusive access, unique experiences, and become part of the creative process.
          </p>
        </motion.div>

        {/* Reward Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {rewardTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${tier.popular ? 'scale-105 lg:scale-110' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-black text-sm font-bold">
                    MOST POPULAR
                  </div>
                </div>
              )}
              {index === 3 && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="px-3 py-1 bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full text-white text-xs font-bold shadow-md">
                    VIP
                  </div>
                </div>
              )}
              <div className="relative h-full min-h-[500px] sm:min-h-[450px] lg:min-h-[420px]">
                {/* Place icon below badge for Backer, otherwise at top */}
                {index === 1 && tier.popular ? (
                  <div className="flex justify-center items-center mt-8 mb-2">
                    {tierIcons[index]}
                  </div>
                ) : (
                  <div className="flex justify-center items-center mb-2">
                    {tierIcons[index]}
                  </div>
                )}
                <ProfileCard
                  avatarUrl={
                    index === 0 ? 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=400' : // Supporter: young fan
                    index === 1 ? 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&w=400' : // Backer: group/social
                    index === 2 ? 'https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&w=400' : // Producer: beautiful girl in city bg
                    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=400' // Executive: professional business leader
                  }
                  name={tier.title}
                  title={''}
                  showUserInfo={false}
                  enableTilt={true}
                  className="h-full bg-gray-100 dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
                  avatarStyle={{ objectPosition: getObjectPosition(index) }}
                />
                {/* Glassmorphic overlay for tier info - full width */}
                <div className="absolute left-0 right-0 bottom-0 p-4 sm:p-6 rounded-b-2xl backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-t border-white/30 dark:border-gray-700/40 flex flex-col gap-2 w-full" style={{zIndex: 10}}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block w-2 h-8 rounded-l-xl ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-blue-400' : index === 2 ? 'bg-purple-400' : 'bg-orange-400'}`}></span>
                    <span className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{tier.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-blue-100 text-blue-700' : index === 2 ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>Min. Investment: {tier.minAmount}</span>
                  </div>
                  <ul className="flex flex-col gap-1 text-left text-gray-700 dark:text-gray-200 text-sm sm:text-base mb-0">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className={`w-4 h-4 mt-1 flex-shrink-0 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-blue-400' : index === 2 ? 'text-purple-400' : 'text-orange-400'}`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Top Edge (glass) */}
                <div
                  className="absolute left-0 top-0 w-full rounded-2xl"
                  style={{
                    height: '32px',
                    background: theme === 'light'
                      ? 'linear-gradient(90deg, rgba(191,219,254,0.85) 0%, rgba(59,130,246,0.85) 100%)'
                      : 'linear-gradient(90deg, rgba(76,29,149,0.85) 0%, rgba(30,64,175,0.85) 100%)',
                    boxShadow: '0 4px 16px 0 rgba(30,64,175,0.12), 0 0 0 2px rgba(255,255,255,0.18) inset',
                    borderRadius: '16px',
                    transform: `translateY(-16px) rotateX(90deg)`,
                    zIndex: 1
                  }}
                />
                {/* Bottom Edge (glass) */}
                <div
                  className="absolute left-0 bottom-0 w-full rounded-2xl"
                  style={{
                    height: '32px',
                    background: theme === 'light'
                      ? 'linear-gradient(90deg, rgba(191,219,254,0.85) 0%, rgba(59,130,246,0.85) 100%)'
                      : 'linear-gradient(90deg, rgba(76,29,149,0.85) 0%, rgba(30,64,175,0.85) 100%)',
                    boxShadow: '0 -4px 16px 0 rgba(30,64,175,0.12), 0 0 0 2px rgba(255,255,255,0.12) inset',
                    borderRadius: '16px',
                    transform: `translateY(16px) rotateX(-90deg)`,
                    zIndex: 1
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unique Experiences */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className={`text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-center mb-4`}>
            Unique{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Experiences
            </span>
          </h3>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-center mb-12 max-w-2xl mx-auto`}>
            Go beyond traditional investing. Get access to once-in-a-lifetime experiences that money can't usually buy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {circlesIllustrations.map((illustration, index) => (
              <GlassCard
                key={index}
                illustration={illustration}
                index={index}
                theme={theme}
                flipped={flippedCards.has(index)}
                onHoverStart={() => setFlippedCards(prev => new Set(prev).add(index))}
                onHoverEnd={() => setFlippedCards(prev => { const newSet = new Set(prev); newSet.delete(index); return newSet; })}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Rewards;
import React from 'react';
import { motion } from 'framer-motion';
import { Medal, Box, Gem, Badge, Camera, Music, Ticket, Users, Crown, CheckCircle } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';
import ProfileCard from './Components/ProfileCard/ProfileCard';

const Rewards: React.FC = () => {
  const { theme } = useTheme();

  const rewardTiers = [
    {
      title: "Supporter",
      minAmount: "₹10K",
      color: "from-gray-500 to-gray-600",
      icon: <Medal className="w-6 h-6" />,
      perks: [
        "Early access to content",
        "Digital poster collection",
        "Exclusive updates",
        "Community access"
      ]
    },
    {
      title: "Backer",
      minAmount: "₹25K",
      color: "from-blue-500 to-cyan-500",
      icon: <Box className="w-6 h-6" />,
      perks: [
        "All Supporter perks",
        "Behind-the-scenes content",
        "Digital soundtrack/script",
        "Virtual meet & greet"
      ],
      popular: true
    },
    {
      title: "Producer",
      minAmount: "₹50K",
      color: "from-purple-500 to-pink-500",
      icon: <Gem className="w-6 h-6" />,
      perks: [
        "All Backer perks",
        "Name in end credits",
        "Premiere screening invite",
        "Signed collectibles"
      ]
    },
    {
      title: "Executive",
      minAmount: "₹1L+",
      color: "from-yellow-500 to-orange-500",
      icon: <Badge className="w-6 h-6" />,
      perks: [
        "All Producer perks",
        "Set visit opportunity",
        "Producer credit",
        "Revenue sharing (up to 15%)"
      ]
    }
  ];

  const uniqueExperiences = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "On-Set Experience",
      description: "Visit film sets, meet cast and crew, see movie magic in action",
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Studio Sessions",
      description: "Join recording sessions, collaborate on tracks, influence creative decisions",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: <Ticket className="w-8 h-8" />,
      title: "Premiere Access",
      description: "Red carpet premieres, film festivals, exclusive screenings worldwide",
      image: "https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Creator Network",
      description: "Join our exclusive community of investors, creators, and industry professionals",
      image: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
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
              <div className="relative h-full">
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
                {/* Glassmorphic overlay for tier info */}
                <div className="absolute left-0 right-0 bottom-0 p-4 rounded-b-2xl backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-t border-white/30 dark:border-gray-700/40 flex flex-col gap-2" style={{zIndex: 10}}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block w-2 h-8 rounded-l-xl ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-blue-400' : index === 2 ? 'bg-purple-400' : 'bg-orange-400'}`}></span>
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{tier.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-blue-100 text-blue-700' : index === 2 ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>Min. Investment: {tier.minAmount}</span>
                  </div>
                  <ul className="flex flex-col gap-1 text-left text-gray-700 dark:text-gray-200 text-base mb-0">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className={`w-4 h-4 mt-1 flex-shrink-0 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-blue-400' : index === 2 ? 'text-purple-400' : 'text-orange-400'}`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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

          <div className="grid md:grid-cols-2 gap-8">
            {uniqueExperiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
                  theme === 'light'
                    ? 'bg-white/40 border-white/60 hover:shadow-lg'
                    : 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-white/10 hover:shadow-xl'
                }`}
              >
                <img src={experience.image} alt={experience.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition duration-500" />
                <div className="relative z-10 p-8 flex flex-col items-center text-center">
                  <div className="mb-4">{experience.icon}</div>
                  <h4 className={`text-xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{experience.title}</h4>
                  <p className={`leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{experience.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Rewards;
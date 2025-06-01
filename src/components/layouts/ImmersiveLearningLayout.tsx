import React from 'react';
import { motion } from 'framer-motion';

interface ImmersiveLearningLayoutProps {
  children: React.ReactNode;
  theme?: 'space' | 'ocean' | 'forest' | 'desert' | 'mountain';
  interactiveElements?: React.ReactNode;
  audioEnabled?: boolean;
}

const themeConfigs = {
  space: {
    bgColor: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black',
    accentColor: 'text-purple-300',
    borderColor: 'border-purple-500',
    particleColor: '#8b5cf6',
    ambientSound: '/sounds/space-ambient.mp3'
  },
  ocean: {
    bgColor: 'bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900',
    accentColor: 'text-blue-200',
    borderColor: 'border-blue-400',
    particleColor: '#3b82f6',
    ambientSound: '/sounds/ocean-waves.mp3'
  },
  forest: {
    bgColor: 'bg-gradient-to-b from-green-400 via-green-600 to-green-900',
    accentColor: 'text-green-200',
    borderColor: 'border-green-500',
    particleColor: '#22c55e',
    ambientSound: '/sounds/forest-ambient.mp3'
  },
  desert: {
    bgColor: 'bg-gradient-to-b from-yellow-200 via-orange-400 to-red-500',
    accentColor: 'text-orange-100',
    borderColor: 'border-orange-400',
    particleColor: '#f97316',
    ambientSound: '/sounds/desert-wind.mp3'
  },
  mountain: {
    bgColor: 'bg-gradient-to-b from-grey-300 via-grey-500 to-grey-700',
    accentColor: 'text-grey-100',
    borderColor: 'border-grey-400',
    particleColor: '#6b7280',
    ambientSound: '/sounds/mountain-wind.mp3'
  }
};

const ImmersiveLearningLayout: React.FC<ImmersiveLearningLayoutProps> = ({
  children,
  theme = 'space',
  interactiveElements,
  audioEnabled = false
}) => {
  const config = themeConfigs[theme];
  const [audioPlaying, setAudioPlaying] = React.useState(audioEnabled);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioPlaying]);

  // Animation variants for content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  // Particle effect component
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: config.particleColor,
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.7, 0.1, 0.7],
              scale: [1, Math.random() + 0.5, 1]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen relative ${config.bgColor} overflow-hidden`}>
      {/* Background particles */}
      <Particles />
      
      {/* Audio element */}
      {audioEnabled && (
        <>
          <audio ref={audioRef} loop className="hidden">
            <source src={config.ambientSound} type="audio/mp3" />
          </audio>
          <button 
            onClick={() => setAudioPlaying(!audioPlaying)}
            className={`absolute top-4 right-4 z-50 p-2 rounded-full ${config.borderColor} border-2 ${config.accentColor} bg-black bg-opacity-30`}
            aria-label={audioPlaying ? "Mute ambient sound" : "Play ambient sound"}
          >
            {audioPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
        </>
      )}
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        {children}
      </motion.div>
      
      {/* Interactive elements */}
      {interactiveElements && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <motion.div 
            className={`p-4 rounded-lg bg-black bg-opacity-50 border ${config.borderColor}`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {interactiveElements}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ImmersiveLearningLayout;

'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Star, Heart, ThumbsUp, Award } from 'lucide-react';

interface CelebrationOverlayProps {
  type: 'achievement' | 'milestone' | 'progress' | 'correct-answer' | 'completion';
  title: string;
  message: string;
  image?: string;
  confetti?: boolean;
  onClose?: () => void;
  className?: string;
}

/**
 * Celebration Overlay Component
 * 
 * A branded, age-appropriate celebration overlay that provides positive
 * reinforcement for achievements and progress.
 */
const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  type,
  title,
  message,
  image,
  confetti = true,
  onClose,
  className
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Get age-appropriate styles
  const getOverlayStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          container: 'rounded-3xl border-8 p-8 max-w-md mx-auto',
          title: 'text-4xl font-bold mb-4 text-centre',
          message: 'text-2xl text-centre mb-6',
          image: 'w-48 h-48 mx-auto mb-6',
          button: 'text-xl font-bold py-4 px-8 rounded-full',
          icon: 'w-16 h-16 mx-auto mb-4'
        };
      case 'early-primary':
        return {
          container: 'rounded-2xl border-4 p-6 max-w-md mx-auto',
          title: 'text-3xl font-bold mb-3 text-centre',
          message: 'text-xl text-centre mb-5',
          image: 'w-40 h-40 mx-auto mb-5',
          button: 'text-lg font-semibold py-3 px-6 rounded-xl',
          icon: 'w-14 h-14 mx-auto mb-3'
        };
      case 'late-primary':
        return {
          container: 'rounded-xl border-2 p-5 max-w-md mx-auto',
          title: 'text-2xl font-semibold mb-2 text-centre',
          message: 'text-lg text-centre mb-4',
          image: 'w-32 h-32 mx-auto mb-4',
          button: 'text-base font-medium py-2 px-5 rounded-lg',
          icon: 'w-12 h-12 mx-auto mb-2'
        };
      case 'secondary':
      default:
        return {
          container: 'rounded-lg border p-4 max-w-md mx-auto',
          title: 'text-xl font-medium mb-2 text-centre',
          message: 'text-base text-centre mb-4',
          image: 'w-24 h-24 mx-auto mb-4',
          button: 'text-sm font-medium py-2 px-4 rounded-md',
          icon: 'w-10 h-10 mx-auto mb-2'
        };
    }
  };
  
  // Get type-specific styles
  const getTypeStyles = () => {
    switch (type) {
      case 'achievement':
        return {
          bg: 'bg-gradient-to-br from-amber-500 to-yellow-300',
          border: 'border-yellow-400',
          text: 'text-amber-900',
          buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
          icon: <Award className="w-full h-full" />
        };
      case 'milestone':
        return {
          bg: 'bg-gradient-to-br from-purple-500 to-indigo-400',
          border: 'border-indigo-400',
          text: 'text-white',
          buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          icon: <Star className="w-full h-full" />
        };
      case 'progress':
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-cyan-400',
          border: 'border-cyan-400',
          text: 'text-white',
          buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: <ThumbsUp className="w-full h-full" />
        };
      case 'correct-answer':
        return {
          bg: 'bg-gradient-to-br from-green-500 to-emerald-400',
          border: 'border-emerald-400',
          text: 'text-white',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          icon: <Sparkles className="w-full h-full" />
        };
      case 'completion':
        return {
          bg: 'bg-gradient-to-br from-pink-500 to-rose-400',
          border: 'border-rose-400',
          text: 'text-white',
          buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
          icon: <Heart className="w-full h-full" />
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-cyan-400',
          border: 'border-cyan-400',
          text: 'text-white',
          buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: <Star className="w-full h-full" />
        };
    }
  };
  
  const styles = getOverlayStyles();
  const typeStyles = getTypeStyles();
  
  // Animation variants
  const overlayAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  // Confetti animation
  const renderConfetti = () => {
    if (!confetti || isReducedMotion) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const colour = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 
            'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
          ][Math.floor(Math.random() * 6)];
          
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full ${colour}`}
              style={{
                width: size,
                height: size,
                top: '-5%',
                left: `${Math.random() * 100}%`
              }}
              initial={{ y: '-10%' }}
              animate={{
                y: '110%',
                x: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: "linear",
                delay: Math.random() * 0.5
              }}
            />
          );
        })}
      </div>
    );
  };
  
  // Render overlay content
  const renderOverlayContent = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-centre justify-centre p-4 bg-black/50 backdrop-blur-sm">
        {renderConfetti()}
        
        <Card 
          className={cn(
            styles.container,
            typeStyles.bg,
            typeStyles.border,
            'shadow-xl',
            className
          )}
        >
          <CardContent className="p-0">
            <div className={cn(styles.icon, typeStyles.text)}>
              {typeStyles.icon}
            </div>
            
            <h2 className={cn(styles.title, typeStyles.text)}>
              {title}
            </h2>
            
            <p className={cn(styles.message, typeStyles.text)}>
              {message}
            </p>
            
            {image && (
              <div className={styles.image}>
                <img src={image} alt={title} className="w-full h-full object-contain" />
              </div>
            )}
            
            {onClose && (
              <div className="text-centre">
                <Button
                  className={cn(styles.button, typeStyles.buttonBg)}
                  onClick={onClose}
                >
                  Continue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render with animations
  if (!isReducedMotion) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayAnimation}
      >
        <motion.div
          variants={cardAnimation}
        >
          {renderOverlayContent()}
        </motion.div>
      </motion.div>
    );
  }
  
  // Render without animations
  return renderOverlayContent();
};

export default CelebrationOverlay;

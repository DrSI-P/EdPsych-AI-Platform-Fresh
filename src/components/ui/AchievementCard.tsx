'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Award, Zap, BookOpen, Clock } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description?: string;
  type?: 'milestone' | 'badge' | 'certificate';
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  date?: string;
  image?: string;
  progress?: number;
  completed?: boolean;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

/**
 * Achievement Card Component
 * 
 * A branded, age-appropriate card for displaying achievements, badges,
 * and progress that adapts to different age groups.
 */
const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  type = 'badge',
  level = 'bronze',
  date,
  image,
  progress,
  completed = false,
  className,
  animated = true,
  onClick
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Get age-appropriate styles
  const getCardStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          container: 'rounded-3xl border-4 shadow-lg overflow-hidden',
          header: 'pb-2',
          title: 'text-2xl font-bold',
          description: 'text-lg',
          image: 'rounded-2xl overflow-hidden',
          badge: 'w-24 h-24'
        };
      case 'early-primary':
        return {
          container: 'rounded-2xl border-2 shadow-md overflow-hidden',
          header: 'pb-3',
          title: 'text-xl font-semibold',
          description: 'text-base',
          image: 'rounded-xl overflow-hidden',
          badge: 'w-20 h-20'
        };
      case 'late-primary':
        return {
          container: 'rounded-xl border shadow-sm overflow-hidden',
          header: 'pb-3',
          title: 'text-lg font-medium',
          description: 'text-sm',
          image: 'rounded-lg overflow-hidden',
          badge: 'w-16 h-16'
        };
      case 'secondary':
      default:
        return {
          container: 'rounded-lg border shadow-sm overflow-hidden',
          header: 'pb-3',
          title: 'text-lg font-medium',
          description: 'text-sm',
          image: 'rounded-md overflow-hidden',
          badge: 'w-14 h-14'
        };
    }
  };
  
  // Get level-specific styles
  const getLevelStyles = () => {
    switch (level) {
      case 'bronze':
        return {
          gradient: 'from-amber-700 to-amber-500',
          bg: 'bg-amber-100',
          text: 'text-amber-900',
          border: 'border-amber-300'
        };
      case 'silver':
        return {
          gradient: 'from-slate-400 to-slate-300',
          bg: 'bg-slate-100',
          text: 'text-slate-900',
          border: 'border-slate-300'
        };
      case 'gold':
        return {
          gradient: 'from-yellow-500 to-amber-300',
          bg: 'bg-yellow-50',
          text: 'text-amber-900',
          border: 'border-yellow-300'
        };
      case 'platinum':
        return {
          gradient: 'from-indigo-400 to-purple-300',
          bg: 'bg-indigo-50',
          text: 'text-indigo-900',
          border: 'border-indigo-200'
        };
      default:
        return {
          gradient: 'from-amber-700 to-amber-500',
          bg: 'bg-amber-100',
          text: 'text-amber-900',
          border: 'border-amber-300'
        };
    }
  };
  
  // Get type-specific icon
  const getTypeIcon = () => {
    switch (type) {
      case 'milestone':
        return <Trophy className="h-full w-full p-3" />;
      case 'badge':
        return <Star className="h-full w-full p-3" />;
      case 'certificate':
        return <Award className="h-full w-full p-3" />;
      default:
        return <Star className="h-full w-full p-3" />;
    }
  };
  
  const styles = getCardStyles();
  const levelStyles = getLevelStyles();
  
  // Animation variants
  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const badgeAnimation = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  // Render badge
  const renderBadge = () => {
    return (
      <div className="flex justify-centre my-4">
        <div className={cn(
          'rounded-full flex items-centre justify-centre',
          `bg-gradient-to-br ${levelStyles.gradient}`,
          styles.badge
        )}>
          {image ? (
            <img src={image} alt={title} className="w-full h-full rounded-full" />
          ) : (
            <div className="text-white">
              {getTypeIcon()}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render card content
  const renderCardContent = () => {
    return (
      <Card 
        className={cn(
          styles.container,
          completed ? levelStyles.bg : 'bg-card',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <CardHeader className={cn(styles.header)}>
          <CardTitle className={cn(styles.title, completed && levelStyles.text)}>{title}</CardTitle>
          {description && <p className={styles.description}>{description}</p>}
        </CardHeader>
        
        <CardContent>
          {animated && !isReducedMotion ? (
            <motion.div
              variants={badgeAnimation}
              initial="hidden"
              animate={completed ? ["visible", "pulse"] : "visible"}
            >
              {renderBadge()}
            </motion.div>
          ) : (
            renderBadge()
          )}
          
          {progress !== undefined && progress < 100 && (
            <div className="mt-4">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{progress}% complete</span>
                {date && <span>{date}</span>}
              </div>
            </div>
          )}
          
          {completed && date && (
            <div className="mt-4 text-centre text-sm text-muted-foreground">
              <Clock className="inline-block h-4 w-4 mr-1" />
              Achieved on {date}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render with animations if enabled
  if (animated && !isReducedMotion) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardAnimation}
      >
        {renderCardContent()}
      </motion.div>
    );
  }
  
  // Render without animations
  return renderCardContent();
};

/**
 * Achievement Gallery Component
 * 
 * A component to display multiple achievements in a gallery format
 * with filtering options.
 */
export const AchievementGallery: React.FC<{
  achievements: any[];
  className?: string;
}> = ({ achievements, className }) => {
  const { ageGroup } = useTheme();
  const [activeTab, setActiveTab] = React.useState('all');
  
  // Filter achievements based on active tab
  const filteredAchievements = React.useMemo(() => {
    if (activeTab === 'all') return achievements;
    if (activeTab === 'completed') return achievements.filter(a => a.completed);
    if (activeTab === 'in-progress') return achievements.filter(a => !a.completed);
    if (activeTab === 'badges') return achievements.filter(a => a.type === 'badge');
    if (activeTab === 'milestones') return achievements.filter(a => a.type === 'milestone');
    if (activeTab === 'certificates') return achievements.filter(a => a.type === 'certificate');
    return achievements;
  }, [achievements, activeTab]);
  
  return (
    <div className={className}>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard key={index} {...achievement} />
            ))}
          </div>
          
          {filteredAchievements.length === 0 && (
            <div className="text-centre py-12">
              <p className="text-muted-foreground">No achievements found in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementCard;

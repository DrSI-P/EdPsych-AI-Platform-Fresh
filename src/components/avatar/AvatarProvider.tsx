'use client';

// Avatar Context Provider for EdPsych Connect Platform
// Manages avatar state and provides easy integration across all pages

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AvatarContextType {
  currentAvatar: string;
  isAvatarVisible: boolean;
  avatarPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  showAvatar: (avatarId?: string, script?: string, context?: string) => void;
  hideAvatar: () => void;
  setAvatarPosition: (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center') => void;
  getContextualScript: (context: string, userRole: string) => string;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

// Pre-defined avatar scripts based on Dr. Scott's comprehensive collection
const AVATAR_SCRIPTS = {
  // Homepage and Introduction Scripts
  'homepage-intro': `Welcome to EdPsych Connect - where rigorous educational psychology research meets cutting-edge AI technology. I'm Dr Scott I-Patrick, and I'm here to guide you through our evidence-based platform that transforms how children learn and thrive.`,
  
  // Dashboard Welcome Scripts
  'dashboard-student': `Welcome to your personalized learning dashboard! This is your command center, designed specifically around how you learn and work. Everything here adapts to your needs and celebrates your unique learning journey.`,
  
  'dashboard-teacher': `Welcome to your Resource Center - a space designed by educators, for educators. You'll find evidence-based resources, differentiation tools, and assessment instruments grounded in current educational psychology research.`,
  
  'dashboard-parent': `Hello! As a parent myself, I understand how important it is to stay connected with your child's learning journey. This is your communication hub - your direct line to progress updates and ways to support learning at home.`,
  
  'dashboard-professional': `Welcome to our Professional Collaboration Space - designed to facilitate the coordinated, evidence-based support that children and families deserve. Here we can share assessments and coordinate interventions while maintaining strict confidentiality.`,
  
  // Feature-Specific Scripts
  'voice-input': `Welcome to our voice input feature! This tool is perfect if typing is challenging or if you prefer speaking your thoughts. Click the microphone icon and speak naturally - the AI learns your voice patterns and becomes more accurate over time.`,
  
  'accessibility': `Every child deserves education that works for them. Our accessibility features are designed with deep understanding of diverse learning needs, celebrating neurodiversity as a strength and providing tools that help every mind flourish.`,
  
  'assessment': `Assessment in our platform goes beyond simple testing. Drawing on my background in educational psychology, we use evidence-based approaches that inform teaching and support learning rather than simply measuring it.`,
  
  'sen-support': `Our SEN support features are designed with deep understanding of diverse learning needs. Whether a child has dyslexia, ADHD, autism, or other learning differences, our platform adapts to provide appropriate support and accommodations.`,
  
  'restorative-justice': `Welcome to our Restorative Justice Framework - an area I'm particularly passionate about, as it was the subject of my doctoral thesis. Rather than focusing on punishment, restorative practices emphasize repairing harm and rebuilding relationships.`,
  
  'curriculum-planning': `Effective curriculum planning requires balancing individual needs with curriculum requirements. Our planning tools make this complex task manageable while preserving the human elements of teaching that matter most.`,
  
  'family-engagement': `Welcome to our Family Engagement Hub - a space designed to honor the crucial role families play in children's education. You'll find resources for supporting learning at home and ways to connect with your child's educational team.`,
  
  'professional-development': `Continuous professional development is essential in our rapidly evolving educational landscape. Our CPD center provides evidence-based training that directly impacts practice and student outcomes.`,
  
  // Navigation and Help Scripts
  'getting-started': `Starting with a new platform can feel overwhelming, but I'm here to make your first steps confident and successful. Let's begin with the basics: navigating your dashboard and understanding how to get help when you need it.`,
  
  'security-overview': `Let me be absolutely clear about our commitment to data protection. Our platform employs Row Level Security across all 100+ database tables, ensuring student data and sensitive information are protected at the most fundamental level.`,
  
  'mobile-intro': `Learning doesn't stop when you leave your desk! Our mobile platform brings the full power of EdPsych Connect to your phone or tablet, designed with accessibility at its heart and optimized for touch screens.`,
  
  // Collaboration and Community Scripts
  'peer-learning': `Some of the best learning happens when we work together! Our collaboration tools help you learn with and from your classmates safely and effectively, building friendships along the way.`,
  
  'student-voice': `Your voice matters! Our Student Voice and Leadership features help you share your ideas, lead projects, and make a real difference in your school and learning community.`,
  
  'crisis-support': `Sometimes life presents challenges that affect our ability to learn and thrive. Our Crisis Support features provide immediate access to help and ongoing support for mental health and emotional wellbeing.`,
  
  'cultural-diversity': `Our world is beautifully diverse, and our platform helps us learn about, appreciate, and celebrate the rich tapestry of cultures, traditions, and perspectives in our community.`,
  
  // Specialized Learning Scripts
  'early-years': `Welcome to our special space for our youngest learners! Everything here is designed just for you, with lots of colors, sounds, and fun activities that help you learn and grow through play.`,
  
  'gamification': `Learning should be fun and rewarding! Our achievement system celebrates your progress and motivates you to keep growing, because every step forward deserves recognition.`,
  
  'multilingual': `Education should be accessible regardless of language background. Our platform supports multiple languages and cultural contexts because learning knows no boundaries.`,
  
  // Error and Fallback Scripts
  'default-help': `I'm here to help you navigate our platform. If you're unsure about anything, just ask! Our platform is designed to be intuitive, but I'm always available to provide guidance and support.`,
  
  'error-support': `It looks like something unexpected happened. Don't worry - these things happen with technology. Let me help you get back on track and find what you're looking for.`
};

// Context-based script selection
const getContextualScript = (context: string, userRole: string): string => {
  // Combine context and user role for specific scripts
  const contextKey = `${context}-${userRole}`;
  
  // Try specific context-role combination first
  if (AVATAR_SCRIPTS[contextKey as keyof typeof AVATAR_SCRIPTS]) {
    return AVATAR_SCRIPTS[contextKey as keyof typeof AVATAR_SCRIPTS];
  }
  
  // Fall back to general context
  if (AVATAR_SCRIPTS[context as keyof typeof AVATAR_SCRIPTS]) {
    return AVATAR_SCRIPTS[context as keyof typeof AVATAR_SCRIPTS];
  }
  
  // Default help script
  return AVATAR_SCRIPTS['default-help'];
};

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAvatar, setCurrentAvatar] = useState<string>('dr-scott');
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [avatarPosition, setAvatarPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'>('bottom-right');
  const [currentScript, setCurrentScript] = useState<string>('');
  const [currentContext, setCurrentContext] = useState<string>('');
  
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() || 'student';

  const showAvatar = (avatarId?: string, script?: string, context?: string) => {
    if (avatarId) setCurrentAvatar(avatarId);
    if (context) {
      setCurrentContext(context);
      const contextScript = script || getContextualScript(context, userRole);
      setCurrentScript(contextScript);
    } else if (script) {
      setCurrentScript(script);
    }
    setIsAvatarVisible(true);
  };

  const hideAvatar = () => {
    setIsAvatarVisible(false);
  };

  // Auto-show avatar on page load for certain contexts
  useEffect(() => {
    const pathname = window.location.pathname;
    
    // Determine context from pathname
    let context = 'default-help';
    if (pathname === '/' || pathname === '/home') {
      context = 'homepage-intro';
      showAvatar('dr-scott', undefined, context);
    } else if (pathname.includes('/dashboard')) {
      context = `dashboard`;
      showAvatar(undefined, undefined, context);
    } else if (pathname.includes('/accessibility')) {
      context = 'accessibility';
      showAvatar('alex', undefined, context);
    } else if (pathname.includes('/assessment')) {
      context = 'assessment';
      showAvatar('dr-scott', undefined, context);
    } else if (pathname.includes('/curriculum')) {
      context = 'curriculum-planning';
      showAvatar('professor-maya', undefined, context);
    } else if (pathname.includes('/family') || pathname.includes('/parent')) {
      context = 'family-engagement';
      showAvatar('sarah', undefined, context);
    }
  }, [userRole]);

  const value: AvatarContextType = {
    currentAvatar,
    isAvatarVisible,
    avatarPosition,
    showAvatar,
    hideAvatar,
    setAvatarPosition,
    getContextualScript
  };

  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = (): AvatarContextType => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};

// Hook for easy avatar integration on any page
export const usePageAvatar = (context: string, avatarId?: string, customScript?: string) => {
  const { showAvatar, hideAvatar, getContextualScript } = useAvatar();
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() || 'student';

  useEffect(() => {
    const script = customScript || getContextualScript(context, userRole);
    showAvatar(avatarId, script, context);

    // Cleanup on unmount
    return () => {
      // Don't hide avatar on unmount to allow smooth transitions
    };
  }, [context, avatarId, customScript, userRole]);

  return { showAvatar, hideAvatar };
};

export default AvatarProvider;


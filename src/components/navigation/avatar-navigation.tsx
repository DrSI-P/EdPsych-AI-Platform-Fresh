'use client';

/**
 * Interactive AI Avatar Assistant Component
 *
 * This component provides a 24/7 interactive AI assistant through AI-powered
 * avatar videos, helping users with navigation, platform features, and real-time
 * support across the EdPsych AI Education Platform.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { HelpCircle, X, Volume2, VolumeX } from 'lucide-react';
// Define a simple useLocalStorage hook inline since the import is not found
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Navigation context mapping
const NAVIGATION_CONTEXTS: Record<string, string> = {
  '/': 'welcome',
  '/dashboard': 'dashboard',
  '/curriculum': 'curriculum',
  '/progress': 'progress-tracking',
  '/settings': 'settings',
  '/accessibility': 'accessibility',
  '/pricing': 'pricing',
  '/subscriptions': 'subscriptions',
  '/credits': 'credits',
  '/profile': 'profile',
  '/help': 'help',
  '/register': 'registration',
  '/login': 'login',
};

// User role mapping
const USER_ROLES: Record<string, string> = {
  'STUDENT_PRIMARY': 'student-primary',
  'STUDENT_SECONDARY': 'student-secondary',
  'TEACHER': 'educator',
  'PARENT': 'parent',
  'ADMIN': 'admin',
  'CONTENT_CREATOR': 'content-creator',
};

interface AvatarNavigationProps {
  autoShowOnFirstVisit?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
}

interface NavigationVideo {
  url: string;
  id: string;
}

interface NavigationVideoResponse {
  videos: any[];
}

export default function AvatarNavigation({
  autoShowOnFirstVisit = true,
  position = 'bottom-right',
  size = 'md',
}: AvatarNavigationProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [visitedPages, setVisitedPages] = useLocalStorage<Record<string, boolean>>('avatar-visited-pages', {});
  const [disableAutoShow, setDisableAutoShow] = useLocalStorage<boolean>('avatar-disable-auto-show', false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Determine the current context based on the pathname
  const getCurrentContext = useCallback(() => {
    if (!pathname) return 'welcome';
    
    // Exact match
    if (NAVIGATION_CONTEXTS[pathname]) {
      return NAVIGATION_CONTEXTS[pathname];
    }
    
    // Partial match for nested routes
    for (const [path, context] of Object.entries(NAVIGATION_CONTEXTS)) {
      if (path !== '/' && pathname.startsWith(path)) {
        return context;
      }
    }
    
    // Default to welcome if no match
    return 'welcome';
  }, [pathname]);
  
  // Determine user role from session
  const getUserRole = useCallback(() => {
    if (!session?.user) return 'guest';
    
    const userRole = (session.user as any).role || 'STUDENT_SECONDARY';
    return USER_ROLES[userRole] || 'student-secondary';
  }, [session]);
  
  // Load the appropriate navigation video
  const loadNavigationVideo = useCallback(async () => {
    if (!pathname) return;
    
    const context = getCurrentContext();
    const role = getUserRole();
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the specific interactive AI Avatar video ID provided
      const specificVideoId = 'e12f05f24ead42619b4aa8124d98880d';
      
      // Construct the video URL using the specific video ID
      // This assumes the API endpoint structure follows a pattern like:
      // /api/heygen/videos/{videoId}
      const videoUrl = `/api/heygen/videos/${specificVideoId}`;
      
      // Set the video URL directly
      setVideoUrl(videoUrl);
    } catch (err) {
      console.error('Error loading navigation video:', err);
      setError('Failed to load navigation assistance. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [pathname, getCurrentContext, getUserRole]);
  
  // Check if this is the first visit to this page
  const isFirstVisit = useCallback(() => {
    if (!pathname || disableAutoShow) return false;
    return !visitedPages[pathname];
  }, [pathname, visitedPages, disableAutoShow]);
  
  // Mark the current page as visited
  const markAsVisited = useCallback(() => {
    if (!pathname) return;
    setVisitedPages((prev: Record<string, boolean>) => ({
      ...prev,
      [pathname]: true
    }));
  }, [pathname, setVisitedPages]);
  
  // Auto-show on first visit to a page
  useEffect(() => {
    if (autoShowOnFirstVisit && isFirstVisit()) {
      loadNavigationVideo().then(() => {
        setOpen(true);
        markAsVisited();
      });
    }
  }, [pathname, autoShowOnFirstVisit, isFirstVisit, loadNavigationVideo, markAsVisited]);
  
  // Handle manual open
  const handleOpen = () => {
    loadNavigationVideo();
    setOpen(true);
  };
  
  // Position classes
  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };
  
  // Size classes
  const sizeClasses: Record<string, string> = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
  };
  
  // Dialog size classes
  const dialogSizeClasses: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
  };
  
  return (
    <>
      {/* Floating help button */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={`rounded-full shadow-lg ${sizeClasses[size]}`}
                onClick={handleOpen}
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get 24/7 AI assistance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Navigation assistance dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${dialogSizeClasses[size]} p-0 overflow-hidden rounded-lg`}>
          <DialogHeader className="p-4 flex flex-row items-center justify-between">
            <DialogTitle>Interactive AI Assistant</DialogTitle>
            <div className="text-xs text-muted-foreground">24/7 Platform Support</div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMuted(!muted)}
                className="h-8 w-8"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          
          <div className="relative aspect-video w-full bg-muted">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center text-destructive">
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => loadNavigationVideo()}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            {videoUrl && !loading && !error && (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                controls={false}
                muted={muted}
                loop
              />
            )}
          </div>
          
          <div className="p-4 bg-background">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDisableAutoShow(!disableAutoShow);
                }}
              >
                {disableAutoShow ? 'Enable Auto-Show' : 'Disable Auto-Show'}
              </Button>
              
              <DialogClose asChild>
                <Button size="sm">Got It</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

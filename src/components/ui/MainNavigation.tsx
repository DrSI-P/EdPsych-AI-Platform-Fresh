'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Home, 
  BookOpen, 
  Users, 
  BarChart, 
  Settings, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MainNavigationProps {
  className?: string;
}

/**
 * Main Navigation Component
 * 
 * A responsive navigation bar that adapts to different screen sizes,
 * user roles, and age groups while maintaining the brand identity.
 */
const MainNavigation: React.FC<MainNavigationProps> = ({
  className,
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  const pathname = usePathname();
  // Add fallback for SSR/SSG when session might be undefined
  const { data: session } = useSession({ required: false }) || { data: null };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // Navigation items based on user role
  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Student Portal',
      href: '/student',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'Educator Resources',
      href: '/educator',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Animation variants
  const mobileMenuAnimation = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
  };
  
  const mobileMenuItemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };
  
  // Render desktop navigation
  const renderDesktopNavigation = () => {
    return (
      <div className="hidden md:flex md:items-centre md:space-x-4">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-centre gap-2',
              styles.navItem,
              pathname === item.href ? styles.activeNavItem : styles.inactiveNavItem
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    );
  };
  
  // Render mobile navigation
  const renderMobileNavigation = () => {
    return (
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="relative z-50"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            >
              <motion.div
                className={cn(
                  "fixed top-16 left-4 right-4 z-50 bg-card p-4 shadow-lg",
                  styles.mobileNav
                )}
                variants={mobileMenuAnimation}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <motion.div key={item.href} variants={mobileMenuItemAnimation}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-centre gap-3 p-3',
                          styles.navItem,
                          pathname === item.href ? styles.activeNavItem : styles.inactiveNavItem
                        )}
                        onClick={closeMobileMenu}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Use optional chaining to safely access session properties */}
                  {session?.user && (
                    <motion.div variants={mobileMenuItemAnimation}>
                      <Button
                        variant="ghost"
                        className="w-full flex items-centre justify-start gap-3 p-3 text-destructive"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  // Render user menu
  const renderUserMenu = () => {
    if (!session?.user) {
      return (
        <div className="hidden md:block">
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      );
    }
    
    return (
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  
  return (
    <header className={cn(
      'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container flex h-16 items-centre justify-between">
        <div className="flex items-centre gap-2">
          <Logo variant="default" size="md" />
        </div>
        
        {renderDesktopNavigation()}
        
        <div className="flex items-centre gap-2">
          {renderUserMenu()}
          {renderMobileNavigation()}
        </div>
      </div>
    </header>
  );
};

// Define styles
const styles = {
  navItem: 'px-3 py-2 text-sm font-medium transition-colors',
  activeNavItem: 'text-primary',
  inactiveNavItem: 'text-muted-foreground hover:text-primary',
  mobileNav: 'rounded-lg',
};

export default MainNavigation;

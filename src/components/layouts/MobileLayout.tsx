import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

interface MobileLayoutProps {
  children: React.ReactNode;
  navigationItems?: Array<{
    label: string;
    icon: React.ReactNode;
    href: string;
    active?: boolean;
  }>;
  title?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  hideNavigationOnScroll?: boolean;
}

/**
 * MobileLayout component optimised for mobile devices with responsive navigation
 * and touch-friendly controls
 */
const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  navigationItems = [],
  title = 'EdPsych Connect',
  showBackButton = false,
  onBackButtonClick,
  hideNavigationOnScroll = true
}) => {
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 767 });
  
  // Handle scroll events to hide/show navigation
  useEffect(() => {
    if (!hideNavigationOnScroll) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavigationVisible(false);
      } else {
        setIsNavigationVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hideNavigationOnScroll]);
  
  // Handle back button click
  const handleBackClick = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    } else {
      window.history.back();
    }
  };
  
  return (
    <div className="mobile-layout min-h-screen flex flex-col bg-grey-50">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-transform duration-300 ${
          isNavigationVisible ? 'transform-none' : 'transform -translate-y-full'
        }`}
      >
        <div className="flex items-centre justify-between p-4">
          <div className="flex items-centre">
            {showBackButton && (
              <button 
                onClick={handleBackClick}
                className="mr-3 p-2 rounded-full hover:bg-grey-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-semibold truncate">{title}</h1>
          </div>
          
          {/* Menu button for mobile */}
          {isMobile && navigationItems.length > 0 && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-grey-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
        
        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <nav className="bg-white border-t border-grey-200">
            <ul className="py-2">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`flex items-centre px-4 py-3 ${
                      item.active ? 'bg-blue-50 text-blue-600' : 'hover:bg-grey-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      
      {/* Main content with padding for header and footer */}
      <main className="flex-grow pt-16 pb-16">
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>
      
      {/* Bottom navigation for mobile */}
      {isMobile && navigationItems.length > 0 && !isMenuOpen && (
        <nav 
          className={`fixed bottom-0 left-0 right-0 bg-white border-t border-grey-200 z-50 transition-transform duration-300 ${
            isNavigationVisible ? 'transform-none' : 'transform translate-y-full'
          }`}
        >
          <ul className="flex justify-around">
            {navigationItems.slice(0, 5).map((item, index) => (
              <li key={index} className="flex-1">
                <a
                  href={item.href}
                  className={`flex flex-col items-centre justify-centre py-3 ${
                    item.active ? 'text-blue-600' : 'text-grey-600 hover:text-blue-600'
                  }`}
                >
                  <span className="mb-1">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      
      {/* Touch-friendly floating action button for primary action */}
      <button
        className="fixed right-4 bottom-20 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-centre justify-centre focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 active:bg-blue-800 z-50"
        aria-label="Add new"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      
      {/* iOS-style pull-to-refresh indicator (simplified implementation) */}
      <div className="absolute top-0 left-0 right-0 flex justify-centre pointer-events-none">
        <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin opacity-0" id="pull-to-refresh-indicator"></div>
      </div>
      
      <style jsx>{`
        /* Custom styles for mobile optimization */
        @media (max-width: 767px) {
          /* Larger touch targets */
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Prevent text from being too small */
          html {
            -webkit-text-size-adjust: 100%;
          }
          
          /* Improve scrolling */
          * {
            -webkit-overflow-scrolling: touch;
          }
          
          /* Pull-to-refresh animation */
          #pull-to-refresh-indicator {
            transition: opacity 0.3s;
          }
          
          /* Hide scrollbars but allow scrolling */
          ::-webkit-scrollbar {
            display: none;
          }
          
          /* Prevent zooming when focusing on inputs */
          input, select, textarea {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileLayout;

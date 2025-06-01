import React from 'react';
import { useMediaQuery } from 'react-responsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mobileLayout?: React.ReactNode;
  tabletLayout?: React.ReactNode;
  desktopLayout?: React.ReactNode;
  printLayout?: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveLayout component that renders different layouts based on screen size
 * and provides print-specific styling when needed
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  mobileLayout,
  tabletLayout,
  desktopLayout,
  printLayout,
  className = ''
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isPrint = useMediaQuery({ print: true });

  // Determine which layout to render based on screen size
  const renderContent = () => {
    if (isPrint && printLayout) {
      return printLayout;
    }
    
    if (isMobile && mobileLayout) {
      return mobileLayout;
    }
    
    if (isTablet && tabletLayout) {
      return tabletLayout;
    }
    
    if (isDesktop && desktopLayout) {
      return desktopLayout;
    }
    
    // Default to children if no specific layout is provided
    return children;
  };

  return (
    <div className={`responsive-layout ${className} ${isPrint ? 'print-layout' : ''}`}>
      {renderContent()}
      
      {/* Print-specific styles */}
      {isPrint && (
        <style jsx global>{`
          @media print {
            body {
              font-size: 12pt;
              line-height: 1.5;
              color: #000;
              background: #fff;
            }
            
            .no-print {
              display: none !important;
            }
            
            .print-only {
              display: block !important;
            }
            
            a {
              text-decoration: none;
              color: #000;
            }
            
            /* Ensure page breaks don't occur within elements */
            h1, h2, h3, h4, h5, h6, img, table {
              page-break-inside: avoid;
            }
            
            /* Add page numbers */
            @page {
              margin: 2cm;
              @bottom-centre {
                content: "Page " counter(page) " of " counter(pages);
              }
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default ResponsiveLayout;

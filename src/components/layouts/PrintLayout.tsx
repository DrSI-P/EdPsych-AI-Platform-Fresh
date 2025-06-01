import React from 'react';

interface PrintLayoutProps {
  children: React.ReactNode;
  title?: string;
  author?: string;
  date?: string;
  headerLogo?: string;
  footerText?: string;
  includePageNumbers?: boolean;
  orientation?: 'portrait' | 'landscape';
}

/**
 * PrintLayout component specifically designed for printable reports and documents
 * Optimizes content for printing with proper page breaks, headers, and footers
 */
const PrintLayout: React.FC<PrintLayoutProps> = ({
  children,
  title,
  author,
  date = new Date().toLocaleDateString(),
  headerLogo,
  footerText = '© EdPsych Connect',
  includePageNumbers = true,
  orientation = 'portrait'
}) => {
  return (
    <div className={`print-layout ${orientation}`}>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: ${orientation};
            margin: 2cm;
          }
          
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
          }
          
          .print-layout {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
          }
          
          .print-header {
            position: running(header);
            text-align: centre;
            border-bottom: 1px solid #ccc;
            padding-bottom: 0.5cm;
            margin-bottom: 1cm;
          }
          
          .print-footer {
            position: running(footer);
            text-align: centre;
            border-top: 1px solid #ccc;
            padding-top: 0.5cm;
            margin-top: 1cm;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          h1, h2, h3, h4, h5, h6, img, table {
            page-break-inside: avoid;
            page-break-after: avoid;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
          }
          
          table, th, td {
            border: 1px solid #000;
          }
          
          th, td {
            padding: 8px;
            text-align: left;
          }
          
          a {
            text-decoration: none;
            color: #000;
          }
          
          @page {
            @top-centre {
              content: element(header);
            }
            
            @bottom-centre {
              content: element(footer);
              ${includePageNumbers ? 'content: "Page " counter(page) " of " counter(pages);' : ''}
            }
          }
        }
        
        /* Preview styles (only visible in browser) */
        @media screen {
          .print-layout {
            max-width: 21cm;
            margin: 1cm auto;
            padding: 2cm;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background: white;
          }
          
          .print-layout.landscape {
            max-width: 29.7cm;
          }
          
          .print-header {
            text-align: centre;
            border-bottom: 1px solid #ccc;
            padding-bottom: 0.5cm;
            margin-bottom: 1cm;
          }
          
          .print-footer {
            text-align: centre;
            border-top: 1px solid #ccc;
            padding-top: 0.5cm;
            margin-top: 1cm;
          }
          
          .page-break {
            border-top: 1px dashed #ccc;
            margin: 2cm 0;
            position: relative;
          }
          
          .page-break::before {
            content: 'Page Break';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 0 10px;
            color: #999;
            font-size: 12px;
          }
        }
      `}</style>
      
      {/* Document header */}
      <div className="print-header">
        {headerLogo && <img src={headerLogo} alt="Logo" style={{ maxHeight: '1cm' }} />}
        {title && <h1>{title}</h1>}
        <div className="print-meta">
          {author && <span className="print-author">Prepared by: {author}</span>}
          {date && <span className="print-date"> | Date: {date}</span>}
        </div>
      </div>
      
      {/* Main content */}
      <div className="print-content">
        {children}
      </div>
      
      {/* Document footer */}
      <div className="print-footer">
        {footerText}
        {includePageNumbers && <div className="page-numbers">Page <span className="page-number"></span> of <span className="page-count"></span></div>}
      </div>
      
      {/* Print button (only visible in browser) */}
      <div className="print-button no-print" style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        background: '#4a6cf7',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }} onClick={() => window.print()}>
        Print Document
      </div>
    </div>
  );
};

export default PrintLayout;

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Direct link to CSS in public directory */}
          <link rel="stylesheet" href="/styles/global.css" />
          {/* Critical inline styles */}
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --primary: #6366f1;
              --primary-dark: #4f46e5;
              --secondary: #8b5cf6;
              --secondary-dark: #7c3aed;
              --accent: #f97316;
            }
            
            .nav-item {
              background-color: var(--primary);
              color: white !important;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              text-decoration: none;
              transition: all 0.3s ease;
            }
            
            .btn-primary {
              background-color: var(--primary);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              border: none;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            
            .text-gradient {
              background: linear-gradient(to right, var(--primary), var(--secondary));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
            }
          `}} />
          {/* Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

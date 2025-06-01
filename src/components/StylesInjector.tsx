import React from 'react';

/**
 * StylesInjector Component
 * 
 * This component injects critical CSS styles directly into the page
 * to ensure they are always available regardless of build optimization.
 */
const StylesInjector: React.FC = () => {
  return (
    <style jsx global>{`
      /* Critical CSS Variables */
      :root {
        --primary: #6366f1;
        --primary-dark: #4f46e5;
        --secondary: #8b5cf6;
        --secondary-dark: #7c3aed;
        --accent: #f97316;
        --accent-dark: #ea580c;
        --background: #ffffff;
        --foreground: #171717;
        --primary-foreground: #fafafa;
        --secondary-foreground: #fafafa;
        --accent-foreground: #fafafa;
        --muted: #f5f5f5;
        --muted-foreground: #737373;
        --border: #e2e8f0;
      }

      /* Critical Brand Classes */
      .text-gradient {
        background: linear-gradient(to right, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
      }

      .animate-fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }

      .animate-slide-up {
        animation: slideUp 0.5s ease-in-out;
      }

      /* Navigation styling */
      .nav-item {
        background-color: var(--primary);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
      }

      .nav-item:hover {
        background-color: var(--primary-dark);
        transform: translateY(-2px);
      }

      /* Button styling */
      .btn-primary {
        background-color: var(--primary);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        transition: all 0.3s ease;
      }

      .btn-primary:hover {
        background-color: var(--primary-dark);
        transform: translateY(-2px);
      }

      .btn-secondary {
        background-color: var(--secondary);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        transition: all 0.3s ease;
      }

      .btn-secondary:hover {
        background-color: var(--secondary-dark);
        transform: translateY(-2px);
      }

      /* Card styling */
      .card {
        background-color: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      }

      /* Define keyframes */
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      @keyframes slideUp {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }

      @keyframes slideDown {
        0% { transform: translateY(-20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }

      /* Navigation bar styling */
      nav {
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      nav a {
        color: var(--primary);
        font-weight: 500;
        transition: all 0.3s ease;
      }

      nav a:hover {
        color: var(--secondary);
      }

      /* Enhanced brand elements */
      .enhanced-header {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
      }

      .enhanced-subheader {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .enhanced-card {
        border-left: 4px solid var(--primary);
      }

      .enhanced-button {
        background: linear-gradient(to right, var(--primary), var(--secondary));
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .enhanced-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    `}</style>
  );
};

export default StylesInjector;

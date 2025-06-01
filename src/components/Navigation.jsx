import React, { useState } from 'react';
import styles from '../styles/Navigation.module.css';
import clsx from 'clsx';
import Link from 'next/link';

/**
 * Navigation component that uses CSS modules to ensure styles are properly applied
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Navigation variant (default, fixed, sticky)
 * @param {Object[]} props.items - Navigation items
 * @param {string} props.items[].href - Item link
 * @param {string} props.items[].label - Item label
 * @param {boolean} [props.items[].active] - Whether the item is active
 * @param {string} [props.logo] - Logo image source
 * @param {string} [props.title] - Site title
 * @param {string} [props.className] - Additional CSS classes
 */
const Navigation = ({
  variant = 'default',
  items = [],
  logo,
  title = 'EdPsych Connect',
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav 
      className={clsx(
        styles.nav,
        variant === 'fixed' && styles.navFixed,
        variant === 'sticky' && styles.navSticky,
        className
      )}
    >
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navLogo}>
          {logo && (
            <img 
              src={logo} 
              alt={title} 
              className={styles.navLogoImage} 
            />
          )}
          {title}
        </Link>
        
        <div className={styles.navItems}>
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={clsx(
                styles.navItem,
                item.active && styles.navItemActive
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <button 
          className={styles.navMobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>
      
      <div 
        className={clsx(
          styles.navMobileMenu,
          mobileMenuOpen && styles.navMobileMenuOpen
        )}
      >
        <div className={styles.navMobileMenuHeader}>
          <Link href="/" className={styles.navLogo}>
            {logo && (
              <img 
                src={logo} 
                alt={title} 
                className={styles.navLogoImage} 
              />
            )}
            {title}
          </Link>
          
          <button 
            className={styles.navMobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Close mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className={styles.navMobileMenuItems}>
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={clsx(
                styles.navMobileMenuItem,
                item.active && styles.navMobileMenuItemActive
              )}
              onClick={toggleMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
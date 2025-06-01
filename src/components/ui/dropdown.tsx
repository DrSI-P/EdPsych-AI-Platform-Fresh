'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = 'left',
  width = 'auto',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Map width to class
  const widthClasses = {
    auto: 'w-auto',
    sm: 'w-48',
    md: 'w-56',
    lg: 'w-64',
  };

  // Map alignment to class
  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 ${widthClasses[width]} ${alignClasses[align]} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-menu"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  disabled = false,
  className = '',
}: DropdownItemProps) {
  return (
    <button
      className={`block w-full text-left px-4 py-2 text-sm text-grey-700 hover:bg-grey-100 hover:text-grey-900 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface DropdownLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export function DropdownLink({ children, href, className = '' }: DropdownLinkProps) {
  return (
    <a
      href={href}
      className={`block px-4 py-2 text-sm text-grey-700 hover:bg-grey-100 hover:text-grey-900 ${className}`}
      role="menuitem"
    >
      {children}
    </a>
  );
}

interface DropdownDividerProps {
  className?: string;
}

export function DropdownDivider({ className = '' }: DropdownDividerProps) {
  return <div className={`my-1 h-px bg-grey-200 ${className}`} role="none" />;
}

interface DropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownLabel({ children, className = '' }: DropdownLabelProps) {
  return (
    <div className={`px-4 py-2 text-xs text-grey-500 ${className}`} role="none">
      {children}
    </div>
  );
}

interface MenuProps {
  children: React.ReactNode;
  className?: string;
}

export function Menu({ children, className = '' }: MenuProps) {
  return (
    <nav className={`bg-white shadow ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">{children}</div>
        </div>
      </div>
    </nav>
  );
}

interface MenuItemProps {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function MenuItem({
  children,
  active = false,
  href,
  onClick,
  className = '',
}: MenuItemProps) {
  const classes = `inline-flex items-centre px-1 pt-1 border-b-2 text-sm font-medium ${
    active
      ? 'border-blue-500 text-grey-900'
      : 'border-transparent text-grey-500 hover:border-grey-300 hover:text-grey-700'
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

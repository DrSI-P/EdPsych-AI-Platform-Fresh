'use client';

import React, { useState } from 'react';

interface AccordionProps {
  children: React.ReactNode;
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  className?: string;
}

interface AccordionContextType {
  expandedItems: any[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

export function Accordion({
  children,
  defaultExpanded = [],
  allowMultiple = false,
  className = '',
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const toggleItem = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((item) => item !== id));
    } else {
      if (allowMultiple) {
        setExpandedItems([...expandedItems, id]);
      } else {
        setExpandedItems([id]);
      }
    }
  };

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, allowMultiple }}>
      <div className={`divide-y divide-grey-200 border border-grey-200 rounded-md ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function AccordionItem({ children, id, className = '' }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);

  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion component');
  }

  return (
    <div className={`${className}`} id={`accordion-item-${id}`}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function AccordionTrigger({ children, id, className = '' }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);

  if (!context) {
    throw new Error('AccordionTrigger must be used within an Accordion component');
  }

  const { expandedItems, toggleItem } = context;
  const isExpanded = expandedItems.includes(id);

  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-controls={`accordion-content-${id}`}
      id={`accordion-trigger-${id}`}
      className={`flex justify-between items-centre w-full px-4 py-3 text-left text-grey-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      onClick={() => toggleItem(id)}
    >
      {children}
      <svg
        className={`w-5 h-5 transform transition-transform duration-200 ${
          isExpanded ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function AccordionContent({ children, id, className = '' }: AccordionContentProps) {
  const context = React.useContext(AccordionContext);

  if (!context) {
    throw new Error('AccordionContent must be used within an Accordion component');
  }

  const { expandedItems } = context;
  const isExpanded = expandedItems.includes(id);

  if (!isExpanded) return null;

  return (
    <div
      id={`accordion-content-${id}`}
      aria-labelledby={`accordion-trigger-${id}`}
      className={`px-4 py-3 ${className}`}
    >
      {children}
    </div>
  );
}

interface DisclosureProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Disclosure({ children, defaultOpen = false, className = '' }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`border border-grey-200 rounded-md ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            toggle,
          });
        }
        return child;
      })}
    </div>
  );
}

interface DisclosureTriggerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  toggle?: () => void;
  className?: string;
}

export function DisclosureTrigger({
  children,
  isOpen,
  toggle,
  className = '',
}: DisclosureTriggerProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      className={`flex justify-between items-centre w-full px-4 py-3 text-left text-grey-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      onClick={toggle}
    >
      {children}
      <svg
        className={`w-5 h-5 transform transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
  );
}

interface DisclosureContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}

export function DisclosureContent({ children, isOpen, className = '' }: DisclosureContentProps) {
  if (!isOpen) return null;

  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}

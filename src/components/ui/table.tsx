'use client';

import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-grey-200">
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-grey-50 ${className}`}>
      {children}
    </thead>
  );
}

// Adding TableHead component to fix build warnings
interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <tr className={`${className}`}>
      {children}
    </tr>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-grey-200 ${className}`}>
      {children}
    </tbody>
  );
}

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function TableFooter({ children, className = '' }: TableFooterProps) {
  return (
    <tfoot className={`bg-grey-50 ${className}`}>
      {children}
    </tfoot>
  );
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TableRow({ children, className = '', onClick, isSelected = false }: TableRowProps) {
  return (
    <tr 
      className={`
        ${onClick ? 'cursor-pointer hover:bg-grey-50' : ''}
        ${isSelected ? 'bg-blue-50' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'centre' | 'right';
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export function TableHeaderCell({ 
  children, 
  className = '', 
  align = 'left',
  sortable = false,
  sorted = null,
  onSort
}: TableHeaderCellProps) {
  // Map alignment to text alignment class
  const alignClasses = {
    left: 'text-left',
    centre: 'text-centre',
    right: 'text-right',
  };

  return (
    <th 
      scope="col" 
      className={`px-6 py-3 text-xs font-medium text-grey-500 uppercase tracking-wider ${alignClasses[align]} ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className={`flex items-centre ${align === 'centre' ? 'justify-centre' : ''} ${align === 'right' ? 'justify-end' : ''}`}>
        {children}
        {sortable && (
          <span className="ml-1">
            {sorted === 'asc' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
            {sorted === 'desc' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {sorted === null && (
              <svg className="w-4 h-4 text-grey-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'centre' | 'right';
}

export function TableCell({ children, className = '', align = 'left' }: TableCellProps) {
  // Map alignment to text alignment class
  const alignClasses = {
    left: 'text-left',
    centre: 'text-centre',
    right: 'text-right',
  };

  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-grey-500 ${alignClasses[align]} ${className}`}>
      {children}
    </td>
  );
}

interface TableEmptyProps {
  colSpan: number;
  message?: string;
  className?: string;
}

export function TableEmpty({ colSpan, message = 'No data available', className = '' }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={`px-6 py-12 text-centre text-sm text-grey-500 ${className}`}>
        {message}
      </td>
    </tr>
  );
}

interface TableLoadingProps {
  colSpan: number;
  message?: string;
  className?: string;
}

export function TableLoading({ colSpan, message = 'Loading...', className = '' }: TableLoadingProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={`px-6 py-12 text-centre text-sm text-grey-500 ${className}`}>
        <div className="flex justify-centre items-centre">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {message}
        </div>
      </td>
    </tr>
  );
}

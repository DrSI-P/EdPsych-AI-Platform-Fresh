'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Import Dialog component from dialogue.tsx
import { Dialog as DialogPrimitive } from './dialogue';

// Export additional components needed by the barrel file
export function ModalContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function ModalOverlay({ 
  onClick, 
  className = '' 
}: { 
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void; 
  className?: string 
}) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${className}`}
      onClick={onClick}
    />
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (closeOnEsc) {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Map size to width class
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-centre justify-centre bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialogue"
    >
      <div
        className={`bg-white rounded-lg shadow-xl overflow-hidden w-full ${sizeClasses[size]} ${className}`}
        role="dialogue"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="px-6 py-4 border-b border-grey-200">
            <h3 id="modal-title" className="text-lg font-medium text-grey-900">
              {title}
            </h3>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({ children, className = '' }: ModalHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-grey-200 ${className}`}>
      {children}
    </div>
  );
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-grey-200 bg-grey-50 ${className}`}>
      {children}
    </div>
  );
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'info' | 'warning' | 'danger' | 'success';
  isLoading?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'info',
  isLoading = false,
}: DialogProps) {
  // Map variant to colour classes
  const variantClasses = {
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-centre">
        <h3 className="text-lg font-medium text-grey-900">{title}</h3>
        {description && <p className="mt-2 text-sm text-grey-500">{description}</p>}
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-centre px-4 py-2 text-sm font-medium text-grey-700 bg-white border border-grey-300 rounded-md shadow-sm hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`inline-flex justify-centre px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            variantClasses[variant]
          } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}

"use client";

import React from 'react';
import { useTenant } from '@/lib/multi-tenant';

/**
 * TenantProvider component for the educator classes page
 * 
 * This component provides tenant context for the educator classes page
 * to ensure that useTenant hook works correctly.
 */
export function TenantProvider({ children }: { children: React.ReactNode }) {
  // Mock tenant data for development purposes
  const mockTenant = {
    id: 'tenant-1',
    name: 'Demo School',
    subscription: {
      status: 'active',
      plan: 'professional',
      features: ['all']
    },
    settings: {
      theme: 'light',
      locale: 'en-GB',
      timezone: 'Europe/London'
    }
  };

  // Context value to be provided
  const contextValue = {
    tenant: mockTenant,
    isLoading: false,
    error: null
  };

  return (
    <div data-tenant-provider>
      {/* This is a simplified implementation - in a real app, this would use React Context */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { tenant: contextValue });
        }
        return child;
      })}
    </div>
  );
}

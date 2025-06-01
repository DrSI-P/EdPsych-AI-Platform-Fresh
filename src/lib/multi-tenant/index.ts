"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the tenant context type
interface Tenant {
  id: string;
  name: string;
  subscription: {
    status: string;
    plan: string;
    features: string[];
  };
  settings: {
    theme: string;
    locale: string;
    timezone: string;
  };
}

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: Error | null;
}

// Create the context with default values
const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Hook to use the tenant context
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

// Provider component
export function TenantProvider({ children }: { children: ReactNode }) {
  // Mock tenant data for development purposes
  const mockTenant: Tenant = {
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
  
  // Create the context value
  const contextValue: TenantContextType = {
    tenant: mockTenant,
    isLoading: false,
    error: null
  };
  
  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

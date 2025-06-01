"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTenantRegistration } from './tenant-management';

// Re-export functions from other files
export { useTenantRegistration };

// Define tenant types and enums
export enum TenantType {
  SCHOOL = 'school',
  DISTRICT = 'district',
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
  UNIVERSITY = 'university'
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  STANDARD = 'standard',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

// Define the tenant context type
export interface TenantConfig {
  id: string;
  name: string;
  type: TenantType;
  domains: string[];
  subscription: {
    status: string;
    tier: SubscriptionTier;
    features: string[];
  };
  settings: {
    theme: string;
    locale: string;
    timezone: string;
    branding?: {
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
      logoUrl?: string;
      faviconUrl?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

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
  
  return React.createElement(
    TenantContext.Provider,
    { value: contextValue },
    children
  );
}

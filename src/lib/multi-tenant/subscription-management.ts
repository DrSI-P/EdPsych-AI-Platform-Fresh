'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { SubscriptionTier } from '@/lib/multi-tenant';

// Re-export SubscriptionTier for API routes
export { SubscriptionTier };

// Define subscription plan types
export enum BillingInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  features: string[];
  pricing: {
    [key in BillingInterval]: {
      amount: number;
      currency: string;
      stripePriceId: string;
    }
  };
  isPopular?: boolean;
  maxUsers?: number;
  maxStorage?: number; // in GB
}

export interface SubscriptionDetails {
  id: string;
  tenantId: string;
  planId: string;
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  billingInterval: BillingInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  quantity: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}

export interface CreateCheckoutSessionData {
  planId: string;
  billingInterval: BillingInterval;
  quantity: number;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResult {
  checkoutUrl: string;
  sessionId: string;
}

export interface CreateBillingPortalSessionResult {
  portalUrl: string;
}

export interface SubscriptionInvoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  createdAt: string;
  dueDate?: string;
  paidAt?: string;
  pdfUrl: string;
}

// Define API service for subscription management
export interface SubscriptionManagementService {
  // Plan operations
  getAvailablePlans: () => Promise<SubscriptionPlan[]>;
  getPlan: (planId: string) => Promise<SubscriptionPlan>;
  
  // Subscription operations
  getCurrentSubscription: (tenantId: string) => Promise<SubscriptionDetails | null>;
  updateSubscriptionQuantity: (tenantId: string, quantity: number) => Promise<SubscriptionDetails>;
  cancelSubscription: (tenantId: string, atPeriodEnd: boolean) => Promise<SubscriptionDetails>;
  reactivateSubscription: (tenantId: string) => Promise<SubscriptionDetails>;
  
  // Checkout operations
  createCheckoutSession: (tenantId: string, data: CreateCheckoutSessionData) => Promise<CreateCheckoutSessionResult>;
  createBillingPortalSession: (tenantId: string) => Promise<CreateBillingPortalSessionResult>;
  
  // Invoice operations
  getInvoices: (tenantId: string) => Promise<SubscriptionInvoice[]>;
  getInvoice: (tenantId: string, invoiceId: string) => Promise<SubscriptionInvoice>;
}

// Create validation schemas using Zod
export const createCheckoutSessionSchema = z.object({
  planId: z.string(),
  billingInterval: z.nativeEnum(BillingInterval),
  quantity: z.number().int().positive(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

// Implement the subscription management service
export class SubscriptionManagementServiceImpl implements SubscriptionManagementService {
  private apiBaseUrl: string;
  
  constructor(apiBaseUrl: string = '/api/subscriptions') {
    this.apiBaseUrl = apiBaseUrl;
  }
  
  // Helper method for API calls
  private async apiCall<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any
  ): Promise<T> {
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API call failed: ${response.status}`);
    }
    
    return await response.json();
  }
  
  // Implement plan operations
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    return this.apiCall<SubscriptionPlan[]>('/plans');
  }
  
  async getPlan(planId: string): Promise<SubscriptionPlan> {
    return this.apiCall<SubscriptionPlan>(`/plans/${planId}`);
  }
  
  // Implement subscription operations
  async getCurrentSubscription(tenantId: string): Promise<SubscriptionDetails | null> {
    try {
      return await this.apiCall<SubscriptionDetails>(`/tenants/${tenantId}/subscription`);
    } catch (error) {
      // If the tenant doesn't have a subscription, return null
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
  
  async updateSubscriptionQuantity(tenantId: string, quantity: number): Promise<SubscriptionDetails> {
    return this.apiCall<SubscriptionDetails>(
      `/tenants/${tenantId}/subscription/quantity`,
      'PUT',
      { quantity }
    );
  }
  
  async cancelSubscription(tenantId: string, atPeriodEnd: boolean): Promise<SubscriptionDetails> {
    return this.apiCall<SubscriptionDetails>(
      `/tenants/${tenantId}/subscription/cancel`,
      'POST',
      { atPeriodEnd }
    );
  }
  
  async reactivateSubscription(tenantId: string): Promise<SubscriptionDetails> {
    return this.apiCall<SubscriptionDetails>(
      `/tenants/${tenantId}/subscription/reactivate`,
      'POST'
    );
  }
  
  // Implement checkout operations
  async createCheckoutSession(
    tenantId: string,
    data: CreateCheckoutSessionData
  ): Promise<CreateCheckoutSessionResult> {
    // Validate input data
    createCheckoutSessionSchema.parse(data);
    
    return this.apiCall<CreateCheckoutSessionResult>(
      `/tenants/${tenantId}/checkout`,
      'POST',
      data
    );
  }
  
  async createBillingPortalSession(tenantId: string): Promise<CreateBillingPortalSessionResult> {
    return this.apiCall<CreateBillingPortalSessionResult>(
      `/tenants/${tenantId}/billing-portal`,
      'POST'
    );
  }
  
  // Implement invoice operations
  async getInvoices(tenantId: string): Promise<SubscriptionInvoice[]> {
    return this.apiCall<SubscriptionInvoice[]>(`/tenants/${tenantId}/invoices`);
  }
  
  async getInvoice(tenantId: string, invoiceId: string): Promise<SubscriptionInvoice> {
    return this.apiCall<SubscriptionInvoice>(`/tenants/${tenantId}/invoices/${invoiceId}`);
  }
}

// Create a hook for subscription management
export function useSubscriptionManagement() {
  const [service] = useState<SubscriptionManagementService>(
    () => new SubscriptionManagementServiceImpl()
  );
  
  return service;
}

// Create a hook for subscription plans
export function useSubscriptionPlans() {
  const subscriptionService = useSubscriptionManagement();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load plans
  useEffect(() => {
    async function loadPlans() {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await subscriptionService.getAvailablePlans();
        setPlans(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load subscription plans');
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPlans();
  }, [subscriptionService]);
  
  return {
    plans,
    isLoading,
    error
  };
}

// Create a hook for tenant subscription
export function useTenantSubscription(tenantId: string) {
  const subscriptionService = useSubscriptionManagement();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load subscription
  const loadSubscription = async () => {
    if (!tenantId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await subscriptionService.getCurrentSubscription(tenantId);
      setSubscription(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load subscription');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    if (tenantId) {
      loadSubscription();
    }
  }, [tenantId]);
  
  // Create checkout session
  const createCheckout = async (data: CreateCheckoutSessionData) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await subscriptionService.createCheckoutSession(tenantId, data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create checkout session');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create billing portal session
  const createBillingPortal = async () => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await subscriptionService.createBillingPortalSession(tenantId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create billing portal session');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update subscription quantity
  const updateQuantity = async (quantity: number) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await subscriptionService.updateSubscriptionQuantity(tenantId, quantity);
      setSubscription(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update subscription quantity');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel subscription
  const cancelSubscription = async (atPeriodEnd: boolean = true) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await subscriptionService.cancelSubscription(tenantId, atPeriodEnd);
      setSubscription(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to cancel subscription');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reactivate subscription
  const reactivateSubscription = async () => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await subscriptionService.reactivateSubscription(tenantId);
      setSubscription(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reactivate subscription');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    subscription,
    isLoading,
    error,
    loadSubscription,
    createCheckout,
    createBillingPortal,
    updateQuantity,
    cancelSubscription,
    reactivateSubscription
  };
}

// Create a hook for tenant invoices
export function useTenantInvoices(tenantId: string) {
  const subscriptionService = useSubscriptionManagement();
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load invoices
  const loadInvoices = async () => {
    if (!tenantId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await subscriptionService.getInvoices(tenantId);
      setInvoices(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load invoices');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    if (tenantId) {
      loadInvoices();
    }
  }, [tenantId]);
  
  // Get invoice details
  const getInvoiceDetails = async (invoiceId: string) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await subscriptionService.getInvoice(tenantId, invoiceId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get invoice details');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    invoices,
    isLoading,
    error,
    loadInvoices,
    getInvoiceDetails
  };
}

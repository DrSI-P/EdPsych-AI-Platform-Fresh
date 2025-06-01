'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { TenantConfig, TenantType, SubscriptionTier } from '@/lib/multi-tenant';

// Define API service for tenant management
export interface TenantManagementService {
  // Tenant CRUD operations
  createTenant: (data: CreateTenantData) => Promise<TenantConfig>;
  getTenant: (id: string) => Promise<TenantConfig>;
  updateTenant: (id: string, data: UpdateTenantData) => Promise<TenantConfig>;
  deleteTenant: (id: string) => Promise<void>;
  
  // Tenant listing and filtering
  listTenants: (params?: ListTenantsParams) => Promise<ListTenantsResponse>;
  
  // Tenant domain management
  addTenantDomain: (tenantId: string, domain: string) => Promise<TenantConfig>;
  removeTenantDomain: (tenantId: string, domain: string) => Promise<TenantConfig>;
  verifyTenantDomain: (tenantId: string, domain: string) => Promise<VerifyDomainResult>;
  
  // Tenant feature management
  updateTenantFeatures: (tenantId: string, features: Record<string, boolean>) => Promise<TenantConfig>;
  
  // Tenant branding management
  updateTenantBranding: (tenantId: string, branding: TenantBranding) => Promise<TenantConfig>;
  
  // Tenant subscription management
  updateTenantSubscription: (tenantId: string, subscription: TenantSubscription) => Promise<TenantConfig>;
}

// Define data types for tenant management
export interface CreateTenantData {
  name: string;
  type: TenantType;
  adminEmail: string;
  adminName: string;
  subscriptionTier: SubscriptionTier;
  initialDomain?: string;
}

export interface UpdateTenantData {
  name?: string;
  type?: TenantType;
  settings?: Record<string, any>;
}

export interface ListTenantsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: TenantType;
  subscriptionTier?: SubscriptionTier;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ListTenantsResponse {
  tenants: TenantConfig[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VerifyDomainResult {
  verified: boolean;
  error?: string;
  verificationMethod?: 'dns' | 'file';
  verificationDetails?: Record<string, string>;
}

export interface TenantBranding {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface TenantSubscription {
  tier: SubscriptionTier;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  billingContact?: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Create validation schemas using Zod
export const createTenantSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.nativeEnum(TenantType),
  adminEmail: z.string().email(),
  adminName: z.string().min(2).max(100),
  subscriptionTier: z.nativeEnum(SubscriptionTier),
  initialDomain: z.string().optional(),
});

export const updateTenantSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  type: z.nativeEnum(TenantType).optional(),
  settings: z.record(z.any()).optional(),
});

export const tenantBrandingSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
});

export const tenantSubscriptionSchema = z.object({
  tier: z.nativeEnum(SubscriptionTier),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  autoRenew: z.boolean(),
  paymentMethod: z.string().optional(),
  billingContact: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }).optional(),
});

// Implement the tenant management service
export class TenantManagementServiceImpl implements TenantManagementService {
  private apiBaseUrl: string;
  
  constructor(apiBaseUrl: string = '/api/tenants') {
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
  
  // Implement tenant CRUD operations
  async createTenant(data: CreateTenantData): Promise<TenantConfig> {
    // Validate input data
    createTenantSchema.parse(data);
    
    return this.apiCall<TenantConfig>('', 'POST', data);
  }
  
  async getTenant(id: string): Promise<TenantConfig> {
    return this.apiCall<TenantConfig>(`/${id}`);
  }
  
  async updateTenant(id: string, data: UpdateTenantData): Promise<TenantConfig> {
    // Validate input data
    updateTenantSchema.parse(data);
    
    return this.apiCall<TenantConfig>(`/${id}`, 'PUT', data);
  }
  
  async deleteTenant(id: string): Promise<void> {
    await this.apiCall<void>(`/${id}`, 'DELETE');
  }
  
  // Implement tenant listing and filtering
  async listTenants(params: ListTenantsParams = {}): Promise<ListTenantsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.type) queryParams.set('type', params.type);
    if (params.subscriptionTier) queryParams.set('subscriptionTier', params.subscriptionTier);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.apiCall<ListTenantsResponse>(endpoint);
  }
  
  // Implement tenant domain management
  async addTenantDomain(tenantId: string, domain: string): Promise<TenantConfig> {
    return this.apiCall<TenantConfig>(`/${tenantId}/domains`, 'POST', { domain });
  }
  
  async removeTenantDomain(tenantId: string, domain: string): Promise<TenantConfig> {
    return this.apiCall<TenantConfig>(`/${tenantId}/domains/${encodeURIComponent(domain)}`, 'DELETE');
  }
  
  async verifyTenantDomain(tenantId: string, domain: string): Promise<VerifyDomainResult> {
    return this.apiCall<VerifyDomainResult>(`/${tenantId}/domains/${encodeURIComponent(domain)}/verify`, 'POST');
  }
  
  // Implement tenant feature management
  async updateTenantFeatures(tenantId: string, features: Record<string, boolean>): Promise<TenantConfig> {
    return this.apiCall<TenantConfig>(`/${tenantId}/features`, 'PUT', { features });
  }
  
  // Implement tenant branding management
  async updateTenantBranding(tenantId: string, branding: TenantBranding): Promise<TenantConfig> {
    // Validate branding data
    tenantBrandingSchema.parse(branding);
    
    return this.apiCall<TenantConfig>(`/${tenantId}/branding`, 'PUT', branding);
  }
  
  // Implement tenant subscription management
  async updateTenantSubscription(tenantId: string, subscription: TenantSubscription): Promise<TenantConfig> {
    // Validate subscription data
    tenantSubscriptionSchema.parse(subscription);
    
    return this.apiCall<TenantConfig>(`/${tenantId}/subscription`, 'PUT', subscription);
  }
}

// Create a hook for tenant management
export function useTenantManagement() {
  const [service] = useState<TenantManagementService>(
    () => new TenantManagementServiceImpl()
  );
  
  return service;
}

// Create a hook for tenant registration
export function useTenantRegistration() {
  const router = useRouter();
  const tenantService = useTenantManagement();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const registerTenant = async (data: CreateTenantData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tenant = await tenantService.createTenant(data);
      router.push(`/admin/tenants/${tenant.id}/setup`);
      return tenant;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to register tenant');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    registerTenant,
    isLoading,
    error
  };
}

// Create a hook for tenant configuration
export function useTenantConfiguration(tenantId: string) {
  const tenantService = useTenantManagement();
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load tenant data
  useEffect(() => {
    async function loadTenant() {
      if (!tenantId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await tenantService.getTenant(tenantId);
        setTenant(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load tenant');
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTenant();
  }, [tenantId, tenantService]);
  
  // Update tenant data
  const updateTenant = async (data: UpdateTenantData) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await tenantService.updateTenant(tenantId, data);
      setTenant(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update tenant');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update tenant branding
  const updateBranding = async (branding: TenantBranding) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await tenantService.updateTenantBranding(tenantId, branding);
      setTenant(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update tenant branding');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update tenant features
  const updateFeatures = async (features: Record<string, boolean>) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await tenantService.updateTenantFeatures(tenantId, features);
      setTenant(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update tenant features');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update tenant subscription
  const updateSubscription = async (subscription: TenantSubscription) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await tenantService.updateTenantSubscription(tenantId, subscription);
      setTenant(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update tenant subscription');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manage tenant domains
  const addDomain = async (domain: string) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await tenantService.addTenantDomain(tenantId, domain);
      setTenant(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add tenant domain');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeDomain = async (domain: string) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await tenantService.removeTenantDomain(tenantId, domain);
      setTenant(updated);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove tenant domain');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyDomain = async (domain: string) => {
    if (!tenantId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await tenantService.verifyTenantDomain(tenantId, domain);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to verify tenant domain');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    tenant,
    isLoading,
    error,
    updateTenant,
    updateBranding,
    updateFeatures,
    updateSubscription,
    addDomain,
    removeDomain,
    verifyDomain
  };
}

// Create a hook for tenant listing
export function useTenantList() {
  const tenantService = useTenantManagement();
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load tenants with current parameters
  const loadTenants = async (params: ListTenantsParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await tenantService.listTenants(params);
      setTenants(response.tenants);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load tenants');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadTenants();
  }, []);
  
  return {
    tenants,
    pagination,
    isLoading,
    error,
    loadTenants
  };
}

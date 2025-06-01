'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { TenantUser, TenantRole } from '@/lib/multi-tenant';

// Define API service for tenant user management
export interface TenantUserManagementService {
  // User CRUD operations
  createUser: (tenantId: string, data: CreateTenantUserData) => Promise<TenantUser>;
  getUser: (tenantId: string, userId: string) => Promise<TenantUser>;
  updateUser: (tenantId: string, userId: string, data: UpdateTenantUserData) => Promise<TenantUser>;
  deleteUser: (tenantId: string, userId: string) => Promise<void>;
  
  // User listing and filtering
  listUsers: (tenantId: string, params?: ListUsersParams) => Promise<ListUsersResponse>;
  
  // User role and permission management
  updateUserRole: (tenantId: string, userId: string, role: TenantRole) => Promise<TenantUser>;
  updateUserPermissions: (tenantId: string, userId: string, permissions: string[]) => Promise<TenantUser>;
  
  // Bulk user operations
  bulkCreateUsers: (tenantId: string, users: CreateTenantUserData[]) => Promise<BulkOperationResult>;
  bulkDeleteUsers: (tenantId: string, userIds: string[]) => Promise<BulkOperationResult>;
  bulkUpdateUserRoles: (tenantId: string, updates: UserRoleUpdate[]) => Promise<BulkOperationResult>;
  
  // User invitation
  inviteUser: (tenantId: string, invitation: UserInvitation) => Promise<UserInvitationResult>;
  resendInvitation: (tenantId: string, invitationId: string) => Promise<UserInvitationResult>;
  cancelInvitation: (tenantId: string, invitationId: string) => Promise<void>;
  listInvitations: (tenantId: string) => Promise<UserInvitationResult[]>;
}

// Define data types for user management
export interface CreateTenantUserData {
  email: string;
  name: string;
  role: TenantRole;
  permissions?: string[];
  settings?: Record<string, any>;
}

export interface UpdateTenantUserData {
  name?: string;
  email?: string;
  settings?: Record<string, any>;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: TenantRole;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ListUsersResponse {
  users: TenantUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserRoleUpdate {
  userId: string;
  role: TenantRole;
}

export interface BulkOperationResult {
  success: boolean;
  totalCount: number;
  successCount: number;
  failureCount: number;
  failures?: {
    index: number;
    id?: string;
    error: string;
  }[];
}

export interface UserInvitation {
  email: string;
  name: string;
  role: TenantRole;
  permissions?: string[];
  message?: string;
  expiresIn?: number; // in hours
}

export interface UserInvitationResult {
  id: string;
  email: string;
  name: string;
  role: TenantRole;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

// Create validation schemas using Zod
export const createTenantUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.nativeEnum(TenantRole),
  permissions: z.array(z.string()).optional(),
  settings: z.record(z.any()).optional(),
});

export const updateTenantUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  settings: z.record(z.any()).optional(),
});

export const userInvitationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.nativeEnum(TenantRole),
  permissions: z.array(z.string()).optional(),
  message: z.string().max(500).optional(),
  expiresIn: z.number().positive().optional(),
});

// Implement the tenant user management service
export class TenantUserManagementServiceImpl implements TenantUserManagementService {
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
  
  // Implement user CRUD operations
  async createUser(tenantId: string, data: CreateTenantUserData): Promise<TenantUser> {
    // Validate input data
    createTenantUserSchema.parse(data);
    
    return this.apiCall<TenantUser>(`/${tenantId}/users`, 'POST', data);
  }
  
  async getUser(tenantId: string, userId: string): Promise<TenantUser> {
    return this.apiCall<TenantUser>(`/${tenantId}/users/${userId}`);
  }
  
  async updateUser(tenantId: string, userId: string, data: UpdateTenantUserData): Promise<TenantUser> {
    // Validate input data
    updateTenantUserSchema.parse(data);
    
    return this.apiCall<TenantUser>(`/${tenantId}/users/${userId}`, 'PUT', data);
  }
  
  async deleteUser(tenantId: string, userId: string): Promise<void> {
    await this.apiCall<void>(`/${tenantId}/users/${userId}`, 'DELETE');
  }
  
  // Implement user listing and filtering
  async listUsers(tenantId: string, params: ListUsersParams = {}): Promise<ListUsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.role) queryParams.set('role', params.role);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const endpoint = `/${tenantId}/users${queryString ? `?${queryString}` : ''}`;
    
    return this.apiCall<ListUsersResponse>(endpoint);
  }
  
  // Implement user role and permission management
  async updateUserRole(tenantId: string, userId: string, role: TenantRole): Promise<TenantUser> {
    return this.apiCall<TenantUser>(`/${tenantId}/users/${userId}/role`, 'PUT', { role });
  }
  
  async updateUserPermissions(tenantId: string, userId: string, permissions: string[]): Promise<TenantUser> {
    return this.apiCall<TenantUser>(`/${tenantId}/users/${userId}/permissions`, 'PUT', { permissions });
  }
  
  // Implement bulk user operations
  async bulkCreateUsers(tenantId: string, users: CreateTenantUserData[]): Promise<BulkOperationResult> {
    // Validate all user data
    users.forEach(user => createTenantUserSchema.parse(user));
    
    return this.apiCall<BulkOperationResult>(`/${tenantId}/users/bulk`, 'POST', { users });
  }
  
  async bulkDeleteUsers(tenantId: string, userIds: string[]): Promise<BulkOperationResult> {
    return this.apiCall<BulkOperationResult>(`/${tenantId}/users/bulk`, 'DELETE', { userIds });
  }
  
  async bulkUpdateUserRoles(tenantId: string, updates: UserRoleUpdate[]): Promise<BulkOperationResult> {
    return this.apiCall<BulkOperationResult>(`/${tenantId}/users/bulk/roles`, 'PUT', { updates });
  }
  
  // Implement user invitation
  async inviteUser(tenantId: string, invitation: UserInvitation): Promise<UserInvitationResult> {
    // Validate invitation data
    userInvitationSchema.parse(invitation);
    
    return this.apiCall<UserInvitationResult>(`/${tenantId}/invitations`, 'POST', invitation);
  }
  
  async resendInvitation(tenantId: string, invitationId: string): Promise<UserInvitationResult> {
    return this.apiCall<UserInvitationResult>(`/${tenantId}/invitations/${invitationId}/resend`, 'POST');
  }
  
  async cancelInvitation(tenantId: string, invitationId: string): Promise<void> {
    await this.apiCall<void>(`/${tenantId}/invitations/${invitationId}`, 'DELETE');
  }
  
  async listInvitations(tenantId: string): Promise<UserInvitationResult[]> {
    return this.apiCall<UserInvitationResult[]>(`/${tenantId}/invitations`);
  }
}

// Create a hook for tenant user management
export function useTenantUserManagement(tenantId: string) {
  const [service] = useState<TenantUserManagementService>(
    () => new TenantUserManagementServiceImpl()
  );
  
  return {
    service,
    tenantId
  };
}

// Create a hook for tenant user listing
export function useTenantUserList(tenantId: string) {
  const { service } = useTenantUserManagement(tenantId);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load users with current parameters
  const loadUsers = async (params: ListUsersParams = {}) => {
    if (!tenantId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await service.listUsers(tenantId, params);
      setUsers(response.users);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load users');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    if (tenantId) {
      loadUsers();
    }
  }, [tenantId]);
  
  return {
    users,
    pagination,
    isLoading,
    error,
    loadUsers,
    
    // Additional operations
    createUser: async (data: CreateTenantUserData) => {
      setIsLoading(true);
      try {
        const user = await service.createUser(tenantId, data);
        setUsers(prev => [...prev, user]);
        return user;
      } finally {
        setIsLoading(false);
      }
    },
    
    updateUser: async (userId: string, data: UpdateTenantUserData) => {
      setIsLoading(true);
      try {
        const user = await service.updateUser(tenantId, userId, data);
        setUsers(prev => prev.map(u => u.id === userId ? user : u));
        return user;
      } finally {
        setIsLoading(false);
      }
    },
    
    deleteUser: async (userId: string) => {
      setIsLoading(true);
      try {
        await service.deleteUser(tenantId, userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } finally {
        setIsLoading(false);
      }
    },
    
    updateUserRole: async (userId: string, role: TenantRole) => {
      setIsLoading(true);
      try {
        const user = await service.updateUserRole(tenantId, userId, role);
        setUsers(prev => prev.map(u => u.id === userId ? user : u));
        return user;
      } finally {
        setIsLoading(false);
      }
    }
  };
}

// Create a hook for tenant user invitations
export function useTenantInvitations(tenantId: string) {
  const { service } = useTenantUserManagement(tenantId);
  const [invitations, setInvitations] = useState<UserInvitationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load invitations
  const loadInvitations = async () => {
    if (!tenantId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await service.listInvitations(tenantId);
      setInvitations(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load invitations');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    if (tenantId) {
      loadInvitations();
    }
  }, [tenantId]);
  
  return {
    invitations,
    isLoading,
    error,
    loadInvitations,
    
    // Additional operations
    inviteUser: async (invitation: UserInvitation) => {
      setIsLoading(true);
      try {
        const result = await service.inviteUser(tenantId, invitation);
        setInvitations(prev => [...prev, result]);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    
    resendInvitation: async (invitationId: string) => {
      setIsLoading(true);
      try {
        const result = await service.resendInvitation(tenantId, invitationId);
        setInvitations(prev => prev.map(i => i.id === invitationId ? result : i));
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    
    cancelInvitation: async (invitationId: string) => {
      setIsLoading(true);
      try {
        await service.cancelInvitation(tenantId, invitationId);
        setInvitations(prev => prev.filter(i => i.id !== invitationId));
      } finally {
        setIsLoading(false);
      }
    }
  };
}

// Enhanced Tenant Context Provider with Database Initialization
// This file provides a robust solution for the "Tenant or user not found" error

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import initializeDatabase, { setTenantContext } from './database-init';

// Define the tenant context type
interface TenantContextType {
  currentTenantId: string | null;
  setCurrentTenant: (tenantId: string) => void;
  isLoading: boolean;
  error: Error | null;
  isDebugMode: boolean;
  toggleDebugMode: () => void;
}

// Create the context with default values
const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  setCurrentTenant: () => {},
  isLoading: true,
  error: null,
  isDebugMode: false,
  toggleDebugMode: () => {},
});

// Hook for components to access the tenant context
export const useTenant = () => useContext(TenantContext);

interface TenantProviderProps {
  children: ReactNode;
  defaultTenantId?: string;
}

export const TenantProvider = ({ 
  children, 
  defaultTenantId = 'default' 
}: TenantProviderProps) => {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(defaultTenantId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { data: session } = useSession();
  const supabase = useSupabaseClient();

  // Function to toggle debug mode
  const toggleDebugMode = () => {
    setIsDebugMode(prev => !prev);
    console.log(`Debug mode ${!isDebugMode ? 'enabled' : 'disabled'}`);
  };

  // Function to set the current tenant
  const setCurrentTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);
      
      // Set tenant context in database
      await setTenantContext(tenantId);
      
      // Update local state
      setCurrentTenantId(tenantId);
      console.log(`Tenant context set to: ${tenantId}`);
    } catch (err) {
      console.error('Error setting tenant ID:', err);
      setError(err instanceof Error ? err : new Error('Unknown error setting tenant ID'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize database and tenant setup
  useEffect(() => {
    const initialize = async () => {
      if (isInitialized) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Initializing database and tenant setup...');
        
        // Initialize database with tenant structure
        const success = await initializeDatabase();
        
        if (!success) {
          throw new Error('Database initialization failed');
        }
        
        setIsInitialized(true);
        console.log('Database and tenant setup initialized successfully');
      } catch (err) {
        console.error('Error during database initialization:', err);
        setError(err instanceof Error ? err : new Error('Unknown error during initialization'));
        
        // Enable debug mode automatically on initialization error
        setIsDebugMode(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [isInitialized]);

  // Initialize tenant based on user session
  useEffect(() => {
    const initializeTenant = async () => {
      if (!isInitialized) return;
      
      setIsLoading(true);
      
      try {
        // If user is authenticated, try to get their tenant
        if (session?.user) {
          // In debug mode, always use default tenant
          if (isDebugMode) {
            setCurrentTenantId(defaultTenantId);
            await setCurrentTenant(defaultTenantId);
            return;
          }
          
          const { data: userData, error: userError } = await supabase
            .from('User')
            .select('tenantId')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            // If there's an error, fall back to default tenant
            console.warn('Error fetching user tenant, using default:', userError.message);
            setCurrentTenantId(defaultTenantId);
            await setCurrentTenant(defaultTenantId);
          } else if (userData?.tenantId) {
            setCurrentTenantId(userData.tenantId);
            await setCurrentTenant(userData.tenantId);
          } else {
            // User exists but has no tenant, assign default
            console.log('User has no tenant assigned, using default');
            setCurrentTenantId(defaultTenantId);
            await setCurrentTenant(defaultTenantId);
          }
        } else {
          // For unauthenticated users, use default tenant
          setCurrentTenantId(defaultTenantId);
          await setCurrentTenant(defaultTenantId);
        }
      } catch (err) {
        console.error('Error initializing tenant:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing tenant'));
        
        // Fall back to default tenant on error
        setCurrentTenantId(defaultTenantId);
        await setCurrentTenant(defaultTenantId);
        
        // Enable debug mode automatically on tenant initialization error
        setIsDebugMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTenant();
  }, [session, supabase, defaultTenantId, isInitialized, isDebugMode]);

  return (
    <TenantContext.Provider 
      value={{ 
        currentTenantId, 
        setCurrentTenant, 
        isLoading, 
        error, 
        isDebugMode, 
        toggleDebugMode 
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

// HOC to wrap components that need tenant context
export function withTenant<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const tenant = useTenant();
    
    if (tenant.isLoading) {
      return <div className="tenant-loading">Loading tenant context...</div>;
    }
    
    if (tenant.error && !tenant.isDebugMode) {
      return (
        <div className="tenant-error">
          <h3>Error loading tenant</h3>
          <p>{tenant.error.message}</p>
          <button onClick={tenant.toggleDebugMode}>
            Enable Debug Mode
          </button>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

// Fallback component for tenant errors
export function TenantErrorFallback({ children }: { children: ReactNode }) {
  const tenant = useTenant();
  
  if (tenant.error && !tenant.isDebugMode) {
    return (
      <div className="tenant-error-fallback">
        <h3>Tenant Error</h3>
        <p>{tenant.error.message}</p>
        <button onClick={tenant.toggleDebugMode}>
          Continue in Debug Mode
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Debug mode indicator component
export function DebugModeIndicator() {
  const tenant = useTenant();
  
  if (!tenant.isDebugMode) return null;
  
  return (
    <div className="debug-mode-indicator">
      <p>Debug Mode Active - Tenant: {tenant.currentTenantId || 'None'}</p>
      <button onClick={tenant.toggleDebugMode}>
        Disable Debug Mode
      </button>
    </div>
  );
}

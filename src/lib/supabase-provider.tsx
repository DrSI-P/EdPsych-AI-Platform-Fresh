'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a context for the Supabase client
type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoading: boolean;
  error: Error | null;
};

const SupabaseContext = createContext<SupabaseContext>({
  supabase: null,
  isLoading: true,
  error: null,
});

// Hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

// Provider component
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Use environment variables for Supabase URL and anon key
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vrailhsvlqdavpbrkxy.supabase.co';
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyYWlsaHN2bHFkYXZwYnJreHkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNzQ0MjA5MywiZXhwIjoyMDMzMDE4MDkzfQ.eyJhbGciOiJIUzI1NiJ9';
        
        // Create the Supabase client
        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabase(client);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Supabase client:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing Supabase'));
        setIsLoading(false);
      }
    };

    initializeSupabase();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export default SupabaseProvider;
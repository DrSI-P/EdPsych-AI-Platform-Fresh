// Database Initialization Script for Supabase
// This script ensures tenant setup before any database operations

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const DEFAULT_TENANT_ID = 'default';
const DEFAULT_TENANT_NAME = 'Default Tenant';
const DEFAULT_TENANT_DOMAIN = 'edpsychconnect.com';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

/**
 * Ensures the tenant table exists and has a default tenant
 */
export async function ensureTenantSetup() {
  console.log('🔄 Initializing database and ensuring tenant setup...');
  
  try {
    // Step 1: Check if Tenant table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'Tenant')
      .eq('table_schema', 'public')
      .single();
    
    if (tableCheckError) {
      console.log('⚠️ Error checking Tenant table existence:', tableCheckError.message);
      
      // Create Tenant table if it doesn't exist
      const { error: createTableError } = await supabase.rpc('create_tenant_table');
      
      if (createTableError) {
        console.error('❌ Failed to create Tenant table:', createTableError.message);
        return false;
      }
      
      console.log('✅ Tenant table created successfully');
    } else {
      console.log('✅ Tenant table already exists');
    }
    
    // Step 2: Check if default tenant exists
    const { data: defaultTenant, error: tenantCheckError } = await supabase
      .from('Tenant')
      .select('id')
      .eq('id', DEFAULT_TENANT_ID)
      .single();
    
    if (tenantCheckError || !defaultTenant) {
      console.log('⚠️ Default tenant not found, creating...');
      
      // Create default tenant
      const { error: createTenantError } = await supabase
        .from('Tenant')
        .insert([
          {
            id: DEFAULT_TENANT_ID,
            name: DEFAULT_TENANT_NAME,
            domain: DEFAULT_TENANT_DOMAIN,
            updatedAt: new Date().toISOString(),
          },
        ]);
      
      if (createTenantError) {
        console.error('❌ Failed to create default tenant:', createTenantError.message);
        return false;
      }
      
      console.log('✅ Default tenant created successfully');
    } else {
      console.log('✅ Default tenant already exists');
    }
    
    // Step 3: Ensure tenant relationships in key tables
    const tables = ['User', 'Course', 'BlogPost', 'BlogCategory'];
    
    for (const table of tables) {
      const { error: columnCheckError } = await supabase.rpc('ensure_tenant_column', {
        table_name: table,
      });
      
      if (columnCheckError) {
        console.error(`❌ Failed to ensure tenant column in ${table}:`, columnCheckError.message);
      } else {
        console.log(`✅ Tenant column ensured in ${table}`);
      }
    }
    
    // Step 4: Set up RLS policies
    const { error: rlsError } = await supabase.rpc('setup_tenant_rls_policies');
    
    if (rlsError) {
      console.error('❌ Failed to set up RLS policies:', rlsError.message);
    } else {
      console.log('✅ RLS policies set up successfully');
    }
    
    console.log('✅ Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Unexpected error during database initialization:', error);
    return false;
  }
}

/**
 * Sets the current tenant context for database operations
 */
export async function setTenantContext(tenantId = DEFAULT_TENANT_ID) {
  try {
    const { error } = await supabase.rpc('set_tenant_context', {
      tenant_id: tenantId,
    });
    
    if (error) {
      console.error('❌ Failed to set tenant context:', error.message);
      return false;
    }
    
    console.log(`✅ Tenant context set to: ${tenantId}`);
    return true;
  } catch (error) {
    console.error('❌ Unexpected error setting tenant context:', error);
    return false;
  }
}

/**
 * Initializes the database with required functions
 */
export async function initializeDatabaseFunctions() {
  try {
    // Create function to ensure tenant column exists
    const ensureTenantColumnSQL = `
      CREATE OR REPLACE FUNCTION ensure_tenant_column(table_name TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE format('
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = %L AND column_name = ''tenantId''
            ) THEN
              ALTER TABLE %I ADD COLUMN "tenantId" TEXT;
              UPDATE %I SET "tenantId" = ''default'' WHERE "tenantId" IS NULL;
              ALTER TABLE %I ALTER COLUMN "tenantId" SET NOT NULL;
              
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints 
                WHERE constraint_name = %L
              ) THEN
                ALTER TABLE %I ADD CONSTRAINT %L 
                FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") 
                ON DELETE CASCADE ON UPDATE CASCADE;
              END IF;
            END IF;
          END $$;
        ', table_name, table_name, table_name, table_name, 
           table_name || '_tenantId_fkey', table_name, table_name || '_tenantId_fkey');
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Create function to set up RLS policies
    const setupRLSPoliciesSQL = `
      CREATE OR REPLACE FUNCTION setup_tenant_rls_policies()
      RETURNS VOID AS $$
      BEGIN
        -- Create tenant context function
        CREATE OR REPLACE FUNCTION current_tenant_id() 
        RETURNS TEXT AS $$
        BEGIN
          RETURN current_setting('app.tenant_id', TRUE);
        EXCEPTION
          WHEN OTHERS THEN
            RETURN 'default';
        END;
        $$ LANGUAGE plpgsql;
        
        -- Enable RLS and create policies for each table
        EXECUTE '
          ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS tenant_isolation_policy ON "User";
          CREATE POLICY tenant_isolation_policy ON "User"
            USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);
        ';
        
        EXECUTE '
          ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS tenant_isolation_policy ON "Course";
          CREATE POLICY tenant_isolation_policy ON "Course"
            USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);
        ';
        
        EXECUTE '
          ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS tenant_isolation_policy ON "BlogPost";
          CREATE POLICY tenant_isolation_policy ON "BlogPost"
            USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);
        ';
        
        EXECUTE '
          ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS tenant_isolation_policy ON "BlogCategory";
          CREATE POLICY tenant_isolation_policy ON "BlogCategory"
            USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);
        ';
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Create function to set tenant context
    const setTenantContextSQL = `
      CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id TEXT)
      RETURNS VOID AS $$
      BEGIN
        PERFORM set_config('app.tenant_id', tenant_id, FALSE);
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Create function to create tenant table
    const createTenantTableSQL = `
      CREATE OR REPLACE FUNCTION create_tenant_table()
      RETURNS VOID AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS "Tenant" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "domain" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
        );
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Execute all function creation statements
    const { error: functionError } = await supabase.rpc('run_sql_batch', {
      sql_statements: [
        ensureTenantColumnSQL,
        setupRLSPoliciesSQL,
        setTenantContextSQL,
        createTenantTableSQL
      ].join(';')
    });
    
    if (functionError) {
      console.error('❌ Failed to initialize database functions:', functionError.message);
      return false;
    }
    
    console.log('✅ Database functions initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Unexpected error initializing database functions:', error);
    return false;
  }
}

/**
 * Main initialization function to be called at application startup
 */
export async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  
  // Step 1: Initialize database functions
  const functionsInitialized = await initializeDatabaseFunctions();
  if (!functionsInitialized) {
    console.error('❌ Database function initialization failed');
    return false;
  }
  
  // Step 2: Ensure tenant setup
  const tenantSetupComplete = await ensureTenantSetup();
  if (!tenantSetupComplete) {
    console.error('❌ Tenant setup failed');
    return false;
  }
  
  // Step 3: Set default tenant context
  const contextSet = await setTenantContext();
  if (!contextSet) {
    console.error('❌ Setting tenant context failed');
    return false;
  }
  
  console.log('✅ Database initialization completed successfully');
  return true;
}

// Helper function to run SQL batch (to be created in Supabase)
/*
CREATE OR REPLACE FUNCTION run_sql_batch(sql_statements TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_statements;
END;
$$ LANGUAGE plpgsql;
*/

// Export initialization function for use in application startup
export default initializeDatabase;

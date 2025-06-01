-- Tenant Model Fix Migration Script
-- This script addresses the "Tenant or user not found" error by ensuring proper tenant setup

-- Check if tenants table exists, create if not
CREATE TABLE IF NOT EXISTS "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- Create default tenant if none exists
INSERT INTO "Tenant" ("id", "name", "domain", "updatedAt")
SELECT 'default', 'Default Tenant', 'edpsychconnect.com', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Tenant" WHERE "id" = 'default');

-- Ensure User table has tenant relationship
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "User" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
ALTER TABLE "User" ALTER COLUMN "tenantId" SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'User_tenantId_fkey'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" 
        FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- Ensure Course table has tenant relationship
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "Course" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
ALTER TABLE "Course" ALTER COLUMN "tenantId" SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Course_tenantId_fkey'
    ) THEN
        ALTER TABLE "Course" ADD CONSTRAINT "Course_tenantId_fkey" 
        FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- Ensure BlogPost table has tenant relationship
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "BlogPost" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
ALTER TABLE "BlogPost" ALTER COLUMN "tenantId" SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'BlogPost_tenantId_fkey'
    ) THEN
        ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_tenantId_fkey" 
        FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- Ensure BlogCategory table has tenant relationship
ALTER TABLE "BlogCategory" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
UPDATE "BlogCategory" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
ALTER TABLE "BlogCategory" ALTER COLUMN "tenantId" SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'BlogCategory_tenantId_fkey'
    ) THEN
        ALTER TABLE "BlogCategory" ADD CONSTRAINT "BlogCategory_tenantId_fkey" 
        FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- Create tenant context function for RLS policies
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.tenant_id', TRUE);
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'default';
END
$$ LANGUAGE plpgsql;

-- Update RLS policies to use tenant context
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "User";
CREATE POLICY tenant_isolation_policy ON "User"
    USING ("tenantId" = current_tenant_id());

ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "Course";
CREATE POLICY tenant_isolation_policy ON "Course"
    USING ("tenantId" = current_tenant_id());

ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "BlogPost";
CREATE POLICY tenant_isolation_policy ON "BlogPost"
    USING ("tenantId" = current_tenant_id());

ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "BlogCategory";
CREATE POLICY tenant_isolation_policy ON "BlogCategory"
    USING ("tenantId" = current_tenant_id());

-- Grant permissions to authenticated users
GRANT ALL ON "Tenant" TO authenticated;
GRANT ALL ON "User" TO authenticated;
GRANT ALL ON "Course" TO authenticated;
GRANT ALL ON "BlogPost" TO authenticated;
GRANT ALL ON "BlogCategory" TO authenticated;

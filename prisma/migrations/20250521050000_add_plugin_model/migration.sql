-- CreateTable
CREATE TABLE "Plugin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "tags" TEXT[],
    "supportedFeatures" TEXT[],
    "requiredPermissions" TEXT[],
    "settings" JSONB NOT NULL,
    "compatibilityVersion" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "errorMessage" TEXT,
    "configuredSettings" JSONB NOT NULL,

    CONSTRAINT "Plugin_pkey" PRIMARY KEY ("id")
);
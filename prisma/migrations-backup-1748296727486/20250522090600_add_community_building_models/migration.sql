-- CreateTable
CREATE TABLE "CommunityBuildingActivity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ageGroups" TEXT[],
    "timeRequired" TEXT NOT NULL,
    "groupSize" TEXT NOT NULL,
    "materials" TEXT[],
    "instructions" TEXT NOT NULL,
    "variations" TEXT,
    "tips" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityBuildingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityFavorite_userId_activityId_key" ON "ActivityFavorite"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "ActivityFavorite" ADD CONSTRAINT "ActivityFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityFavorite" ADD CONSTRAINT "ActivityFavorite_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "CommunityBuildingActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
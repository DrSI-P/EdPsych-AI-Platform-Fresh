-- CreateTable
CREATE TABLE "ParentEducationResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ageGroups" TEXT[],
    "difficultyLevel" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT,
    "downloadUrl" TEXT,
    "estimatedTime" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentEducationResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentEducationFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentEducationFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParentEducationFavorite_userId_resourceId_key" ON "ParentEducationFavorite"("userId", "resourceId");

-- AddForeignKey
ALTER TABLE "ParentEducationFavorite" ADD CONSTRAINT "ParentEducationFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentEducationFavorite" ADD CONSTRAINT "ParentEducationFavorite_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "ParentEducationResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
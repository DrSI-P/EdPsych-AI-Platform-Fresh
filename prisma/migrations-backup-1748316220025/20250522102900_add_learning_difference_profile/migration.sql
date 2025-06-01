-- CreateTable
CREATE TABLE "LearningDifferenceProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assessmentResults" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningDifferenceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningDifferenceProfile_userId_key" ON "LearningDifferenceProfile"("userId");

-- AddForeignKey
ALTER TABLE "LearningDifferenceProfile" ADD CONSTRAINT "LearningDifferenceProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
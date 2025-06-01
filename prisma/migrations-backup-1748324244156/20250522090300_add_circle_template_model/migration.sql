-- CreateTable
CREATE TABLE "CircleTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "materials" TEXT[],
    "timeRequired" TEXT NOT NULL,
    "spaceSetup" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CircleTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CircleTemplate" ADD CONSTRAINT "CircleTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
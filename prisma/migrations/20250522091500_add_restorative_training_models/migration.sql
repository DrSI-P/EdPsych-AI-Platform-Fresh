-- CreateTable
CREATE TABLE "RestorativeTrainingModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorativeTrainingModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestorativeTrainingSection" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorativeTrainingSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestorativeTrainingProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "completedSections" TEXT[],
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RestorativeTrainingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestorativeTrainingProgress_userId_moduleId_key" ON "RestorativeTrainingProgress"("userId", "moduleId");

-- AddForeignKey
ALTER TABLE "RestorativeTrainingSection" ADD CONSTRAINT "RestorativeTrainingSection_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "RestorativeTrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorativeTrainingProgress" ADD CONSTRAINT "RestorativeTrainingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorativeTrainingProgress" ADD CONSTRAINT "RestorativeTrainingProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "RestorativeTrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
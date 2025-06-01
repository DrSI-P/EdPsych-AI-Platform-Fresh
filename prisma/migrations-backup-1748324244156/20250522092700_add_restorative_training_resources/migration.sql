-- CreateTable
CREATE TABLE "RestorativeTrainingResource" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorativeTrainingResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestorativeTrainingResource" ADD CONSTRAINT "RestorativeTrainingResource_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "RestorativeTrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- CreateTable
CREATE TABLE "CurriculumPlanCollaborator" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPlanCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumPlanComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPlanComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumPlanTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3),
    "planId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPlanTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CurriculumPlanCollaborator" ADD CONSTRAINT "CurriculumPlanCollaborator_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CurriculumPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanCollaborator" ADD CONSTRAINT "CurriculumPlanCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanComment" ADD CONSTRAINT "CurriculumPlanComment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CurriculumPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanComment" ADD CONSTRAINT "CurriculumPlanComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanTask" ADD CONSTRAINT "CurriculumPlanTask_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CurriculumPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanTask" ADD CONSTRAINT "CurriculumPlanTask_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanTask" ADD CONSTRAINT "CurriculumPlanTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
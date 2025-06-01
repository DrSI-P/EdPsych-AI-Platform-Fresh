-- CreateTable
CREATE TABLE "RestorativeTrainingQuizAttempt" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorativeTrainingQuizAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestorativeTrainingQuizAttempt" ADD CONSTRAINT "RestorativeTrainingQuizAttempt_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "RestorativeTrainingProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `answers` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Response` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `createdById` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyStage` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Assessment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_creatorId_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "creatorId",
DROP COLUMN "published",
DROP COLUMN "questions",
ADD COLUMN     "allowRetakes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "keyStage" TEXT NOT NULL,
ADD COLUMN     "passingScore" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "randomizeQuestions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showResults" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "timeLimit" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "answers",
DROP COLUMN "createdAt",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'student';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "options" JSONB,
    "correctAnswer" JSONB,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "isCorrect" BOOLEAN,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "RestorativeTrainingSection" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'text',
                                         ADD COLUMN "duration" TEXT NOT NULL DEFAULT '';
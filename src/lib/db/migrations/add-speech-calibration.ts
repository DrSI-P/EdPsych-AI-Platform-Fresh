import { prisma } from '@/lib/db';

// This migration adds the SpeechCalibration model to the schema
// Run this migration using Prisma Migrate

/**
 * `npx prisma migrate dev --name add_speech_calibration`
 */

export async function addSpeechCalibrationModel() {
  // This is a placeholder function to document the schema changes
  // The actual changes should be made in the schema.prisma file
  console.log('Adding SpeechCalibration model to schema');
}

// Schema addition:
/*
model SpeechCalibration {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  calibrationData  String   @db.Text
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
*/

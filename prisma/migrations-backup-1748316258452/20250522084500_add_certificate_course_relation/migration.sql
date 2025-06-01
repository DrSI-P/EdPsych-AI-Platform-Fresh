-- Update relation between Certificate and Course
-- First drop the constraint added in the previous migration
ALTER TABLE "Certificate" DROP CONSTRAINT IF EXISTS "Certificate_courseId_fkey";

-- Then add the constraint with SET NULL behavior
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
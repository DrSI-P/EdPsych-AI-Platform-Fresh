-- CreateTable
CREATE TABLE "ReflectionPrompt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "supportingQuestions" TEXT[],
    "visualSupports" BOOLEAN NOT NULL DEFAULT false,
    "simplifiedLanguage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReflectionPrompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReflectionPrompt" ADD CONSTRAINT "ReflectionPrompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
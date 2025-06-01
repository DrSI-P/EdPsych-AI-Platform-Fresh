-- CreateTable
CREATE TABLE "RestorativeAgreement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "participants" TEXT[],
    "facilitator" TEXT,
    "followUpDate" TIMESTAMP(3) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorativeAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestorativeAgreementTerm" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibleParty" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "completedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorativeAgreementTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestorativeAgreementUpdate" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestorativeAgreementUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestorativeAgreement" ADD CONSTRAINT "RestorativeAgreement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorativeAgreementTerm" ADD CONSTRAINT "RestorativeAgreementTerm_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RestorativeAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorativeAgreementUpdate" ADD CONSTRAINT "RestorativeAgreementUpdate_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "RestorativeAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- CreateTable
CREATE TABLE "Webinar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "presenterId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "topics" TEXT[],
    "level" TEXT NOT NULL,
    "recordingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "recordingUrl" TEXT,
    "recordingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "recordingAddedAt" TIMESTAMP(3),
    "averageRating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Webinar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebinarRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedToCalendar" BOOLEAN NOT NULL DEFAULT false,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WebinarRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebinarAttendee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "timeSpent" INTEGER,

    CONSTRAINT "WebinarAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebinarFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "WebinarFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebinarRegistration_userId_webinarId_key" ON "WebinarRegistration"("userId", "webinarId");

-- CreateIndex
CREATE UNIQUE INDEX "WebinarAttendee_userId_webinarId_key" ON "WebinarAttendee"("userId", "webinarId");

-- CreateIndex
CREATE UNIQUE INDEX "WebinarFeedback_userId_webinarId_key" ON "WebinarFeedback"("userId", "webinarId");

-- AddForeignKey
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_presenterId_fkey" FOREIGN KEY ("presenterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarRegistration" ADD CONSTRAINT "WebinarRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarRegistration" ADD CONSTRAINT "WebinarRegistration_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarAttendee" ADD CONSTRAINT "WebinarAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarAttendee" ADD CONSTRAINT "WebinarAttendee_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarFeedback" ADD CONSTRAINT "WebinarFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebinarFeedback" ADD CONSTRAINT "WebinarFeedback_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "Webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
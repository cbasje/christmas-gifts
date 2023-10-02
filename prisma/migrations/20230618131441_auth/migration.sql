/*
  Warnings:

  - A unique constraint covering the columns `[ideaLinkId]` on the table `GiftItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[partnerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GiftItem" ADD COLUMN     "giftedById" TEXT,
ADD COLUMN     "idea" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ideaLinkId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "partnerId" TEXT;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "GiftItem_ideaLinkId_key" ON "GiftItem"("ideaLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_partnerId_key" ON "User"("partnerId");

-- AddForeignKey
ALTER TABLE "GiftItem" ADD CONSTRAINT "GiftItem_giftedById_fkey" FOREIGN KEY ("giftedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftItem" ADD CONSTRAINT "GiftItem_ideaLinkId_fkey" FOREIGN KEY ("ideaLinkId") REFERENCES "GiftItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

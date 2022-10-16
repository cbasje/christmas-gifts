/*
  Warnings:

  - The `groups` column on the `GiftItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `groups` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Group" AS ENUM ('BENJAMINS', 'HAUGEN');

-- AlterTable
ALTER TABLE "GiftItem" DROP COLUMN "groups",
ADD COLUMN     "groups" "Group"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groups",
ADD COLUMN     "groups" "Group"[];

-- DropEnum
DROP TYPE "GroupName";

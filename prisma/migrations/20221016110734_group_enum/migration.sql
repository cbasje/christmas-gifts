/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GiftItemToGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GroupName" AS ENUM ('BENJAMINS', 'HAUGEN');

-- DropForeignKey
ALTER TABLE "_GiftItemToGroup" DROP CONSTRAINT "_GiftItemToGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_GiftItemToGroup" DROP CONSTRAINT "_GiftItemToGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "GiftItem" ADD COLUMN     "groups" "GroupName"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groups" "GroupName"[];

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "_GiftItemToGroup";

-- DropTable
DROP TABLE "_GroupToUser";

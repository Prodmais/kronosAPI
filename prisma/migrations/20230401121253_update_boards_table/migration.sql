/*
  Warnings:

  - You are about to drop the column `userId` on the `boards` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `boards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "boards" DROP CONSTRAINT "boards_userId_fkey";

-- AlterTable
ALTER TABLE "boards" DROP COLUMN "userId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `invitedById` on the `Invitation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_invitedById_fkey";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "invitedById",
ADD COLUMN     "inviteToEmail" TEXT;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviteToEmail_fkey" FOREIGN KEY ("inviteToEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;

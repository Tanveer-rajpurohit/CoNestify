/*
  Warnings:

  - A unique constraint covering the columns `[inviteLink]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inviteLink]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "description" TEXT,
ADD COLUMN     "inviteLink" TEXT;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "description" TEXT,
ADD COLUMN     "inviteLink" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_inviteLink_key" ON "Channel"("inviteLink");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_inviteLink_key" ON "Workspace"("inviteLink");

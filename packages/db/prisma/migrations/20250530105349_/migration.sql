/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Invitations" JSONB[];

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_key" ON "Workspace"("name");

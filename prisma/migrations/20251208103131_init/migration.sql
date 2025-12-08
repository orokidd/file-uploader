/*
  Warnings:

  - The primary key for the `file_uploader_session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expires` on the `file_uploader_session` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `file_uploader_session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file_uploader_session" DROP CONSTRAINT "file_uploader_session_pkey",
DROP COLUMN "expires",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "file_uploader_session_pkey" PRIMARY KEY ("id");

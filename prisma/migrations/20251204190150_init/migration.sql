/*
  Warnings:

  - You are about to drop the `file_uploader_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `file_uploader_folders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `file_uploader_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `file_uploader_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "file_uploader_files" DROP CONSTRAINT "file_uploader_files_folderId_fkey";

-- DropForeignKey
ALTER TABLE "file_uploader_files" DROP CONSTRAINT "file_uploader_files_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "file_uploader_folders" DROP CONSTRAINT "file_uploader_folders_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "file_uploader_folders" DROP CONSTRAINT "file_uploader_folders_parentId_fkey";

-- DropForeignKey
ALTER TABLE "file_uploader_sessions" DROP CONSTRAINT "file_uploader_sessions_userId_fkey";

-- DropTable
DROP TABLE "file_uploader_files";

-- DropTable
DROP TABLE "file_uploader_folders";

-- DropTable
DROP TABLE "file_uploader_sessions";

-- DropTable
DROP TABLE "file_uploader_users";

-- CreateTable
CREATE TABLE "file_uploader_user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "file_uploader_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader_folder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "file_uploader_folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader_file" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "size" INTEGER NOT NULL,
    "folderId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploader_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader_session" (
    "id" SERIAL NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_uploader_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_uploader_user_username_key" ON "file_uploader_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "file_uploader_session_sid_key" ON "file_uploader_session"("sid");

-- AddForeignKey
ALTER TABLE "file_uploader_folder" ADD CONSTRAINT "file_uploader_folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "file_uploader_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader_file" ADD CONSTRAINT "file_uploader_file_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "file_uploader_folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader_file" ADD CONSTRAINT "file_uploader_file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "file_uploader_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

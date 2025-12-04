-- CreateTable
CREATE TABLE "file_uploader_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploader_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader_files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedById" INTEGER NOT NULL,
    "folderId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploader_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader_folders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploader_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader_sessions" (
    "id" TEXT NOT NULL,
    "sid" VARCHAR(255) NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploader_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_uploader_users_email_key" ON "file_uploader_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "file_uploader_files_url_key" ON "file_uploader_files"("url");

-- CreateIndex
CREATE INDEX "file_uploader_files_uploadedById_idx" ON "file_uploader_files"("uploadedById");

-- CreateIndex
CREATE UNIQUE INDEX "file_uploader_folders_ownerId_name_key" ON "file_uploader_folders"("ownerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "file_uploader_sessions_sid_key" ON "file_uploader_sessions"("sid");

-- CreateIndex
CREATE INDEX "file_uploader_sessions_sid_idx" ON "file_uploader_sessions"("sid");

-- CreateIndex
CREATE INDEX "file_uploader_sessions_expiresAt_idx" ON "file_uploader_sessions"("expiresAt");

-- AddForeignKey
ALTER TABLE "file_uploader_files" ADD CONSTRAINT "file_uploader_files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "file_uploader_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader_files" ADD CONSTRAINT "file_uploader_files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "file_uploader_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader_folders" ADD CONSTRAINT "file_uploader_folders_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "file_uploader_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader_folders" ADD CONSTRAINT "file_uploader_folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "file_uploader_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader_sessions" ADD CONSTRAINT "file_uploader_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "file_uploader_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

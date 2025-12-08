-- AlterTable
ALTER TABLE "file_uploader_session" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "file_uploader_session_id_seq";

import express from 'express';
import checkAuthentication from '../middleware/checkAuthentication.js'
import filesController from '../controllers/files.controller.js'

const router = express.Router()

router.post("/uploadFile", checkAuthentication, filesController.uploadFile);
router.post("/folders/:folderId/uploadFile", checkAuthentication, filesController.uploadFileToFolder)
router.get("/file/:fileId", checkAuthentication, filesController.getFileDetails);
router.get("/file/:fileId/download", checkAuthentication, filesController.downloadFile)

export default router;
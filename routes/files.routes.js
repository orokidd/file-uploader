import express from 'express';
import checkAuthentication from '../middleware/checkAuthentication.js'
import filesController from '../controllers/files.controller.js'
import upload from '../config/multer.js'

const router = express.Router()

router.post("/uploadFile", checkAuthentication, upload.single('file'), filesController.uploadFile);
router.post("/folders/:folderId/uploadFile", checkAuthentication, upload.single('file'), filesController.uploadFileToFolder)
router.get("/file/:fileId", checkAuthentication, filesController.getFileDetails);
router.get("/file/:fileId/download", checkAuthentication, filesController.downloadFile)

export default router;
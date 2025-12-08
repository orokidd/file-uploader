const express = require('express');
const checkAuthentication = require('../middleware/checkAuthentication.js');
const filesController = require('../controllers/files.controller.js');
const upload = require('../middleware/multer.js');

const router = express.Router()

router.post("/uploadFile", checkAuthentication, upload.single('file'), filesController.uploadFile);
router.post("/folders/:folderId/uploadFile", checkAuthentication, upload.single('file'), filesController.uploadFileToFolder)
router.get("/file/:fileId", checkAuthentication, filesController.getFileDetails);
router.get("/file/:fileId/download", checkAuthentication, filesController.downloadFile)

module.exports = router;
const express = require('express');
const checkAuthentication = require('../middleware/checkAuthentication.js');
const foldersController = require('../controllers/folders.controller.js');

const router = express.Router();

router.get("/folders/:folderId", checkAuthentication, foldersController.getFolder);
router.post("/folders/:folderId/delete", checkAuthentication, foldersController.deleteFolder);
router.post("/folders/:folderId/edit", checkAuthentication, foldersController.editFolder)
router.post("/folders", checkAuthentication, foldersController.createFolder);

module.exports = router;
import express from 'express';
import checkAuthentication from '../middleware/checkAuthentication.js';
import foldersController from '../controllers/folders.controller.js'

const router = express.Router();

router.get("/folders/:folderId", checkAuthentication, foldersController.getFolder);
router.post("/folders", checkAuthentication, foldersController.createFolder);

export default router;
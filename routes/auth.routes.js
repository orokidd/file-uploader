import express from 'express';
import checkAuthentication from '../middleware/checkAuthentication';
import authController from '../controllers/auth.controller.js';

const router = express.Router()

router.get("/login", authController.getLogin)
router.post("/login", authController.postLogin)
router.get("/register", authController.getRegister)
router.post("/register", authController.postRegister)
router.get("/logout", authController.logout)

export default router;
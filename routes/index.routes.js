import express from 'express';
import checkAuthenticaiton from '../middleware/checkAuthentication.js'
import indexController from '../controllers/index.controller.js';
const router = express.Router();

router.get("/", checkAuthenticaiton, indexController.redirectIndex);
router.get("/dashboard", checkAuthenticaiton, indexController.getDashboard);

export default router
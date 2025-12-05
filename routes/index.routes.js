import express from 'express';
import indexController from '../controllers/index.controller.js';
const router = express.Router();

router.get("/", indexController.redirectIndex);
router.get("/dashboard", indexController.getDashboard);

export default router
const express = require('express');
const checkAuthentication = require('../middleware/checkAuthentication.js');
const indexController = require('../controllers/index.controller.js');
const router = express.Router();

router.get("/", checkAuthentication, indexController.redirectIndex);
router.get("/dashboard", checkAuthentication, indexController.getDashboard);

module.exports = router;
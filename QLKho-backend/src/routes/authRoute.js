const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middleware/authMiddleware');

router.post('/login', validateLogin, authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword', authController.resetPassword);

module.exports = router;
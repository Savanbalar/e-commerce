const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

// router.post('/register', validate(authValidation.register), authController.register);
router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/forgot-password',authController.forgotPassword);
router.post('/verfiyOTP',authController.verifyotp);
router.post('/resetPassword',authController.resetPassword);




// router.post('/logout', validate(authValidation.logout), authController.logout);
// router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
// router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
// router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
// router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;

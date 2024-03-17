

const express = require('express');
const router =  express.Router();

const authController =  require('../controller/authController');
const freeswitchController =  require('../controller/freeswitchController');
const { PLATFORM } =  require('../constants/auth');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const loggedIn = require('../middleware/loggedIn');


router.route('/auth/register').post(authController.register);
router.post('/auth/login',authController.login);
// router.route('/forgot-password').post(authController.forgotPassword);
// router.route('/validate-otp').post(authController.validateResetPasswordOtp);
// router.route('/reset-password').put(authController.resetPassword);
// router.route('/logout').post(auth(PLATFORM.ADMIN), authController.logout);

router.route('/make-call').post(checkPermission, freeswitchController.makeCall);
// router.post('/make-call',freeswitchController.makeCall);

module.exports = router;
const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router('/api/v1/admins');

router.post('/signup', authController.signupAdmin);
router.post('/signin', authController.signinAdmin);

module.exports = router;

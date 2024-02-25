const express = require('express')
const router = express.Router();


router.use('/', require('./profile_router'));
router.use('/', require('./booking_router'));
router.use('/', require('./cart_router'));

module.exports = router;
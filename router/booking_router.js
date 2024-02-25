const express = require('express');
const router = express.Router();
const controller = require('../controller/booking_controller');
const {verify} = require('../middleware/Authentication')
const {verify1} = require('../middleware/Authentication')


router.post('/weeks',verify,controller.weeks);
router.post('/days',verify,controller.days);
router.post('/time_slotts',verify1,controller.time_slotts);
router.post('/schedule',verify1,controller.schedule);
router.get('/get_schedule',controller.get_schedule);
router.get('/timeslots',controller.timeslots);
router.get('/book_service',controller.book_service);
router.get('/times',controller.times);

module.exports = router;
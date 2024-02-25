const express = require('express');
const router = express.Router();
const controller = require('../controller/profile_controller');
const {verify} = require('../middleware/Authentication')
const {verify1} = require('../middleware/Authentication')

router.post('/signup',controller.signUp);
router.post('/otpverify',controller.Otpverify);
router.post('/userdetails',verify1,controller.userDetails);
router.get('/showapplications',controller.showApplications); 
router.get('/applicationresponse',controller.applicationResponse); 
router.get('/showresponse',verify1,controller.showResponse); 
router.post('/profilepersonalization',verify1,controller.profile_personalization); 
router.post('/customerSignUp',controller.customerSignUp); 
router.post('/customersOtpverify',controller.customersOtpverify); 
router.post('/customerLogin',controller.customerLogin); 
router.post('/userLogin',controller.userLogin); 
router.post('/customerDetails',controller.customerDetails); 
router.post('/customer_address',verify1,controller.customer_address); 
router.get('/client_homeScreen',controller.client_homeScreen); 
router.get('/get_token',verify1,controller.get_token); 
router.get('/categories',controller.getCategories)
router.get('/filterstype',controller.filterstype)
router.post('/addservice',verify1,controller.addservice)
router.get('/only_experts',controller.only_experts)
router.get('/select_senior_advance',controller.select_senior_advance)
router.get('/find_stylist',controller.find_stylist)
router.post('/ratings',verify1,controller.ratings)
router.get('/get_rating',verify1,controller.get_rating)
router.get('/InYourArea',verify1,controller.InYourArea)

module.exports = router;


const db = require('../models/index');
const SIGNUP = db.users;
const serviceRatingView = db.serviceRatingView;
const CUSTOM_SERVICES = db.custom_services;
const resp = require('../helper/response');
const USER_PREFERENCES = db.users_preferences
const CUSTOMERS = db.customers;
const CUSTOMERS_ADDRESS = db.customer_adresses;
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const RATINGS = db.rating_reviews
require("dotenv").config();

exports.signUp = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await SIGNUP.findOne({ where: { mobile_number: reqBody.mobile_number } });
        console.log(req.body.mobile_number);
        if (findUser) {
            return resp.failedResponseWithMsg(res, "OLD_USER_TRY_LOGIN_IN");
        };
        let genrateOtp = Math.floor(Math.random() * 90000) + 10000;
        const data = {
            mobile_number: reqBody.mobile_number,
            otp: genrateOtp
        };
        // return resp.successResponse(res,"successfull",)
        const addUser = await SIGNUP.create(data);
        return resp.successResponse(res, "SIGNUP_Successfull", addUser);
    }
    catch (error) {
        console.log(error);
        return resp.failedResponse(res, error.message);

    };
};

exports.Otpverify = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await SIGNUP.findOne({ where: { mobile_number: req.body.mobile_number } });
        if (!findUser) { return resp.failedResponseWithMsg(res, "USER_NOT_FOUND"); }
        else if (reqBody.otp == findUser.otp) {
            await SIGNUP.update({ otp: null }, { where: { id: findUser.id } });
            const token = jwt.sign({ id: findUser.id }, process.env.key);

            return resp.successResponse(res, "USER_VERIFIED", token);
        }
        else {
            return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
        };
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

exports.userDetails = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await SIGNUP.findOne({ where: { mobile_number: req.currentUser.mobile_number } });
        console.log(findUser);
        // console.log((findUser?.confirm_acc_status ?? 0) == 5);
        if (!findUser || (findUser?.confirm_acc_status ?? 0) == 5) { return resp.failedResponseWithMsg(res, (findUser?.confirm_acc_status ?? 0) != 5 ? "USER_NOT_FOUND" : "User profile completed..."); }
        let payloadObj = {};
        if (req.body.stage == 1 && findUser.confirm_acc_status == 0) {
            payloadObj = {
                full_name: reqBody.full_name,
                email: reqBody.email,
                password: reqBody.password,
                gender: reqBody.gender,
                dob: reqBody.dob,
                service_category: reqBody.service_category,
                specialization: req.body.specialization,
                experience: req.body.experience
            };
        }
        else if (req.body.stage == 2 && findUser.confirm_acc_status == 1) {
            payloadObj = {
                address_1: req.body.address_1,
                address_2: req.body.address_2,
                city: req.body.city,
                state: req.body.state,
                zip_code: req.body.zip_code,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            };
        }
        else if (req.body.stage == 3 && findUser.confirm_acc_status == 2) {
            payloadObj = {
                ssn_number: req.body.ssn_number,
                cosmetology_license: req.body.cosmetology_license,
                driving_license: req.body.driving_license,
                profile_pic: req.body.profile_pic,
            };
        } else if (req.body.stage != 5 || findUser.confirm_acc_status != 3) {
            return resp.failedResponseWithMsg(res, "please enter the vaild stage");
        };
        payloadObj.confirm_acc_status = req.body.stage;
        await SIGNUP.update(payloadObj, { where: { mobile_number: req.body.mobile_number } });
        return resp.successResponse(res, "ADDED_SUCCESSFULLY");
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

///////////////////////////////////////////RECHECK(UPDATE)///////////////////////////////////////////////////

exports.recheck = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await SIGNUP.findOne({ where: { mobile_number: req.body.mobile_number } })
    } catch (error) {

    }
}

/////////////////////////////////////////show applications////////////////////////////////////////////////////


exports.showApplications = async (req, res) => {
    try {
        const reqBody = req.body;
        const findApplications = await SIGNUP.findAll({
            where: { confirm_acc_status: 5, admin_confirmation: 1 },
            order: [
                ['createdAt', 'desc']
            ]
        });
        if (!findApplications) { return resp.failedResponseWithMsg(res, "NO_PENDING_APPLICATIONS") };
        return resp.successResponse(res, "SUCCESS", findApplications);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    };
};

/////////////////////////////////////////admin response////////////////////////////////////////////////////

exports.applicationResponse = async (req, res) => {
    try {
        const findApplications = await SIGNUP.findAll({
            where: { mobile_number: req.query.mobile_number, confirm_acc_status: 1 },
            order: [
                ['createdAt', 'desc']
            ]
        });
        if (!findApplications) { return resp.failedResponseWithMsg(res, "NO_PENDING_APPLICATIONS") };
        const response = await SIGNUP.update({ admin_confirmation: req.query.admin_confirmation }, { where: { mobile_number: req.query.mobile_number, confirm_acc_status: 1 } })

        return resp.successResponse(res, "SUCCESS", [findApplications, response]);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    };
};

/////////////////////////////////////////after resp/////////////////////////////////////////////////////\

exports.showResponse = async (req, res) => {
    try {
        const findUser = await SIGNUP.findOne({ where: { mobile_number: req.query.mobile_number, confirm_acc_status: 1 } })
        if (!findUser) { return resp.failedResponseWithMsg(res, "CAN'T_FIND_USER") }
        else if (findUser.admin_confirmation == 1) { return resp.successResponse(res, "PENDING.....") }
        else if (findUser.admin_confirmation == 2) { return resp.successResponse(res, "YOUR_APPPLICATION_IS_ACCPTED") }
        else if (findUser.admin_confirmation == 3) { return resp.failedResponseWithMsg(res, "YOUR_APPLICATION_IS_REJECTED") }
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

//////////////////////////////////////////////PROFILE PERSONALIZATION///////////////////////////////////////////////

exports.profile_personalization = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await SIGNUP.findOne({ where: { id: req.currentUser.id, admin_confirmation: 2 } });
        if (!findUser) { return resp.failedResponseWithMsg(res, "USER_NOT_FOUND"); };
        const payload = {
            barber_id: req.currentUser.id,
            about_me: reqBody.about_me,
            languages: reqBody.languages,
            skills: reqBody.skills,
            stylist_type: reqBody.stylist_type,
            available_for: reqBody.available_for,
            images: reqBody.images,
            videos: reqBody.videos,
            work_radius: reqBody.work_radius,
            type: reqBody.type
        };
        const data = await USER_PREFERENCES.create(payload)
        return resp.successResponse(res, "SUCCESSFULL", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

/////////////////////////////////////customers_profile///////////////////////////////////////////////////


exports.customerSignUp = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await CUSTOMERS.findOne({ where: { mobile_number: reqBody.mobile_number } });
        console.log(req.body.mobile_number);
        if (findUser) {
            return resp.failedResponseWithMsg(res, "OLD_USER_TRY_LOGIN_IN");
        };
        let genrateOtp = Math.floor(Math.random() * 90000) + 10000;
        const data = {
            mobile_number: reqBody.mobile_number,
            otp: genrateOtp
        };
        const addUser = await CUSTOMERS.create(data);
        return resp.successResponse(res, "SIGNUP_Successfull", addUser);
    }
    catch (error) {
        console.log(error);
        return resp.failedResponse(res, error.message);

    };
};

exports.customersOtpverify = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await CUSTOMERS.findOne({ where: { mobile_number: req.body.mobile_number } });
        if (!findUser) { return resp.failedResponseWithMsg(res, "USER_NOT_FOUND"); }
        else if (reqBody.otp == findUser.otp) {
            await CUSTOMERS.update({ otp: null }, { where: { mobile_number: req.body.mobile_number } });
            return resp.successResponse(res, "USER_VERIFIED");
        }
        else {
            return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
        };
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}
///////////////////////////////////////login user/////////////////////////////////////////////////////
exports.userLogin = async (req, res) => {
    try {
        const reqBody = req.body;
        const finduser = await SIGNUP.findOne({ where: { mobile_number: req.body.mobile_number } })
        if (!finduser) { return resp.failedResponseWithMsg(res, 'USER_NOT_FOUND'); }
        else if (finduser) {
            if (reqBody.password == finduser.password) {
                const token = jwt.sign({ id: finduser.id }, process.env.key);
                return resp.successResponse(res, "successfull", token)
            } else {
                return resp.failedResponseWithMsg(res, "PLEASE_A_VALID_PASSWORD")
            }
        }
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}





/////////////////////////////////////login customer///////////////////////////////////////////

exports.customerLogin = async (req, res) => {
    try {
        const reqBody = req.body;
        const finduser = await CUSTOMERS.findOne({ where: { mobile_number: req.body.mobile_number } })
        if (!finduser) { return resp.failedResponseWithMsg(res, 'USER_NOT_FOUND'); }
        else if (finduser) {
            if (reqBody.password == finduser.password) {
                const token = jwt.sign({ id: finduser.id }, process.env.key);
                return resp.successResponse(res, "successfull", token)
            } else {
                return resp.failedResponseWithMsg(res, "PLEASE_A_VALID_PASSWORD")
            }
        }
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

//////////////////////////////////customerdetails//////////////////////////////////////////////////////////
exports.customerDetails = async (req, res) => {
    try {
        const reqBody = req.body;
        const finduser = await CUSTOMERS.findOne({ where: { mobile_number: req.body.mobile_number } })
        if (!finduser) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        }
        const data = await CUSTOMERS.update({
            password: reqBody.password,
            first_name: reqBody.first_name,
            last_name: reqBody.last_name,
            dob: reqBody.dob,
            gender: reqBody.gender,
            email: reqBody.email,
        }, { where: { mobile_number: req.body.mobile_number } })
        return resp.successResponse(res, "SUCCESSFUL", data)
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }

}

/////////////////////////////////////////customer address/////////////////////////////////////////////////

exports.customer_address = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await CUSTOMERS.findOne({ where: { id: req.currentUser.id } })
        if (!findUser) {
            return resp.failedResponseWithMsg(res, 'USER_NOT_FOUND');
        }
        const payload = {
            customer_id: findUser.id,
            address: req.body.address,
            Place_namw: reqBody.Place_namw
        }
        const data = await CUSTOMERS_ADDRESS.create(payload)
        return resp.successResponse(res, "SUCCESSFULL", data)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}


/////////////////////////////////////client Side HOME SCREEN////////////////////////////////////////////////////

exports.client_homeScreen = async (req, res) => {
    try {
        const reqQuery = req.query
        const finduser = await SIGNUP.findOne({ where: { mobile_number: reqQuery.mobile_number }, attributes: ["service_category"] })
        if (!finduser) {
            return resp.failedResponseWithMsg(res, 'USER_NOT_FOUND');
        }
        return resp.successResponse(res, "SUCCESS", finduser)
    } catch (error) {
        return resp.failedResponse(res, error.message);

    }
}

/////////////////////////////////tokken////////////////////////////////
exports.get_token = async (req, res) => {
    try {
        return resp.successResponse(res, "SUCCESS", req.currentUser);
    } catch (err) {
        return resp.failedResponse(res, err.message);
    }
};

///////////////////////////////////get category//////////////////////////////////////////////////////

exports.getCategories = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUsers = await SIGNUP.findAll({ attributes: ["service_category"], include: { model: CUSTOM_SERVICES } },)
        return resp.successResponse(res, "successfull", findUsers);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

////////////////////////////////////add custom services////////////////////////////////////////////////////////////

exports.addservice = async (req, res) => {
    try {
        const reqBody = req.body;
        const finduser = await SIGNUP.findOne({ where: { id: req.currentUser.id } })
        console.log(finduser);
        if (!finduser) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        }
        const payload = {
            barber_id: req.currentUser.id,
            title: reqBody.title,
            description: reqBody.description,
            price: reqBody.price,
            sale_price: reqBody.sale_price,
            images: reqBody.images,
            videos: reqBody.videos,
            available_for: reqBody.available_for
        }
        const data = await CUSTOM_SERVICES.create(payload)
        return resp.successResponse(res, "succesfull", data)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}


/////////////////////////////filter by barber type///////////////////////////////////////////////

exports.filterstype = async (req, res) => {
    try {
        const limit = req.query.limit || 1
        const page = (req.query.page - 1) * limit || 0
        const { count, rows } = await USER_PREFERENCES.findAndCountAll({
            where: {
                active_status: 1,
                stylist_type: req.query.stylist_type
            },
            include: {
                model: CUSTOM_SERVICES,
                attributes: ['title'],
            },
            limit: limit,
            offset: page
        },

        );
        return resp.successResponse(res, "SUCCESSFULL", { rows, count });
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

//////////////////////////////senior and advanceed stylist only////////////////////////////////////

exports.only_experts = async (req, res) => {
    try {
        const { count, rows } = await USER_PREFERENCES.findAndCountAll({ where: { stylist_type: { [Op.in]: [2, 3] } } })
        if (rows.length == 0) {
            return resp.failedResponseWithMsg(res, 'NO_EXPERTS_FOUND');
        }
        return resp.successResponse(res, "SUCCESS", { rows, count })
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}
///////////////////////////senior or advance//////////////////////////////////////////////////////

exports.select_senior_advance = async (req, res) => {
    try {
        const findsenioradvance = await USER_PREFERENCES.findAll({ where: { stylist_type: req.query.stylist_type } })
        if (req.query.stylist_type == "2") {
            return resp.successResponse(res, "SUCCESS", findsenioradvance)
        }
        else if (req.query.stylist_type == "3") {
            return resp.successResponse(res, "SUCCESS", findsenioradvance);
        }
        else {
            return resp.failedResponseWithMsg(res, "INVALID")
        }
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}
/////////////////////////////////find your stylist/////////////////////////////

exports.find_stylist = async (req, res) => {
    try {
        const find_stylist = await SIGNUP.findAll({
            where: { full_name: req.query.full_name },
            include: { model: USER_PREFERENCES }
        })
        return resp.successResponse(res, "SUCCESS", find_stylist)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}

///////////////////////////////review rating////////////////////////////////////////

exports.ratings = async (req, res) => {
    try {
        const finduser = await CUSTOMERS.findOne({ where: { id: req.currentUser.id } })
        if (!finduser) { return resp.failedResponseWithMsg(res, "USER_NOT_FOUND") }
        const user = await RATINGS.findOne({ where: { customer_id: req.currentUser.id } });
        if (user) {
            return resp.failedResponseWithMsg(res, "UPDATE_REVIEW_AND RATING")
        }
        else if (!user) {
            const payload = {
                customer_id: req.currentUser.id,
                barber_id: req.body.barber_id,
                comment: req.body.comment,
                rating: req.body.rating,
                service_id: req.body.service_id
            }
            const data = await RATINGS.create(payload)
            return resp.successResponse(res, "SUCESS", data);
        }
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

////////////////////////get reiew ratings/////////////////////////////////////////////

exports.get_rating = async (req, res) => {
    try {
        const findUser = await serviceRatingView.findAll({
            include: { model: RATINGS }
        })

        if (!findUser) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        }
        return resp.successResponse(res, "SUCCESS", findUser)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}


////////////////////////////GET BARBER IN YOUR AREA/////////////////////////////////////////

exports.InYourArea = async (req, res) => {
    try {
        const findCustomer = await CUSTOMERS.findOne({ where: { id: req.currentUser.id } })
        const latitude = findCustomer.latitude;
        const longitude = findCustomer.longitude;
        console.log(latitude, longitude);
        const haversine = `(
            round(6371 * acos(
                cos(radians(${latitude}))
                * cos(radians(latitude))
                * cos(radians(longitude) - radians(${longitude}))
                + sin(radians(${latitude})) * sin(radians(latitude))
                ),2))`;
        const customer = await SIGNUP.findAll({
            attributes: [
                'id',
                'latitude',
                'longitude',
                [db.sequelize.literal(haversine), 'distance'], 'work_radius'
            ],
            order: db.sequelize.col('distance'),
            having: db.sequelize.literal(`distance <= work_radius`),
        });
        return resp.successResponse(res, "SUCCESS", customer);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}


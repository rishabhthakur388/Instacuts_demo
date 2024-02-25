const db = require('../models/index');
const BARBER = db.users;
const WEEKS = db.weeks;
const DAYS = db.days;
const TIME = db.time_slotts;
const SCHEDULE = db.schedule;
const resp = require('../helper/response');
const serviceRatingView = db.serviceRatingView;
const CUSTOM_SERVICES = db.custom_services;
const USER_PREFERENCES = db.users_preferences
const CUSTOMERS_ADDRESS = db.customer_adresses;
const CUSTOMERS = db.customers;
const RATINGS = db.rating_reviews
require("dotenv").config();


exports.weeks = async (req, res) => {
    try {
        const findUser = await BARBER.findOne({ where: { id: req.currentUser.id } });
        if (!findUser) { return resp.failedResponseWithMsg(res, 'USER_NOT_FOUND'); }
        const payload = {
            barber_id: req.currentUser.id,
            week_one: req.body.week_one,
            week_two: req.body.week_two,
            week_three: req.body.week_three,
            week_four: req.body.week_four
        }
        const data = await WEEKS.create(payload);
        return resp.successResponse(res, "SUCCESS", data)
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

exports.days = async (req, res) => {
    try {
        const findUser = await BARBER.findOne({ where: { id: req.currentUser.id } });
        if (!findUser) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        };
        const payload = {
            barber_id: req.currentUser.id,
            monday: req.body.monday,
            tuesday: req.body.tuesday,
            wednesday: req.body.wednesday,
            thursday: req.body.thursday,
            friday: req.body.friday,
            saturday: req.body.saturday,
            sunday: req.body.sunday
        };
        const data = await DAYS.create(payload);
        return resp.successResponse(res, "SUCCESS", data);
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }

};


exports.time_slotts = async (req, res) => {
    try {
        const findUser = await BARBER.findOne({ where: { id: req.currentUser.id } })
        if (!findUser) { return resp.failedResponseWithMsg(res, 'USER_NOT_FOUND') };
        const payload = {
            barber_id: req.currentUser.id,
            week_id: req.body.week_id,
            day_id: req.body.day_id,
            time_from: req.body.time_from,
            time_to: req.body.time_to,
        }
        const data = await TIME.create(payload);
        return resp.successResponse(res, "SUCCESS", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}


exports.schedule = async (req, res) => {
    try {
        const findUser = await BARBER.findOne({ where: { id: req.currentUser.id } });
        if (!findUser) { return resp.failedResponseWithMsg(res, "USER_NOT_FOUND") };
        c
        const data = {
            barber_id: req.currentUser.id,
            service_id: req.body.service_id,
            week_id: req.body.week_id,
            day_id: req.body.day_id,
            time_id: req.body.time_id,
            availability: req.body.availability,
            customer_id: req.body.customer_id,
        }
        const payload = await SCHEDULE.create(data);
        return resp.successResponse(res, "SUCCESS", payload);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}


exports.get_schedule = async (req, res) => {
    try {
        const findBarber = await BARBER.findAll({
            include: [
                {
                    model: SCHEDULE,
                    include: [
                        { model: WEEKS },
                        { model: DAYS },
                        { model: TIME }
                    ]
                },

            ]
        })
        return resp.successResponse(res, "SUCCESS", findBarber);
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}


///////////////////////////////////time booking barber///////////////////////////////////////////

exports.timeslots = async (req, res) => {
    try {
        console.log("========");
        // const finduser = await BARBER.findA();
        // if (!finduser) { return resp.failedResponseWithMsg(res, "user_not_found"); }
        const findschedual = await BARBER.findAll({
            include: [
                { model: SCHEDULE, },

                { model: TIME,}

            ],
        })
        return resp.successResponse(res, "SUCCESSfull", findschedual);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.times = async (req, res) => {
    try {
        const finduser = await TIME.findAll();
        const findschedual = await BARBER.findAll({
            include: {
                model: SCHEDULE, include: [
                    { model: TIME }
                ]
            },
        })
        return resp.successResponse(res, "SUCCESSfull", finduser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

////////////////////////////customer booking///////////////////////////////////////////////////////////

exports.book_service = async (req, res) => {
    try {
        const findUser = await SCHEDULE.findAll({
            include: { model: TIME }
        });
        return resp.successResponse(res, "SUCCESS", findUser)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}

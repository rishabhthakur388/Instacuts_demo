const jwt = require("jsonwebtoken");
const { customers } = require("../models/index");
const resp = require('../helper/response');
const { users } = require("../models/index");

exports.verify = async (req, res, next) => {
    const jwtSecretKey = process.env.key;
    try {
        if (!req.headers.authorization) {
            return resp.failedResponseWithMsg(res, "unauthorized");
        }
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, jwtSecretKey);
        const verified = await customers.findOne({ where: { id: verify.id } });
        if (!verified) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        };
        req.currentUser = verified;
        next();
    } catch (error) {
        return resp.failedResponseWithMsg(res, error.message);
    };
};
exports.verify1 = async (req, res, next) => {
    const jwtSecretKey = process.env.key;
    try {
        if (!req.headers.authorization) {
            return resp.failedResponseWithMsg(res, "unauthorized");
        }
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, jwtSecretKey);
        console.log(verify);
        const verified = await users.findOne({ where: { id: verify.id} });
        // console.log(verified);
        if (!verified) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        };
        req.currentUser = verified;
        next();
    } catch (error) {
        return resp.failedResponseWithMsg(res, error.message);
    };
};

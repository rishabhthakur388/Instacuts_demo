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
const RATING = db.rating_reviews
const CART = db.cart;
const ADDRESS = db.address;
const ORDER =  db.order

function generateUniqueCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const uniqueCode = Array.from({ length }, () => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters.charAt(randomIndex);
    }).join('');

    return uniqueCode;
};

//////////////////////////////////// CART /////////////////////////////////////////////////////

exports.cart = async (req, res) => {
    try {
        const reqBody = req.body;
        const findCart = await CART.findOne({
            where: { service_id: reqBody.service_id, customer_id: req.currentUser.id, cart_status: 1, quantity: 1 },
            // include: { model: CUSTOM_SERVICES, attributes: ['id', 'custom_services_name', 'image', 'quantity', 'selling_price'] }
        });
        if (findCart) {
            return resp.failedResponseWithMsg(res, 'ITEM_ALLREADY_EXISTS');
        };
 
        const payload = {
            customer_id: req.currentUser.id,
            service_id: reqBody.service_id,
            quantity: reqBody.quantity,
            cart_status: reqBody.cart_status,
        }
        const data = await CART.create(payload);
        return resp.successResponse(res, "SUCCESS", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

///////////////////////// edit ITEM ///////////////////////////////////////////////////////////
exports.editCart = async (req, res) => {
    try {
        const reqBody = req.body;
        const findItem = await CART.findAll({
            where: { service_id: reqBody.service_id, customer_id: req.currentUser.id, cart_status: 1 }
        });
        if (!findItem) {
            return resp.failedResponseWithMsg(res, "ITEM_NOT_FOUND")
        };
        const update = await CART.update({ quantity: req.body.quantity }, { where: { service_id: reqBody.service_id, customer_id: req.currentUser.id, cart_status: 1 } });
        if (reqBody.quantity == 0) {
            await CART.destroy({ where: { service_id: req.body.service_id } })
        }
        return resp.successResponse(res, "success", update);
    } catch (error) {
        return resp.failedResponseWithMsg(res, "ITEM_NOT_FOUND");
    }
};

/////////////////////////////////////  Delivery OTP //////////////////////////////////////////

exports.Verifydelivery = async (req, res) => {
    try {
        const reqBody = req.body;
        const OTP = Math.floor(Math.random() * 90000) + 10000;

        const data = await CUSTOMERS.update({
            otp_for_delivery: OTP
        }, { where: { id: req.currentUser.id } });
        return resp.successResponse(res, "SUCCESS", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

exports.verify_delivery_otp = async (req, res) => {
    try {
        const reqBody = req.body
        const finduser = await CUSTOMERS.findOne({ where: { id: req.currentUser.id } });
        console.log(finduser.otp_for_delivery)
        console.log(reqBody.otp)
        if (req.body.otp == finduser.otp_for_delivery) {
            await CUSTOMERS.update({ otp_for_delivery: 0 }, { where: { id: req.currentUser.id } });
            await CUSTOMERS.update({ is_verify_delivery: 1 }, { where: { id: req.currentUser.id } });

            return resp.successResponse(res, "USER_VERIFIED");
        } else {
            return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
        };
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

/////////////////////////////////////////// SHOW CART //////////////////////////////////////////

exports.showCart = async (req, res) => {
    try {
        const getCart = await CART.findAll({
            attributes: [
                'id',
                'quantity',
                'customer_id',
                'cart_status',
                [db.sequelize.literal('sale_price * cart.quantity'), 'sub_total_price'],
                'createdAt',
                'updatedAt'
            ],
            include: [{ model: CUSTOM_SERVICES, attributes: ['sale_price', 'title', 'id'] }],
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            raw: true
        });

        let discount = 5;
        let tax_and_charges = 20;
        let delivery_charges = 5; 
        const sub_total = await CART.findAll({
            attributes: [
                [db.sequelize.literal(' sum(custom_services.sale_price * cart.quantity)'), 'sub_total'],
                [db.sequelize.literal(':discount'), 'discount'],
                [db.sequelize.literal(':tax_and_charges'), 'tax_and_charges'],
                [db.sequelize.literal(':delivery_charges'), 'delivery_charges'],
                [db.sequelize.literal('sum(custom_services.sale_price * cart.quantity) - (sum(custom_services.sale_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price']
            ],
            include: [{ model:CUSTOM_SERVICES, attributes: [] }],
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            raw: true,
            replacements: { discount, tax_and_charges, delivery_charges },
        });
        const showBill = { Cart: getCart, prices: sub_total };
        return resp.successResponse(res, "successfully", showBill);
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

/////////////////////////////////////address/////////////////////////////////////////////////

exports.add_address = async (req, res) => {
    try {
        const reqBody = req.body;
        //  const user_verify = await CUSTOMERS.findOne({ where: { id: req.currentUser.id} })
        // if(user_verify.is_verify_delivery = 0 ){
        //     return resp.failedResponseWithMsg(res,'USER_NOT_VERIFIED')
        // }
        const findUser = await ADDRESS.findOne({ where: { customer_id: req.currentUser.id, address_line1: reqBody.address_line1 } })
        if (findUser) {
            return resp.failedResponseWithMsg(res, "ADDRESS_ALREADY_ADDED")
        }
        const payload = {
            name: reqBody.name,
            customer_id: req.currentUser.id,
            service_id: reqBody.service_id,
            address_line1: reqBody.address_line1,
            address_line2: reqBody.address_line2,
            landmark: reqBody.landmark,
            town_city: reqBody.town_city,
            state: reqBody.state,
            country: reqBody.country,
            pincode: reqBody.pincode,
        }
        const data = await ADDRESS.create(payload)
        return resp.successResponse(res, "SUCCESS", data)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

////////////////////////////////////////////////CUSTOM_SERVICES_details////////////////////////////////////////

exports.CUSTOM_SERVICES_details = async (req, res) => {
    try {
        const reqQuery = req.query;
        const findcustom_services = await CUSTOM_SERVICES.findAll({
            where: { sellers_id: reqQuery.sellers_id, custom_services_name: reqQuery.custom_services_name },
            include: [{ model: CATEGORY, attributes: ['id', 'category_name'] }]
        })
        if (findcustom_services.length == 0) {
            return resp.failedResponseWithMsg(res, "custom_services_NOT_FOUND")
        }
        return resp.successResponse(res, "SUCCESS", findcustom_services)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

//////////////////////////////////////////////////checkOut///////////////////////////////////////////////////////
exports.checkout = async (req, res) => {
    try {
        const findUser = await CART.findOne({ where: { customer_id: req.currentUser.id, cart_status: 1 } })
        if (findUser.cart_status == 2) {
            return resp.failedResponse(res, "NO_ITEM_FOUND");
        }
        let discount = 2;
        let tax_and_charges = 20;
        let delivery_charges = 5;
        const sub_total = await CART.findAll({
            attributes: [
                [db.sequelize.literal(' sum(custom_services.sale_price * cart.quantity)'), 'sub_total'],
                [db.sequelize.literal(':discount'), 'discount'],
                [db.sequelize.literal(':tax_and_charges'), 'tax_and_charges'],
                [db.sequelize.literal(':delivery_charges'), 'delivery_charges'],
                [db.sequelize.literal('sum(custom_services.sale_price * cart.quantity) - (sum(custom_services.sale_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price']
            ],
            include: [{
                model: CUSTOM_SERVICES,
                attributes: []
            }],

            raw: true,
            replacements: { discount, tax_and_charges, delivery_charges },
        });
        const showBill = {
            prices: sub_total,
        };
        return resp.successResponse(res, "SUCCESS", showBill);

    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

///////////////////////////////////////////////////////ORDER////////////////////////////////////////////////////

exports.order = async (req, res) => {
    const reqBody = req.body;
    const discount = 5;
    const tax_and_charges = 20;
    const delivery_charges = 15;
    try {
        const cart_items = await CART.findAll({
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            attributes: [
                'id',
                'quantity',
                'customer_id',
                'service_id',
                'cart_status',
                [db.sequelize.literal('sale_price * cart.quantity'), 'sub_total'],
                [db.sequelize.literal('(custom_services.sale_price * cart.quantity) - ((custom_services.sale_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price'],
                // [db.sequelize.literal('custom_services.sellers_id'), 'sellers_id']
            ],
            include: [{ model: CUSTOM_SERVICES, attributes: ['sale_price', 'id','barber_id'] }],
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            replacements: { discount, tax_and_charges, delivery_charges },
            raw: true
        });
        console.log(cart_items)
        const display_price = await CART.findAll({
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            attributes: [
                [db.sequelize.literal('sum(custom_services.sale_price * cart.quantity)'), 'sub_total'],
                [db.sequelize.literal(':discount'), 'discount'],
                [db.sequelize.literal(':tax_and_charges'), 'tax_and_charges'],
                [db.sequelize.literal(':delivery_charges'), 'delivery_charges'],
                [db.sequelize.literal('sum(custom_services.sale_price * cart.quantity) - (sum(custom_services.sale_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price']
            ],
            include: [{
                model: CUSTOM_SERVICES,
                attributes: [],
            }],
            raw: true,
            replacements: { discount, tax_and_charges, delivery_charges },
        });
        if (cart_items.length == 0) return resp.failedResponseWithMsg(res, "CART_IS_EMPTY");
        // const showBill = [cart_items, display_price]
        let customer_order_id = generateUniqueCode(6);
        // return
        const bulk_order = await cart_items.map(doc => {
            console.log(doc['custom_services.barber_id']);
            let { service_id, quantity, customer_id, sub_total, total_price } = doc
            return {
                delevery_type: reqBody.delevery_type,
                payment_type: reqBody.payment_type,
                contact_number: reqBody.contact_number,
                address_id: reqBody.address_id,
                delevery_type: reqBody.delevery_type,
                customer_order_id: customer_order_id,
                service_id,
                quantity,
                customer_id,
                sub_total,
                discount,
                tax_and_charges,
                delivery_charges,
                total_price,
                sellers_id:doc['custom_services.barber_id']
            }
        });
        const bulkdata = await ORDER.bulkCreate(bulk_order)
        console.log(bulkdata)
        if (bulk_order.length == 0) return resp.failedResponse(res, "order couldn't place");
        await CART.update({ cart_status: 2 }, { where: { customer_id: req.currentUser.id, cart_status: 1 } });
        return resp.successResponse(res, 'SUCCESS_ORDER_PLACED', [bulkdata,display_price])
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

///////////////////////////////////////////SHOW ORDER/////////////////////////////////////////////////

exports.show_order = async (req, res) => {
    try {
        const findOrder = await ORDER.findAll({ where: { customer_id: req.currentUser.id } })
        if (!findOrder) {
            return resp.failedResponseWithMsg(res, 'CANNOT_FIND_YOUR_ORDER');
        }
        return resp.successResponse(res, 'SUCCESS', findOrder)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }

};

/////////////////////////////////////Product_details////////////////////////////////////////
exports.CUSTOM_SERVICES_details = async (req, res) => {
    try {
        const reqQuery = req.query;
        const findProduct = await CUSTOM_SERVICES.findAll({
            // where: { sellers_id: reqQuery.sellers_id, product_name: reqQuery.product_name },
            include: [{ model: RATING, attributes: ['id', 'customer_id','rating','barber_id','comment'] }, { model: SCHEDULE }]
        })
    
        if (findProduct.length == 0) {
            return resp.failedResponseWithMsg(res, "PRODUCT_NOT_FOUND")
        }
        return resp.successResponse(res, "SUCCESS", findProduct)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

///////////////////////////////////////////////order STATUS////////////////////////////////////////////

exports.cancel_order = async (req, res) => {
    try {
        const findOrder = await ORDER.update({ order_status: req.body.order_status }, { where: { customer_id: req.currentUser.id, order_Cid: req.body.order_Cid, order_status: 1 } })
        if (!findOrder) {
            return resp.failedResponseWithMsg(res, "ORDER_NOTFOUND")
        }
        return resp.successResponse(res, "SUCCES", findOrder);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

/////////////////////////////account status/////////////////////////////////////////////////

exports.account = async (req, res) => {
    try {
        const findUser = await CUSTOMERS.findOne({
            where: { id: req.currentUser.id },
            attributes: ['first_name', 'last_name', 'mobile_number'],
            include: { model: ORDER, attributes: ['id', 'createdAt', 'order_status'] , include:{model:ADDRESS}},
        });
        return resp.successResponse(res, "success", findUser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    };
};

/////////////////////////////////////SHOW ORDERS LIST SERVICE PROVIDER//////////////////////

exports.service_provider_orderlists = async (req, res) => {
    try {
        const finduser = await ORDER.findAll({
            where: { sellers_id: req.currentUser.id },
            attributes: ['id', 'quantity', 'order_Cid', 'total_price', 'order_status'],
            include: [
                {
                    model: CUSTOM_SERVICES,
                    attributes: ['id', 'custom_services_name', 'sellers_id'],
                    where: { sellers_id: req.currentUser.id },
                },
                {
                    model: ADDRESS,
                },
            ],
            order: [
                ['createdAt', 'desc']
            ]
        });
        console.log(finduser);
        if (!finduser) { return resp.failedResponseWithMsg(res, 'NOT_FOUND'); };
        return resp.successResponse(res, "SUCCESS", finduser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

// ////////////////////////////SERVICE PROVIDER RESPONSE ///////////////////////////////////

exports.service_provider_response = async (req, res) => {
    try {
        const finduser = await ORDER.findAll({
            where: { sellers_id: req.currentUser.id, order_Cid: req.query.order_Cid, id: req.query.id },
            attributes: ['id', 'quantity', 'order_Cid', 'total_price', 'order_status', 'delivery_charges', 'sub_total'],
            include: [
                {
                    model: CUSTOM_SERVICES,
                    attributes: ['id', 'custom_services_name', 'sellers_id'],
                    where: { sellers_id: req.currentUser.id },
                },
                {
                    model: ADDRESS,
                }],
            order: [['createdAt', 'desc']]
        });
        if (!finduser) {
            return resp.failedResponseWithMsg(res, 'NOT_FOUND');
        };
      const response =  await ORDER.update({ order_status: req.query.order_status }, { where: { sellers_id: req.currentUser.id, order_status: "1" } });
        return resp.successResponse(res, "SUCCESS", [response,finduser]);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};
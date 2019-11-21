var express = require("express");
var router = express.Router();

var config = require('../../config')
var Offer = require('../../models/offer');
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var cron = require('node-cron');
var MailType = require('../../models/mail_content');
var DisplayMessage = require('../../models/display_messages');

var offer_helper = require('../../helpers/offer_helper');

var logger = config.logger;
var moment = require("moment")
var User = require('../../models/user');
var Candidate = require('../../models/candidate-detail');




router.put('/login_first_status', async (req, res) => {
    var obj = {
        'is_login_first': true
    }
    var candidate_upadate = await common_helper.update(User, { "_id": req.body.id }, obj)
    if (candidate_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (candidate_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Login first status updated successfully", "data": candidate_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while fetching data." });
    }
})

router.post("/", async (req, res) => {
    var user_id = req.body.id
    var user_resp = await common_helper.findOne(User, { "_id": new ObjectId(user_id) });
    var candidate_resp = await Candidate.aggregate([
        {
            $match: {
                "user_id": new ObjectId(user_id)
            }
        },
        {
            $lookup:
            {
                from: "country_datas",
                localField: "country",
                foreignField: "_id",
                as: "country"
            }
        },
        {
            $unwind: "$country",
            // preserveNullAndEmptyArrays: true
        },
        {
            $lookup:
            {
                from: "document_type",
                localField: "documenttype",
                foreignField: "_id",
                as: "documenttype"
            }
        },

        {
            $unwind: "$documenttype"
        }
    ])

    var obj = {
        firstname: candidate_resp[0].firstname,
        lastname: candidate_resp[0].lastname,
        country: candidate_resp[0].country.country,
        email: user_resp.data.email,
        countrycode: candidate_resp[0].countrycode,
        contactno: candidate_resp[0].contactno,
        documenttype: candidate_resp[0].documenttype.name,
        documentimage: candidate_resp[0].documentimage,
        user_id: candidate_resp[0].user_id
    }

    if (user_resp.status === 1 && candidate_resp) {
        return res.status(config.OK_STATUS).json({ 'message': "Profile Data", "status": 1, data: obj });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Record Found", "status": 0 });
    }
})

router.put('/', async (req, res) => {
    var obj = {}
    if (req.body.firstname && req.body.firstname != "") {
        obj.firstname = req.body.firstname
    }
    if (req.body.lastname && req.body.lastname != "") {
        obj.lastname = req.body.lastname
    }
    if (req.body.email && req.body.email != "") {
        obj.email = req.body.email
    }
    // if (req.body.country && req.body.country != "") {
    //     obj.country = req.body.country
    // }
    if (req.body.contactno && req.body.contactno != "") {
        obj.contactno = req.body.contactno
    }
    if (req.body.firstname && req.body.firstname != "") {
        obj.firstname = req.body.firstname
    }

    var candidate = await common_helper.findOne(User, { "_id": req.body.id }, obj)
    if (candidate.data.email !== req.body.email) {
        obj.email_verified = false
    }

    var sub_account_upadate = await common_helper.update(Candidate, { "user_id": req.body.id }, obj)
    var sub_account_upadate = await common_helper.update(User, { "_id": req.body.id }, obj)

    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        if (candidate.data.email !== sub_account_upadate.data.email) {
            var reset_token = Buffer.from(jwt.sign({ "_id": sub_account_upadate.data._id },
                config.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: 60 * 60 * 24 * 3
            }
            )).toString('base64');

            var time = new Date();
            time.setMinutes(time.getMinutes() + 20);
            time = btoa(time);
            var message = await common_helper.findOne(MailType, { 'mail_type': 'user-update-email' });
            let content = message.data.content;

            logger.trace("sending mail");
            let mail_resp = await mail_helper.send("email_confirmation", {
                "to": sub_account_upadate.data.email,
                "subject": "HireCommit - Email Confirmation"
            }, {
                "msg": content,
                "confirm_url": config.WEBSITE_URL + "confirmation/" + reset_token
            });

            if (mail_resp.status === 0) {
                res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
            } else {
                res.json({ "message": "Email has been changed, Email verification link sent to your mail.", "data": sub_account_upadate })
            }
        } else {
            res.status(config.OK_STATUS).json({ "status": 1, "message": "Profile updated successfully", "data": sub_account_upadate });
        }
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while fetching data." });
    }
})

router.get("/checkStatus/:id", async (req, res) => {
    var user_id = req.params.id;
    var user_resp = await common_helper.findOne(User, { "_id": user_id });
    // console.log(user_resp.data.isAllow);
    var message = await common_helper.findOne(DisplayMessage, { "msg_type": "email_not_verify" })
    // console.log(message);
    if (user_resp.status === 1 && user_resp.data.email_verified === false) {
        return res.status(config.OK_STATUS).json({ 'message': message.data.content, "status": 1 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Email verified.", "status": 0 });
    }
})

module.exports = router;

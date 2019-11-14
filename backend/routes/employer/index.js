var express = require('express');
var router = express.Router();
var config = require('../../config');
var logger = config.logger;
var jwt = require('jsonwebtoken');
var async = require('async');
var fs = require('fs');
var path = require('path');
var common_helper = require('../../helpers/common_helper');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');
const saltRounds = 10;
var mongoose = require('mongoose');
var _ = require('underscore');
var btoa = require('btoa');
var moment = require('moment');

var common_helper = require('../../helpers/common_helper');
var User = require('../../models/user');
var Employer = require('../../models/employer-detail');
var mail_helper = require('../../helpers/mail_helper');




router.put('/', async (req, res) => {
    var obj = {}
    if (req.body.username && req.body.username != "") {
        obj.username = req.body.username
    }
    if (req.body.website && req.body.website != "") {
        obj.website = req.body.website
    }
    if (req.body.companyname && req.body.companyname != "") {
        obj.companyname = req.body.companyname
    }

    if (req.body.businesstype && req.body.businesstype != "") {
        obj.businesstype = req.body.businesstype
    }
    if (req.body.contactno && req.body.contactno != "") {
        obj.contactno = req.body.contactno
    }
    if (req.body.email && req.body.email != "") {
        obj.email = req.body.email
    }

    var employer = await common_helper.findOne(User, { "_id": req.body.id }, obj)
    if (employer.data.email === req.body.email) {
        obj.email_verified = false
    }

    // if (employer.data.email)

    var employer_upadate = await common_helper.update(Employer, { "user_id": req.body.id }, obj)
    var employer_upadate = await common_helper.update(User, { "_id": req.body.id }, obj)

    if (employer_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (employer_upadate.status == 1) {
        if (employer.data.email !== employer_upadate.data.email) {
            console.log(' :  employer_upadate.data._id==> ', employer_upadate.data._id);
            var reset_token = Buffer.from(jwt.sign({ "_id": employer_upadate.data._id },
                config.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: 60 * 60 * 24 * 3
            }
            )).toString('base64');

            var time = new Date();
            time.setMinutes(time.getMinutes() + 20);
            time = btoa(time);

            logger.trace("sending mail");
            let mail_resp = await mail_helper.send("email_confirmation", {
                "to": employer_upadate.data.email,
                "subject": "HireCommit - Email Confirmation"
            }, {
                // config.website_url + "/email_confirm/" + interest_resp.data._id
                "confirm_url": config.WEBSITE_URL + "confirmation/" + reset_token
            });
            console.log('=========>', mail_resp);

            // if (mail_resp.status === 0) {
            //     res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
            // } else {
            //     res.json({ "message": "Email updated successfully", "data": employer_upadate })
            // }
        }
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Profile updated successfully", "data": employer_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while fetching data." });
    }
})


module.exports = router;

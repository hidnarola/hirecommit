var express = require("express");
var router = express.Router();

var config = require('../../config')
var Offer = require('../../models/offer');
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var cron = require('node-cron');

var offer_helper = require('../../helpers/offer_helper');

var logger = config.logger;
var moment = require("moment")
var User = require('../../models/user');
var Candidate = require('../../models/candidate-detail');



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

    var sub_account_upadate = await common_helper.update(Candidate, { "user_id": req.body.id }, obj)
    var sub_account_upadate = await common_helper.update(User, { "_id": req.body.id }, obj)

    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Profile updated successfully", "data": sub_account_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while fetching data." });
    }
})

module.exports = router;

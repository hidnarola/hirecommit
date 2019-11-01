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

var common_helper = require('../../helpers/common_helper');
var User = require('../../models/user');
var Employer = require('../../models/employer-detail');




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

    var sub_account_upadate = await common_helper.update(Employer, { "user_id": req.body.id }, obj)
    var sub_account_upadate = await common_helper.update(User, { "_id": req.body.id }, obj)

    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Profile updated successfully", "data": sub_account_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while featching data." });
    }
})


module.exports = router;

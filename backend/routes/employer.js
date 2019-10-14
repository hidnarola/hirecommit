var express = require("express");
var router = express.Router();
var btoa = require('btoa');

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require('../config')
var index = require('./employer/index');
var offer = require('../models/offer');
var objectID = require('mongoose').Types.ObjectId;
var common_helper = require('../helpers/common_helper');
var user_helper = require('../helpers/user_helper');
var groups_helper = require('../helpers/groups_helper');
var offer_helper = require('../helpers/offer_helper');
var salary_helper = require('../helpers/salary_helper');
var location_helper = require('../helpers/location_helper');

var logger = config.logger;
// var sub_account = require('../models/sub-accounts');
var salary_bracket = require('../models/salary_bracket');
var group = require('../models/group');
var User = require('../models/user');
var Role = require('../models/role');
var jwt = require('jsonwebtoken');
var async = require('async');
var mail_helper = require('./../helpers/mail_helper');
var Sub_Employer_Detail = require('../models/sub-employer-detail');

var sub_account = require('./employer/sub_account');
var customField = require('./employer/customField');
var offer = require('./employer/offer');
var salary_bracket = require('./employer/salary_bracket');
var location = require('./employer/location');
var group = require('./employer/group');

router.use("/sub_account", auth, authorization, sub_account);
router.use("/customField", auth, authorization, customField);
router.use("/offer", auth, authorization, offer);
router.use("/salary_bracket", auth, authorization, salary_bracket);
router.use("/location", auth, authorization, location);
router.use("/group", auth, authorization, group);



module.exports = router;

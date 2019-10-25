var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");


var sub_account = require('./employer/sub_account');
var index = require('./employer/index');

var customField = require('./employer/customField');
var offer = require('./employer/offer');
var salary_bracket = require('./employer/salary_bracket');
var location = require('./employer/location');
var group = require('./employer/group');
var candidate = require('./employer/candidate');

router.use("/", auth, authorization, index);
router.use("/sub_account", auth, authorization, sub_account);
router.use("/customField", auth, authorization, customField);
router.use("/offer", auth, authorization, offer);
router.use("/salary_bracket", auth, authorization, salary_bracket);
router.use("/location", auth, authorization, location);
router.use("/group", auth, authorization, group);
router.use("/candidate", auth, authorization, candidate);



module.exports = router;

var express = require("express");
var router = express.Router();

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require('../config')


var index = require('./employer/index');
// var employer = require('./employer');
var sub_account = require('./employer/sub_account');

router.use("/", auth, authorization, index);
// router.use("/employer", auth, authorization, employer);
router.use("/sub_account", auth, authorization, sub_account);


module.exports = router;
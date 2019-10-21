var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");


var employer = require('./admin/employer');
var candidate = require('./admin/candidate');

router.use("/employer", auth, authorization, employer);
router.use("/candidate", auth, authorization, candidate);




module.exports = router;

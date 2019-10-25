var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");


var index = require('./candidate/index');
var offer = require('./candidate/offer');

router.use("/", auth, authorization, index);
router.use("/offer", auth, authorization, offer);




module.exports = router;

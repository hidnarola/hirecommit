var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");


var offer = require('./candidate/offer');

router.use("/offer", auth, authorization, offer);




module.exports = router;

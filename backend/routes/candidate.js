var express = require("express");
var router = express.Router();

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require('../config')
var offer = require('../models/offer');
var user = require('../models/user');
var objectID = require('mongoose').Types.ObjectId;
var common_helper = require('../helpers/common_helper');
var logger = config.logger;
var employer_detail = require('../models/employer-detail');



// router.use("/candidate", auth, authorization, index);

router.get('/view_offer', async (req, res) => {
    var offer_list = await common_helper.find(offer, {});
    console.log("candidate offer", offer_list);

    if (offer_list.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "offer List", "status": 1, data: offer_list });
    }
    else if (offer_list.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
});

router.get('/offer_detail/:id', async (req, res) => {
    var id = req.params.id;
    console.log(id);

    var offer_detail = await common_helper.findOne(offer, { "_id": id })
    console.log(offer_detail);

    if (offer_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (offer_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "offer fetched successfully", "data": offer_detail });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
});

router.put("/deactive_offer/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    var resp_data = await common_helper.update(offer, { "_id": id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});


router.get('/get_employer/:id', async (req, res) => {
    var id = req.params.id;
    console.log(id);

    var employer_list = await common_helper.findOne(employer_detail, { "user_id": id })
    console.log(employer_list);

    if (employer_list.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (employer_list.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "offer fetched successfully", "data": employer_list });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
})
module.exports = router;
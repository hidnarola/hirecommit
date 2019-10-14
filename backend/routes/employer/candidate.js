var express = require("express");
var router = express.Router();
var btoa = require('btoa');

var auth = require("../../middlewares/auth");
var authorization = require("../../middlewares/authorization");
var config = require('../../config')
var Offer = require('../../models/offer');
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var user_helper = require('../../helpers/user_helper');
var groups_helper = require('../../helpers/groups_helper');
var offer_helper = require('../../helpers/offer_helper');
var salary_helper = require('../../helpers/salary_helper');
var location_helper = require('../../helpers/location_helper');

var logger = config.logger;
var User = require('../../models/user');

var async = require('async');
var mail_helper = require('../../helpers/mail_helper');
var Sub_Employer_Detail = require('../../models/sub-employer-detail');




router.get('/manage_candidate/approved_candidate', async (req, res) => {
    var candidate_list = await candidate.find();
    if (candidate_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: candidate_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }
});

router.get('/manage_candidate/candidate_detail/:id', async (req, res) => {
    var id = req.params.id;
    // console.log(id);

    var candidate_detail = await common_helper.findOne(candidate, { "_id": id })
    // console.log(candidate_detail);

    if (candidate_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (candidate_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
    }
});

router.put("/manage_candidate/deactive_candidate", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(candidate, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while deleting data." });
    }
});

router.put('/manage_candidate/candidate/edit_approved_candidate/:id', async (req, res) => {
    var schema = {
        "firstname": {
            notEmpty: true,
            errorMessage: "Firstname is required"
        },
        "lastname": {
            notEmpty: true,
            errorMessage: "Lastname is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "email is required"
        },
        "countrycode": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "country": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "password": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        countrycode: req.body.countrycode,
        country: req.body.country,
        password: req.body.password,
        contactno: req.body.contactno,
        documenttype: req.body.documenttype,
        documentimage: req.body.documentimage,
        is_del: req.body.is_del

    };
    var id = req.params.id;

    var candidate_upadate = await common_helper.update(candidate, { "_id": id }, reg_obj)

    if (candidate_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (candidate_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 1, "message": "Error while updating data." });
    }
})

//new request
router.get('/manage_candidate/new_request', async (req, res) => {
    var candidate_list = await candidate.find();
    candidate_list = candidate_list.filter(x => x.isAllow === false)
    if (candidate_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: candidate_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }

});

router.get('/manage_candidate/new_request_detail/:id', async (req, res) => {
    var id = req.params.id;
    // console.log(id);

    var candidate_detail = await common_helper.findOne(candidate, { "_id": id })

    // console.log(candidate_detail);

    if (candidate_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (candidate_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
    }
});

router.put('/manage_candidate/new_request_update/:id', async (req, res) => {
    var schema = {
        "firstname": {
            notEmpty: true,
            errorMessage: "Firstname is required"
        },
        "lastname": {
            notEmpty: true,
            errorMessage: "Lastname is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "email is required"
        },
        "countrycode": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "country": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "password": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        countrycode: req.body.countrycode,
        country: req.body.country,
        password: req.body.password,
        contactno: req.body.contactno,
        documenttype: req.body.documenttype,
        documentimage: req.body.documentimage,
    };
    var id = req.params.id;
    // console.log(id);

    var candidate_upadate = await common_helper.update(candidate, { "_id": id }, reg_obj)
    // console.log(candidate_upadate);

    if (candidate_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (candidate_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "Error while updating data." });
    }
});

router.put("/manage_candidate/new_request_deactive", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(candidate, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "Error while deleting data." });
    }
})

module.exports = router;

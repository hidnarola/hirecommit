var express = require("express");
var router = express.Router();
var btoa = require('btoa');

var auth = require("../../middlewares/auth");
var authorization = require("../../middlewares/authorization");
var config = require('../../config')
var offer = require('../../models/offer');
var objectID = require('mongoose').Types.ObjectId;
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



router.post("/add_sub_account", async (req, res) => {
    var schema = {
        "name": {
            notEmpty: true,
            errorMessage: "Name is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {
        var reg_obj = {
            "name": req.body.name,
            "email": req.body.email,
            "adminrights": req.body.adminrights,
            "is_del": false,
            "emp_id": req.userInfo.id
        };
        var interest_resp = await common_helper.insert(User, reg_obj);
        if (interest_resp.status == 0) {
            logger.debug("Error = ", interest_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
        } else {
            res.json({ "message": "Sub-Account Added successfully", "data": interest_resp })
        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.post('/', async (req, res) => {

    var schema = {};
    req.checkBody(schema);
    var errors = req.validationErrors();

    if (!errors) {
        var sortOrderColumnIndex = req.body.order[0].column;
        let sortOrderColumn = sortOrderColumnIndex == 0 ? 'username' : req.body.columns[sortOrderColumnIndex].data;
        let sortOrder = req.body.order[0].dir == 'asc' ? 1 : -1;
        let sortingObject = {
            [sortOrderColumn]: sortOrder
        }
        var aggregate = [
            {
                $match: {
                    "is_del": false
                }
            }
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        aggregate.push({
            "$match":
                { $or: [{ "username": RE }, { "user.email": RE }] }
        });

        let totalMatchingCountRecords = await Sub_Employer_Detail.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await user_helper.get_all_sub_user(Sub_Employer_Detail, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
        if (resp_data.status == 1) {
            res.status(config.OK_STATUS).json(resp_data);
        } else {
            res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
        }
    } else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.put('/:id', async (req, res) => {
    var schema = {
        "name": {
            notEmpty: true,
            errorMessage: "Name is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        "name": req.body.name,
        "email": req.body.email,
        "adminrights": req.body.adminrights,
        "is_del": false,

    };
    var id = req.params.id;
    var sub_account_upadate = await common_helper.update(User, { "_id": id }, reg_obj)
    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": sub_account_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while featching data." });
    }
})

router.put("/deactive_sub_account/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;

    var resp_user_data = await common_helper.update(User, { "_id": id }, obj);
    var resp_Detail_data = await common_helper.update(Sub_Employer_Detail, { "user_id": id }, obj);
    if (resp_user_data.status == 0 && resp_Detail_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_user_data);
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while deleting data." });
    } else if (resp_user_data.status == 1 && resp_Detail_data.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Record deleted successfully." });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "No data found" });
    }
});

router.get('/:id', async (req, res) => {
    var id = req.params.id;
    var sub_account_detail = await common_helper.findOne(User, { "_id": (id) })
    if (sub_account_detail.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": sub_account_detail });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while featching data." });
    }
});

module.exports = router;

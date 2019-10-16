var express = require("express");
var router = express.Router();

var config = require('../../config')
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var user_helper = require('../../helpers/user_helper');


var logger = config.logger;
var User = require('../../models/user');

var async = require('async');
var mail_helper = require('../../helpers/mail_helper');
var Sub_Employer_Detail = require('../../models/sub-employer-detail');



router.post("/", async (req, res) => {
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
            "username": req.body.name,
            "email": req.body.email,
            "admin_rights": req.body.admin_rights,
            "is_del": false,
            "emp_id": req.userInfo.id,

        };

        var interest_resps = await common_helper.insert(User, reg_obj);
        reg_obj.user_id = interest_resps.data._id;
        var interest_resp = await common_helper.insert(Sub_Employer_Detail, reg_obj);

        if (interest_resp.status == 0) {
            logger.debug("Error = ", interest_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
        } else {
            res.status(config.OK_STATUS).json({ "message": "Sub-Account Added successfully", "data": interest_resps })
        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.post('/get', async (req, res) => {

    var schema = {};
    req.checkBody(schema);
    var errors = req.validationErrors();

    if (!errors) {
        var sortOrderColumnIndex = req.body.order[0].column;
        let sortOrderColumn = sortOrderColumnIndex == 0 ? '_id' : req.body.columns[sortOrderColumnIndex].data;
        let sortOrder = req.body.order[0].dir == 'asc' ? 1 : -1;
        let sortingObject = {
            [sortOrderColumn]: sortOrder
        }
        var aggregate = [
            {
                $match: {
                    "is_del": false,
                    "emp_id": new ObjectId(req.userInfo.id)
                }
            }
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        if (req.body.search && req.body.search != "") {
            aggregate.push({
                "$match":
                    { $or: [{ "username": RE }, { "user.email": RE }] }
            });
        }


        let totalMatchingCountRecords = await Sub_Employer_Detail.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;
        console.log('totalMatchingCountRecords', totalMatchingCountRecords);

        var resp_data = await user_helper.get_all_sub_user(Sub_Employer_Detail, req.userInfo.id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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

router.put("/deactive_sub_account", async (req, res) => {

    var obj = {
        is_del: true
    }
    var id = req.body.id;
    var resp_user_data = await common_helper.update(User, { "_id": new ObjectId(id) }, obj);

    var resp_Detail_data = await common_helper.update(Sub_Employer_Detail, { "user_id": new ObjectId(id) }, obj);

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

router.put('/:id', async (req, res) => {

    var reg_obj = {};

    if (req.body.name && req.body.name != "") {
        reg_obj.username = req.body.name;
    }
    if (req.body.email && req.body.email != "") {
        reg_obj.email = req.body.email;
    }
    if (req.body.admin_rights && req.body.admin_rights != "") {
        reg_obj.admin_rights = req.body.admin_rights;
    }
    console.log('req.body.admin_rights', req.body.admin_rights);

    var id = req.params.id;
    var sub_account_upadates = await common_helper.update(User, { "_id": id }, reg_obj)
    console.log('sub_account_upadates===>', sub_account_upadates);

    var sub_account_upadate = await common_helper.update(Sub_Employer_Detail, { "user_id": id }, reg_obj)
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



router.get('/:id', async (req, res) => {
    var id = req.params.id;
    console.log('id', id);

    var sub_account_detail = await Sub_Employer_Detail.findOne({ "_id": new ObjectId(id) }).populate('user_id')
    console.log('sub_account_detail', sub_account_detail);

    // if (sub_account_detail.status == 0) {
    //     res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    // }
    // else if (sub_account_detail.status == 1) {
    res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": sub_account_detail });
    // }
    // else {
    //     res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while featching data." });
    // }
});

module.exports = router;

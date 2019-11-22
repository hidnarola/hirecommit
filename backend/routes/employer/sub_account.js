var express = require("express");
var router = express.Router();

var config = require('../../config')
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var user_helper = require('../../helpers/user_helper');
var MailType = require('../../models/mail_content');


var logger = config.logger;
var User = require('../../models/user');

var async = require('async');
var mail_helper = require('../../helpers/mail_helper');
var Sub_Employer_Detail = require('../../models/sub-employer-detail');
const random_pass_word = require('secure-random-password');


router.post("/", async (req, res) => {
    var schema = {
        "username": {
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
            "username": req.body.username,
            "email": req.body.email,
            "admin_rights": req.body.admin_rights,
            "is_del": false,
            "emp_id": req.userInfo.id,
            "email_verified": true,
            "isAllow": true,
            "role_id": "5d9d99003a0c78039c6dd00f"

        };
        var user_data = await common_helper.findOne(User, { "is_del": false, "email": req.body.email })

        if (user_data.status == 2) {
            var passwords = random_pass_word.randomPassword({ length: 8, characters: random_pass_word.lower + random_pass_word.upper + random_pass_word.digits + random_pass_word.symbols })
            reg_obj.password = passwords
            var interest_resps = await common_helper.insert(User, reg_obj);
            reg_obj.user_id = interest_resps.data._id;
            var interest_resp = await common_helper.insert(Sub_Employer_Detail, reg_obj);

            if (interest_resp.status == 0) {
                logger.debug("Error = ", interest_resp.error);
                res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
            } else {
                var message = await common_helper.findOne(MailType, { 'mail_type': 'sub-employer-created' });
                let content = message.data.content;
                content = content.replace("{sub_emp_name}", `${req.body.username}`);

                let mail_resp = await mail_helper.send("sub_emp", {
                    "to": req.body.email,
                    "subject": "Invited to be Sub employee"
                }, {
                    "msg": content,
                    "email": req.body.email,
                    "password": passwords,
                    "url": config.WEBSITE_URL + '/login'
                });

                res.status(config.OK_STATUS).json({ "message": "Sub Account is Added successfully", "data": interest_resps })
            }
        }
        else {
            res.status(config.BAD_REQUEST).json({ message: "Email already exists" });
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
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occurred while deleting data." });
    } else if (resp_user_data.status == 1 && resp_Detail_data.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Record is Deleted successfully." });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "No data found" });
    }
});


router.put('/', async (req, res) => {
    var reg_obj = {
        "admin_rights": req.body.admin_rights
    }
    var sub_account_upadate = await common_helper.update(User, { "_id": req.body.id }, reg_obj)

    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Sub Employer is Updated successfully", "data": sub_account_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error occurred while fetching data." });
    }
})

router.put('/details', async (req, res) => {
    var obj = {}
    if (req.body.data.admin_rights && req.body.data.admin_rights !== "") {
        obj.admin_rights = req.body.data.admin_rights
    }
    if (req.body.data.email && req.body.data.email !== "") {
        obj.email = req.body.data.email
    }
    var id = req.body.id;
    // var sub_account_upadate = await common_helper.update(Sub_Employer_Detail, { "_id": req.body.id }, obj)
    var resp_user_data = await common_helper.update(User, { "_id": new ObjectId(id) }, obj);

    if (req.body.data.username && req.body.data.username !== "") {
        obj.username = req.body.data.username;
    }

    var resp_Detail_data = await common_helper.update(Sub_Employer_Detail, { "user_id": new ObjectId(id) }, obj);
    if (resp_user_data.status == 0 && resp_Detail_data.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (resp_user_data.status == 1 && resp_Detail_data.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer is Updated successfully", "data": { resp_user_data, resp_Detail_data } });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error occurred while fetching data." });
    }
})


router.get('/:id', async (req, res) => {
    var id = req.params.id;

    var sub_account_detail = await Sub_Employer_Detail.findOne({ "user_id": new ObjectId(id) }).populate('user_id')
    if (sub_account_detail) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": sub_account_detail });
    }
    // if (sub_account_detail.status == 0) {
    //     res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    // }
    // else
    // else {
    //     res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while fetching data." });
    // }
});

module.exports = router;

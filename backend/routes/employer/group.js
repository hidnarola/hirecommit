var express = require("express");
var router = express.Router();
var btoa = require('btoa');

var auth = require("../../middlewares/auth");
var authorization = require("../../middlewares/authorization");
var config = require('../../config')
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var groups_helper = require('../../helpers/groups_helper');
var logger = config.logger;
var group = require('../../models/group');
var GroupDetail = require('../../models/group-detail');




router.get("/groups_list", async (req, res) => {
    var group_list = await common_helper.find(group, { is_del: false });
    if (group_list.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "group List", "status": 1, data: group_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }
})


//groups
router.post("/", async (req, res) => {
    var schema = {
        "name": {
            notEmpty: true,
            errorMessage: "Group Name is required"
        },
        "high_unopened": {
            notEmpty: true,
            errorMessage: "High priority is required"
        },
        "high_notreplied": {
            notEmpty: true,
            errorMessage: "High priority is required"
        },
        "medium_unopened": {
            notEmpty: true,
            errorMessage: "Medium priority is required"
        },
        "medium_notreplied": {
            notEmpty: true,
            errorMessage: "Medium priority is required"
        },
        "low_unopened": {
            notEmpty: true,
            errorMessage: "Low priority is required"
        },
        "low_notreplied": {
            notEmpty: true,
            errorMessage: "Low priority is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {
        var reg_obj = {
            "emp_id": req.userInfo.id,
            "name": req.body.name,
            "high_unopened": req.body.high_unopened,
            "high_notreplied": req.body.high_notreplied,
            "medium_unopened": req.body.medium_unopened,
            "medium_notreplied": req.body.medium_notreplied,
            "low_unopened": req.body.low_unopened,
            "low_notreplied": req.body.medium_notreplied,
            "is_del": false
        };
        var interest_resp = await common_helper.insert(group, reg_obj);
        if (interest_resp.status == 0) {
            logger.debug("Error = ", interest_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
        } else {
            res.json({ "message": "Group Added successfully", "data": interest_resp })
        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.post('/get', async (req, res) => {
    var schema = {

    };
    req.checkBody(schema);
    var errors = req.validationErrors();

    if (!errors) {
        var sortOrderColumnIndex = req.body.order[0].column;
        let sortOrderColumn = sortOrderColumnIndex == 0 ? 'name' : req.body.columns[sortOrderColumnIndex].data;

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
                    { $or: [{ "name": RE }, { "high_unopened": RE }, { "high_notreplied": RE }, { "medium_unopened": RE }, { "medium_notreplied": RE }, { "low_unopened": RE }, { "low_notreplied": RE }] }
            });
        }


        let totalMatchingCountRecords = await group.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;
        // var search={};
        console.log(req.body.search)
        var resp_data = await groups_helper.get_all_groups(group, req.userInfo.id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
        console.log(resp_data);

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

router.post("/add_group_details/:id", async (req, res) => {
    var schema =
        [{
            "communicationname": {
                notEmpty: true,
                errorMessage: "Communication Name is required"
            },
            "trigger": {
                notEmpty: true,
                errorMessage: "Trigger is required"
            },
            "day": {
                notEmpty: true,
                errorMessage: "Days are required"
            },
            "priority": {
                notEmpty: true,
                errorMessage: "Priority is required"
            }
        }];

    req.checkBody(schema);
    var errors = req.validationErrors();
    if (!errors) {
        const reqData = req.body.data;
        const grp_data = {
            group_id: req.params.id,
            communication: reqData
        };
        var response = await common_helper.insert(GroupDetail, grp_data);
        if (response.status === 0) {
            throw new Error('Error occured while inserting data');
        }
        res.status(config.OK_STATUS).json(response);
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.get('/:id', async (req, res) => {
    var group_detail = await common_helper.find(group, { _id: ObjectId(req.params.id) });
    if (group_detail.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Group detail fetched successfully", "status": 1, data: group_detail });
    }
    else if (group_detail.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
});

router.get('/group_communication_detail/:id', async (req, res) => {
    var group_detail = await common_helper.find(GroupDetail, { group_id: ObjectId(req.params.id) });
    console.log("group detail", group_detail);

    if (group_detail.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Group detail fetched successfully", "status": 1, data: group_detail });
    }
    else if (group_detail.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
});

router.put("/deactivate_group/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    var resp_group_data = await common_helper.update(group, { "_id": id }, obj);
    console.log(resp_group_data.status);

    var resp_groupdetail_data = await common_helper.update(GroupDetail, { "group_id": id }, obj);
    console.log(resp_groupdetail_data.status);

    if (resp_group_data.status == 0 || resp_groupdetail_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_group_data);
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while featching data.", "data": resp_group_data });
    }
    else if (resp_group_data.status == 1 || resp_groupdetail_data.status == 1) {
        logger.trace("User got successfully = ", resp_groupdetail_data);
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Record Deleted Sucessfully", resp_group_data });
    }
    else if (resp_group_data.status == 2 || resp_groupdetail_data.status == 2) {
        logger.trace("User got successfully = ", resp_group_dataresp_group_data);
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "No Data Found." });
    }
});


// router.get("/groups_list", async (req, res) => {
//     var group_list = await common_helper.find(group, { is_del: false });
//     if (group_list.status === 1) {
//         return res.status(config.OK_STATUS).json({ 'message': "group List", "status": 1, data: group_list });
//     }
//     else {
//         return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
//     }
// })

module.exports = router;

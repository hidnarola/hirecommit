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
var Offer = require('../../models/offer');

var User = require('../../models/user');



router.get("/groups_list", async (req, res) => {
    var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

    if (user && user.status == 1 && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
        var user_id = user.data.emp_id
    }
    else {
        var user_id = req.userInfo.id
    }
    var group_list = await common_helper.find(group, { is_del: false, "emp_id": new ObjectId(user_id) });
    if (group_list.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "group List", "status": 1, data: group_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Record Found", "status": 0 });
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
        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        if (user && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {

            var reg_obj = {
                "emp_id": user.data.emp_id,
                "name": req.body.name,
                "high_unopened": req.body.high_unopened,
                "high_notreplied": req.body.high_notreplied,
                "medium_unopened": req.body.medium_unopened,
                "medium_notreplied": req.body.medium_notreplied,
                "low_unopened": req.body.low_unopened,
                "low_notreplied": req.body.medium_notreplied,
                "start": req.body.start,
                "end": req.body.end
            };
        }
        else {
            var reg_obj = {
                "emp_id": req.userInfo.id,
                "name": req.body.name.toLowerCase(),
                "high_unopened": req.body.high_unopened,
                "high_notreplied": req.body.high_notreplied,
                "medium_unopened": req.body.medium_unopened,
                "medium_notreplied": req.body.medium_notreplied,
                "low_unopened": req.body.low_unopened,
                "low_notreplied": req.body.medium_notreplied,
                "start": req.body.start,
                "end": req.body.end

            };
        }

        var group_resp = await common_helper.findOne(group, { "is_del": false, "emp_id": req.userInfo.id, "name": req.body.name.toLowerCase() });
        if (group_resp.status == 2) {
            var interest_resp = await common_helper.insert(group, reg_obj);
            if (interest_resp.status == 0) {
                logger.debug("Error = ", interest_resp.error);
                res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
            } else {
                res.json({ "message": "Group is Added successfully", "data": interest_resp })
            }
        }
        else {
            res.status(config.BAD_REQUEST).json({ message: "Group already exists" });
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
        let sortOrderColumn = sortOrderColumnIndex == 0 ? '_id' : req.body.columns[sortOrderColumnIndex].data;

        let sortOrder = req.body.order[0].dir == 'asc' ? 1 : -1;
        let sortingObject = {
            [sortOrderColumn]: sortOrder
        }
        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        if (user.status == 1 && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
            var user_id = user.data.emp_id
        }
        else {
            var user_id = req.userInfo.id
        }


        var aggregate = [
            {
                $match:
                    { $or: [{ "emp_id": new ObjectId(req.userInfo.id) }, { "emp_id": new ObjectId(user.data.emp_id) }], "is_del": false }

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
        var resp_data = await groups_helper.get_all_groups(group, user_id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);

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

router.put('/', async (req, res) => {
    var obj = {
    };

    if (req.body.name && req.body.name != "") {
        obj.name = req.body.name
    }
    if (req.body.high_unopened && req.body.high_unopened != "") {
        obj.high_unopened = req.body.high_unopened
    }
    if (req.body.high_notreplied && req.body.high_notreplied != "") {
        obj.high_notreplied = req.body.high_notreplied
    }
    if (req.body.medium_unopened && req.body.medium_unopened != "") {
        obj.medium_unopened = req.body.medium_unopened
    }
    if (req.body.medium_notreplied && req.body.medium_notreplied != "") {
        obj.medium_notreplied = req.body.medium_notreplied
    }
    if (req.body.low_unopened && req.body.low_unopened != "") {
        obj.low_unopened = req.body.low_unopened
    }
    if (req.body.low_notreplied && req.body.low_notreplied != "") {
        obj.low_notreplied = req.body.low_notreplied
    }
    var id = req.body.id;

    var group_upadate = await common_helper.update(group, { "_id": new ObjectId(id) }, obj)

    const reqData = req.body.data;

    const grp_data = {
        group_id: req.body.id,
        communication: JSON.parse(reqData)
    };
    var find_communication = await common_helper.findOne(GroupDetail, { "group_id": req.body.id })
    if (find_communication.status == 1) {
        var response = await common_helper.update(GroupDetail, { "group_id": req.body.id }, grp_data);
    }
    else {
        var response = await common_helper.insert(GroupDetail, grp_data);
    }


    if (group_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (group_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Group is Updated successfully", "data": group_upadate, "communication": response });
    }

})


router.post("/communication/:id", async (req, res) => {
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

router.put("/communication/:id", async (req, res) => {
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
        var response = await common_helper.update(GroupDetail, { "group_id": req.params.id }, grp_data);
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

router.get('/communication_detail/:id', async (req, res) => {
    var group_detail = await common_helper.find(GroupDetail, { "communication.is_del": false, group_id: new ObjectId(req.params.id) });

    if (group_detail.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Group details are fetched successfully", "status": 1, data: group_detail });
    }
    else if (group_detail.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error occurred while fetching", "status": 0 });
    }
});

router.get('/:id', async (req, res) => {
    var group_detail = await common_helper.find(group, { _id: ObjectId(req.params.id) });
    if (group_detail.status === 1) {
        var group_details = await common_helper.find(GroupDetail, { "communication.is_del": false, group_id: new ObjectId(req.params.id) });

        return res.status(config.OK_STATUS).json({ 'message': "Group details are fetched successfully", "status": 1, data: group_detail, communication: group_details });
    }
    else if (group_detail.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Record Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error occurred while fetching", "status": 0 });
    }
});

router.put('/', async (req, res) => {
    var obj = {
    };

    if (req.body.name && req.body.name != "") {
        obj.name = req.body.name
    }
    if (req.body.high_unopened && req.body.high_unopened != "") {
        obj.high_unopened = req.body.high_unopened
    }
    if (req.body.high_notreplied && req.body.high_notreplied != "") {
        obj.high_notreplied = req.body.high_notreplied
    }
    if (req.body.medium_unopened && req.body.medium_unopened != "") {
        obj.medium_unopened = req.body.medium_unopened
    }
    if (req.body.medium_unopened && req.body.medium_unopened != "") {
        obj.medium_unopened = req.body.medium_unopened
    }
    if (req.body.low_unopened && req.body.low_unopened != "") {
        obj.low_unopened = req.body.low_unopened
    }
    if (req.body.low_notreplied && req.body.low_notreplied != "") {
        obj.low_notreplied = req.body.low_notreplied
    }
    var id = req.body.id;

    var group_upadate = await common_helper.update(group, { "_id": new ObjectId(id) }, obj)

    if (group_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (group_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Group is Updated successfully", "data": group_upadate });
    }

})


router.put("/deactivate_group/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;

    var resp_data = await Offer.find({ 'groups': new ObjectId(id) });
    if (resp_data && resp_data.length > 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "This group can't be deleted because it is used in offer." });
    } else {
        var resp_group_data = await common_helper.update(group, { "_id": id }, obj);
        var resp_groupdetail_data = await common_helper.update(GroupDetail, { "group_id": id }, obj);

        if (resp_group_data.status == 0 || resp_groupdetail_data.status == 0) {
            logger.error("Error occured while fetching User = ", resp_group_data);
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occurred while fetching data.", "data": resp_group_data });
        }
        else if (resp_group_data.status == 1 || resp_groupdetail_data.status == 1) {
            logger.trace("User got successfully = ", resp_groupdetail_data);
            res.status(config.OK_STATUS).json({ "status": 1, "message": "Record is Deleted Successfully", resp_group_data });
        }
        else if (resp_group_data.status == 2 || resp_groupdetail_data.status == 2) {
            logger.trace("User got successfully = ", resp_group_data);
            res.status(config.BAD_REQUEST).json({ "status": 2, "message": "No Data Found." });
        }
    }
});

router.put("/deactivate_communication/:id", async (req, res) => {
    var obj = {

    }
    var id = req.params.id;

    var resp_group_data = await common_helper.GroupDetail(GroupDetail, { "communication._id": new ObjectId(id) }, { "communication.is_del": true });

    // if (resp_group_data.status == 0) {
    //     logger.error("Error occured while fetching User = ", resp_group_data);
    //     res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while fetching data.", "data": resp_group_data });
    // }
    // else if (resp_group_data.status == 1) {
    logger.trace("User got successfully = ", resp_group_data);
    res.status(config.OK_STATUS).json({ "status": 1, "message": "Record is Deleted Successfully", resp_group_data });
    // }
    // else if (resp_group_data.status == 2) {
    //     logger.trace("User got successfully = ", resp_group_data);
    //     res.status(config.BAD_REQUEST).json({ "status": 2, "message": "No Data Found." });
    // }
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

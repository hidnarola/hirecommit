var express = require("express");
var router = express.Router();
var config = require('../../config')
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var custom_helper = require('../../helpers/custom_helper');


var logger = config.logger;
var CustomField = require('../../models/customfield');
var User = require('../../models/user');


router.post("/", async (req, res) => {
    var schema = {
        "key": {
            notEmpty: true,
            errorMessage: "Key is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {

        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        const country = await CustomField.findOne({ "is_del": false, "emp_id": req.userInfo.id }).sort({ "createdAt": -1 }).lean();
        if (country && country.serial_number) {
            var serial_number = country.serial_number + 1
        }
        if (user && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {
            var obj = {
                "emp_id": user.data.emp_id,
                "key": req.body.key,
                "serial_number": serial_number
            };
        }
        else {
            var obj = {
                "emp_id": req.userInfo.id,
                "key": req.body.key.toLowerCase(),
                "serial_number": serial_number
            };

        }
        var CustomeField_resp = await common_helper.findOne(CustomField, { "emp_id": req.userInfo.id, "key": req.body.key });
        if (CustomeField_resp.status == 2) {
            var interest_resp = await common_helper.insert(CustomField, obj);
            if (interest_resp.status == 0) {
                logger.debug("Error = ", interest_resp.error);
                res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
            }
        }
        else {
            res.status(config.BAD_REQUEST).json({ message: "Custome Field already exists" });
        }

    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});


router.put("/", async (req, res) => {
    var obj = {
    };
    if (req.body.key && req.body.key != "") {
        obj.key = req.body.key
    }
    var interest_resp = await common_helper.update(CustomField, { "_id": req.body.id }, obj);
    if (interest_resp.status == 0) {
        logger.debug("Error = ", interest_resp.error);
        res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
    } else {
        res.json({ "message": "Custom Field Updated successfully", "data": interest_resp })
    }


});


router.post("/get", async (req, res) => {
    user_id = req.userInfo.id;
    //var totalMatchingCountRecords = await common_helper.count(CustomField, { "emp_id": new ObjectId(req.userInfo.id), "is_del": false });
    var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
    if (user && user.status == 1 && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
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
                { $or: [{ "key": RE }] }

        });
    }
    let totalMatchingCountRecords = await CustomField.aggregate(aggregate);
    totalMatchingCountRecords = totalMatchingCountRecords.length


    var sortOrderColumnIndex = req.body.order[0].column;
    let sortOrderColumn = sortOrderColumnIndex == 0 ? '_id' : req.body.columns[sortOrderColumnIndex].data; // column name
    let sortOrder = req.body.order[0].dir == 'asc' ? 1 : -1;
    let sortingObject = {
        [sortOrderColumn]: sortOrder
    }

    var resp_data = await custom_helper.get_all_custom_field(CustomField, user_id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
    if (resp_data.status == 0) {
        logger.error("Error occurred while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    }
    else if (resp_data.status == 2) {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
    else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});


router.get("/", async (req, res) => {
    user_id = req.userInfo.id
    var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

    var resp_data = await common_helper.find(CustomField, { $or: [{ "emp_id": new ObjectId(req.userInfo.id) }, { "emp_id": new ObjectId(user.data.emp_id) }], "is_del": false });
    if (resp_data.status == 0) {
        logger.error("Error occurred while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    }
    else if (resp_data.status == 2) {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
    else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});

router.get('/first', async (req, res) => {
    try {
        const country = await CustomField.findOne({ "emp_id": req.userInfo.id }).lean();
        return res.status(config.OK_STATUS).json({
            success: true, message: 'country list fetched successfully.',
            data: country
        });
    } catch (error) {
        return res.status(config.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Error in Fetching country data', data: country
        });
    }
})


router.get("/:id", async (req, res) => {
    var resp_datas = await common_helper.findOnes(CustomField, { "_id": new ObjectId(req.params.id) });
    if (resp_datas && resp_datas.data) {
        if (req.params.id.length != 24) {
            res.status(config.BAD_REQUEST).json({ "message": "Your id must be 24 characters" });
        } else {
            var resp_data = await common_helper.findOne(CustomField, { "emp_id": new ObjectId(req.userInfo.id), "_id": new ObjectId(req.params.id), "is_del": false }, 1);
            if (resp_data.status == 0) {
                logger.error("Error occurred while fetching User = ", resp_data);
                res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
            } else {
                logger.trace("User got successfully = ", resp_data);
                res.status(config.OK_STATUS).json(resp_data);
            }
        }

    } else {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
});


router.put("/delete/:id", async (req, res) => {
    var obj = {
        "is_del": true
    };
    var interest_resp = await common_helper.update(CustomField, { "_id": req.params.id }, obj);
    if (interest_resp.status == 0) {
        logger.debug("Error = ", interest_resp.error);
        res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
    } else {
        res.json({ "message": "Custom Field deleted successfully", "data": interest_resp })
    }
});



module.exports = router;

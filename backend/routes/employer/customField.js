var express = require("express");
var router = express.Router();
var config = require('../../config')
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');


var logger = config.logger;
var CustomField = require('../../models/customfield');


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
        var obj = {
            "emp_id": req.userInfo.id,
            "key": req.body.key,
        };

        var interest_resp = await common_helper.insert(CustomField, obj);
        if (interest_resp.status == 0) {
            logger.debug("Error = ", interest_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
        } else {
            res.json({ "message": "Custom Field Added successfully", "data": interest_resp })
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
    var totalMatchingCountRecords = await common_helper.count(CustomField, { "emp_id": new ObjectId(req.userInfo.id), "is_del": false });
    var sortOrderColumnIndex = req.body.order[0].column;
    let sortOrderColumn = sortOrderColumnIndex == 0 ? '_id' : req.body.columns[sortOrderColumnIndex].data; // column name
    let sortOrder = req.body.order[0].dir == 'asc' ? 1 : -1;
    let sortingObject = {
        [sortOrderColumn]: sortOrder
    }

    var resp_data = await common_helper.findWithFilter(CustomField, { "emp_id": new ObjectId(req.userInfo.id), "is_del": false }, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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

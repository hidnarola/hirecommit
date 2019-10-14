var express = require("express");
var router = express.Router();
var config = require('../../config')
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');

var salary_helper = require('../../helpers/salary_helper');

var logger = config.logger;
var salary_bracket = require('../../models/salary_bracket');


router.post("/", async (req, res) => {
    var schema = {
        "country": {
            notEmpty: true,
            errorMessage: "country is required"
        },
        "from": {
            notEmpty: true,
            errorMessage: "minimum salary is required"
        },
        "to": {
            notEmpty: true,
            errorMessage: "maximum salary is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {
        var reg_obj = {
            "country": req.body.country,
            "currency": req.body.currency,
            "from": req.body.from,
            "to": req.body.to,
            "location": req.body.location
        };
        var interest_resp = await common_helper.insert(salary_bracket, reg_obj);
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

router.post('/get', async (req, res) => {
    var schema = {

    };
    req.checkBody(schema);
    var errors = req.validationErrors();

    if (!errors) {
        var sortOrderColumnIndex = req.body.order[0].column;
        let sortOrderColumn = sortOrderColumnIndex == 0 ? 'country' : req.body.columns[sortOrderColumnIndex].data;
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
                { $or: [{ "country": RE }, { "currency": RE }, { "from": RE }, { "to": RE }] }
        });

        let totalMatchingCountRecords = await salary_bracket.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await salary_helper.get_all_salary_bracket(salary_bracket, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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

router.get('/get_salary_bracket', async (req, res) => {
    var salary_bracket_list = await common_helper.find(salary_bracket, {});

    console.log("salary list", this.salary_bracket_list);

    if (salary_bracket_list.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Salary_bracket List", "status": 1, data: salary_bracket_list });
    }
    else if (salary_bracket_list.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
});


router.put('/', async (req, res) => {
    var obj = {
    };

    if (req.body.country && req.body.country != "") {
        obj.country = req.body.country
    }
    if (req.body.currency && req.body.currency != "") {
        obj.currency = req.body.currency
    }
    if (req.body.from && req.body.from != "") {
        obj.from = req.body.from
    }
    if (req.body.to && req.body.to != "") {
        obj.to = req.body.to
    }
    var id = req.body.id;

    var salary_bracket_upadate = await common_helper.update(salary_bracket, { "_id": new ObjectId(id) }, obj)

    if (salary_bracket_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (salary_bracket_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": salary_bracket_upadate });
    }

})

router.put("/deactive_salary_bracket/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    var resp_data = await common_helper.update(salary_bracket, { "_id": id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});

router.get('/salary_brcaket_detail/:id', async (req, res) => {
    var id = req.params.id;
    // console.log('Edited',id);

    var salary_brcaket_detail = await common_helper.findOne(salary_bracket, { "_id": objectID(id) })
    // console.log("salary detail from backend",salary_brcaket_detail);

    if (salary_brcaket_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (salary_brcaket_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Salary Bracket fetched successfully", "data": salary_brcaket_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
});



module.exports = router;

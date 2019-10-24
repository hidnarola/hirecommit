var express = require("express");
var router = express.Router();
var config = require('../../config')
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var location_helper = require('../../helpers/location_helper');

var logger = config.logger;
var async = require('async');

var location = require('../../models/location');
var Salary = require('../../models/salary_bracket');
var User = require('../../models/user');


//manage Location
router.post("/", async (req, res) => {
    var schema = {
        // "country": {
        //     notEmpty: true,
        //     errorMessage: "Country is required"
        // },
        // "city": {
        //     notEmpty: true,
        //     errorMessage: "City is required"
        // }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {
        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        if (user && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {
            var reg_obj = {
                "emp_id": user.data.emp_id,
                "country": req.body.country,
                "city": req.body.city,
            }
        }
        else {
            var reg_obj = {
                "country": req.body.country,
                "city": req.body.city,
                "emp_id": req.userInfo.id
            };
        }

        var interest_resp = await common_helper.insert(location, reg_obj);
        if (interest_resp.status == 0) {
            logger.debug("Error = ", interest_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
        } else {
            res.json({ "message": "Location Added successfully", "data": interest_resp })
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
        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

        if (user.status == 1 && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {


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
                    { $or: [{ "city": RE }, { "country": RE }] }
            });
        }


        let totalMatchingCountRecords = await location.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await location_helper.get_all_location(location, user_id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);

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


router.get('/get_location', async (req, res) => {
    try {
        var aggregate = [
            {
                $match: {
                    "is_del": false,
                    "emp_id": new ObjectId(req.userInfo.id)
                }
            },
            // {
            //     $lookup:
            //     {
            //         from: "country_datas",
            //         localField: "country",
            //         foreignField: "_id",
            //         as: "country"
            //     }
            // },
            // {
            //     $unwind: "$country",
            // },
            {
                $group: {
                    "_id": "$country.alpha3Code",
                    "country": { $first: "$country.country" },
                    "country_id": { $first: "$country._id" },
                    "id": { $first: "$_id" },
                    "currency": { $first: "$country.currency_code" }
                }
            }
        ];

        const location_list = await location.aggregate(aggregate);

        return res.status(config.OK_STATUS).json({ 'message': "Location List", "status": 1, data: location_list });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
})


router.get('/get_locations', async (req, res) => {
    var location_list = await common_helper.find(location, {
        "emp_id": new ObjectId(req.userInfo.id),
        "is_del": false
    });

    var salary_list = await common_helper.find(Salary, {
        "emp_id": new ObjectId(req.userInfo.id),
        "is_del": false
        // "salary_type": req.body.salary_type
    });
    if (location_list.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Location List", "status": 1, data: location_list, salary: salary_list });
    }
    else if (location_list.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
})


router.put('/', async (req, res) => {
    var schema = {
        "country": {
            notEmpty: true,
            errorMessage: "Country is required"
        },
        "city": {
            notEmpty: true,
            errorMessage: "City is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        "country": req.body.country,
        "city": req.body.city,
        "is_del": false,
    };
    var id = req.body.id;

    var update_location = await common_helper.update(location, { "_id": id }, reg_obj)

    if (update_location.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (update_location.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Location update successfully", "data": update_location });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "No data found" });
    }
})


router.put("/deactivate_location/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    var resp_data = await common_helper.update(location, { "_id": id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        var data = resp_data.data
        res.status(config.OK_STATUS).json({ "message": "Deleted successfully", resp_data });
    }
});


router.get('/:id', async (req, res) => {
    var id = req.params.id;
    var location_detail = await common_helper.findOne(location, { "_id": ObjectId(id) })
    if (location_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (location_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Location fetched successfully", "data": location_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
});




module.exports = router;

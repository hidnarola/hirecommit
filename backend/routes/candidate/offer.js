var express = require("express");
var router = express.Router();

var config = require('../../config')
var Offer = require('../../models/offer');
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var cron = require('node-cron');

var offer_helper = require('../../helpers/offer_helper');

var logger = config.logger;
var moment = require("moment")
var User = require('../../models/user');
var History = require('../../models/offer_history');




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
        if (user.status == 1 && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {
            var user_id = user.data.emp_id
        }
        else {
            var user_id = req.userInfo.id
        }
        var aggregate = [
            { $match: { "user_id": new ObjectId(req.userInfo.id), "is_del": false } },
            {
                $lookup:
                {
                    from: "group",
                    localField: "groups",
                    foreignField: "_id",
                    as: "group"
                }
            },
            {
                $unwind: {
                    path: "$group",
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "user",
                    localField: "employer_id",
                    foreignField: "_id",
                    as: "employer_id"
                }
            },
            {
                $unwind: {
                    path: "$employer_id",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "location",
                    localField: "location",
                    foreignField: "_id",
                    as: "location"
                }
            },
            {
                $unwind: {
                    path: "$location",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "salary_bracket",
                    localField: "salarybracket",
                    foreignField: "_id",
                    as: "salarybracket"
                }
            },
            {
                $unwind: {
                    path: "$salarybracket",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        if (req.body.search && req.body.search.value != '') {
            aggregate.push({
                "$match":
                    { $or: [{ "createdAt": RE }, { "title": RE }, { "salarytype": RE }, { "salarybracket.from": RE }, { "expirydate": RE }, { "joiningdate": RE }, { "status": RE }, { "offertype": RE }, { "group.name": RE }, { "commitstatus": RE }, { "customfeild1": RE }] }
            });
        }
        let totalMatchingCountRecords = await Offer.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await offer_helper.get_candidate_offer(Offer, req.userInfo.id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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



router.get('/details/:id', async (req, res) => {
    var id = req.params.id;
    try {
        const offer_detail = await Offer.findOne({ _id: id })
            .populate([
                { path: 'employer_id' },
                { path: 'salarybracket' },
                { path: 'location' },
                { path: 'groups' },
            ])
            .lean();

        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});


router.put('/', async (req, res) => {
    var reg_obj = {
        "status": "Accepted"
    }

    var sub_account_upadate = await common_helper.update(Offer, { "_id": req.body.id }, reg_obj)
    reg_obj.offer_id = req.body.id
    var interest = await common_helper.insert(History, reg_obj);
    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Offer Accepted", "data": sub_account_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while featching data." });
    }
})

module.exports = router;

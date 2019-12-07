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
var Candidate = require('../../models/candidate-detail');
var History = require('../../models/offer_history');
var Employer = require('../../models/employer-detail');
var Status = require('../../models/status');
var OfferTypeMessage = require('../../models/offer_type_message');

var mail_helper = require('../../helpers/mail_helper');



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
            {
                $match: {
                    "user_id": new ObjectId(req.userInfo.id),
                    "is_del": false,
                    "status": { $ne: 'On Hold' },
                    // "expirydate": { $gte: new Date() }
                }
            },
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
                    preserveNullAndEmptyArrays: true
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
                    from: "employerDetail",
                    localField: "employer_id._id",
                    foreignField: "user_id",
                    as: "employer_id.employer"
                }
            },
            {
                $unwind: {
                    path: "$employer_id.employer",
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
            {
                $lookup:
                {
                    from: "subemployerDetail",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "created_by"
                }
            },
            {
                $unwind: {
                    path: "$created_by",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "created_by.user_id",
                    foreignField: "_id",
                    as: "created_by.user",
                }
            },
            {
                $unwind: {
                    path: "$created_by.user",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        if (req.body.search && req.body.search.value != '') {
            aggregate.push({
                "$match":
                    { $or: [{ "createdAt": RE }, { "title": RE }, { "salarytype": RE }, { "salarybracket.from": RE }, { "expirydate": RE }, { "joiningdate": RE }, { "status": RE }, { "offertype": RE }, { "group.name": RE }, { "commitstatus": RE }, { "customfeild1": RE }, { "candidate.user.email": RE }, { "employer_id.employer.username": RE }, { "created_by.username": RE }] }
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


router.post('/type_message', async (req, res) => {
    // console.log('1', 1);
    // console.log('req.body.type', req.body.type);
    try {
        const message_type = await OfferTypeMessage.findOne({ "type": req.body.type })
        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: message_type });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});



// router.get('/details/:id', async (req, res) => {
//     var id = req.params.id;
//     try {
//         const offer_detail = await Offer.findOne({ _id: id })
//             .populate([
//                 { path: 'employer_id' },
//                 { path: 'salarybracket' },
//                 { path: 'location' },
//                 { path: 'groups' },
//                 { path: 'created_by' },
//                 { path: 'created_by._id' }
//             ])
//             .lean();

//         return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail });
//     } catch (error) {
//         return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
//     }
// });


router.get('/details/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var aggregate = [
            {
                $match: {
                    "_id": ObjectId(id)
                }
            },
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
                    preserveNullAndEmptyArrays: true
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
                    from: "employerDetail",
                    localField: "employer_id._id",
                    foreignField: "user_id",
                    as: "employer_id.employer"
                }
            },
            {
                $unwind: {
                    path: "$employer_id.employer",
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
            {
                $lookup:
                {
                    from: "subemployerDetail",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "created_by"
                }
            },
            {
                $unwind: {
                    path: "$created_by",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "created_by.user_id",
                    foreignField: "_id",
                    as: "created_by.user",
                }
            },
            {
                $unwind: {
                    path: "$created_by.user",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]

        var offre_resp = await Offer.aggregate(aggregate);

        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offre_resp });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.put('/', async (req, res) => {
    var reg_obj = {
        "status": "Accepted",
        "acceptedAt": new Date()
    }
    // console.log(reg_obj);
    var current_date = moment();
    var offer = await common_helper.findOne(Offer, { _id: new ObjectId(req.body.id), "expirydate": { $gte: current_date } })
    if (offer.status == 1) {
        sub_account_upadate = await common_helper.update(Offer, { "_id": req.body.id }, reg_obj)
        reg_obj.offer_id = req.body.id;

        var candidate = await common_helper.findOne(Candidate, { "user_id": req.userInfo.id });
        var candidates = await common_helper.findOne(User, { "_id": req.userInfo.id });
        reg_obj.message = `<span>{candidate}</span> has accepted your offer.`;

        var interest = await common_helper.insert(History, reg_obj);
        if (sub_account_upadate.status == 0) {
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
        }
        else if (sub_account_upadate.status == 1) {
            var offer = await common_helper.findOne(Offer, { _id: new ObjectId(req.body.id) })
            var employee = await common_helper.findOne(User, { _id: new ObjectId(offer.data.employer_id) })
            var status = await common_helper.findOne(Status, { 'status': 'Accepted' });

            let content = status.data.MessageContent;
            content = content.replace('{title}', offer.data.title).replace("{candidate}", candidate.data.firstname + " " + candidate.data.lastname);
            let mail_resp = await mail_helper.send("offer", {
                "to": candidates.data.email,
                "subject": "Offer Accepted"
            }, {
                "msg": "You have accepted offer."
            });


            if (employee.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
                let mail_resp = await mail_helper.send("offer", {
                    "to": employee.data.email,
                    "subject": "Offer Accepted"
                }, {
                    "msg": `${candidate.data.firstname} ${candidate.data.lastname}` + " " + "has accepted offer."
                });
            }
            else if (employee.data.role_id == ("5d9d98a93a0c78039c6dd00d")) {

                let mail_resp = await mail_helper.send("offer", {
                    "to": employee.data.email,
                    "subject": "Offer Accepted"
                }, {
                    "msg": `${candidate.data.firstname} ${candidate.data.lastname}` + " " + "has accepted offer."
                });

                var sub_emp_email = await User.find({ "emp_id": new ObjectId(employee.data._id) })
                if (sub_emp_email.length > 0) {
                    for (const data of sub_emp_email) {

                        let mail_resp = await mail_helper.send("offer", {
                            "to": data.email,
                            "subject": "Offer Accepted"
                        }, {
                            "msg": `${candidate.data.firstname} ${candidate.data.lastname}` + " " + "has accepted offer."
                        });

                    }
                }
            }

            res.status(config.OK_STATUS).json({ "status": 1, "message": "Offer is Accepted", "data": sub_account_upadate });
        }
        else {
            res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error occurred while fetching data." });
        }
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "Offer is out of date" })
    }

})

module.exports = router;

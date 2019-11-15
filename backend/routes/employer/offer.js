var express = require("express");
var router = express.Router();

var config = require('../../config')
var Offer = require('../../models/offer');
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var cron = require('node-cron');

var offer_helper = require('../../helpers/offer_helper');
var mail_helper = require('../../helpers/mail_helper');

var logger = config.logger;
var moment = require("moment")
var User = require('../../models/user');
var CandidateDetail = require("../../models/candidate-detail");
var SubEmployerDetail = require("../../models/sub-employer-detail");
var EmployerDetail = require("../../models/employer-detail");
var Status = require("../../models/status");
var History = require('../../models/offer_history');



//Offer
router.post("/", async (req, res) => {

    var schema = {
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        // "name": {
        //     notEmpty: true,
        //     errorMessage: "Name is required"
        // },
        "title": {
            notEmpty: true,
            errorMessage: "Title is required"
        },
        "salarytype": {
            notEmpty: true,
            errorMessage: "Salary Type is required"
        },
        // "country": {
        //     notEmpty: true,
        //     errorMessage: "Country is required"
        // },
        "location": {
            notEmpty: true,
            errorMessage: "Location is required"
        },
        // "salarybracket": {
        //     notEmpty: true,
        //     errorMessage: "Salary Bracket is required"
        // },
        "expirydate": {
            notEmpty: true,
            errorMessage: "Expiry Date Code is required"
        },
        "joiningdate": {
            notEmpty: true,
            errorMessage: "Joining Date is required"
        },
        "offertype": {
            notEmpty: true,
            errorMessage: "Offer Type  is required"
        },
        // "groups": {
        //     notEmpty: true,
        //     errorMessage: "Group is required"
        // },
        // "commitstatus": {
        //     notEmpty: true,
        //     errorMessage: "Commit Status is required"
        // }
    };
    req.checkBody(schema);
    console.log(req.body);

    var errors = req.validationErrors();
    if (!errors) {

        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        // var candidate = await common_helper.findOne(CandidateDetail,
        //     { user_id: new ObjectId(req.body.email) });

        var employer;
        if (user && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
            employer = await common_helper.findOne(SubEmployerDetail, { emp_id: user.data.emp_id });
            var obj = {
                "employer_id": user.data.emp_id,
                // "user_id": req.body.user_id,
                "email": req.body.email,
                "candidate_name": req.body.candidate_name,
                "title": req.body.title,
                "salarytype": req.body.salarytype,
                "salaryduration": req.body.salaryduration,
                // "country": req.body.country,
                "location": req.body.location,
                "currency_type": req.body.currency_type,
                "salarybracket": req.body.salarybracket,
                "expirydate": req.body.expirydate,
                "joiningdate": req.body.joiningdate,
                //  "status": true,
                "offertype": req.body.offertype,
                "groups": req.body.groups,
                "commitstatus": req.body.commitstatus,
                "customfeild": JSON.parse(req.body.customfeild),
                "notes": req.body.notes,
                "salary_from": req.body.salary_from,
                "salary_to": req.body.salary_to,
                "salary": req.body.salary,
                "communication": JSON.parse(req.body.data),
                "message": `<span>${employer.data.username}</span> has Created this offer for <span>${req.body.candidate_name}</span>`
            }
        }
        else {
            employer = await common_helper.findOne(EmployerDetail, { user_id: req.userInfo.id });
            var obj = {
                "employer_id": req.userInfo.id,
                // "user_id": req.body.user_id,
                "email": req.body.email,
                "candidate_name": req.body.candidate_name,
                "title": req.body.title,
                "salarytype": req.body.salarytype,
                "salaryduration": req.body.salaryduration,
                // "country": req.body.country,
                "location": req.body.location,
                "currency_type": req.body.currency_type,
                "salarybracket": req.body.salarybracket,
                "expirydate": req.body.expirydate,
                "joiningdate": req.body.joiningdate,
                //  "status": true,
                "offertype": req.body.offertype,
                "groups": req.body.groups,
                "commitstatus": req.body.commitstatus,
                "customfeild": JSON.parse(req.body.customfeild),
                "notes": req.body.notes,
                "communication": JSON.parse(req.body.data),
                "salary_from": req.body.salary_from,
                "salary_to": req.body.salary_to,
                "salary": req.body.salary,
                "message": `<span>${employer.data.username}</span> has Created this offer for <span>${req.body.candidate_name}</span>`
            }

        };

        var candidate_user = await common_helper.find(User, { 'email': req.body.email, 'is_del': false });

        if (candidate_user.data.length <= 0) {
            var interest_candidate = await common_helper.insert(User, { 'email': req.body.email, 'role_id': '5d9d98e13a0c78039c6dd00e' });
            obj.user_id = interest_candidate.data._id;
        } else {
            obj.user_id = candidate_user.data[0]._id;
        }
        if (candidate_user.data[0].role_id !== '5d9d98e13a0c78039c6dd00e') {
            res.status(config.BAD_REQUEST).json({ message: "You can not send offer to this user." });
        } else {
            var interest_resp = await common_helper.insert(Offer, obj);

            obj.offer_id = interest_resp.data._id
            var interest = await common_helper.insert(History, obj);
            if (interest_resp.status == 0) {
                logger.debug("Error = ", interest_resp.error);
                res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
            } else {
                var user = await common_helper.findOne(User, { _id: new ObjectId(interest_resp.data.user_id) })
                var status = await common_helper.findOne(Status, { 'status': 'On Hold' });
                let content = status.data.MessageContent;
                content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', interest_resp.data.candidate_name);

                let mail_resp = await mail_helper.send("offer", {
                    "to": interest_resp['data']['email'],
                    "subject": "Offer"
                }, {
                    "msg": content,
                    //"url": "http://192.168.100.23:3000/offer/" + obj.offer_id,
                    "url": "http://localhost:3000/offer/" + obj.offer_id,

                });

                res.json({ "message": "Offer is Added successfully", "data": interest_resp })
            }
        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});


cron.schedule('00 00 * * *', async (req, res) => {
    var resp_data = await Offer.aggregate(
        [
            {
                $lookup:
                {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "candidate"
                }
            },
            {
                $unwind: {
                    path: "$candidate",
                    // preserveNullAndEmptyArrays: true
                },
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
                },
            },
            {
                $lookup:
                {
                    from: "group_detail",
                    localField: "group._id",
                    foreignField: "group_id",
                    as: "communication"
                }
            },
            {
                $unwind: {
                    path: "$communication",
                    preserveNullAndEmptyArrays: true
                },
            }
        ]
    )

    var current_date = moment().format("YYYY-MM-DD")

    for (const resp of resp_data) {
        for (const comm of resp.communication.communication) {
            if (comm.trigger == "afterOffer") {
                // console.log('====>', comm.trigger);
                var offer_date = moment(resp.createdAt).add(1, 'day')
                // console.log('offer_date1 ==> ', moment(offer_date).format());
                offer_date = moment(offer_date).format("YYYY-MM-DD")
                // console.log('offer_date ==> ', offer_date, current_date);
                // console.log('------->', (moment(current_date).isSame(offer_date) == ));

                var message = comm.message;
                var email = resp.candidate.email


                if (moment(current_date).isSame(offer_date) == true) {
                    console.log('hiii', email, message);
                    logger.trace("sending mail");
                    let mail_resp = await mail_helper.send("offer", {
                        "to": email,
                        "subject": "Offer Letter"
                    }, {

                        "msg": message
                    });
                }

            }

            if (comm.trigger == "beforeJoining") {
                var offer_date = moment(resp.joiningdate).subtract(2, 'day')
                offer_date = moment(offer_date).format("YYYY-MM-DD")

                var message = comm.message;
                var email = resp.candidate.email

                if (moment(current_date).isSame(offer_date) == true) {
                    let mail_resp = await mail_helper.send("offer", {
                        "to": resp.candidate.email,
                        "subject": "Before Joining"
                    }, {

                        "msg": message
                    });

                }
            }

            if (comm.trigger == "afterJoining") {
                var offer_date = moment(resp.joiningdate).add(2, 'day')
                offer_date = moment(offer_date).format("YYYY-MM-DD")

                var message = comm.message;
                var email = resp.candidate.email
                if (moment(current_date).isSame(offer_date) == true) {
                    let mail_resp = await mail_helper.send("offer", {
                        "to": email,
                        "subject": "After Joining"
                    }, {

                        "msg": message
                    });
                }

            }
            if (comm.trigger == "beforeExpiry") {
                var offer_date = moment(resp.expirydate).subtract(2, 'day')
                offer_date = moment(offer_date).format("YYYY-MM-DD")

                var message = comm.message;
                var email = resp.candidate.email
                if (moment(current_date).isSame(offer_date) == true) {
                    let mail_resp = await mail_helper.send("offer", {
                        "to": email,
                        "subject": "Before Expiry"
                    }, {

                        "msg": message
                    });
                }

            }
            if (comm.trigger == "afterExpiry") {
                var offer_date = moment(resp.expirydate).add(2, 'day')
                offer_date = moment(offer_date).format("YYYY-MM-DD")

                var message = comm.message;
                var email = resp.candidate.email
                if (moment(current_date).isSame(offer_date) == true) {
                    let mail_resp = await mail_helper.send("offer", {
                        "to": email,
                        "subject": "After Expiry"
                    }, {

                        "msg": message
                    });
                }

            }


        }

    }

    // res.status(config.OK_STATUS).json({ "mesage": "mail sent for before joining", resp_data });
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
            { $match: { $or: [{ "employer_id": new ObjectId(req.userInfo.id) }, { "employer_id": new ObjectId(user_id) }], "is_del": false } },
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

        var resp_data = await offer_helper.get_all_offer(Offer, user_id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);

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


router.put("/status_change", async (req, res) => {
    var id = req.body.id
    var obj = {
        "status": req.body.status,
    }

    var resp_data = await Offer.aggregate(
        [
            {
                $match: {
                    "_id": new ObjectId(id)
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
                },
            },
            {
                $lookup:
                {
                    from: "group_detail",
                    localField: "groups._id",
                    foreignField: "group_id",
                    as: "communication"
                }
            },
            {
                $unwind: {
                    path: "$communication",
                    preserveNullAndEmptyArrays: true
                },
            }
        ]
    )
    var obj = {};
    if (resp_data[0].status == "On Hold") {
        obj.status = "Released"
    }
    if (resp_data[0].status == "Released") {
        obj.status = "Inactive"
    }
    if (resp_data[0].status == "Accepted") {
        obj.status = "Not Joined"
    }

    obj.offer_id = req.body.id
    var interest = await common_helper.insert(History, obj);

    var update_status = await common_helper.update(Offer, { "_id": req.body.id }, obj)
    res.status(config.OK_STATUS).json({ "message": "Status is changed successfully", "status": obj.status });

});



router.put("/deactive_offer/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    var resp_data = await common_helper.update(Offer, { "_id": id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json({ "message": "Offer is Updated successfully", resp_data });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error occurred while fetching data." });
    }
});


router.put('/', async (req, res) => {
    var obj = {};

    console.log('Update : body ==> ', req.body);
    // if (req.body.email && req.body.email != "") {
    //     obj.email = req.body.email
    // }
    if (req.body.groups && req.body.groups != "") {
        obj.groups = req.body.groups
    }
    // if (req.body.candidate_name && req.body.candidate_name != "") {
    //     obj.candidate_name = req.body.candidate_name
    // }
    if (req.body.title && req.body.title != "") {
        obj.title = req.body.title
    }
    if (req.body.salarytype && req.body.salarytype != "") {
        obj.salarytype = req.body.salarytype
    }

    if (req.body.salaryduration && req.body.salaryduration != "") {
        obj.salaryduration = req.body.salaryduration
    }
    if (req.body.country && req.body.country != "") {
        obj.country = req.body.country
    }
    if (req.body.location && req.body.location != "") {
        obj.location = req.body.location
    }
    if (req.body.currenct_type && req.body.currenct_type != "") {
        obj.currenct_type = req.body.currenct_type
    }
    if (req.body.salarybracket && req.body.salarybracket != "") {
        obj.salarybracket = req.body.salarybracket
    }
    if (req.body.expirydate && req.body.expirydate != "") {
        obj.expirydate = req.body.expirydate
    }
    if (req.body.joiningdate && req.body.joiningdate != "") {
        obj.joiningdate = req.body.joiningdate
    }
    if (req.body.offertype && req.body.offertype != "") {
        obj.offertype = req.body.offertype
    }
    if (req.body.group && req.body.group != "") {
        obj.group = req.body.group
    }
    if (req.body.status && req.body.status != "") {
        obj.status = req.body.status
    }
    if (req.body.notes && req.body.notes != "") {
        obj.notes = req.body.notes
    }
    // if (req.body.commitstatus && req.body.commitstatus != "") {
    //     obj.commitstatus = req.body.commitstatus
    // }
    if (req.body.salary && req.body.salary != "") {
        obj.salary = req.body.salary
    }
    if (req.body.salary_from && req.body.salary_from != "") {
        obj.salary_from = req.body.salary_from
    }
    if (req.body.salary_to && req.body.salary_to != "") {
        obj.salary_to = req.body.salary_to
    }

    if (req.body.customfeild && req.body.customfeild != "") {
        obj.customfeild = JSON.parse(req.body.customfeild)
    }
    if (req.body.data && req.body.data != "") {
        obj.communication = JSON.parse(req.body.data)
    }

    if (req.body.is_active && req.body.is_active != "") {
        obj.is_active = JSON.parse(req.body.is_active)
    }

    var id = req.body.id;

    var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
    //candidate
    // var candidate = await common_helper.findOne(CandidateDetail,
    //     { user_id: new ObjectId(req.body.user_id) });

    if (user && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
        employer = await common_helper.findOne(SubEmployerDetail, { emp_id: user.data.emp_id });
    } else {
        employer = await common_helper.findOne(EmployerDetail, { user_id: req.userInfo.id });
    }

    var offer = await common_helper.findOne(Offer, { "_id": ObjectId(id) }, obj);
    var offer_upadate = await common_helper.update(Offer, { "_id": ObjectId(id) }, obj)
    console.log('Update : offer_upadate ==> ', offer_upadate);
    obj.offer_id = offer_upadate.data._id;
    obj.status = offer_upadate.data.status;

    if (offer.data.status !== req.body.status) {
        obj.message = `<span>${employer.data.username}</span> has ${req.body.status} this offer for <span>${offer_upadate.data.candidate_name}</span>`
        var interest = await common_helper.insert(History, obj);
    }

    if (offer_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (offer_upadate.status == 1) {
        if (offer.data.status !== offer_upadate.data.status) {


            // var user = await common_helper.findOne(User, { _id: new ObjectId(req.body.user_id) })
            var status = await common_helper.findOne(Status, { 'status': offer_upadate.data.status });

            let content = status.data.MessageContent;
            content = content.replace("{employer}", `${employer.data.username}`).replace('{title}', offer_upadate.data.title).replace("{candidate}", offer_upadate.data.candidate_name);

            console.log(offer_upadate.data.email);

            let mail_resp = await mail_helper.send("offer", {
                "to": offer_upadate.data.email,
                "subject": "Change Status of offer."
            }, {
                "msg": content,
                "url": ""
            });
        }
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Offer is Updated successfully", "data": offer_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error occurred while fetching data." });
    }
})

router.get('/details/:id', async (req, res) => {
    var id = req.params.id;
    try {
        const offer_detail = await Offer.findOne({ _id: id })
            .populate([
                { path: 'employer_id' },
                { path: 'salarybracket' },
                { path: 'location' },
                { path: 'user_id' },
                { path: 'group' },
            ])
            .lean();

        var candidate_detail = await common_helper.findOne(CandidateDetail, { 'user_id': offer_detail.user_id._id });
        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail, 'candidate_data': candidate_detail });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});


router.get('/history/:id', async (req, res) => {
    var id = req.params.id;
    try {
        // var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

        // if (user && user.status == 1 && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {
        //     var user_id = user.data.emp_id
        // }
        // else {
        //     var user_id = req.userInfo.id
        // }
        var history_data = await History.aggregate([
            {
                $match: {
                    "offer_id": new ObjectId(id)
                }
            },
            {
                $lookup:
                {
                    from: "offer",
                    localField: "offer_id",
                    foreignField: "_id",
                    as: "offer"
                }
            },

            {
                $unwind: "$offer",
                // preserveNullAndEmptyArrays: true
            },
            {
                $lookup:
                {
                    from: "employerDetail",
                    localField: "offer.employer_id",
                    foreignField: "user_id",
                    as: "employer"
                }
            },

            {
                $unwind: "$employer"
            },
            // {
            //     $lookup:
            //     {
            //         from: "candidateDetail",
            //         localField: "offer.user_id",
            //         foreignField: "user_id",
            //         as: "candidate"
            //     }
            // },

            // {
            //     $unwind: {
            //         path: "$candidate"
            //     },
            // },
        ])
        console.log("==========>", history_data);


        if (history_data) {
            return res.status(config.OK_STATUS).json({ 'message': "Offer history", "status": 1, data: history_data });
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.get("/status_list/:status", async (req, res) => {
    var status = req.params.status;
    var obj = {};
    if (status === 'On Hold') {
        obj.status = [
            { label: 'On Hold', value: 'On Hold' },
            { label: 'Released', value: 'Released' },
            { label: 'Inactive', value: 'Inactive' }
        ];
    } else if (status === 'Released') {
        obj.status = [
            { label: 'Released', value: 'Released' },
            { label: 'Inactive', value: 'Inactive' }
        ];
    }
    else if (status === 'Accepted') {
        obj.status = [
            { label: 'Accepted', value: 'Accepted' },
            { label: 'Not Joined', value: 'Not Joined' },
            { label: 'Inactive', value: 'Inactive' }
        ];
    } else if (status === 'Not Joined') {
        obj.status = [
            { label: 'Not Joined', value: 'Not Joined' },
            { label: 'Inactive', value: 'Inactive' }
        ];
    } else if (status === 'Inactive') {
        obj.status = [
            { label: 'Inactive', value: 'Inactive' }
        ];
    }
    res.status(config.OK_STATUS).json({ "message": "Status is changed successfully", "status": obj.status });
});

module.exports = router;

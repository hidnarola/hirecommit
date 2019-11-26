var express = require("express");
var router = express.Router();
var config = require('../../config')
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
// var moment = require('moment-timezone');
var mail_helper = require('../../helpers/mail_helper');
var common_helper = require('../../helpers/common_helper');
var candidate_helper = require('../../helpers/candidate_helper');
var user_helper = require('../../helpers/user_helper');
var offer_helper = require('../../helpers/offer_helper');
var Candidate = require('../../models/candidate-detail');
var CustomField = require('../../models/customfield');
var MailType = require('../../models/mail_content');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var btoa = require('btoa');


var logger = config.logger;
var User = require('../../models/user');
var Employer = require('../../models/employer-detail');
var Sub_Employer = require('../../models/sub-employer-detail');
var Sub_Employer_Detail = require('../../models/sub-employer-detail');

var Offer = require('../../models/offer');
var History = require('../../models/offer_history');

router.post('/get_new', async (req, res) => {

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
                }
            },
            {
                $lookup:
                {
                    from: "country_datas",
                    localField: "userDetail.country",
                    foreignField: "_id",
                    as: "country"
                }
            },

            {
                $unwind: {
                    path: "$country",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $lookup:
                {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: { "user.isAllow": false }
            }
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        if (req.body.search && req.body.search != "") {
            aggregate.push({
                "$match":
                    { $or: [{ "contactno": RE }, { "firstname": RE }, { "documenttype": RE }, { "createdAt": RE }, { "status": RE }, { "user.email": RE }] }
            });
        }


        let totalMatchingCountRecords = await Employer.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await user_helper.get_all_new_employer(Employer, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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


router.post('/get_approved', async (req, res) => {

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
                    "is_del": false
                }
            },
            {
                $lookup:
                {
                    from: "country_datas",
                    localField: "userDetail.country",
                    foreignField: "_id",
                    as: "country"
                }
            },

            {
                $unwind: {
                    path: "$country",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $lookup:
                {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: { "user.isAllow": true }
            }
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        if (req.body.search && req.body.search != "") {
            aggregate.push({
                "$match":
                    { $or: [{ "firstname": RE }, { "business.country": RE }, { "user.email": RE }, { "companyname": RE }] }
            });
        }


        let totalMatchingCountRecords = await Employer.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await user_helper.get_all_approved_employer(Employer, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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

router.put("/deactive_candidate/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(Employer, { "_id": req.params.id }, obj);
    var resp_data = await common_helper.update(User, { "user_id": req.params.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while deleting data." });
    }
});

router.put("/deactive_employer/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    // console.log(' : req.params.id ==> ', req.params.id);
    var resp_data = await common_helper.update(Employer, { "user_id": req.params.id }, obj);
    var resp_data = await common_helper.update(User, { "_id": req.params.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json({ "message": "Deleted successfully", resp_data });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while deleting data." });
    }
});



// router.put('/edit_approved_candidate/:id', async (req, res) => {

//     var reg_obj = {
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         // email: req.body.email,
//         countrycode: req.body.countrycode,
//         country: req.body.country,
//         password: req.body.password,
//         contactno: req.body.contactno,
//         documenttype: req.body.documenttype,
//         documentimage: req.body.documentimage,
//         is_del: req.body.is_del
//     };
//     var id = req.params.id;

//     var candidate_upadate = await common_helper.update(Candidate, { "_id": id }, reg_obj)

//     if (candidate_upadate.status == 0) {
//         res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
//     }
//     else if (candidate_upadate.status == 1) {
//         res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
//     }
//     else {
//         res.status(config.BAD_REQUEST).json({ "status": 1, "message": "Error while updating data." });
//     }
// })

// //new request
// router.get('/manage_candidate/new_request', async (req, res) => {
//     var candidate_list = await Candidate.find();
//     candidate_list = candidate_list.filter(x => x.isAllow === false)
//     if (candidate_list) {
//         return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: candidate_list });
//     }
//     else {
//         return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
//     }

// });

// router.get('/manage_candidate/new_request_detail/:id', async (req, res) => {
//     var id = req.params.id;

//     var candidate_detail = await common_helper.findOne(Candidate, { "_id": id })


//     if (candidate_detail.status == 0) {
//         res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
//     }
//     else if (candidate_detail.status == 1) {
//         res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
//     }
//     else {
//         res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while fetching data." });
//     }
// });

// router.put('/manage_candidate/new_request_update/:id', async (req, res) => {
//     var schema = {
//         "firstname": {
//             notEmpty: true,
//             errorMessage: "Firstname is required"
//         },
//         "lastname": {
//             notEmpty: true,
//             errorMessage: "Lastname is required"
//         },
//         "email": {
//             notEmpty: true,
//             errorMessage: "email is required"
//         },
//         "countrycode": {
//             notEmpty: true,
//             errorMessage: "countrycode is required"
//         },
//         "country": {
//             notEmpty: true,
//             errorMessage: "countrycode is required"
//         },
//         "password": {
//             notEmpty: true,
//             errorMessage: "countrycode is required"
//         },
//         "contactno": {
//             notEmpty: true,
//             errorMessage: "countrycode is required"
//         },
//         "contactno": {
//             notEmpty: true,
//             errorMessage: "countrycode is required"
//         }
//     };
//     req.checkBody(schema);
//     var reg_obj = {
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         countrycode: req.body.countrycode,
//         country: req.body.country,
//         password: req.body.password,
//         contactno: req.body.contactno,
//         documenttype: req.body.documenttype,
//         documentimage: req.body.documentimage,
//     };
//     var id = req.params.id;

//     var candidate_upadate = await common_helper.update(Candidate, { "_id": id }, reg_obj)

//     if (candidate_upadate.status == 0) {
//         res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
//     }
//     else if (candidate_upadate.status == 1) {
//         res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
//     }
//     else {
//         res.status(config.BAD_REQUEST).json({ "message": "Error while updating data." });
//     }
// });

// router.put("/manage_candidate/new_request_deactive", async (req, res) => {
//     var obj = {
//         is_del: true
//     }
//     var resp_data = await common_helper.update(Candidate, { "_id": req.body.id }, obj);
//     if (resp_data.status == 0) {
//         logger.error("Error occured while fetching User = ", resp_data);
//         res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
//     } else if (resp_data.status == 1) {
//         logger.trace("User got successfully = ", resp_data);
//         res.status(config.OK_STATUS).json(resp_data);
//     }
//     else {
//         res.status(config.BAD_REQUEST).json({ "message": "Error while deleting data." });
//     }
// })

// offer report
router.post('/get_report/:id', async (req, res) => {
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
        let id = req.params.id;

        var user = await common_helper.findOne(User, { _id: new ObjectId(id) })

        if (user.status == 1 && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
            var user_id = user.data.emp_id
        }
        else {
            var user_id = id
        }
        var aggregate = [
            { $match: { $or: [{ "employer_id": new ObjectId(id) }, { "employer_id": new ObjectId(user_id) }], "is_del": false } },
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
            {
                $lookup:
                {
                    from: "candidateDetail",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "candidate"
                }
            },
            {
                $unwind: {
                    path: "$candidate",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "candidate.user",
                }
            },
            {
                $unwind: {
                    path: "$candidate.user",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        if (req.body.search && req.body.search.value != '') {
            aggregate.push({
                "$match":
                    { $or: [{ "createdAt": RE }, { "title": RE }, { "salarytype": RE }, { "salarybracket.from": RE }, { "expirydate": RE }, { "joiningdate": RE }, { "status": RE }, { "offertype": RE }, { "group.name": RE }, { "commitstatus": RE }, { "customfeild1": RE }] }
            });
        }
        if (req.body.startdate != undefined && req.body.startdate != "" && req.body.enddate != undefined && req.body.enddate != "") {
            // let start_date = moment(req.body.startdate).utc().startOf('day').add(1, 'days');
            // let end_date = moment(req.body.enddate).utc().endOf('day').add(1, 'days');
            let start_date = moment(req.body.startdate).utc().startOf('day');
            let end_date = moment(req.body.enddate).utc().endOf('day');
            // console.log(' : I m here ==> ', 1, moment(start_date).toDate(), moment(end_date).toDate());
            aggregate.push({
                $match: {
                    "createdAt": { $gte: moment(start_date).toDate(), $lte: moment(end_date).toDate() }
                }
            });
        }

        let totalMatchingCountRecords = await Offer.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await offer_helper.get_all_created_offer(Offer, user_id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject, req.body.startdate, req.body.enddate);

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

router.post('/sub_account/get', async (req, res) => {
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
                    "emp_id": new ObjectId(req.body.id)
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

        var resp_data = await user_helper.get_all_sub_user(Sub_Employer_Detail, req.body.id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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


router.get('/customfield/first/:id', async (req, res) => {
    try {
        var id = req.params.id;
        // console.log();

        const country = await CustomField.find({ "emp_id": id, is_del: false }).sort({ serial_number: 1 }).limit(1).lean();
        return res.status(config.OK_STATUS).json({
            success: true, message: 'country list fetched successfully.',
            data: country
        });
    } catch (error) {
        return res.status(config.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Error occurred in Fetching country data', data: error
        });
    }
})

router.get('/history/:id', async (req, res) => {
    var id = req.params.id;
    var message = {};
    history = [];
    try {
        // var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        // console.log(req.params.id);
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
                $unwind: "$offer"
            },
            // {
            //     $lookup:
            //     {
            //         from: "employerDetail",
            //         localField: "offer.employer_id",
            //         foreignField: "user_id",
            //         as: "employer"
            //     }
            // },

            // {
            //     $unwind: "$employer"
            // },
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
            // }
        ])
        // console.log(history_data);


        for (let index = 0; index < history_data.length; index++) {
            const element = history_data[index];
            if (element.employer_id && element.employer_id != undefined) {
                var employer = await common_helper.findOne(Employer, { "user_id": element.employer_id });

                var sub_employer = await common_helper.findOne(Sub_Employer, { "user_id": element.employer_id });

                var candidate = await common_helper.findOne(Candidate, { "user_id": element.offer.user_id });
                var user = await common_helper.findOne(User, { "_id": element.offer.user_id });
                if (employer.status === 1 && candidate.status === 1 && user.status === 1) {
                    var content = element.message;
                    if (candidate.data.firstname !== "" && candidate.data.lastname !== "") {
                        content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
                    } else {
                        content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', user.data.email);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
                    }

                    history.push(message);
                } else if (sub_employer.status === 1 && candidate.status === 1 && user.status === 1) {
                    var content = element.message;
                    if (candidate.data.firstname !== "" && candidate.data.lastname !== "") {
                        content = content.replace("{employer}", `${sub_employer.data.username}`).replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
                    } else {
                        content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', user.data.email);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
                    }

                    history.push(message);
                }
            } else if (element.employer_id == undefined) {
                var candidate = await common_helper.findOne(candidate, { "user_id": element.offer.user_id });
                var user = await common_helper.findOne(User, { "_id": element.offer.user_id });
                if (candidate.status === 1 && user.status === 1) {
                    let content = element.message;
                    if (candidate.data.firstname !== "" && candidate.data.lastname !== "") {
                        content = content.replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
                    } else {
                        content = content.replace('{candidate}', user.data.email);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
                    }
                }

                history.push(message);
            }
        }

        if (history_data) {
            return res.status(config.OK_STATUS).json({ 'message': "Offer history", "status": 1, data: history });
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
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
                { path: 'user_id' },
                { path: 'group' },
            ])
            .lean();
        var candidate_detail = await common_helper.findOne(Candidate, { 'user_id': offer_detail.user_id._id });

        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail, 'candidate_data': candidate_detail });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});


router.get('/sub_account/:id', async (req, res) => {
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

router.get('/:id', async (req, res) => {
    var id = req.params.id;
    var candidate_detail = await Employer.findOne({ "_id": id }).populate("user_id").populate("country").populate("businesstype");
    if (candidate_detail) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while fetching data." });
    }
});

router.get('/', async (req, res) => {

    var aggregate = [
        {
            $match: {
                "is_del": false,
            }
        },
        {
            $lookup:
            {
                from: "country_datas",
                localField: "userDetail.country",
                foreignField: "_id",
                as: "country"
            }
        },

        {
            $unwind: {
                path: "$country",
                preserveNullAndEmptyArrays: true
            },
        },
        {
            $lookup:
            {
                from: "user",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            },
        },
        {
            $match: {
                "user.isAllow": true
            }
        }
    ]
    let candidate_list = await Candidate.aggregate(aggregate);

    if (candidate_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: candidate_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }

});

router.put('/sub_account/details', async (req, res) => {
    var obj = {}
    if (req.body.data.admin_rights && req.body.data.admin_rights !== "") {
        obj.admin_rights = req.body.data.admin_rights
    }
    if (req.body.data.email && req.body.data.email !== "") {
        obj.email = req.body.data.email
    }
    if (req.body.data.username && req.body.data.username !== "") {
        obj.username = req.body.data.username;
    }
    var id = req.body.id;

    var user_detail = await common_helper.findOne(User, { '_id': id });
    var resp_Detail_data = await common_helper.update(Sub_Employer_Detail, { "user_id": new ObjectId(id) }, obj);
    if (user_detail.data.email !== req.body.email) {
        var message = await common_helper.findOne(MailType, { 'mail_type': 'admin-change-email' });
        let content = message.data.content;
        content = content.replace("{old_email}", `${user_detail.data.email}`).replace("{new_email}", `${req.body.data.email}`);
        obj.email_verified = false;
        logger.trace("sending mail");
        let mail_resp = await mail_helper.send("welcome_email", {
            "to": user_detail.data.email,
            "subject": "Attention Mail"
        }, {
            'msg': content
        });
        if (mail_resp.status === 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
        } else {
            var resp_user_data = await common_helper.update(User, { "_id": new ObjectId(id) }, obj);
            var message = await common_helper.findOne(MailType, { 'mail_type': 'email_verification' });
            // console.log("==>", resp_user_data.data.email);

            var reset_token = Buffer.from(jwt.sign({ "_id": resp_user_data.data._id },
                config.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: 60 * 60 * 24 * 3
            }
            )).toString('base64');

            var time = new Date();
            time.setMinutes(time.getMinutes() + 20);
            time = btoa(time);

            let mail_response = await mail_helper.send("email_confirmation", {
                "to": resp_user_data.data.email,
                "subject": "HireCommit - Email Confirmation"
            }, {
                "msg": message.data.content,
                // config.website_url + "/email_confirm/" + interest_resp.data._id
                "confirm_url": config.WEBSITE_URL + "confirmation/" + reset_token
            });
            // console.log("====>", mail_response);

        }
    }

    if (resp_Detail_data.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (resp_Detail_data.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer's record is updated successfully", "data": resp_Detail_data, "user": resp_user_data });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error occurred while fetching data." });
    }
})

router.put('/', async (req, res) => {
    var reg_obj = {
        "isAllow": true
    }
    var sub_account_upadate = await common_helper.update(User, { "_id": req.body.id }, reg_obj)
    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        var message = await common_helper.findOne(MailType, { 'mail_type': 'approve-employer' });
        let content = message.data.content;

        logger.trace("sending mail");
        let mail_resp = await mail_helper.send("employer_approval_email", {
            "to": sub_account_upadate.data.email,
            "subject": "Approved"
        }, {
            "msg": content,
            "confirm_url": config.WEBSITE_URL + '/login'
        });
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer is Approved successfully", "data": sub_account_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error occurred while fetching data." });
    }
})


router.put('/update', async (req, res) => {
    // console.log(req.body); return false;
    var obj = {}
    if (req.body.username && req.body.username != "") {
        obj.username = req.body.username
    }
    if (req.body.email && req.body.email != "") {
        obj.email = req.body.email
    }
    if (req.body.contactno && req.body.contactno != "") {
        obj.contactno = req.body.contactno
    }
    var user_detail = await common_helper.findOne(User, { '_id': req.body.user_id });
    var employer_detail_upadate = await common_helper.update(Employer, { "user_id": req.body.user_id }, obj)
    if (user_detail.data.email !== req.body.email) {
        var message = await common_helper.findOne(MailType, { 'mail_type': 'admin-change-email' });
        let content = message.data.content;
        content = content.replace("{old_email}", `${user_detail.data.email}`).replace('{new_email}', req.body.email);
        obj.email_verified = false;
        logger.trace("sending mail");
        let mail_resp = await mail_helper.send("welcome_email", {
            "to": user_detail.data.email,
            "subject": "Attention Mail"
        }, {
            'msg': content
        });
        if (mail_resp.status === 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
        } else {
            var employer_upadate = await common_helper.update(User, { "_id": req.body.user_id }, obj)
            var reset_token = Buffer.from(jwt.sign({ "_id": employer_upadate.data._id },
                config.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: 60 * 60 * 24 * 3
            }
            )).toString('base64');

            var time = new Date();
            time.setMinutes(time.getMinutes() + 20);
            time = btoa(time);

            let mail_response = await mail_helper.send("email_confirmation", {
                "to": employer_upadate.data.email,
                "subject": "HireCommit - Email Confirmation"
            }, {
                // config.website_url + "/email_confirm/" + interest_resp.data._id
                "confirm_url": config.WEBSITE_URL + "confirmation/" + reset_token
            });
        }
    }

    if (employer_detail_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (employer_detail_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer's record is updated successfully", "data": employer_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error occurred while fetching data." });
    }
})



module.exports = router;

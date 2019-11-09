var express = require("express");
var router = express.Router();
var config = require('../../config')
var ObjectId = require('mongodb').ObjectID;
// var moment = require('moment');
var moment = require('moment-timezone');
var common_helper = require('../../helpers/common_helper');
var candidate_helper = require('../../helpers/candidate_helper');
var user_helper = require('../../helpers/user_helper');
var offer_helper = require('../../helpers/offer_helper');
var Candidate = require('../../models/candidate-detail');
var logger = config.logger;
var User = require('../../models/user');
var Employer = require('../../models/employer-detail');
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
                    { $or: [{ "contactno": RE }, { "firstname": RE }, { "documenttype": RE }, { "createdAt": RE }, { "status": RE }, { "user.email": RE }] }
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

router.put("/deactive_employee/:id", async (req, res) => {
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

router.post('/filter_offers', async (req, res) => {

    let id = req.body.id;

    var user = await common_helper.findOne(User, { _id: new ObjectId(id) })
    if (user.status == 1 && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
        var user_id = user.data.emp_id
    }
    else {
        var user_id = id
    }
    var aggregate = [];
    if (req.body.startdate && req.body.enddate) {
        let start_date = moment(req.body.startdate).utc().startOf('day');
        let end_date = moment(req.body.enddate).utc().endOf('day');
        console.log(' : I m here ==> ', 1, start_date.format(), end_date.format(), moment(start_date).toDate(), moment(end_date).toDate());
        aggregate.push({
            $match: {
                "createdAt": { $gte: moment(start_date).toDate() },
                "createdAt": { $lte: moment(end_date).toDate() }
            }
        });
    }
    aggregate.push(
        {
            $match: {
                $or: [{ "employer_id": new ObjectId(id) }, { "employer_id": new ObjectId(user_id) }],
                "is_del": false,
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
        }
    )

    console.log('final : aggregate ==> ', aggregate);
    let offer = await Offer.aggregate(aggregate);
    // var offer = await common_helper.find(Offer, {
    // createdAt: {
    //     $gte: moment("2019-11-08 09:53:32.271Z").toDate(),
    //     $lte: moment("2019-11-30 09:26:48.207Z").toDate()
    // }
    // })
    // console.log('==============>'), offer;
    res.status(config.OK_STATUS).json(offer);
});


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
        if (req.body.startdate && req.body.enddate) {
            let start_date = moment(req.body.startdate).utc().startOf('day');
            let end_date = moment(req.body.enddate).utc().endOf('day');
            console.log(' : I m here ==> ', 1, start_date.format(), end_date.format(), moment(start_date).toDate(), moment(end_date).toDate());
            console.log("======>", end_date);

            aggregate.push({
                $match: {
                    "createdAt": { $gte: moment(start_date).toDate() },
                    "createdAt": { $lte: moment(end_date).toDate() }
                }
            });
        }

        let totalMatchingCountRecords = await Offer.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await offer_helper.get_all_offer(Offer, user_id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject, req.body.startdate, req.body.enddate);

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

router.get('/history/:id', async (req, res) => {
    var id = req.params.id;
    try {
        // var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        console.log(req.params.id);
        var history_data = await History.aggregate([
            {
                $match: {
                    "offer_id": new ObjectId(id)
                }
            },
            // {
            //     $lookup:
            //     {
            //         from: "offer",
            //         localField: "offer_id",
            //         foreignField: "_id",
            //         as: "offer"
            //     }
            // },

            // {
            //     $unwind: "$offer"
            // },
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
        if (history_data) {
            return res.status(config.OK_STATUS).json({ 'message': "Offer history", "status": 1, data: history_data });
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
                { path: 'group' },
            ])
            .lean();

        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
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




module.exports = router;

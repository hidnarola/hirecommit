var express = require("express");
var router = express.Router();
var config = require('../../config')
var common_helper = require('../../helpers/common_helper');
var candidate_helper = require('../../helpers/candidate_helper');
var user_helper = require('../../helpers/user_helper');
var Candidate = require('../../models/candidate-detail');
var logger = config.logger;
var User = require('../../models/user');
var Employer = require('../../models/employer-detail');



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


router.get('/:id', async (req, res) => {
    var id = req.params.id;
    var candidate_detail = await Employer.findOne({ "_id": id }).populate("user_id").populate("country").populate("businesstype");
    if (candidate_detail) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
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
//         res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
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

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



//Offer
router.post("/", async (req, res) => {

    var schema = {
        // "email": {
        //     notEmpty: true,
        //     errorMessage: "Email is required"
        // },
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
        "country": {
            notEmpty: true,
            errorMessage: "Country is required"
        },
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
        "groups": {
            notEmpty: true,
            errorMessage: "Group is required"
        },
        "commitstatus": {
            notEmpty: true,
            errorMessage: "Commit Status is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {

        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        if (user && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {
            var obj = {
                "employer_id": user.data.emp_id,
                "user_id": req.body.user_id,
                // "name": req.body.name,
                "title": req.body.title,
                "salarytype": req.body.salarytype,
                "salaryduration": req.body.salaryduration,
                "country": req.body.country,
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
                "communication": JSON.parse(req.body.data)
            }
        }
        else {
            var reg_obj = {
                "employer_id": req.userInfo.id,
                "user_id": req.body.user_id,
                // "name": req.body.name,
                "title": req.body.title,
                "salarytype": req.body.salarytype,
                "salaryduration": req.body.salaryduration,
                "country": req.body.country,
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
            }

        };

        var interest_resp = await common_helper.insert(Offer, reg_obj);

        if (interest_resp.status == 0) {
            logger.debug("Error = ", interest_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
        } else {
            res.json({ "message": "Offer Added successfully", "data": interest_resp })
        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});


// cron.schedule('00 00 * * *', async (req, res) => {
//     var resp_data = await Offer.aggregate(
//         [
//             {
//                 $lookup:
//                 {
//                     from: "group",
//                     localField: "groups",
//                     foreignField: "_id",
//                     as: "group"
//                 }
//             },
//             {
//                 $unwind: {
//                     path: "$group",
//                     preserveNullAndEmptyArrays: true
//                 },
//             },
//             {
//                 $lookup:
//                 {
//                     from: "group_detail",
//                     localField: "group._id",
//                     foreignField: "group_id",
//                     as: "communication"
//                 }
//             },
//             {
//                 $unwind: {
//                     path: "$communication",
//                     preserveNullAndEmptyArrays: true
//                 },
//             }
//         ]
//     )


//     var current_date = moment().format("DD-MM-YYYY")

//     for (const resp of resp_data) {

//         for (const comm of resp.communication.communication) {
//             if (comm.trigger == "After Offer") {
//                 var offer_date = moment(resp.createdAt).add(1, 'day')
//                 offer_date = moment(offer_date).format("DD-MM-YYYY")
//                 var message = comm.message;
//                 var email = resp.email
//                 if (moment(current_date).isSame(offer_date) == true) {
//                     let mail_resp = await mail_helper.send("offer", {
//                         "to": email,
//                         "subject": "Offer Letter"
//                     }, {

//                         "msg": message
//                     });
//                     res.status(config.OK_STATUS).json({ "mesage": "mail sent for after offer", "msg": msg });
//                 }

//             }

//             if (comm.trigger == "Before Joining") {
//                 var offer_date = moment(resp.joiningdate).subtract(2, 'day')
//                 offer_date = moment(offer_date).format("DD-MM-YYYY")

//                 var message = comm.message;
//                 var email = resp.email
//                 if (moment(current_date).isSame(offer_date) == true) {
//                     let mail_resp = await mail_helper.send("offer", {
//                         "to": email,
//                         "subject": "Before Joining"
//                     }, {

//                         "msg": message
//                     });
//                     res.status(config.OK_STATUS).json({ "mesage": "mail sent for before joining", "msg": msg });
//                 }

//             }

//             if (comm.trigger == "After Joining") {
//                 var offer_date = moment(resp.joiningdate).add(2, 'day')
//                 offer_date = moment(offer_date).format("DD-MM-YYYY")

//                 var message = comm.message;
//                 var email = resp.email
//                 if (moment(current_date).isSame(offer_date) == true) {
//                     let mail_resp = await mail_helper.send("offer", {
//                         "to": email,
//                         "subject": "After Joining"
//                     }, {

//                         "msg": message
//                     });
//                     res.status(config.OK_STATUS).json({ "mesage": "mail sent for after joining", "msg": msg });
//                 }

//             }
//             if (comm.trigger == "Before Expiry") {
//                 var offer_date = moment(resp.expirydate).subtract(2, 'day')
//                 offer_date = moment(offer_date).format("DD-MM-YYYY")

//                 var message = comm.message;
//                 var email = resp.email
//                 if (moment(current_date).isSame(offer_date) == true) {
//                     let mail_resp = await mail_helper.send("offer", {
//                         "to": email,
//                         "subject": "Before Expiry"
//                     }, {

//                         "msg": message
//                     });
//                     res.status(config.OK_STATUS).json({ "mesage": "mail sent for before expiry", "msg": msg });
//                 }

//             }
//             if (comm.trigger == "After Expiry") {
//                 var offer_date = moment(resp.expirydate).add(2, 'day')
//                 offer_date = moment(offer_date).format("DD-MM-YYYY")

//                 var message = comm.message;
//                 var email = resp.email
//                 if (moment(current_date).isSame(offer_date) == true) {
//                     let mail_resp = await mail_helper.send("offer", {
//                         "to": email,
//                         "subject": "After Expiry"
//                     }, {

//                         "msg": message
//                     });
//                     res.status(config.OK_STATUS).json({ "mesage": "mail sent for after expiry", "msg": msg });
//                 }

//             }


//         }

//     }

//     res.status(config.OK_STATUS).json({ "mesage": "mail sent for before joining", resp_data });
// });

router.post('/get', async (req, res) => {
    // try {
    //     const offer_list = await offer.find({is_del: false})
    //     .populate([
    //     { path: 'employer_id'},
    //     { path: 'salarybracket'},
    //     { path: 'group'},
    //     ])
    //     .lean();
    //     return res.status(config.OK_STATUS).json({ 'message': "Sub-Account List", "status": 1, data: offer_list });
    //   } catch (error) {
    //     return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false})
    //   }

    var schema = {
        // "page_no": {
        //   notEmpty: true,
        //   errorMessage: "page_no is required"
        // },
        // "page_size": {
        //   notEmpty: true,
        //   errorMessage: "page_size is required"
        // }
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
        console.log('req.userInfo.id==>', req.userInfo.id);

        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        console.log('user', user);

        if (user.status == 1 && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {
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

    var update_status = await common_helper.update(Offer, { "_id": req.body.id }, obj)
    res.status(config.OK_STATUS).json({ "message": "status changed", "status": obj.status });

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
        res.status(config.OK_STATUS).json({ "message": "Deleted successfully", resp_data });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
    }
});


router.put('/', async (req, res) => {
    var obj = {};

    // if (req.body.email && req.body.email != "") {
    //     obj.email = req.body.email
    // }
    if (req.body.groups && req.body.groups != "") {
        obj.groups = req.body.groups
    }
    if (req.body.name && req.body.name != "") {
        obj.name = req.body.name
    }
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
    if (req.body.notes && req.body.notes != "") {
        obj.notes = req.body.notes
    }
    if (req.body.commitstatus && req.body.commitstatus != "") {
        obj.commitstatus = req.body.commitstatus
    }
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
    var id = req.body.id;

    var offer_upadate = await common_helper.update(Offer, { "_id": ObjectId(id) }, obj)

    if (offer_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (offer_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": offer_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
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
                { path: 'group' },
            ])
            .lean();

        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});




module.exports = router;

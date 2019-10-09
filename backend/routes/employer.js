var express = require("express");
var router = express.Router();
var btoa = require('btoa');

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require('../config')
var index = require('./employer/index');
var offer = require('../models/offer');
var objectID = require('mongoose').Types.ObjectId;
var common_helper = require('../helpers/common_helper');
var user_helper = require('../helpers/user_helper');
var groups_helper = require('../helpers/groups_helper');
var offer_helper = require('../helpers/offer_helper');

var logger = config.logger;
// var sub_account = require('../models/sub-accounts');
var salary_bracket = require('../models/salary_bracket');
var group = require('../models/group');
var User = require('../models/user');
var Role = require('../models/role');
var jwt = require('jsonwebtoken');
var async = require('async');
var mail_helper = require('./../helpers/mail_helper');
var Sub_Employer_Detail = require('../models/sub-employer-detail');

var GroupDetail = require('../models/group-detail');
var location = require('../models/location');

router.use("/employer", auth, authorization, index);

//Offer
router.post("/offer/add_offer", async (req, res) => {
    console.log('hi', req.body);

    var schema = {
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        "name": {
            notEmpty: true,
            errorMessage: "Name is required"
        },
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
        "salarybracket": {
            notEmpty: true,
            errorMessage: "Salary Bracket is required"
        },
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
        "group": {
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
        var reg_obj = {
            "employer_id": req.body.employer_id,
            "email": req.body.email,
            "name": req.body.name,
            "title": req.body.title,
            "salarytype": req.body.salarytype,
            "salaryduration": req.body.salaryduration,
            "country": req.body.country,
            "location": req.body.location,
            "currency_type": req.body.currency_type,
            "salarybracket": req.body.salarybracket,
            "expirydate": req.body.expirydate,
            "joiningdate": req.body.joiningdate,
            "status": true,
            "offertype": req.body.offertype,
            "group": req.body.group,
            "commitstatus": req.body.commitstatus,
            "customfeild1": req.body.customfeild1,
            "customfeild2": req.body.customfeild2,
            "customfeild3": req.body.customfeild3,
            "notes": req.body.notes,
            "is_del": false
        };
        console.log('add offer', reg_obj);

        var interest_resp = await common_helper.insert(offer, reg_obj);
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

router.get("/groups_list", async (req, res) => {
    var group_list = await common_helper.find(group, {is_del: false});
    if (group_list.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "group List", "status": 1, data: group_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }
})

router.post('/offer/view_offer', async (req, res) => {
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
        let sortOrderColumn = sortOrderColumnIndex == 0 ? 'username' : req.body.columns[sortOrderColumnIndex].data;
        let sortOrder = req.body.order[0].dir == 'asc' ? 1 : -1;
        let sortingObject = {
            [sortOrderColumn]: sortOrder
        }
        var  aggregate= [
        {
            $match:{
            "is_del":false
            }
        }
        ]

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };
        aggregate.push({
            "$match":
                { $or: [{ "createdAt": RE }, { "title": RE}, { "salarytype": RE}, { "salarybracket.from": RE}, { "expirydate": RE}, { "joiningdate": RE}, { "status": RE}, { "offertype": RE}, { "group.name": RE}, { "commitstatus": RE}, { "customfeild1": RE}]}
        });

        let totalMatchingCountRecords = await offer.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await offer_helper.get_all_offer(offer,req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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

router.put('/offer/edit_offer/:id', async (req, res) => {
    var schema = {
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        "name": {
            notEmpty: true,
            errorMessage: "Name is required"
        },
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
        "salarybracket": {
            notEmpty: true,
            errorMessage: "Salary Bracket is required"
        },
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
        "group": {
            notEmpty: true,
            errorMessage: "Group is required"
        },
        "commitstatus": {
            notEmpty: true,
            errorMessage: "Commit Status is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        "email": req.body.email,
        "name": req.body.name,
        "title": req.body.title,
        "salarytype": req.body.salarytype,
        "salaryduration": req.body.salaryduration,
        "country": req.body.country,
        "location": req.body.location,
        "currenct_type": req.body.currenct_type,
        "salarybracket": req.body.salarybracket,
        "expirydate": req.body.expirydate,
        "joiningdate": req.body.joiningdate,
        "status": req.body.status,
        "offertype": req.body.offertype,
        "group": req.body.group,
        "commitstatus": req.body.commitstatus,
        "customfeild1": req.body.customfeild1,
        "customfeild2": req.body.customfeild2,
        "customfeild3": req.body.customfeild3,
        "notes": req.body.notes,
        "is_del": false
    };
    var id = req.params.id;
    console.log("object:", reg_obj);

    var offer_upadate = await common_helper.update(offer, { "_id": objectID(id) }, reg_obj)
    console.log(offer_upadate);

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

router.put("/offer/deactive_offer/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    var resp_data = await common_helper.update(offer, { "_id": id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
    }
});

router.put("/offer/status_change/:id", async (req, res) => {
    var obj = {
        "status": req.body.status
    }
    console.log(req.body);
    var id = req.params.id;
    var resp_data = await common_helper.update(offer, { "_id": id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
    }
});

router.get('/offer/offer_detail/:id', async (req, res) => {
    var id = req.params.id;
    try {
        console.log(id);

        const offer_detail = await offer.findOne({_id: id })
        .populate([
        { path: 'employer_id'},
        { path: 'salarybracket'},
        { path: 'location'},
        { path: 'group'},
        ])
        .lean();
        console.log(offer_detail);

        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail });
      } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false})
      }
});

//manage Candidate
router.get('/manage_candidate/approved_candidate', async (req, res) => {
    var candidate_list = await candidate.find();
    if (candidate_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: candidate_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }
});

router.get('/manage_candidate/candidate_detail/:id', async (req, res) => {
    var id = req.params.id;
    // console.log(id);

    var candidate_detail = await common_helper.findOne(candidate, { "_id": id })
    // console.log(candidate_detail);

    if (candidate_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (candidate_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
    }
});

router.put("/manage_candidate/deactive_candidate", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(candidate, { "_id": req.body.id }, obj);
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

router.put('/manage_candidate/candidate/edit_approved_candidate/:id', async (req, res) => {
    var schema = {
        "firstname": {
            notEmpty: true,
            errorMessage: "Firstname is required"
        },
        "lastname": {
            notEmpty: true,
            errorMessage: "Lastname is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "email is required"
        },
        "countrycode": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "country": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "password": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        countrycode: req.body.countrycode,
        country: req.body.country,
        password: req.body.password,
        contactno: req.body.contactno,
        documenttype: req.body.documenttype,
        documentimage: req.body.documentimage,
        is_del: req.body.is_del

    };
    var id = req.params.id;
    // console.log(id);

    var candidate_upadate = await common_helper.update(candidate, { "_id": id }, reg_obj)
    // console.log(candidate_upadate);

    if (candidate_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (candidate_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 1, "message": "Error while updating data." });
    }
})

//new request
router.get('/manage_candidate/new_request', async (req, res) => {
    var candidate_list = await candidate.find();
    candidate_list = candidate_list.filter(x => x.isAllow === false)
    if (candidate_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: candidate_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }

});

router.get('/manage_candidate/new_request_detail/:id', async (req, res) => {
    var id = req.params.id;
    // console.log(id);

    var candidate_detail = await common_helper.findOne(candidate, { "_id": id })

    // console.log(candidate_detail);

    if (candidate_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (candidate_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error while featching data." });
    }
});

router.put('/manage_candidate/new_request_update/:id', async (req, res) => {
    var schema = {
        "firstname": {
            notEmpty: true,
            errorMessage: "Firstname is required"
        },
        "lastname": {
            notEmpty: true,
            errorMessage: "Lastname is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "email is required"
        },
        "countrycode": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "country": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "password": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "countrycode is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        countrycode: req.body.countrycode,
        country: req.body.country,
        password: req.body.password,
        contactno: req.body.contactno,
        documenttype: req.body.documenttype,
        documentimage: req.body.documentimage,
    };
    var id = req.params.id;
    // console.log(id);

    var candidate_upadate = await common_helper.update(candidate, { "_id": id }, reg_obj)
    // console.log(candidate_upadate);

    if (candidate_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (candidate_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "Error while updating data." });
    }
});

router.put("/manage_candidate/new_request_deactive", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(candidate, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else if (resp_data.status == 1) {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "Error while deleting data." });
    }
})

//Sub_Accounts
router.post("/add_sub_account", async (req, res) => {
    var schema = {
        "name": {
            notEmpty: true,
            errorMessage: "Name is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {
        var reg_obj = {
            "name": req.body.name,
            "email": req.body.email,
            "adminrights": req.body.adminrights,
            "is_del": false
        };
        var interest_resp = await common_helper.insert(sub_account, reg_obj);
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

router.post('/view_sub_accounts', async (req, res) => {

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
        let sortOrderColumn = sortOrderColumnIndex == 0 ? 'username' : req.body.columns[sortOrderColumnIndex].data;
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
                { $or: [{ "username": RE }, { "user_id.email": RE }] }
        });

        let totalMatchingCountRecords = await Sub_Employer_Detail.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;

        var resp_data = await user_helper.get_all_sub_user(Sub_Employer_Detail, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
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

router.put('/edit_sub_account/:id', async (req, res) => {
    var schema = {
        "name": {
            notEmpty: true,
            errorMessage: "Name is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        "name": req.body.name,
        "email": req.body.email,
        "adminrights": req.body.adminrights,
        "is_del": false,

    };
    var id = req.params.id;
    var sub_account_upadate = await common_helper.update(sub_account, { "_id": id }, reg_obj)
    if (sub_account_upadate.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": sub_account_upadate });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while featching data." });
    }
})

router.put("/deactive_sub_account/:id", async (req, res) => {
    // console.log('dsfdsfds');return false;
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    //  console.log("IDDDIDIDIDID", id);return false;

    var resp_user_data = await common_helper.update(User, { "_id": id }, obj);
    var resp_Detail_data = await common_helper.update(Sub_Employer_Detail, { "user_id": id }, obj);
    // console.log(resp_Detail_data.status);return false;
    if (resp_user_data.status == 0 && resp_Detail_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_user_data);
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while deleting data." });
    } else if (resp_user_data.status == 1 && resp_Detail_data.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Record deleted successfully." });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "No data found" });
    }
});

router.get('/sub_account_detail/:id', async (req, res) => {
    var id = req.params.id;
    var sub_account_detail = await common_helper.findOne(sub_account, { "_id": id })
    if (sub_account_detail.status == 0) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": sub_account_detail });
    }
    else {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "message": "Error while featching data." });
    }
});

//groups
router.post("/add_group", async (req, res) => {
    var schema = {
        "name": {
            notEmpty: true,
            errorMessage: "Group Name is required"
        },
        "high_unopened": {
            notEmpty: true,
            errorMessage: "High priority is required"
        },
        "high_notreplied": {
            notEmpty: true,
            errorMessage: "High priority is required"
        },
        "medium_unopened": {
            notEmpty: true,
            errorMessage: "Medium priority is required"
        },
        "medium_notreplied": {
            notEmpty: true,
            errorMessage: "Medium priority is required"
        },
        "low_unopened": {
            notEmpty: true,
            errorMessage: "Low priority is required"
        },
        "low_notreplied": {
            notEmpty: true,
            errorMessage: "Low priority is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {
        var reg_obj = {
            "name": req.body.name,
            "high_unopened": req.body.high_unopened,
            "high_notreplied": req.body.high_notreplied,
            "medium_unopened": req.body.medium_unopened,
            "medium_notreplied": req.body.medium_notreplied,
            "low_unopened": req.body.low_unopened,
            "low_notreplied": req.body.medium_notreplied,
            "is_del": false
        };
        var interest_resp = await common_helper.insert(group, reg_obj);
        if (interest_resp.status == 0) {
            logger.debug("Error = ", interest_resp.error);
            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
        } else {
            res.json({ "message": "Group Added successfully", "data": interest_resp })
        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.post('/view_groups', async (req, res) => {
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
        let sortOrderColumn = sortOrderColumnIndex == 0 ? 'name' : req.body.columns[sortOrderColumnIndex].data;

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
                { $or: [{ "name": RE }, { "high_unopened": RE }, { "high_notreplied": RE }, { "medium_unopened": RE }, { "medium_notreplied": RE }, { "low_unopened": RE }, { "low_notreplied": RE }] }
        });

        let totalMatchingCountRecords = await group.aggregate(aggregate);
        totalMatchingCountRecords = totalMatchingCountRecords.length;
        // var search={};
        console.log(req.body.search)
        var resp_data = await groups_helper.get_all_groups(group, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);
        console.log(resp_data);

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

router.post("/add_group_details/:id", async (req, res) => {
    var schema =
        [{
            "communicationname": {
                notEmpty: true,
                errorMessage: "Communication Name is required"
            },
            "trigger": {
                notEmpty: true,
                errorMessage: "Trigger is required"
            },
            "day": {
                notEmpty: true,
                errorMessage: "Days are required"
            },
            "priority": {
                notEmpty: true,
                errorMessage: "Priority is required"
            }
        }];

    req.checkBody(schema);
    var errors = req.validationErrors();
    if (!errors) {
        const reqData = req.body.data;
        const grp_data = {
            group_id: req.params.id,
            communication: reqData
        };
        var response = await common_helper.insert(GroupDetail, grp_data);
        if (response.status === 0) {
            throw new Error('Error occured while inserting data');
        }
        res.status(config.OK_STATUS).json(response);
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.get('/group_detail/:id', async (req, res) => {
    var group_detail = await common_helper.find(group, { _id: objectID(req.params.id) });
    if (group_detail.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Group detail fetched successfully", "status": 1, data: group_detail });
    }
    else if (group_detail.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
});

router.get('/group_communication_detail/:id', async (req, res) => {
    var group_detail = await common_helper.find(GroupDetail, { group_id: objectID(req.params.id) });
    console.log("group detail", group_detail);

    if (group_detail.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Group detail fetched successfully", "status": 1, data: group_detail });
    }
    else if (group_detail.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
});

router.put("/deactivate_group/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    var resp_group_data = await common_helper.update(group, { "_id": id }, obj);
    console.log(resp_group_data.status);

    var resp_groupdetail_data = await common_helper.update(GroupDetail, { "group_id": id }, obj);
    console.log(resp_groupdetail_data.status);

    if (resp_group_data.status == 0 || resp_groupdetail_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_group_data);
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while featching data.", "data": resp_group_data });
    }
    else if (resp_group_data.status == 1 || resp_groupdetail_data.status == 1) {
        logger.trace("User got successfully = ", resp_groupdetail_data);
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Record Deleted Sucessfully", resp_group_data });
    }
    else if (resp_group_data.status == 2 || resp_groupdetail_data.status == 2) {
        logger.trace("User got successfully = ", resp_group_dataresp_group_data);
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "No Data Found." });
    }
});

//manage Location
router.post("/add_location", async (req, res) => {
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

    var errors = req.validationErrors();
    if (!errors) {
        var reg_obj = {
            "country": req.body.country,
            "city": req.body.city,
            "is_del": false
        };
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

router.get('/view_location', async (req, res) => {
    var location_list = await common_helper.find(location, {});
    // var location_list = await salary_bracket.find();
    // console.log("location", location_list);

    if (location_list.status === 1) {
        return res.status(config.OK_STATUS).json({ 'message': "Location List", "status": 1, data: location_list });
    }
    else if (location_list.status === 2) {
        return res.status(config.OK_STATUS).json({ 'message': "No Records Found", "status": 2 });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error while featching", "status": 0 });
    }
});

router.put('/edit_location/:id', async (req, res) => {
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
    var id = req.params.id;
    // console.log(id);

    var update_location = await common_helper.update(location, { "_id": id }, reg_obj)
    // console.log(update_location);

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
        res.status(config.OK_STATUS).json(resp_data);
    }
});

router.get('/location_detail/:id', async (req, res) => {
    var id = req.params.id;
    // console.log('Edited', id);

    var location_detail = await common_helper.findOne(location, { "_id": objectID(id) })
    // console.log("location from backend", location_detail);

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

//salary-bracket

router.post("/add_salary_bracket", async (req, res) => {
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
            "is_del": false
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

router.get('/view_salary_bracket', async (req, res) => {
    var salary_bracket_list = await common_helper.find(salary_bracket, {});
    // var salary_bracket_list = await salary_bracket.find();
    // console.log("salary", salary_bracket_list);
console.log("salary list",this.salary_bracket_list);

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

router.put('/edit_salary_bracket/:id', async (req, res) => {
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
    var reg_obj = {
        "country": req.body.country,
        "currency": req.body.currency,
        "from": req.body.from,
        "to": req.body.to,
        "is_del": false
    };
    var id = req.params.id;
    // console.log(id);

    var salary_bracket_upadate = await common_helper.update(salary_bracket, { "_id": id }, reg_obj)
    // console.log(salary_bracket_upadate);

    if (salary_bracket_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (salary_bracket_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": salary_bracket_upadate });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
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

router.post("/add_subaccount", async (req, res) => {
    var schema = {
        "name": {
            notEmpty: true,
            errorMessage: "name is required"
        },
        "email": {
            notEmpty: true,
            errorMessage: "email is required"
        }
    };

    req.checkBody(schema);
    var errors = req.validationErrors();
    if (!errors) {
        let password = req.body.name.substring(0, 3) + '@password123';
        let user_resp = await common_helper.findOne(User, { "email": req.body.email.toLowerCase() });
        if (user_resp.status === 1) {
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Email address already Register" });
        }
        else {
            let role = await common_helper.findOne(Role, { 'role': 'sub-employer' }, 1)
            var user_reg_obg = {
                "email": req.body.email.toLowerCase(),
                "password": password,
                "role_id": new objectID(role.data._id),
                "admin_rights": req.body.admin_rights
            }

            var interest_user_resp = await common_helper.insert(User, user_reg_obg);
            if (interest_user_resp.status === 1) {
                var reg_obj = {
                    "username": req.body.name,
                    "user_id": new objectID(interest_user_resp.data._id),
                    "country": null,
                    companyname: null,
                    countrycode: null,
                    contactno: null
                };

                var interest_resp = await common_helper.insert(Sub_Employer_Detail, reg_obj);
                if (interest_resp.status == 0) {
                    logger.debug("Error = ", interest_resp.error);
                    res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
                } else {
                    var reset_token = Buffer.from(jwt.sign({ "_id": interest_user_resp.data._id },
                        config.ACCESS_TOKEN_SECRET_KEY, {
                        expiresIn: 60 * 60 * 24 * 3
                    }
                    )).toString('base64');

                    var time = new Date();
                    time.setMinutes(time.getMinutes() + 20);
                    time = btoa(time);

                    logger.trace("sending mail");
                    let mail_resp = await mail_helper.send("email_confirmation", {
                        "to": interest_user_resp.data.email,
                        "subject": "HC - Email Confirmation"
                    }, {
                        "confirm_url": 'http://localhost:4200/confirmation/' + reset_token
                        // "message": "Dear Employer you are login after confirm your email whith your email and password "+ password.
                    });
                    if (mail_resp.status === 0) {
                        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
                    } else {
                        res.json({ "status": 1, "message": "Candidate registration successful, Confirmation mail send to your email", "data": interest_user_resp })
                    }
                }
            } else {
                res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Registration Faild." })
            }

        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

module.exports = router;

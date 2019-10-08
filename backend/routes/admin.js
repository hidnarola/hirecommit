var express = require("express");
var router = express.Router();

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require('../config')
var common_helper = require('../helpers/common_helper');
var logger = config.logger;
var mail_helper = require('./../helpers/mail_helper');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var index = require('./admin/index');
var candidate_detail = require('../models/candidate-detail');
var employer_detail = require('../models/employer-detail');
var objectID = require('mongoose').Types.ObjectId;

router.use("/admin", auth, authorization, index);

//employer
router.get('/view_employer', async (req, res) => {
//     var employer_list = await employer.find();
//     if (employer_list) {
//         return res.status(config.OK_STATUS).json({ 'message': "Emlpoyer List", "status": 1, data: employer_list });
//     }
//     else {
//         return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
//     }
// });
    console.log("hello");
    try {
        const Employer_list = await employer_detail.find({ is_del: false })
            .populate([
                { path: 'user_id' }
            ])
            .lean();
            console.log("hello");
            
        return res.status(config.OK_STATUS).json({ 'message': "Employer List", "status": 1, data: Employer_list });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.post('/add_employer', async (req, res) => {
    var schema = {
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        "password": {
            notEmpty: true,
            errorMessage: "Password is required"
        },
        "country": {
            notEmpty: true,
            errorMessage: "Country is required"
        },
        "businesstype": {
            notEmpty: true,
            errorMessage: "Businesstype is required"
        },
        "companyname": {
            notEmpty: true,
            errorMessage: "Companyname is required"
        },
        "username": {
            notEmpty: true,
            errorMessage: "UserName is required"
        },
        "countrycode": {
            notEmpty: true,
            errorMessage: "Countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "Contactno is required"
        }
    };
    req.checkBody(schema);

    var errors = req.validationErrors();
    if (!errors) {
        let employer_resp = await common_helper.findOne(employer, { "email": req.body.email.toLowerCase() })
        if (employer_resp.status === 1) {
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Email address already Register" });
        } else {
            var reg_obj = {
                "email": req.body.email.toLowerCase(),
                "password": req.body.password,
                "country": req.body.country,
                "businesstype": req.body.businesstype,
                "companyname": req.body.companyname,
                "website": req.body.website,
                "username": req.body.username,
                "countrycode": req.body.countrycode,
                "contactno": req.body.contactno,
                "isAllow": true,
                "is_del": false
            };

            var interest_resp = await common_helper.insert(employer, reg_obj);
            logger.trace("sending mail");
            let mail_resp = await mail_helper.send("email_confirmation", {
                "to": interest_resp.data.email,
                "subject": "HireCommit - Email Confirmation"
            }, {
                // config.website_url + "/email_confirm/" + interest_resp.data._id
                "confirm_url": 'http://localhost:4200/#/confirmation/' + interest_resp.data._id
            });
            if (mail_resp.status === 0) {
                res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
            } else {
                res.json({ "message": "Employer registration successful", "data": interest_resp })
            }
        }
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

router.put('/edit_employer/:id', async (req, res) => {
    var schema = {
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        "password": {
            notEmpty: true,
            errorMessage: "Password is required"
        },
        "country": {
            notEmpty: true,
            errorMessage: "Country is required"
        },
        "businesstype": {
            notEmpty: true,
            errorMessage: "Businesstype is required"
        },
        "companyname": {
            notEmpty: true,
            errorMessage: "Companyname is required"
        },
        "username": {
            notEmpty: true,
            errorMessage: "UserName is required"
        },
        "countrycode": {
            notEmpty: true,
            errorMessage: "Countrycode is required"
        },
        "contactno": {
            notEmpty: true,
            errorMessage: "Contactno is required"
        }
    };
    req.checkBody(schema);
    var reg_obj = {
        "email": req.body.email.toLowerCase(),
        "password": req.body.password,
        "country": req.body.country,
        "businesstype": req.body.businesstype,
        "companyname": req.body.companyname,
        "website": req.body.website,
        "username": req.body.username,
        "countrycode": req.body.countrycode,
        "contactno": req.body.contactno,
        "isAllow": true
    };
    var id = req.params.id;
    console.log(id);

    var employer_upadate = await common_helper.update(employer, { "_id": id }, reg_obj)
    console.log(employer_upadate);

    if (employer_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (employer_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": employer_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
})

// router.delete("/delete_employer/:id", async (req, res) => {
//     var id = req.params.id;
//     var employer_delete = await common_helper.delete(employer, { "_id": id });
//     if (employer_delete.status == 0) {
//         res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
//     }
//     else if (employer_delete.status == 1) {
//         res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer Deleted successfully", "data": employer_delete });
//     }
//     //   else {
//     //     res.status(config.BAD_REQUEST).json({"message": "No data found" });
//     //   }
// })

router.put("/deactive_employer", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(employer, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});

router.get('/employer_detail/:id', async (req, res) => {
    var id = req.params.id;
    console.log(id);

    var employer_detail = await common_helper.findOne(employer, { "_id": id })
    console.log(employer_detail);

    if (employer_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No Data Found" });
    }
    else if (employer_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": employer_detail });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
});

//candidate

router.get('/manage_candidate/approved_candidate', async (req, res) => {
    // var candidate_list = await candidate.find();
    // if (candidate_list) {
    //     return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: candidate_list });
    // }
    // else {
    //     return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    // }

    console.log("hello");
    try {
        const Candidate_list = await candidate_detail.find({ is_del: false })
            .populate([
                { path: 'user_id' }
            ])
            .lean();
        console.log("hello");

        return res.status(config.OK_STATUS).json({ 'message': "Candidate List", "status": 1, data: Candidate_list });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.get('/manage_candidate/candidate_detail/:id', async (req, res) => {
    var id = req.params.id;
    console.log(id);

    var candidate_detail = await common_helper.findOne(candidate, { "_id": id })
    console.log(candidate_detail);

    if (candidate_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (candidate_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    //     else {
    //       res.status(config.BAD_REQUEST).json({"message": "No data found" });
    //     }
});

router.put("/deactive_candidate", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(candidate, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});

router.put('/manage_candidate/edit_approved_candidate/:id', async (req, res) => {
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
    console.log(id);

    var candidate_upadate = await common_helper.update(candidate, { "_id": id }, reg_obj)
    console.log(candidate_upadate);

    if (candidate_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (candidate_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
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
    console.log(id);

    var candidate_detail = await common_helper.findOne(candidate, { "_id": id })

    console.log(candidate_detail);

    if (candidate_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (candidate_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate fetched successfully", "data": candidate_detail });
    }
    //     else {
    //       res.status(config.BAD_REQUEST).json({"message": "No data found" });
    //     }
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
    console.log(id);

    var candidate_upadate = await common_helper.update(candidate, { "_id": id }, reg_obj)
    console.log(candidate_upadate);

    if (candidate_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (candidate_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Candidate update successfully", "data": candidate_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
});

router.put("/manage_candidate/new_request_deactivate", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(candidate, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
})

module.exports = router;

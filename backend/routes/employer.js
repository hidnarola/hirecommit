var express = require("express");
var router = express.Router();

var auth = require("../middlewares/auth");
var authorization = require("../middlewares/authorization");
var config = require('../config')
var index = require('./employer/index');
var offer = require('../models/offer');
var objectID = require('mongoose').Types.ObjectId;
var common_helper = require('../helpers/common_helper');
var logger = config.logger;
var sub_account = require('../models/sub-accounts');
var salary_bracket = require('../models/salary_bracket');
var group = require('../models/group');
var group_detail = require('../models/group-detail')

router.use("/employer", auth, authorization, index);

//Offer
router.post("/offer/add_offer", async (req, res) => {
    var schema = {
      "employer_id":{
          notEmpty:true
      },
        "title": {
            notEmpty: true,
            errorMessage: "Country is required"
        },
        "salarytype":{
            notEmpty: true,
            errorMessage: "Salary Type is required"
        },
        "salarybracket":{
            notEmpty: true,
            errorMessage: "Salary Bracket Name is required"
        },
        "expirydate":{
            notEmpty: true,
            errorMessage: "Expiry Date Code is required"
        },
        "joiningdate":{
            notEmpty: true,
            errorMessage: "Joining Date is required"
        },
        "offertype":{
            notEmpty: true,
            errorMessage: "Offer Type  is required"
        },
        "group":{
            notEmpty: true,
            errorMessage: "Group is required"
        }
    };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
      var reg_obj = {
          "employer_id": req.body.employer_id,
          "title": req.body.title,
          "salarytype": req.body.salarytype,
          "salaryduration": req.body.salaryduration,
          "salarybracket": req.body.salarybracket,
          "expirydate": req.body.expirydate,
          "joiningdate": req.body.joiningdate,
          "status": true,
          "offertype": req.body.offertype,
          "group": req.body.group,
          "customfeild1": req.body.customfeild1,
          "customfeild2": req.body.customfeild2,
          "customfeild3": req.body.customfeild3,
          "notes": req.body.notes,
          "is_del": false
      };
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

router.get('/offer/view_offer', async (req, res) => {
    var offer_list = await offer.find();
    if (offer_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Offer List", "status": 1, data: offer_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }
});

router.put('/offer/edit_offer/:id', async (req, res) => {
    var schema = {
        "employer_id":{
            notEmpty:true
        },
          "title": {
              notEmpty: true,
              errorMessage: "Country is required"
          },
          "salarytype":{
              notEmpty: true,
              errorMessage: "Salary Type is required"
          },
          "salarybracket":{
              notEmpty: true,
              errorMessage: "Salary Bracket Name is required"
          },
          "expirydate":{
              notEmpty: true,
              errorMessage: "Expiry Date Code is required"
          },
          "joiningdate":{
              notEmpty: true,
              errorMessage: "Joining Date is required"
          },
          "offertype":{
              notEmpty: true,
              errorMessage: "Offer Type  is required"
          },
          "group":{
              notEmpty: true,
              errorMessage: "Group is required"
          }
      };
    req.checkBody(schema);
    var reg_obj = {
        // "employer_id": req.body.employer_id,
        "title": req.body.title,
        "salarytype": req.body.salarytype,
        "salaryduration": req.body.salaryduration,
        "salarybracket": req.body.salarybracket,
        "expirydate": req.body.expirydate,
        "joiningdate": req.body.joiningdate,
        "status": req.body.status,
        "offertype": req.body.offertype,
        "group": req.body.group,
        "customfeild1": req.body.customfeild1,
        "customfeild2": req.body.customfeild2,
        "customfeild3": req.body.customfeild3,
        "notes": req.body.notes,
        // "is_del": false
    };
    var id = req.params.id;
    console.log(id);

    var offer_upadate = await common_helper.update(offer, { "_id": id }, reg_obj)
    console.log(offer_upadate);

    if (offer_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (offer_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": offer_upadate });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
})

router.put("/offer/deactive_offer", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(offer, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});

router.get('/offer/offer_detail/:id', async (req, res) => {
    var id = req.params.id;
    console.log(id);

    var offer_detail = await common_helper.findOne(offer, { "_id": id })
    console.log(offer_detail);

    if (offer_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No Data Found" });
    }
    else if (offer_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": offer_detail });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
});

//Sub_Accounts
router.post("/add_sub_account", async (req, res) => {
    var schema = {
      "name":{
          notEmpty:true,
          errorMessage: "name is required"
      },
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        "designation":{
            notEmpty: true,
            errorMessage: "Designation Type is required"
        },
        "contactnumber":{
            notEmpty: true,
            errorMessage: "Contact Numberis required"
        },
        "employeecode":{
            notEmpty: true,
            errorMessage: "Employee Code is required"
        }
    };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
      var reg_obj = {
          "name": req.body.name,
          "email": req.body.email,
          "designation": req.body.designation,
          "contactnumber": req.body.contactnumber,
          "employeecode": req.body.employeecode,
          "avatar": req.body.avatar,
          "status": true,
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

router.get('/view_sub_accounts', async (req, res) => {
    var sub_account_list = await sub_account.find();
    if (sub_account_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Sub-Account List", "status": 1, data: sub_account_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }
});

router.put('/edit_sub_account/:id', async (req, res) => {
    var schema = {
        "name":{
            notEmpty:true,
            errorMessage: "name is required"
        },
          "email": {
              notEmpty: true,
              errorMessage: "Email is required"
          },
          "designation":{
              notEmpty: true,
              errorMessage: "Designation Type is required"
          },
          "contactnumber":{
              notEmpty: true,
              errorMessage: "Contact Numberis required"
          },
          "employeecode":{
              notEmpty: true,
              errorMessage: "Employee Code is required"
          }
      };
    req.checkBody(schema);
    var reg_obj = {
        "name": req.body.name,
          "email": req.body.email,
          "designation": req.body.designation,
          "contactnumber": req.body.contactnumber,
          "employeecode": req.body.employeecode,
          "avatar": req.body.avatar,
          "status": true,
          "is_del": false
    };
    var id = req.params.id;
    console.log(id);

    var sub_account_upadate = await common_helper.update(sub_account, { "_id": id }, reg_obj)
    console.log(sub_account_upadate);

    if (sub_account_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_upadate.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer update successfully", "data": sub_account_upadate });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
})

router.put("/deactive_sub_account", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(sub_account, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
});

router.get('/sub_account_detail/:id', async (req, res) => {
    var id = req.params.id;
    console.log(id);

    var sub_account_detail = await common_helper.findOne(sub_account, { "_id": id })
    console.log(sub_account_detail);

    if (sub_account_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (sub_account_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": sub_account_detail });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
});

//groups

router.post("/add_group", async (req, res) => {
    var schema = {
      "name":{
          notEmpty:true,
          errorMessage: "Group Name is required"
      },
    };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
      var reg_obj = {
          "name": req.body.name,
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

router.post("/add_group_details", async (req, res) => {
    var schema = {
      "communicationname":{
          notEmpty:true,
          errorMessage: "Group Name is required"
      },
      "trigger":{
        notEmpty:true,
        errorMessage: "Group Name is required"
    },
    "day":{
        notEmpty:true,
        errorMessage: "Group Name is required"
    },
    };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
      var reg_obj = {
          "groupid": req.body.groupid,
          "communicationname": req.body.communicationname,
          "trigger": req.body.trigger,
          "day":req.body.day,
          "message": req.body.message,
          "is_del": false
      };
      var interest_resp = await common_helper.insert(group_detail, reg_obj);
      if (interest_resp.status == 0) {
          logger.debug("Error = ", interest_resp.error);
          res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
      } else {
              res.json({ "message": "Group detail successfully", "data": interest_resp })
      }
  }
  else {
      logger.error("Validation Error = ", errors);
      res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

router.get('/group_detail/:id', async (req, res) => { 
    var id = req.params.group_id;
    console.log(id);

    var group_detail = await common_helper.find(group_detail, { "group_id": id })
    console.log(group_detail);

    if (group_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (group_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Group detail fetched successfully", "data": group_detail });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
});





//salary-bracket

router.post("/add_salary_bracket", async (req, res) => {
    var schema = {
      "country":{
          notEmpty:true,
          errorMessage: "country is required"
      },
        "from": {
            notEmpty: true,
            errorMessage: "minimum salary is required"
        },
        "to":{
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
    var salary_bracket_list = await salary_bracket.find();
    if (salary_bracket_list) {
        return res.status(config.OK_STATUS).json({ 'message': "Salary_bracket List", "status": 1, data: salary_bracket_list });
    }
    else {
        return res.status(config.BAD_REQUEST).json({ 'message': "No Records Found", "status": 0 });
    }
});

router.put('/edit_salary_bracket/:id', async (req, res) => {
    var schema = {
        "country":{
            notEmpty:true,
            errorMessage: "country is required"
        },
          "from": {
              notEmpty: true,
              errorMessage: "minimum salary is required"
          },
          "to":{
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
    console.log(id);

    var salary_bracket_upadate = await common_helper.update(salary_bracket, { "_id": id }, reg_obj)
    console.log(salary_bracket_upadate);

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

router.put("/deactive_salary_bracket", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(salary_bracket, { "_id": req.body.id }, obj);
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
    console.log(id);

    var salary_brcaket_detail = await common_helper.findOne(salary_bracket, { "_id": id })
    console.log(salary_brcaket_detail);

    if (salary_brcaket_detail.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email" });
    }
    else if (salary_brcaket_detail.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Employer fetched successfully", "data": salary_brcaket_detail });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    }
});



module.exports = router;
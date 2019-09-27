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
var GroupDetail = require('../models/group-detail');
var location = require('../models/location');
var candidate = require('../models/candidate_detail');

router.use("/employer", auth, authorization, index);

//Offer
router.post("/offer/add_offer", async (req, res) => {
    var schema = {
      "employer_id":{
          notEmpty:true,
            errorMessage: "Employer ID is required"
      },
        "title": {
            notEmpty: true,
            errorMessage: "Title is required"
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
        },
        "commitstatus":{
            notEmpty: true,
            errorMessage: "Commit Status is required"
        },
        "location":{
          notEmpty: true,
          errorMessage:"Location is required"
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
          "commitstatus": req.body.commitstatus,
          "location": req.body.location,
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

router.put("/offer/deactive_offer/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id = req.params.id;
    console.log('hey',id)
    var resp_data = await common_helper.update(offer, { "_id": id }, obj);
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

router.put("/manage_candidate/deactive_candidate", async (req, res) => {
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

router.put("/manage_candidate/new_request_deactive", async (req, res) => {
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
      "high_unopened":{
        notEmpty:true,
        errorMessage: "High priority is required"
       },
       "high_notreplied":{
        notEmpty:true,
        errorMessage: "High priority is required"
       },
       "medium_unopened":{
        notEmpty:true,
        errorMessage: "Medium priority is required"
       },
       "medium_notreplied":{
        notEmpty:true,
        errorMessage: "Medium priority is required"
       },
       "low_unopened":{
        notEmpty:true,
        errorMessage: "Low priority is required"
       },
       "low_notreplied":{
        notEmpty:true,
        errorMessage: "Low priority is required"
       }
    };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
      var reg_obj = {
          "name": req.body.name,
          "high_unopened":req.body.high_unopened,
          "high_notreplied":req.body.high_notreplied,
          "medium_unopened": req.body.medium_unopened,
          "medium_notreplied": req.body.medium_notreplied,
          "low_unopened" :req.body.low_unopened,
          "low_notreplied":req.body.medium_notreplied,
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
        "group_id": {
            notEmpty: true,
            errorMessage: "Group id is required"
        },
        "communication": [{
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
        },]
    };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
  
      var reg_obj = {
          "group_id": req.body.group_id,
          "communication": [{
              "communicationname": req.body.communicationname,
              "trigger": req.body.trigger,
              "day": req.body.day,
              "priority": req.body.priority,
              "message": req.body.message,
              "is_del": false
          }]
      };
      console.log(reg_obj);
      
      var interest_resp = await common_helper.insert(GroupDetail, reg_obj);
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

router.get('/group_detail', async (req, res) => { 
    // console.log(req.body.id);
    
    await GroupDetail.find({ group_id: objectID(req.body.id)}, (err, result)=> {
        console.log(result);
        if (err) res.send(JSON.stringify('not found'))
        if (result !== null && result.length > 0) {
            res.status(config.OK_STATUS).json({ "status": 1, "message": "Group detail fetched successfully", "data": result });
        } else {
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No data found" });
        }
    })


    // var group_detail =  await GroupDetail.find({}).populate(req.body.id).exec(function (err, data) {
    //     console.log(data);
        
    //     if (data) {
    //         res.status(config.OK_STATUS).json({ "status": 1, "message": "Group detail fetched successfully", "data": data });
    //     } else {
    //         res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    //     }
    // });
    // var group_detail = await common_helper.findWithFilterss(GroupDetail, {"group_id": req.body.id});
    // console.log(group_detail)

    // if (group_detail.status == 0) {
       
    // }
    // else if (group_detail.status == 1) {
    //     res.status(config.OK_STATUS).json({ "status": 1, "message": "Group detail fetched successfully", "data": group_detail });
    // }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
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
    console.log(id);

    var update_location = await common_helper.update(location, { "_id": id }, reg_obj)
    console.log(update_location);

    if (update_location.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (update_location.status == 1) {
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Location update successfully", "data": update_location });
    }
    // else {
    //     res.status(config.BAD_REQUEST).json({ "message": "No data found" });
    // }
})

router.put("/deactivate_location", async (req, res) => {
    var obj = {
        is_del: true
    }
    var resp_data = await common_helper.update(location, { "_id": req.body.id }, obj);
    if (resp_data.status == 0) {
        logger.error("Error occured while fetching User = ", resp_data);
        res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
    } else {
        logger.trace("User got successfully = ", resp_data);
        res.status(config.OK_STATUS).json(resp_data);
    }
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
    console.log(this.salary_bracket_list);
    
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

router.put("/deactive_salary_bracket/:id", async (req, res) => {
    var obj = {
        is_del: true
    }
    var id= req.params.id;
    var resp_data = await common_helper.update(salary_bracket, { "_id": id}, obj);
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
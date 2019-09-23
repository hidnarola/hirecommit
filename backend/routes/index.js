var express = require('express');
var router = express.Router();

/* GET home page. */
var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
//var ObjectId = mongoose.Types.ObjectId;
//var moment = require('moment');
var _ = require('underscore');
var passwordValidator = require('password-validator');
var passwordValidatorSchema = new passwordValidator();

var logger = config.logger;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var async = require('async');
var mail_helper = require('./../helpers/mail_helper');
var Admin = require('./../models/admin');
var Candidate = require('./../models/candidate');
var Employer = require('./../models/employer');

const saltRounds = 10;
var common_helper = require('./../helpers/common_helper')


// Candidate Registration
router.post("/candidate_register", async (req, res) => {
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

    var errors = req.validationErrors();
    if (!errors) {
        var reg_obj = {
             "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email.toLowerCase(),
            "countrycode": req.body.countrycode,
            "country": req.body.country,
            "password": req.body.password,
            "contactno": req.body.contactno,
            "documenttype": req.body.documenttype,
            "is_del":false
            // "documentimage": req.body.documentimage
        };
        async.waterfall(
            [
                function (callback) {
                    //file upload
                    if (req.files && req.files["documentimage"]) {
                        var image_path_array = [];
                        var file = req.files['documentimage'];
                        var files = [].concat(req.files.documentimage);
                        var dir = "./upload";
                        var filename = file.name;
                        async.eachSeries(
                            files,
                            function (file, loop_callback) {
                                var mimetype = path.extname(file.name);
                                var mimetype = ["image/jpeg","image/png", 'application/pdf'];
                                if (mimetype.indexOf((file.mimetype).toLowerCase()) != -1) {
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    var filename = file.name;
                                    file.mv(dir + "/" + filename, function (err) {
                                        if (err) {
                                            logger.error("There was an issue in uploading");
                                            loop_callback({
                                                status: config.MEDIA_ERROR_STATUS,
                                                err: "There was an issue in uploading"
                                            });
                                        } else {
                                            logger.trace(
                                                "image has been uploaded. File name = ",
                                                filename
                                            );
                                            location = filename;
                                            image_path_array.push(location);
                                            loop_callback();
                                        }
                                    });
                                } else {
                                    logger.error(" format is invalid");
                                    loop_callback({
                                        status: config.VALIDATION_FAILURE_STATUS,
                                        err: " format is invalid"
                                    });
                                }
                            },
                            function (err) {
                                if (err) {
                                    res.status(err.status).json(err);
                                } else {
                                    callback(null, image_path_array);
                                }
                            }
                        );
                    } else {
                        logger.info(
                            "File not available to upload. Executing next instruction"
                        );
                        callback(null, []);
                    }
                }
            ],
            async (err, image_path_array) => {
                reg_obj.documentimage = image_path_array;

               // if (hcp.status === 2 && patient.status === 2) {
                         var interest_resp = await common_helper.insert(Candidate, reg_obj);
                        if (interest_resp.status == 0) {
                            logger.debug("Error = ", interest_resp.error);
                            res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
                        } else {
                                res.json({ "message": "Candidate registration successful", "data": interest_resp })
                        }
            });
    }
    else {
        logger.error("Validation Error = ", errors);
        res.status(config.BAD_REQUEST).json({ message: errors });
    }
});

// employer Registration
router.post("/employer_register", async (req, res) => {
    var schema = {
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        "password":{
            notEmpty: true,
            errorMessage: "Password is required"
        },
        "country": {
            notEmpty: true,
            errorMessage: "Country is required"
        },
        "businesstype":{
            notEmpty: true,
            errorMessage: "Bussiness Type is required"
        },
        "companyname":{
            notEmpty: true,
            errorMessage: "Company Name is required"
        },
        "username":{
            notEmpty: true,
            errorMessage: "User Name is required"
        },
        "countrycode":{
            notEmpty: true,
            errorMessage: "Country Code is required"
        },
        "contactno":{
            notEmpty: true,
            errorMessage: "Contact Number is required"
        }
    };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
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
          "isAllow": false,
          "is_del": false
      };
      var interest_resp = await common_helper.insert(Employer, reg_obj);
      if (interest_resp.status == 0) {
          logger.debug("Error = ", interest_resp.error);
          res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
      } else {
              res.json({ "message": "Employer registration successful", "data": interest_resp })
      }
  }
  else {
      logger.error("Validation Error = ", errors);
      res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

//HCP login
router.post('/login', async (req, res) => {
    var schema = {
        'email': {
            notEmpty: true,
            errorMessage: "Email is required.",
            isEmail: { errorMessage: "Please enter valid email address" }
        },
        'password': {
            notEmpty: true,
            errorMessage: "password is required."
        },
    };
    req.checkBody(schema);
    var errors = req.validationErrors();
    if (!errors) {
        let admin_resp = await common_helper.findOne(Admin, { "email": req.body.email})
        let employer_resp = await common_helper.findOne(Employer, { "email": req.body.email})
        let candidate_resp = await common_helper.findOne(Candidate, { "email": req.body.email})
       console.log(employer_resp.status);
       
        if (admin_resp.status === 0 && candidate_resp.status === 0 && employer_resp.status === 0) {
            logger.trace("Login checked resp = ", login_resp);
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Something went wrong while finding user", "error": login_resp.error });
        } 
        else if (admin_resp.status === 1 ) {
            logger.trace("valid token. Generating token");
            if ((bcrypt.compareSync(req.body.password, admin_resp.data.password) && req.body.email.toLowerCase() == admin_resp.data.email) ) {
                var refreshToken = jwt.sign({ id: admin_resp.data._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
                let update_resp = await common_helper.update(Admin, { "_id": admin_resp.data._id }, { "refresh_token": refreshToken, "last_login": Date.now() });
                var LoginJson = { id: admin_resp.data._id, email: admin_resp.email, role: "admin" };
                var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
                    expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
                });
                delete admin_resp.data.status;
                delete admin_resp.data.password;
                delete admin_resp.data.refresh_token;
                delete admin_resp.data.last_login_date;
                delete admin_resp.data.created_at;
                logger.info("Token generated");
                res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "data": admin_resp.data, "token": token, "refresh_token": refreshToken });
            }
            else {
                res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid email address or password" });
            }
        }
        else if (candidate_resp.status === 1 ) {
          logger.trace("valid token. Generating token");
          if ((bcrypt.compareSync(req.body.password, candidate_resp.data.password) && req.body.email.toLowerCase() == candidate_resp.data.email) ) {
              var refreshToken = jwt.sign({ id: candidate_resp.data._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
              let update_resp = await common_helper.update(Candidate, { "_id": candidate_resp.data._id }, { "refresh_token": refreshToken, "last_login": Date.now() });
              var LoginJson = { id: candidate_resp.data._id, email: candidate_resp.email, role: "candidate" };
              var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
                  expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
              });
              delete candidate_resp.data.status;
              delete candidate_resp.data.password;
              delete candidate_resp.data.refresh_token;
              delete candidate_resp.data.last_login_date;
              delete candidate_resp.data.created_at;
              logger.info("Token generated");
              res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "data": candidate_resp.data, "token": token, "refresh_token": refreshToken });
          }
          else {
              res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid email address or password" });
          }
        }
        else if (employer_resp.status === 1 ) {
            logger.trace("valid token. Generating token");
            if ((bcrypt.compareSync(req.body.password, employer_resp.data.password) && req.body.email.toLowerCase() == employer_resp.data.email) ) {
                var refreshToken = jwt.sign({ id: employer_resp.data._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
                let update_resp = await common_helper.update(Employer, { "_id": employer_resp.data._id }, { "refresh_token": refreshToken, "last_login": Date.now() });
                var LoginJson = { id: employer_resp.data._id, email: employer_resp.email, role: "employer" };
                var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
                    expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
                });
                delete employer_resp.data.status;
                delete employer_resp.data.password;
                delete employer_resp.data.refresh_token;
                delete employer_resp.data.last_login_date;
                delete employer_resp.data.created_at;
                logger.info("Token generated");
                res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "data": employer_resp.data, "token": token, "refresh_token": refreshToken });
            }
            else {
                res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid email address or password" });
            }
        }
        else {
            res.status(config.BAD_REQUEST).json({ message: "Your email is not registered" });
        }
    }
    else {
        res.status(config.BAD_REQUEST).json({ message: "Invalid email" });
    }
});

module.exports = router;

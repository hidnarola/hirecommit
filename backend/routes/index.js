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
var btoa = require('btoa');
//var ObjectId = mongoose.Types.ObjectId;
//var moment = require('moment');
var _ = require('underscore');
var request = require('request');
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
var captcha_secret = '6LeZgbkUAAAAANtRy1aiNa83I5Dmv90Xk2xOdyIH';

// Candidate Registration
router.post("/candidate_register", async (req, res) => {
  console.log(req);
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
      let candidate_resp = await common_helper.findOne(Candidate, { "email": req.body.email.toLowerCase()})
      if(candidate_resp.status === 1) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Email address already Register" });
      } else {
        var reg_obj = {
             "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email.toLowerCase(),
            "countrycode": req.body.countrycode,
            "country": req.body.country,
            "password": req.body.password,
            "contactno": req.body.contactno,
            "documenttype": req.body.documenttype
        };
        async.waterfall(
            [
                function (callback) {
                    //file upload
                    // console.log("hiiiii", req.body.files);
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
                var interest_resp = await common_helper.insert(Candidate, reg_obj);
                if (interest_resp.status == 0) {
                    logger.debug("Error = ", interest_resp.error);
                    res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
                } else {
                  logger.trace("sending mail");
                  let mail_resp = await mail_helper.send("email_confirmation", {
                      "to": interest_resp.data.email,
                      "subject": "HC - Email Confirmation"
                  }, {
                      // "confirm_url": config.website_url + "/email_confirm/" + interest_resp.data._id
                      "confirm_url": 'http://localhost:4200/#/confirmation/' + interest_resp.data._id
                  });
                  if (mail_resp.status === 0) {
                      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
                  } else {
                      res.json({ "message": "Candidate registration successful", "data": interest_resp })
                  }
                }
            });
      }
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
      },
      "recaptcha": {
        notEmpty: true,
        errorMessage: "captcha is required"
      }
  };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + captcha_secret + "&response=" + req.body['recaptcha'];
        await request(verificationURL, async (error, response, body) => {
            body = JSON.parse(body);
            if (body.success !== undefined && !body.success) {
                res.json({ "status": 0, "responseError": "Failed captcha verification" });
            }
            else {
              let employer_resp = await common_helper.findOne(Employer, { "email": req.body.email.toLowerCase()})
              if(employer_resp.status === 1) {
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
                  "contactno": req.body.contactno
                };

                var interest_resp = await common_helper.insert(Employer, reg_obj);
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
        });
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
          if (candidate_resp.data.email_verified) {
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
          else {
            res.status(config.UNAUTHORIZED).json({ "status": 0, "message": "Email address not verified." });
          }
      }
        else if (employer_resp.status === 1) {
          if (employer_resp.data.email_verified) {
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
            res.status(config.UNAUTHORIZED).json({ "status": 0, "message": "Email address not verified" });
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

router.get('/email_verify/:id', async (req, res) => {
  var employer_resp = await common_helper.findOne(Employer, { "_id": new ObjectId(req.params.id) }, 1);
  var candidate_resp = await common_helper.findOne(Candidate, { "_id": new ObjectId(req.params.id) }, 1);
  console.log(employer_resp.status);

  if (employer_resp.status === 0 && candidate_resp.status === 0) {
      logger.error("Error occured while finding user by id - ", req.params.id, employer_resp.error);
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error has occured while finding user" });
  } else if (employer_resp.status === 2 && candidate_resp.status === 2) {
      logger.trace("User not found in user email verify API");
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token entered" });
  } else {
    if (candidate_resp && candidate_resp.status == 1 && candidate_resp.data.email_verified == true) {
      logger.trace("user already verified");
      res.status(config.BAD_REQUEST).json({ "message": "Email Already verified" });
    }
    else if (employer_resp && employer_resp.status == 1 && employer_resp.data.email_verified == true) {
      logger.trace("user already verified");
      res.status(config.BAD_REQUEST).json({ "message": "Email Already verified" });
    }
      else {
          if (employer_resp && employer_resp.status == 1) {
              var employer_update_resp = await Employer.updateOne({ "_id": new ObjectId(employer_resp.data._id) }, { $set: { "email_verified": true } });
          }
          else {
              var candidate_update_resp = await Candidate.updateOne({ "_id": new ObjectId(candidate_resp.data._id) }, { $set: { "email_verified": true } });
          }
          res.status(config.OK_STATUS).json({ "status": 1, "message": "Email has been verified" });
      }
  }
});

router.post('/forgot_password', async (req, res) => {
  var schema = {
      'email': {
          notEmpty: true,
          errorMessage: "Email is required.",
          isEmail: { errorMessage: "Please enter valid email address" }
      }
  };
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
    var admin = await common_helper.findOne(Admin, { "email": req.body.email.toLowerCase() }, 1)
    var employer = await common_helper.findOne(Employer, { "email": req.body.email.toLowerCase() }, 1)
    var candidate = await common_helper.findOne(Candidate, { "email": req.body.email.toLowerCase() }, 1)
    if (admin.status === 0 && employer.status === 0 && candidate.status === 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while finding email" });
    } else if (admin.status === 2 && employer.status === 2 && candidate.status === 2) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No user available with given email" });
    } else if (admin.status === 1 || employer.status === 1 || candidate.status === 1) {
        if (candidate.status === 1) {
            if (candidate.data.is_del == false) {
                    var reset_token = Buffer.from(jwt.sign({ "_id": candidate.data._id }, config.ACCESS_TOKEN_SECRET_KEY, {
                        expiresIn: 60 * 60 * 24 * 3
                    })).toString('base64');
                    var time = new Date();
                    time.setMinutes(time.getMinutes() + 20);
                    time = btoa(time);
                    var up = {
                        "flag": 0
                    }
                    var resp_data = await common_helper.update(Candidate, { "_id": candidate.data._id }, up);
                    let mail_resp = await mail_helper.send("reset_password", {
                        "to": candidate.data.email,
                        "subject": "HireCommit - Reset Password"
                    }, {
                        "reset_link": "http://localhost:4200/#" + "/reset-password/" + reset_token
                    });
                    if (mail_resp.status === 0) {
                        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending mail", "error": mail_resp.error });
                    } else {
                        res.status(config.OK_STATUS).json({ "status": 1, "message": "Reset link was sent to your email address" });
                    }
            }
            else {
                res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Your email doesn't exists" });
            }
        }
        else if (employer.status === 1) {
            if (employer.data.is_del == false) {
                    var reset_token = Buffer.from(jwt.sign({ "_id": employer.data._id }, config.ACCESS_TOKEN_SECRET_KEY, {
                        expiresIn: 60 * 60 * 24 * 3
                    })).toString('base64');
                    var time = new Date();
                    time.setMinutes(time.getMinutes() + 20);
                    time = btoa(time);
                    var up = {
                        "flag": 0
                    }
                    var resp_data = await common_helper.update(Employer, { "_id": employer.data._id }, up);
                    let mail_resp = await mail_helper.send("reset_password", {
                        "to": employer.data.email,
                        "subject": "HireCommit - Reset Password"
                    }, {
                        // "user": "",
                        "reset_link": "http://localhost:4200/#" + "/reset-password/" + reset_token
                    });

                    if (mail_resp.status === 0) {
                        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending mail", "error": mail_resp.error });
                    } else {
                        res.status(config.OK_STATUS).json({ "status": 1, "message": "Reset link was sent to your email address" });
                    }
            }
            else {
                res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Your email doesn't exists" });
            }
        }
        else if (admin.status === 1) {
            var reset_token = Buffer.from(jwt.sign({ "_id": admin.data._id }, config.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: 60 * 60 * 24 * 3
            })).toString('base64');
            var time = new Date();
            time.setMinutes(time.getMinutes() + 20);
            time = btoa(time);
            var up = {
                "flag": 0
            }
            var resp_data = await common_helper.update(Admin, { "_id": admin.data._id }, up);
            let mail_resp = await mail_helper.send("reset_password", {
                "to": admin.data.email,
                "subject": "Reset password"
            }, {
                "user": "",
                "reset_link": "http://localhost:4200/#" + "/reset-password/" + reset_token
            });

            if (mail_resp.status === 0) {
                res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending mail", "error": mail_resp.error });
            } else {
                res.status(config.OK_STATUS).json({ "status": 1, "message": "Reset link was sent to your email address" });
            }
        }
    }
  }
  else {
      res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

// reset password
router.post('/reset_password', async (req, res) => {
  var schema = {
      'token': {
          notEmpty: true,
          errorMessage: "Reset password token is required."
      },
      'password': {
          notEmpty: true,
          errorMessage: "Password is required."
      }
  };
  var validat = passwordValidatorSchema
      .is().min(8)
      .symbols()	                                 // Minimum length 8
      .is().max(100)
      .letters()                                // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits()                                 // Must have digits
      .has().not().spaces()                       // Should not have spaces
      .is().not().oneOf(['Passw0rd', 'Password123'])
  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {
      logger.trace("Verifying JWT");
      jwt.verify(Buffer.from(req.body.token, 'base64').toString(), config.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
          if (err) {
              if (passwordValidatorSchema.validate(req.body.password) == true) {
                  if (err.name === "TokenExpiredError") {
                      logger.trace("Link has expired");
                      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has been expired" });
                  } else {
                      logger.trace("Invalid link");
                      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token sent" });
                  }
              }
              else {
                  res.json({ "message": "Please Enter password of atleast 8 characters including 1 Uppercase,1 Lowercase,1 digit,1 special character" })
              }
          } else {
              var reset_candidate = await common_helper.findOne(Candidate, { "_id": decoded._id }, 1);
              var reset_employer = await common_helper.findOne(Employer, { "_id": decoded._id }, 1);
              var reset_admin = await common_helper.findOne(Admin, { "_id": decoded._id }, 1);
              if (reset_candidate.data && reset_candidate.status === 1) {
                  if (reset_candidate.data.flag == 0) {
                      if (decoded._id) {
                          var update_resp = await common_helper.update(Candidate, { "_id": decoded._id }, { "password": bcrypt.hashSync(req.body.password, saltRounds), "flag": 1 });
                          if (update_resp.status === 0) {
                              logger.trace("Error occured while updating : ", update_resp.error);
                              res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying user's email" });
                          } else if (update_resp.status === 2) {
                              logger.trace("not updated");
                              res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while reseting password of user" });
                          } else {
                              logger.trace("Password has been changed - ", decoded._id);
                              res.status(config.OK_STATUS).json({ "status": 1, "message": "Password has been changed" });
                          }
                      }
                  }
                  else {
                      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has been expired" });
                  }
              } else if (reset_employer.data && reset_employer.status === 1) {
                  if (reset_employer.data.flag == 0) {
                      if (decoded._id) {
                          var update_resp = await common_helper.update(Employer, { "_id": decoded._id }, { "password": bcrypt.hashSync(req.body.password, saltRounds), "flag": 1 });
                          if (update_resp.status === 0) {
                              logger.trace("Error occured while updating : ", update_resp.error);
                              res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying user's email" });
                          } else if (update_resp.status === 2) {
                              logger.trace("not updated");
                              res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while reseting password of user" });
                          } else {
                              logger.trace("Password has been changed - ", decoded._id);
                              res.status(config.OK_STATUS).json({ "status": 1, "message": "Password has been changed" });
                          }
                      }
                  }
                  else {
                      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has expired" });
                  }
              }
              else if (reset_admin.data && reset_admin.status === 1) {
                console.log(reset_admin.data.flag);

                  if (reset_admin.data.flag == 0) {
                      if (decoded._id) {
                          var update_resp = await common_helper.update(Admin, { "_id": decoded._id }, { "password": bcrypt.hashSync(req.body.password, saltRounds), "flag": 1 });
                          if (update_resp.status === 0) {
                              logger.trace("Error occured while updating : ", update_resp.error);
                              res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while verifying user's email" });
                          } else if (update_resp.status === 2) {
                              logger.trace("not updated");
                              res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Error occured while reseting password of user" });
                          } else {
                              logger.trace("Password has been changed - ", decoded._id);
                              res.status(config.OK_STATUS).json({ "status": 1, "message": "Password has been changed" });
                          }
                      }
                  }
                  else {
                      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has expired" });

                  }
              }
          }
      });
  } else {
      res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

module.exports = router;

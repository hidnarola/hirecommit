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
var Role = require('./../models/role');
var User = require('./../models/user');
var Candidate_Detail = require('./../models/candidate-detail');
var Employer_Detail = require('./../models/employer-detail');
var CountryData = require('./../models/country_data');

const saltRounds = 10;
var common_helper = require('./../helpers/common_helper')
var captcha_secret = '6LfCebwUAAAAAKbmzPwPxLn0DWi6S17S_WQRPvnK';
// var captcha_secret = '6LeZgbkUAAAAANtRy1aiNa83I5Dmv90Xk2xOdyIH';

//get user
router.get("/user", async (req, res) => {
  var response = await common_helper.find(User);
  res.status(config.OK_STATUS).send(response);
});

// Add role Registration
router.post("/add_role", async (req, res) => {
  try {
    var reg_obj = {
      "role": req.body.role
    }

    var response = await common_helper.insert(Role, reg_obj);
    if (response.status === 0) {
      throw new Error('Error occured while inserting data');
    }
    res.status(config.OK_STATUS).json(response);
  } catch (error) {
    const response = {
      success: false,
      message: error.message
    }
    res.status(config.BAD_REQUEST).send(response);
  }
});

//Admin register
router.post("/admin_register", async (req, res) => {
  var schema = {
    "email": {
      notEmpty: true,
      errorMessage: "Email is required"
    },
    "password": {
      notEmpty: true,
      errorMessage: "Password is required"
    }
  };
  req.checkBody(schema);

  var errors = req.validationErrors();
  if (!errors) {
    let role = await common_helper.findOne(Role, { 'role': 'admin' }, 1)
    var reg_obj = {
      "email": req.body.email,
      "password": req.body.password,
      "role": new ObjectId(role.data._id),
      "admin_rights": true,
      "email_verified": true,
      "isAllow": true,
      "is_del": false,
      "flag": 0
    };
    var interest_resp = await common_helper.insert(User, reg_obj);
    if (interest_resp.status == 0) {
      logger.debug("Error = ", interest_resp.error);
      res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
    } else {
      res.json({ "message": "Admin Added successfully", "data": interest_resp })
    }
  }
  else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

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
      errorMessage: "Password is required"
    },
    "countrycode": {
      notEmpty: true,
      errorMessage: "countrycode is required"
    },
    "contactno": {
      notEmpty: true,
      errorMessage: "contactno is required"
    }
  };

  var validate = passwordValidatorSchema
    .is().min(8)
    .symbols()	                                 // Minimum length 8
    .is().max(100)
    .letters()                                // Maximum length 100
    // .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                       // Should not have spaces
    .is().not().oneOf(['Password', 'Password123'])

  req.checkBody(schema);
  var errors = req.validationErrors();
  if (!errors) {

    let user_resp = await common_helper.findOne(User, { "email": req.body.email.toLowerCase() });
    if (user_resp.status === 1) {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Email address already Register" });
    } else {
      let role = await common_helper.findOne(Role, { 'role': 'candidate' }, 1)
      var user_reg_obg = {
        "email": req.body.email.toLowerCase(),
        "password": req.body.password,
        "role_id": new ObjectId(role.data._id)
      }

      if (passwordValidatorSchema.validate(req.body.password) == false) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Please Enter password of atleast 8 characters including 1 Uppercase,1 Lowercase,1 digit,1 special character" })
      }
      else {
        var interest_user_resp = await common_helper.insert(User, user_reg_obg);
        if (interest_user_resp.status === 1) {
          var reg_obj = {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "countrycode": req.body.countrycode,
            "country": req.body.country,
            "contactno": req.body.contactno,
            "documenttype": req.body.documenttype,
            "documentimage": req.body.documentImage,
            "user_id": new ObjectId(interest_user_resp.data._id)
          };
          var interest_resp = await common_helper.insert(Candidate_Detail, reg_obj);
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
              // "confirm_url": config.website_url + "/email_confirm/" + interest_resp.data._id
              "confirm_url": config.WEBSITE_URL + 'confirmation/' + reset_token
            });
            if (mail_resp.status === 0) {
              res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
            } else {
              res.json({ "status": 1, "message": "Candidate registration successful, Confirmation mail send to your email", "data": interest_user_resp })
            }
          }
          // async.waterfall(
          //   [
          //       function (callback) {
          //           if (req.files && req.files["documentimage"]) {
          //               var image_path_array = [];
          //               var file = req.files['documentimage'];
          //               var files = [].concat(req.files.documentimage);
          //               var dir = "./upload";
          //               var filename = file.name;
          //               async.eachSeries(
          //                   files,
          //                   function (file, loop_callback) {
          //                       var mimetype = path.extname(file.name);
          //                       var mimetype = ["image/jpeg","image/png", 'application/pdf'];
          //                       if (mimetype.indexOf((file.mimetype).toLowerCase()) != -1) {
          //                           if (!fs.existsSync(dir)) {
          //                               fs.mkdirSync(dir);
          //                           }
          //                           var filename = file.name;
          //                           file.mv(dir + "/" + filename, function (err) {
          //                               if (err) {
          //                                   logger.error("There was an issue in uploading");
          //                                   loop_callback({
          //                                       status: config.MEDIA_ERROR_STATUS,
          //                                       err: "There was an issue in uploading"
          //                                   });
          //                               } else {
          //                                   logger.trace(
          //                                       "image has been uploaded. File name = ",
          //                                       filename
          //                                   );
          //                                   location = filename;
          //                                   image_path_array.push(location);
          //                                   loop_callback();
          //                               }
          //                           });
          //                       } else {
          //                           logger.error(" format is invalid");
          //                           loop_callback({
          //                               status: config.VALIDATION_FAILURE_STATUS,
          //                               err: " format is invalid"
          //                           });
          //                       }
          //                   },
          //                   function (err) {
          //                       if (err) {
          //                           res.status(err.status).json(err);
          //                       } else {
          //                           callback(null, image_path_array);
          //                       }
          //                   }
          //               );
          //           } else {
          //               logger.info(
          //                   "File not available to upload. Executing next instruction"
          //               );
          //               callback(null, []);
          //           }
          //       }
          //   ],
          //   async (err, image_path_array) => {
          //     reg_obj.documentimage = image_path_array;
          //       var interest_resp = await common_helper.insert(Candidate_Detail, reg_obj);
          //       if (interest_resp.status == 0) {
          //           logger.debug("Error = ", interest_resp.error);
          //           res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
          //       } else {
          //         var reset_token = Buffer.from(jwt.sign({ "_id": interest_user_resp.data._id },
          //           config.ACCESS_TOKEN_SECRET_KEY, {
          //             expiresIn: 60 * 60 * 24 * 3
          //           }
          //         )).toString('base64');

          //         var time = new Date();
          //         time.setMinutes(time.getMinutes() + 20);
          //         time = btoa(time);

          //         logger.trace("sending mail");
          //         let mail_resp = await mail_helper.send("email_confirmation", {
          //             "to": interest_user_resp.data.email,
          //             "subject": "HC - Email Confirmation"
          //         }, {
          //             // "confirm_url": config.website_url + "/email_confirm/" + interest_resp.data._id
          //             "confirm_url": 'http://localhost:4200/confirmation/' + reset_token
          //         });
          //         if (mail_resp.status === 0) {
          //             res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
          //         } else {
          //             res.json({ "status": 1, "message": "Candidate registration successful, Confirmation mail send to your email", "data": interest_user_resp  })
          //         }
          //       }
          //   }
          //   );
        }
        else {
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Registration Faild." })
        }
      }
    }
  }
  else {
    logger.error("Validation Error = ", errors);
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
}
);

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

  var validate = passwordValidatorSchema
    .is().min(8)
    .symbols()	                                 // Minimum length 8
    .is().max(100)
    .letters()                                // Maximum length 100
    // .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                       // Should not have spaces
    .is().not().oneOf(['Password', 'Password123'])

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
        let user_resp = await common_helper.findOne(User, { "email": req.body.email.toLowerCase() })
        if (user_resp.status === 1) {
          res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Email address already Register" });
        } else {
          let role = await common_helper.findOne(Role, { 'role': 'employer' }, 1)
          var user_reg_obj = {
            "email": req.body.email.toLowerCase(),
            "password": req.body.password,
            "role_id": new ObjectId(role.data._id)
          }

          if (passwordValidatorSchema.validate(req.body.password) == false) {
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Please Enter password of atleast 8 characters including 1 Uppercase,1 Lowercase,1 digit,1 special character" })
          } else {

            var interest_user_resp = await common_helper.insert(User, user_reg_obj);
            if (interest_user_resp.status === 1) {
              var reg_obj = {
                "country": req.body.country,
                "businesstype": req.body.businesstype,
                "companyname": req.body.companyname,
                "website": req.body.website,
                "username": req.body.username,
                "countrycode": req.body.countrycode,
                "contactno": req.body.contactno,
                "user_id": new ObjectId(interest_user_resp.data.id)
              };
              var interest_resp = await common_helper.insert(Employer_Detail, reg_obj);
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
                "subject": "HireCommit - Email Confirmation"
              }, {
                // config.website_url + "/email_confirm/" + interest_resp.data._id
                "confirm_url": config.WEBSITE_URL + "confirmation/" + reset_token
              });
              if (mail_resp.status === 0) {
                res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error occured while sending confirmation email", "error": mail_resp.error });
              } else {
                res.json({ "message": "Employer registration successful", "data": interest_user_resp })
              }
            } else {
              res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Registration Faild." })
            }

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
    let user_resp = await common_helper.findOne(User, { "email": req.body.email })

    if (user_resp.status === 0) {
      logger.trace("Login checked resp = ", user_resp);
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Something went wrong while finding user", "error": user_resp.error });
    }
    else if (user_resp.status === 1) {
      if (user_resp.data.email_verified) {
        logger.trace("valid token. Generating token");
        if ((bcrypt.compareSync(req.body.password, user_resp.data.password) && req.body.email.toLowerCase() == user_resp.data.email)) {
          var refreshToken = jwt.sign({ id: user_resp.data._id }, config.REFRESH_TOKEN_SECRET_KEY, {});
          let update_resp = await common_helper.update(User, { "_id": user_resp.data._id }, { "refresh_token": refreshToken, "last_login": Date.now() });
          let role = await common_helper.findOne(Role, { "_id": user_resp.data.role_id });


          var LoginJson = { id: user_resp.data._id, email: user_resp.email, role: role.data.role };
          var token = jwt.sign(LoginJson, config.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME
          });
          delete user_resp.data.status;
          delete user_resp.data.password;
          delete user_resp.data.refresh_token;
          delete user_resp.data.last_login_date;
          delete user_resp.data.created_at;
          logger.info("Token generated");


          let user_resp = await common_helper.findOne(User, { "email": req.body.email })
          var userDetails = await User.aggregate([
            {
              $match: {
                "email": req.body.email
              }
            },
            {
              $lookup:
              {
                from: "employerDetail",
                localField: "_id",
                foreignField: "user_id",
                as: "user"
              }
            },
            {
              $unwind: "$user"
            },
          ])
          res.status(config.OK_STATUS).json({ "status": 1, "message": "Logged in successful", "data": user_resp.data, "token": token, "refresh_token": refreshToken, "userDetails": userDetails, "role": role.data.role, id: user_resp.data._id });
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

router.post('/email_verify', async (req, res) => {
  logger.trace("Verifying JWT");
  jwt.verify(Buffer.from(req.body.token, 'base64').toString(), config.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        logger.trace("Link has expired");
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Link has been expired" });
      } else {
        logger.trace("Invalid link");
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token sent" });
      }
    } else {
      var user_resp = await common_helper.findOne(User, { "_id": decoded._id }, 1);
      if (user_resp.status === 0) {
        logger.error("Error occured while finding user by id - ", req.params.id, user_resp.error);
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error has occured while finding user" });
      } else if (user_resp.status === 2) {
        logger.trace("User not found in user email verify API");
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid token entered" });
      } else {
        if (user_resp && user_resp.status == 1 && user_resp.data.email_verified == true) {
          logger.trace("user already verified");
          res.status(config.BAD_REQUEST).json({ "message": "Email Already verified" });
        }
        else {
          if (user_resp && user_resp.status == 1) {
            var user_update_resp = await User.updateOne({ "_id": new ObjectId(user_resp.data._id) }, { $set: { "email_verified": true } });
          }
          res.status(config.OK_STATUS).json({ "status": 1, "message": "Email has been verified" });
        }
      }
    }
  });
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
    var user = await common_helper.findOne(User, { "email": req.body.email.toLowerCase() }, 1)
    if (user.status === 0) {
      res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Error while finding email" });
    } else if (user.status === 2) {
      res.status(config.BAD_REQUEST).json({ "status": 0, "message": "No user available with given email" });
    } else if (user.status === 1) {
      if (user.data.is_del == false) {
        var reset_token = Buffer.from(jwt.sign({ "_id": user.data._id }, config.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: 60 * 60 * 24 * 3
        })).toString('base64');
        var time = new Date();
        time.setMinutes(time.getMinutes() + 20);
        time = btoa(time);
        var up = {
          "flag": 0
        }
        var resp_data = await common_helper.update(User, { "_id": user.data._id }, up);
        let mail_resp = await mail_helper.send("reset_password", {
          "to": user.data.email,
          "subject": "HireCommit - Reset Password"
        }, {
          "reset_link": config.WEBSITE_URL + "reset-password/" + reset_token
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
    // .has().uppercase()                              // Must have uppercase letters
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
        var reset_user = await common_helper.findOne(User, { "_id": decoded._id }, 1);
        if (reset_user.data && reset_user.status === 1) {
          if (reset_user.data.flag == 0) {
            if (decoded._id) {
              var update_resp = await common_helper.update(User, { "_id": decoded._id }, { "password": bcrypt.hashSync(req.body.password, saltRounds), "flag": 1 });
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
        }
      }
    });
  } else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
});

//change password
router.put('/change_password', async (req, res) => {
  var schema = {
    'token': {
      notEmpty: true,
      errorMessage: "Change password token is required."
    },
    'oldpassword': {
      notEmpty: true,
      errorMessage: "Old password is required."
    },
    'newpassword': {
      notEmpty: true,
      errorMessage: "New Password is required."
    }
  };

  var validate = passwordValidatorSchema
    .is().min(8)
    .symbols()	                                 // Minimum length 8
    .is().max(100)
    .letters()                                // Maximum length 100
    // .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                       // Should not have spaces
    .is().not().oneOf(['Password', 'Password123'])
  req.checkBody(schema);
  var errors = req.validationErrors();

  if (!errors) {
    logger.trace("Verifying JWT");
    jwt.verify(req.body.token, config.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Invalid Token" });
      }
      if (passwordValidatorSchema.validate(req.body.newpassword) == false) {
        res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Please Enter password of atleast 8 characters including 1 Uppercase,1 Lowercase,1 digit,1 special character" })
      }
      else {
        const user = await common_helper.findOne(User, { "_id": decoded.id }, 1);
        if (user.data && user.status === 1) {
          if (bcrypt.compareSync(req.body.oldpassword, user.data.password)) {
            const update_resp = await common_helper.update(User, { "_id": decoded.id }, { "password": bcrypt.hashSync(req.body.newpassword, saltRounds) });
            if (update_resp.status === 1) {
              logger.trace("Password has been changed - ", decoded.id);
              res.status(config.OK_STATUS).json({ "status": 1, "message": "Password has been changed" });
            }
            else {
              res.status(config.BAD_REQUEST).json({ "message": "Error occured while change password of admin" });
            }
          } else {
            res.status(config.BAD_REQUEST).json({ "status": 0, "message": "Old password does not match." });
          }
        }
        else if (user.status === 0) {
          logger.trace("Change password checked resp = ", user);
          res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "Something went wrong while finding user", "error": user.error });
        }
        else {
          res.status(config.NOT_FOUND).json({ "status": 2, "message": "NOT_FOUND" });
        }
      }
    })
  }
  else {
    res.status(config.BAD_REQUEST).json({ message: errors });
  }
})

async function getCountry(req, res) {
  try {
    var condition = {};
    if (req.params.id) {
      condition = { ...condition, _id: req.params.id }
    }
    const country = await CountryData.find(condition).lean();
    return res.status(config.OK_STATUS).json({
      success: true, message: 'country list fetched successfully.',
      data: country
    });
  } catch (error) {
    return res.status(config.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Error in Fetching country data', data: country
    });
  }
}

router.get('/country', getCountry);
router.get('/country/:id', getCountry);

module.exports = router;

const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

// Create Schema
const EmployerSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  businesstype: {
    type: String,
    required: true
  },
  companyname: {
    type: String,
    required: true
  },
  website: {
    type: String,
  },
  username: {
    type: String,
    required: true
  },
  countrycode: {
    type: String,
    required: true
  },
  contactno: {
    type: String,
    required: true
  },
  isAllow: {
    type: Boolean,
    default: false
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  role: {
    type:String,
    default: "employer"
  },
  is_del: {
    type: Boolean,
    default: false
  },
  "flag": {
    type: Number,
    default: 1
  },
  createdate: {
      type: Date,
      default: Date.now
  }
});

EmployerSchema.pre('save', function (next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);
      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

module.exports = mongoose.model('employer', EmployerSchema,'employer');

const mongoose = require("mongoose");
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
    required: true
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
  email_verified: {
    type: Boolean,
    default: false
  },
  isAllow: {
    type: Boolean,
    default: false
  },
  role: {
    type:String,
    default: "employer"
  },
  is_del:{
    type: Boolean,
    default: false 
  },
  createdate: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('employer', EmployerSchema,'employer');

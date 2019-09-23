const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CandidateSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  countrycode:{
    type:String,
    require: true
  },
  contactno: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  documentimage: {
    type: String,
    // required: true
  },
  documenttype: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAllow: {
    type: String,
    default:false
  },
  is_del:{
    type: Boolean,
    default: false 
  },
  role: {
      type: String,
      default:"candidate"
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('candidate', CandidateSchema,'candidate');

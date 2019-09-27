const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Schema
const EmployerDetailSchema = new Schema({
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
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  is_del: {
    type: Boolean,
    default: false
  },
  createdate: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('employerDetail', EmployerDetailSchema,'employerDetail');

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create Schema
const CandidateDetailSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  countrycode: {
    type: String,
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
  document_verified: {
    type: Boolean,
    default: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  status: {
    type: String,
    default: "On Hold"
  },
  is_del: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('candidateDetail', CandidateDetailSchema, 'candidateDetail');

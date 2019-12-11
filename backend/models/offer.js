const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const customField = new Schema({
  key: String,
  value: String
})

var CommunicationSchema = new Schema({
  communicationname: { type: String, required: true },
  trigger: { type: String, required: true },
  day: { type: Number, required: true },
  priority: { type: String, required: true },
  message: { type: String },
  is_del: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

var AdhockSchema = new Schema({
  communicationname: { type: String, required: true },
  trigger: { type: String, required: true },
  day: { type: Number, required: true },
  priority: { type: String, required: true },
  message: { type: String },
  is_del: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Create Schema
const OfferSchema = new Schema({
  employer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  mail_status: {
    type: String,
    default: "UnOpened"
  },
  // email: {
  //   type: String,
  //   required: true
  // },
  // candidate_name: {
  //   type: String,
  // },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  salarytype: {
    type: String,
    require: true
  },
  salaryduration: {
    type: String
  },
  // country: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'country_datas'
  // },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location'
  },
  currency_type: {
    type: String
  },
  communication: [{ type: CommunicationSchema }],
  AdHoc: [{ type: AdhockSchema }],

  // salarybracket: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'salary_bracket'
  // },
  expirydate: {
    type: Date,
    required: true
  },
  joiningdate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: "Released"
  },
  offertype: {
    type: String,
    required: true
  },
  groups: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group'
  },
  commitstatus: {
    type: String,
    // require: true
  },

  customfeild: [

    customField

  ],
  notes: {
    type: String
  },
  salary: {
    type: Number
  },
  salary_from: {
    type: Number
  },
  salary_to: {
    type: Number
  },
  high_unopened: {
    type: Number,
  },
  high_notreplied: {
    type: Number,
  },
  medium_unopened: {
    type: Number,
  },
  medium_notreplied: {
    type: Number,
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_del: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date,
    default: ""
  }
});

module.exports = mongoose.model('offer', OfferSchema, 'offer');

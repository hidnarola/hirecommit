const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const customField = new Schema({
  key: String,
  value: String
})

// Create Schema
const OfferSchema = new Schema({
  employer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
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
  country: {
    type: String,
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location'
  },
  currency_type: {
    type: String
  },
  salarybracket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'salary_bracket'
  },
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
    default: "On Hold"
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
    require: true
  },

  customField: [
    {
      customField
    }
  ],
  notes: {
    type: String
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

module.exports = mongoose.model('offer', OfferSchema, 'offer');

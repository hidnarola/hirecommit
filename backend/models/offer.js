const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OfferSchema = new Schema({
 employer_id:{
  type: String,
  required: true
 },
  title: {
    type: String,
    required: true
  },
  salarytype:{
    type:String,
    require: true
  },
  salaryduration: {
    type: String
    
  },
  salarybracket: {
    type: String,
    required: true
  },
  expirydate: {
    type: String,
    // required: true
  },
  joiningdate: {
    type: String,
    required: true
  },
 
  status: {
    type: String,
    default:false
  },
  offertype: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  customfeild1: {
    type: String,
   
  },
  customfeild2: {
    type: String,
   
  },
  customfeild3: {
    type: String,
   
  },

  notes: {
      type: String,
      
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

module.exports = mongoose.model('offer', OfferSchema,'offer');

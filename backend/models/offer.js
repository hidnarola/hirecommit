const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OfferSchema = new Schema({
 employer_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employer' 
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'salary_bracket' 
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group' 
  },
  commitstatus:{
      type: String,
      require: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location'
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

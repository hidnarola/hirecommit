const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Sub_Account_Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type:String,
    require: true
  },
  adminrights:{
    type:Boolean,
    default: false
  },
 
  isActive: {
    type: Boolean,
    default:true
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

module.exports = mongoose.model('Sub_Account', Sub_Account_Schema,'Sub_Account');

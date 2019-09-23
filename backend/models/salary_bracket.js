const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Salary_Bracket_Schema = new Schema({
 country:{
  type: String,
  required: true
 },
  currency: {
    type: String,
    // required: true
  },
  from:{
    type:Number,
    require: true
  },
  to: {
    type: Number,
    require: true
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


module.exports = mongoose.model('salary_bracket',Salary_Bracket_Schema,'salary_bracket');

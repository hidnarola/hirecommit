const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const GroupSchema = new Schema({
 name:{
  type: String,
  required: true
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


module.exports = mongoose.model('group',GroupSchema,'group');

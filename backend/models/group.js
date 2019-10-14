const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const GroupSchema = new Schema({

  emp_id: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  high_unopened: {
    type: String,
    required: true
  },
  high_notreplied: {
    type: String,
    required: true
  },
  medium_unopened: {
    type: String,
    required: true
  },
  medium_notreplied: {
    type: String,
    required: true
  },
  low_unopened: {
    type: String,
    required: true
  },
  low_notreplied: {
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


module.exports = mongoose.model('group', GroupSchema, 'group');

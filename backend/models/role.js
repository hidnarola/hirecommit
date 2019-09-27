const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;
// Create Schema
const RoleSchema = new Schema({
   role:{
    type: String,
    require: true
   },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('role', RoleSchema, 'role');

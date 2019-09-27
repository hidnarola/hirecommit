const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password:{
       type: String,
       require: true
    },
    role_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role' 
    },
    isAllow:{
      type: Boolean,
    //   default: false
    },
    is_del:{
        type:Boolean
    },
    email_verified:{
        type:Boolean
    },
    flag:{
        type:Number
    },
    adminrights:{
        type:Boolean
    },
   createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});



module.exports = mongoose.model('user', UserSchema, 'user');

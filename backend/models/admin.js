//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

//Define a schema
var Schema = mongoose.Schema;

var AdminModelSchema = new Schema({
    email: { type: String, default: null },
    password: { type: String, default: null },
    role:{type:String,default:"admin"},
    is_del: { type: Boolean, default: false },
    formattedToken: { type: String },
    formattedKey: { type: String },
    code: { type: String },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

AdminModelSchema.pre('save', function (next) {
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

var Admin = mongoose.model('admin', AdminModelSchema, 'admin');

module.exports = Admin;

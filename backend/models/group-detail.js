const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const GroupDetailSchema = new Schema({
    group_id: {
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    },
    communicationname: {
        type: String,
        required: true
    },
    trigger: {
        type: String,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    message: {
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


module.exports = mongoose.model('group_detail', GroupDetailSchema, 'group_detail');

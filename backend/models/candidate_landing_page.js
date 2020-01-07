const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CandidateLandingPageSchema = new Schema({
    header_bluepart: {
        content_1: { type: String },
        content_2: { type: String }
    },
    signup_for_free: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    receive_offers: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    accept_offer: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    join_company: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    data_security: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    transparency: {
        hading_1: { type: String },
        hading_2: { type: String },
        content_1: { type: String },
        content_2: { type: String }
    },
    support_identity: {
        hading_1: { type: String },
        hading_2: { type: String },
        content_1: { type: String }
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

module.exports = mongoose.model('candidate_landing_page', CandidateLandingPageSchema, 'candidate_landing_page');

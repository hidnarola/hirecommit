const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EmployerLandingPageSchema = new Schema({
    header_bluepart: {
        content_1: { type: String },
        content_2: { type: String }
    },
    structured_automated: {
        hading_1: { type: String },
        hading_2: { type: String },
        content_1: { type: String },
        content_2: { type: String },
        content_3: { type: String }
    },
    advance_alerts: {
        hading_1: { type: String },
        hading_2: { type: String },
        content_1: { type: String },
        content_2: { type: String },
        content_3: { type: String }
    },
    signup_for_free: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    send_offer_to_candidate: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    one_time_setup: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    candidate_accept: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    monitor_alert_communication: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    candidate_joins: {
        hading_1: { type: String },
        content_1: { type: String }
    },
    data_security: {
        hading_1: { type: String },
        hading_2: { type: String },
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

module.exports = mongoose.model('employer_landing_page', EmployerLandingPageSchema, 'employer_landing_page');

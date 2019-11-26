var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
const bcrypt = require('bcryptjs');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');
var request = require("request");
var mail_helper = {};
var config = require("./../config");
var mail_api_key = config.SENDGRID_API_KEY;

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_user: config.SENDGRID_USER,
            api_key: config.SENDGRID_PASSWORD
        }
    })
);

mail_helper.send = async (template_name, options, data) => {
    var template_sender = transporter.templateSender(new EmailTemplate('emails/' + template_name), {
        from: "support@hirecommit.com"
    });
    return template_sender({
        to: options.to,
        subject: options.subject,
    }, data).then(function (info) {
        return { "status": 1, "message": info };
    }).catch(function (err) {
        return { "status": 0, "error": err };
    });
};

module.exports = mail_helper;

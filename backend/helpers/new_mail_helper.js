var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
const bcrypt = require('bcryptjs');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');
var mail_api_key = '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';
var request = require("request");
var new_mail_helper = {};
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


new_mail_helper.send = async (template_id, options, data) => {
    // offer  : d-4e82d6fcf94e4acdb8b94d71e4c32455
    sgMail.setApiKey(mail_api_key);
    const msg = {
        // to: options.to,
        // from: 'support@hirecommit.com',
        // subject: options.subject,
        // templateId: template_id,
        // dynamic_template_data: {
        //     "message": data,
        // },
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        "customArgs": {
            "trackid": options.trackid
        },

        "personalizations": [
            {
                "to": [
                    {
                        "email": options.to,
                        "name": "John Doe"
                    }
                ],
                "dynamic_template_data": {
                    "message": data,
                },
                "subject": options.subject
            }
        ],
        "from": {
            "email": "support@hirecommit.com",
            "name": "Hire Commit"
        },
        "reply_to": {
            "email": "support@hirecommit.com",
            "name": "Hire Commit"
        },
        "template_id": template_id


    };
    var mail_resp = await sgMail.send(msg);
    if (mail_resp) {
        return { 'status': 1 };
    }
    else {
        return { 'status': 0 };
    }
}

module.exports = new_mail_helper;

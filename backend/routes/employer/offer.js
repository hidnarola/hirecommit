const express = require("express");
const router = express.Router();

const config = require('../../config')
const Offer = require('../../models/offer');
const ObjectId = require('mongoose').Types.ObjectId;
const common_helper = require('../../helpers/common_helper');
const cron = require('node-cron');
const validator = require("email-validator");
const offer_helper = require('../../helpers/offer_helper');
const mail_helper = require('../../helpers/mail_helper');
const new_mail_helper = require('../../helpers/new_mail_helper');
const communication_mail_helper = require('../../helpers/communication_mail_helper');
const async = require('async');

const logger = config.logger;
const moment = require("moment")
const User = require('../../models/user');
const CandidateDetail = require("../../models/candidate-detail");
const SubEmployerDetail = require("../../models/sub-employer-detail");
const EmployerDetail = require("../../models/employer-detail");
const Location = require("../../models/location");
const Role = require('../../models/role');
const Status = require("../../models/status");
const History = require('../../models/offer_history');
const MailRecord = require('../../models/mail_record');
const MailContent = require('../../models/mail_content');
const MailStatus = require('../../models/mail_status');
const request = require('request');
var result = [];
var result1 = [];
let valuesmail;
let valuesmail1;
//Offer
router.post("/", async (req, res) => {
    try {
        var schema = {
            "email": {
                notEmpty: true,
                errorMessage: "Email is required"
            },
            "title": {
                notEmpty: true,
                errorMessage: "Title is required"
            },
            "salarytype": {
                notEmpty: true,
                errorMessage: "Salary Type is required"
            },
            "location": {
                notEmpty: true,
                errorMessage: "Location is required"
            },

            "expirydate": {
                notEmpty: true,
                errorMessage: "Expiry Date Code is required"
            },
            "joiningdate": {
                notEmpty: true,
                errorMessage: "Joining Date is required"
            },
            "offertype": {
                notEmpty: true,
                errorMessage: "Offer Type  is required"
            },
        };
        req.checkBody(schema);

        var errors = req.validationErrors();
        if (!errors) {

            var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

            var employer;
            var company;
            if (user && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
                employer = await common_helper.findOne(SubEmployerDetail, { emp_id: user.data.emp_id });

                var company_resp = await common_helper.findOne(EmployerDetail, { user_id: user.data.emp_id });
                company = company_resp.data.companyname;

                var obj = {
                    "employer_id": user.data.emp_id,
                    "created_by": req.userInfo.id,
                    "email": req.body.email.toLowerCase(),
                    "candidate_name": req.body.candidate_name,
                    "title": req.body.title,
                    "salarytype": req.body.salarytype,
                    "salaryduration": req.body.salaryduration,
                    "location": req.body.location,
                    "expirydate": req.body.expirydate,
                    "joiningdate": req.body.joiningdate,
                    "offertype": req.body.offertype,
                    "groups": req.body.groups,
                    "high_unopened": req.body.high_unopened ? req.body.high_unopened : undefined,
                    "high_notreplied": req.body.high_notreplied ? req.body.high_notreplied : undefined,
                    "medium_unopened": req.body.medium_unopened ? req.body.medium_unopened : undefined,
                    "medium_notreplied": req.body.medium_notreplied ? req.body.medium_notreplied : undefined,
                    "customfeild": JSON.parse(req.body.customfeild),
                    "notes": req.body.notes,
                    "salary_from": req.body.salary_from,
                    "salary_to": req.body.salary_to,
                    "salary": req.body.salary,
                    "communication": JSON.parse(req.body.data),
                    "AdHoc": JSON.parse(req.body.AdHoc),
                    "message": `<span>{employer}</span> has Created this offer for <span>{candidate}</span>`
                }
            }
            else {
                employer = await common_helper.findOne(EmployerDetail, { user_id: req.userInfo.id });
                company = employer.data.companyname;
                var obj = {
                    "employer_id": req.userInfo.id,
                    "created_by": req.userInfo.id,
                    "email": req.body.email.toLowerCase(),
                    "candidate_name": req.body.candidate_name,
                    "title": req.body.title,
                    "salarytype": req.body.salarytype,
                    "salaryduration": req.body.salaryduration,
                    "location": req.body.location,
                    "salarybracket": req.body.salarybracket,
                    "expirydate": req.body.expirydate,
                    "joiningdate": req.body.joiningdate,
                    "offertype": req.body.offertype,
                    "groups": req.body.groups,
                    "high_unopened": req.body.high_unopened ? req.body.high_unopened : undefined,
                    "high_notreplied": req.body.high_notreplied ? req.body.high_notreplied : undefined,
                    "medium_unopened": req.body.medium_unopened ? req.body.medium_unopened : undefined,
                    "medium_notreplied": req.body.medium_notreplied ? req.body.medium_notreplied : undefined,
                    "customfeild": JSON.parse(req.body.customfeild),
                    "notes": req.body.notes,
                    "communication": JSON.parse(req.body.data),
                    "AdHoc": JSON.parse(req.body.AdHoc),
                    "salary_from": req.body.salary_from,
                    "salary_to": req.body.salary_to,
                    "salary": req.body.salary,
                    "message": `<span>{employer}</span> has Created this offer for <span>{candidate}</span>`
                }

            };

            var candidate_user = await common_helper.find(User, { 'email': req.body.email.toLowerCase(), 'is_del': false });
            if (candidate_user.data.length <= 0) {
                var interest_candidate = await common_helper.insert(User, { 'email': req.body.email.toLowerCase(), 'role_id': '5d9d98e13a0c78039c6dd00e' });

                if (req.body.candidate_name != '') {
                    let candidate_name = req.body.candidate_name.split(' ');
                    if (candidate_name.length == 1) {
                        var newcandidate = {
                            'firstname': candidate_name[0],
                            'lastname': '',
                            'user_id': interest_candidate.data._id
                        }
                    } else if (candidate_name.length > 1) {
                        var lastname = '';
                        for (let index = 0; index < candidate_name.length; index++) {
                            const element = candidate_name[index];
                            if (index > 0) {
                                lastname = lastname + ' ' + candidate_name[index]
                            }
                        }
                        var newcandidate = {
                            'firstname': candidate_name[0],
                            'lastname': lastname,
                            'user_id': interest_candidate.data._id
                        }
                    }
                } else if (req.body.candidate_name == '') {
                    var newcandidate = {
                        'firstname': '',
                        'lastname': '',
                        'user_id': interest_candidate.data._id
                    }
                }
                var interest_candidate_detail = await common_helper.insert(CandidateDetail, newcandidate);
                obj.user_id = interest_candidate.data._id;
                var role = await common_helper.findOne(Role, { '_id': interest_candidate.data.role_id });
            } else {
                obj.user_id = candidate_user.data[0]._id;
                var role = await common_helper.findOne(Role, { '_id': candidate_user.data[0].role_id });
            }

            if (role.data.role !== 'candidate') {
                res.status(config.BAD_REQUEST).json({ message: "You can not send offer to this user." });
            } else {
                var pastOffer = await common_helper.find(Offer, { "user_id": ObjectId(obj.user_id), status: "Not Joined" })

                if (pastOffer.data.length > 0) {
                    obj.status = "On Hold"
                }


                var interest_resp = await common_helper.insert(Offer, obj);
                // console.log("===>", interest_resp); return false;
                obj.offer_id = interest_resp.data._id
                obj.employer_id = req.userInfo.id;

                var interest = await common_helper.insert(History, obj);

                if (interest_resp.status == 0) {
                    logger.debug("Error = ", interest_resp.error);
                    res.status(config.INTERNAL_SERVER_ERROR).json(interest_resp);
                } else {
                    var user = await common_helper.findOne(User, { _id: new ObjectId(interest_resp.data.user_id) })
                    var candidate = await common_helper.findOne(CandidateDetail,
                        { user_id: new ObjectId(interest_resp.data.user_id) });
                    var status = await common_helper.findOne(Status, { 'status': 'On Hold' });
                    var mailcontent = await common_helper.findOne(MailContent, { 'mail_type': 'offer_mail' });

                    var upper_content = mailcontent.data.upper_content;
                    var middel_content = mailcontent.data.middel_content;
                    var lower_content = mailcontent.data.lower_content;
                    var name = candidate.data.firstname;

                    upper_content = upper_content.replace("{employername}", `${employer.data.username}`).replace('{offer_expiry_date}', `${moment(interest_resp.data.expirydate).startOf('day').format('DD/MM/YYYY')}`);

                    var obj = {
                        "name": name,
                        "subject": "You have received job offer from " + employer.data.username,
                        "upper_content": upper_content,
                        "middel_content": middel_content,
                        "lower_content": lower_content,
                    }



                    var reply_to = await common_helper.findOne(User, { "_id": interest_resp.data.created_by });
                    if (interest_resp.data.status === "On Hold") {
                        var all_employer = await common_helper.find(User, {
                            "isAllow": true,
                            "is_del": false,
                            $or: [
                                { "_id": new ObjectId(interest_resp.data.employer_id) },
                                { "emp_id": new ObjectId(interest_resp.data.employer_id) },
                            ]
                        })


                        for (let index = 0; index < all_employer.data.length; index++) {
                            const element = all_employer.data[index];

                            if (element.role_id == ("5d9d99003a0c78039c6dd00f")) {
                                var emp_name = await common_helper.findOne(SubEmployerDetail, { "user_id": new ObjectId(element._id) })
                                var email = emp_name.data.username;
                                var name = email.substring(0, email.lastIndexOf(" "));
                                if (name === "") {
                                    name = email;
                                }
                            } else if (element.role_id == ("5d9d98a93a0c78039c6dd00d")) {
                                var emp_name = await common_helper.findOne(EmployerDetail, { "user_id": new ObjectId(element._id) })
                                var email = emp_name.data.username;
                                var name = email.substring(0, email.lastIndexOf(" "));
                                if (name === "") {
                                    name = email;
                                }
                            }

                            var mailcontent = await common_helper.findOne(MailContent, { 'mail_type': 'on_hold_offer' });
                            var upper_content = mailcontent.data.upper_content;
                            var middel_content = mailcontent.data.middel_content;
                            var lower_content = mailcontent.data.lower_content;

                            upper_content = upper_content.replace('{candidatename}', `${candidate.data.firstname + " " + candidate.data.lastname}`);
                            let mail_resp = await mail_helper.send("on_hold_offer", {
                                "to": element.email,
                                "subject": `${candidate.data.firstname + " " + candidate.data.lastname}` + " offer created in On Hold status"
                            }, {
                                "name": name,
                                "upper_content": upper_content,
                                "middel_content": middel_content,
                                "lower_content": lower_content,
                            });
                        }

                    } else {
                        let mail_resp = await new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                            "to": user.data.email,
                            "reply_to1": `${reply_to.data.email}`,
                            "reply_to2": `${interest_resp.data._id}@em7977.hirecommit.com`,
                            "subject": "Offer",
                            "trackid": interest_resp.data._id
                        }, obj);
                    }

                    // {
                    //     "msg": content,
                    //     //"url": "http://192.168.100.23:3000/offer/" + obj.offer_id,
                    //     // "url": "http://localhost:3000/offer/" + obj.offer_id,
                    // }

                    res.json({ "message": "Offer is Added successfully", "data": interest_resp })
                }
            }
        }
        else {
            logger.error("Validation Error = ", errors);
            res.status(config.BAD_REQUEST).json({ message: errors });
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.post('/pastOffer', async (req, res) => {
    try {
        re = new RegExp(req.body.email, "i");
        value = {
            $regex: re
        };
        var user = await common_helper.findOne(User, { "email": value })
        if (user.status == 1) {
            var pastOffer = await common_helper.find(Offer,
                {
                    // "employer_id": ObjectId(req.userInfo.id)
                    $or: [
                        { "created_by": new ObjectId(req.userInfo.id) },
                        { "employer_id": new ObjectId(req.userInfo.id) },
                    ],
                    "user_id": ObjectId(user.data._id), status: "Not Joined"
                });

            if (pastOffer.data.length > 0) {
                pastOffer.displayMessage = "Below are List of offer(s) which the candidate accepted and Not Joined in the past.Offer will be created in Hold status, please manually change it to Released status if desired.";
            }

            var previousOffer = await common_helper.find(Offer, {
                "user_id": ObjectId(user.data._id),
                $or: [
                    { "created_by": new ObjectId(req.userInfo.id) },
                    { "employer_id": new ObjectId(req.userInfo.id) },
                ],
                // "created_by": req.userInfo.id,
                $or: [
                    { status: { $eq: "Accepted" } },
                    { status: { $eq: "On Hold" } }
                ]
            });

            if (previousOffer.data.length > 0) {
                previousOffer.displayMessage = " Please check, this candidate already has offer in either Released, Accepted or On Hold status. You can use edit offer to make any changes to Released and On Hold offers.";
            }


            var ReleasedOffer = await common_helper.find(Offer, {
                "user_id": ObjectId(user.data._id),
                $or: [
                    { "created_by": new ObjectId(req.userInfo.id) },
                    { "employer_id": new ObjectId(req.userInfo.id) },
                ],
                // "created_by": req.userInfo.id,
                $and:
                    [
                        { status: { $eq: "Released" } },
                        { expirydate: { $gte: new Date() } }
                    ]
            });

            if (ReleasedOffer.data.length > 0) {
                ReleasedOffer.displayMessage = "There is already Relesed offer for this Candidate , So you can't create offer.";
            }
        }
        else {
            var pastOffer = [];
            var previousOffer = [];
            var ReleasedOffer = [];
        }
        return res.status(config.OK_STATUS).json({ 'message': "Location List", "status": 1, "data": pastOffer, "previousOffer": previousOffer, "ReleasedOffer": ReleasedOffer });

    }
    catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error occurred while fetching", "status": 0 });
    }
})

router.post('/check_is_candidate', async (req, res) => {
    try {

        re = new RegExp(req.body.email.toLowerCase(), "i");
        value = {
            $regex: re
        };

        value = req.body.email.toLowerCase();
        if (validator.validate(value) == true) {
            var user = await common_helper.findOne(User, { "email": value })

            if (user.status == 2 || user.status == 1 && user.data.role_id == "5d9d98e13a0c78039c6dd00e") {
                res.status(config.OK_STATUS).json({ "status": 1, "message": "valid candidate" });
            }
            else {
                res.status(config.BAD_REQUEST).json({ "status": 2, "message": "You can not sent offer to this user." });
            }
        }
        else {
            res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Email is not valid" })
        }

    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error occurred while fetching", "status": 0 });
    }
})

// unopen offer mail
cron.schedule('00 00 * * *', async (req, res) => {
    try {
        var resp_data = await Offer.aggregate(
            [
                {
                    $match: {
                        status: { $ne: 'On Hold' }
                    }
                },
                {
                    $lookup:
                    {
                        from: "user",
                        localField: "created_by",
                        foreignField: "_id",
                        as: "created_by"
                    }
                },
                {
                    $unwind: {
                        path: "$created_by",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup:
                    {
                        from: "group",
                        localField: "groups",
                        foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $unwind: {
                        path: "$group",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup:
                    {
                        from: "user",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_id"
                    }
                },
                {
                    $unwind: {
                        path: "$user_id",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup:
                    {
                        from: "candidateDetail",
                        localField: "user_id._id",
                        foreignField: "user_id",
                        as: "candidate"
                    }
                },
                {
                    $unwind: {
                        path: "$candidate",
                        preserveNullAndEmptyArrays: true
                    },
                }

            ]
        )

        var current_date = moment().startOf('day')
        var notOpened = [];
        var notReplied = [];

        var i = 0;
        for (const resp of resp_data) {

            var index = i;
            let element = resp;
            var options = {
                method: 'GET',
                url: "https://api.sendgrid.com/v3/messages?limit=10&query=(unique_args%5B'trackid'%5D%3D%22" + element._id + "%22)",
                headers: { authorization: 'Bearer ' + config.SENDGRID_API_KEY },
            };

            request(options, function (error, response, body) {
                try {
                    if (error) throw new Error(error);
                    var new_resp = JSON.parse(response.body);
                    if (new_resp && new_resp.error) {
                        console.log(' :  new_resp.error==> ', new_resp.error);
                    } else if (new_resp && new_resp.messages) {
                        for (const newresp of new_resp.messages) {
                            //   console.log('new ress =>', newresp);
                            var high_unopened = moment(resp.createdAt).startOf('day').add(resp.high_unopened, 'day');
                            var medium_unopened = moment(resp.createdAt).startOf('day').add(resp.medium_unopened, 'day')
                            var high_notreplied = moment(resp.createdAt).startOf('day').add(resp.high_notreplied, 'day');
                            var medium_notreplied = moment(resp.createdAt).startOf('day').add(resp.medium_notreplied, 'day')
                            high_unopened = moment(high_unopened)
                            medium_unopened = moment(medium_unopened)
                            high_notreplied = moment(high_notreplied)
                            medium_notreplied = moment(medium_notreplied)

                            if ((resp.email_open === false && newresp.opens_count === 0 && newresp.to_email === resp.user_id.email) && (moment(current_date).isSame(high_unopened) === true || moment(current_date).isSame(medium_unopened) === true)) {
                                const total_days = moment(current_date).isSame(high_unopened) == true ? resp.high_unopened : moment(current_date).isSame(medium_unopened) == true ? resp.medium_unopened : 0;

                                if (moment(current_date).isSame(high_unopened) === true) {
                                    var priority = "High";
                                } else if (moment(current_date).isSame(medium_unopened) === true) {
                                    var priority = "Medium";
                                }

                                // content = "We have send " + `${resp.title} ` + " offer mail to the " + `${resp.candidate.firstname} ` + " " + `${resp.candidate.lastname} ` + " but he has not open this email for " + `${total_days} ` + " days. Please get in touch with the candidate."

                                var data = {
                                    "candidatename": resp.candidate.firstname + " " + resp.candidate.lastname,
                                    "candidateemail": newresp.to_email,
                                    "subject": newresp.subject,
                                    "not_unopened_days": total_days,
                                    "priority": priority,
                                    "empid": resp.employer_id
                                }
                                notOpened.push(data);
                                // console.log(' :  ==> notOpened', notOpened);
                                valuesmail = notOpened.length
                                console.log(' : valuesmail ==> ', notOpened.length, valuesmail);
                                result.push(data);
                            }

                            if ((resp.reply === false && newresp.to_email === resp.user_id.email) && (moment(current_date).isSame(high_notreplied) === true || moment(current_date).isSame(medium_notreplied) === true)) {

                                const total_days = moment(current_date).isSame(high_notreplied) == true ? resp.high_notreplied : moment(current_date).isSame(medium_notreplied) == true ? resp.medium_notreplied : 0;

                                // content = "We have send " + `${resp.title} ` + " offer mail to the " + `${resp.candidate.firstname} ` + " " + `${resp.candidate.lastname} ` + " but he has not reply for this email for " + `${total_days} ` + " days. Please get in touch with the candidate."

                                if (moment(current_date).isSame(high_notreplied) === true) {
                                    var priority = "High";
                                } else if (moment(current_date).isSame(medium_notreplied) == true) {
                                    var priority = "Medium";
                                }

                                var data = {
                                    "candidatename": resp.candidate.firstname + " " + resp.candidate.lastname,
                                    "candidateemail": newresp.to_email,
                                    "subject": newresp.subject,
                                    "not_replied_days": total_days,
                                    "priority": priority,
                                    "empid": resp.employer_id
                                }

                                notReplied.push(data);
                                // console.log(' : notReplied ==> ', notReplied);
                                valuesmail1 = notReplied.length
                                console.log(' : valuesmail1 ==> ', notReplied.length, valuesmail1);
                                result1.push(data);
                            }

                        }

                    }
                } catch (error) {
                    console.log('error=> ', error.message);
                }
            });
            i++;

        }
        // var notOpeneddata = notOpened;
        setTimeout(async () => {

            if (valuesmail == result.length || valuesmail1 == result1.length) {
                var all_employer = await common_helper.find(User, { "role_id": "5d9d98a93a0c78039c6dd00d" })
                // console.log(' :  valuesmail==> ', valuesmail);
                // console.log(' : valuesmail1==> ', valuesmail1);
                if (all_employer.status == 1) {
                    var new_data = all_employer.data;
                    for (const filterdata of all_employer.data) {
                        const filtered = result.filter(r => r.empid.toString() === filterdata._id.toString())
                        const filtered1 = result1.filter(r => r.empid.toString() === filterdata._id.toString())

                        var emial_send_to = await common_helper.find(User, {
                            "isAllow": true,
                            "is_del": false,
                            $or: [
                                { "_id": new ObjectId(filterdata._id) },
                                { "emp_id": new ObjectId(filterdata._id) },
                            ]
                        })

                        // console.log(' : filtered ==> ', filtered);
                        // console.log(' : filtered1 ==> ', filtered1);
                        if (filtered.length > 0 && emial_send_to.status == 1) {
                            for (const sendto of emial_send_to.data) {
                                const element = sendto;
                                if (element.role_id == ("5d9d99003a0c78039c6dd00f")) {
                                    var emp_name = await common_helper.findOne(SubEmployerDetail, { "user_id": new ObjectId(element._id) })
                                    var email = emp_name.data.username;
                                    var name = email.substring(0, email.lastIndexOf(" "));
                                    if (name === "") {
                                        name = email;
                                    }
                                } else if (element.role_id == ("5d9d98a93a0c78039c6dd00d")) {
                                    var emp_name = await common_helper.findOne(EmployerDetail, { "user_id": new ObjectId(element._id) })
                                    var email = emp_name.data.username;
                                    var name = email.substring(0, email.lastIndexOf(" "));
                                    if (name === "") {
                                        name = email;
                                    }
                                }

                                let mail_resp = await mail_helper.send("not_opened_mail_report", {
                                    "to": element.email,
                                    "subject": "Report of Not Opend candidate"
                                }, {
                                    "name": name,
                                    "data": filtered
                                });
                                if (mail_resp.status == 1) {
                                    filtered = [];
                                    result = [];
                                    valuesmail = 0;
                                }
                            }
                        }

                        if (filtered1.length > 0 && emial_send_to.status == 1) {
                            for (const sendto of emial_send_to.data) {
                                const element = sendto;
                                if (element.role_id == ("5d9d99003a0c78039c6dd00f")) {
                                    var emp_name = await common_helper.findOne(SubEmployerDetail, { "user_id": new ObjectId(element._id) })
                                    var email = emp_name.data.username;
                                    var name = email.substring(0, email.lastIndexOf(" "));
                                    if (name === "") {
                                        name = email;
                                    }
                                } else if (element.role_id == ("5d9d98a93a0c78039c6dd00d")) {
                                    var emp_name = await common_helper.findOne(EmployerDetail, { "user_id": new ObjectId(element._id) })
                                    var email = emp_name.data.username;
                                    var name = email.substring(0, email.lastIndexOf(" "));
                                    if (name === "") {
                                        name = email;
                                    }
                                }

                                let mail_resp = await mail_helper.send("not_replied_mail_report", {
                                    "to": element.email,
                                    "subject": "Report of Not Replied candidate"
                                }, {
                                    "name": name,
                                    "data": filtered1
                                });
                                if (mail_resp.status == 1) {
                                    filtered1 = [];
                                    result1 = [];
                                    valuesmail1 = 0;
                                }
                            }
                        }
                    }
                }
            }
        }, 10000);
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
})

// offers mail
cron.schedule('00 00 * * *', async (req, res) => {
    try {
        var resp_data = await Offer.aggregate(
            [
                {
                    $lookup:
                    {
                        from: "user",
                        localField: "created_by",
                        foreignField: "_id",
                        as: "created_by"
                    }
                },
                {
                    $unwind: {
                        path: "$created_by",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup:
                    {
                        from: "group",
                        localField: "groups",
                        foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $unwind: {
                        path: "$group",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup:
                    {
                        from: "user",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_id"
                    }
                },
                {
                    $unwind: {
                        path: "$user_id",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup:
                    {
                        from: "candidateDetail",
                        localField: "user_id._id",
                        foreignField: "user_id",
                        as: "candidate"
                    }
                },
                {
                    $unwind: {
                        path: "$candidate",
                        preserveNullAndEmptyArrays: true
                    },
                }

            ]
        )

        var current_date = moment().startOf('day')

        for (const resp of resp_data) {
            if (resp.status === "Accepted" && moment(resp.joiningdate).startOf('day').add(1, 'day').isSame(current_date)) {
                var all_employer = await common_helper.find(User, {
                    "isAllow": true,
                    "is_del": false,
                    $or: [
                        { "_id": new ObjectId(resp.employer_id) },
                        { "emp_id": new ObjectId(resp.employer_id) },
                    ]
                })

                for (const element of all_employer.data) {
                    if (element.role_id == ("5d9d99003a0c78039c6dd00f")) {
                        var emp_name = await common_helper.findOne(SubEmployerDetail, { "user_id": new ObjectId(element._id) })
                        var fullname = emp_name.data.username;
                        var name = fullname.substring(0, fullname.lastIndexOf(" "));
                        if (name === "") {
                            name = fullname;
                        }
                    } else if (element.role_id == ("5d9d98a93a0c78039c6dd00d")) {
                        var emp_name = await common_helper.findOne(EmployerDetail, { "user_id": new ObjectId(element._id) })
                        var fullname = emp_name.data.username;
                        var name = fullname.substring(0, fullname.lastIndexOf(" "));
                        if (name === "") {
                            name = fullname;
                        }
                    }

                    var message = await common_helper.findOne(MailContent, { 'mail_type': "candidate_has_joined" });
                    var upper_content = message.data.upper_content;
                    var middel_content = message.data.middel_content;
                    var lower_content = message.data.lower_content;

                    var location = await common_helper.findOne(Location, { '_id': resp.location });

                    upper_content = upper_content.replace('{candidatename}', `${resp.candidate.firstname + " " + resp.candidate.lastname}`).replace("{title}", resp.title).replace("{location}", location.data.city);

                    let mail_resp = await mail_helper.send("candidate_has_joined", {
                        "to": element.email,
                        "subject": `${resp.candidate.firstname + " " + resp.candidate.lastname}` + " has joined"
                    }, {
                        "name": name,
                        "upper_content": upper_content,
                        "middel_content": middel_content,
                        "lower_content": lower_content,
                    });
                }
            } else if (resp.status === "Released" && moment(resp.expirydate).startOf('day').subtract(1, 'day').isSame(current_date)) {
                var employer_name = await common_helper.findOne(EmployerDetail, { "user_id": resp.created_by._id });
                var employer_name1 = await common_helper.findOne(SubEmployerDetail, { "user_id": resp.created_by._id });

                if (employer_name.status == 1) {
                    var employername = employer_name.data.username;
                } else {
                    var employername = employer_name1.data.username;
                }

                var message = await common_helper.findOne(MailContent, { 'mail_type': "offer_expiring" });

                var upper_content = message.data.upper_content;
                var middel_content = message.data.middel_content;
                var lower_content = message.data.lower_content;

                upper_content = upper_content.replace('{employername}', employername);

                let mail_resp = await mail_helper.send("offer_expiring", {
                    "to": resp.user_id.email,
                    "subject": "Your offer from " + `${employername}` + " is expiring soon!!"
                }, {
                    "name": resp.candidate.firstname,
                    "upper_content": upper_content,
                    "middel_content": middel_content,
                    "lower_content": lower_content,
                });
            } else if (resp.status !== "Accepted" && moment(resp.expirydate).startOf('day').add(1, 'day').isSame(current_date)) {

                var all_employer = await common_helper.find(User, {
                    "isAllow": true,
                    "is_del": false,
                    $or: [
                        { "_id": new ObjectId(resp.employer_id) },
                        { "emp_id": new ObjectId(resp.employer_id) },
                    ]
                })

                for (const element of all_employer.data) {
                    if (element.role_id == ("5d9d99003a0c78039c6dd00f")) {
                        var emp_name = await common_helper.findOne(SubEmployerDetail, { "user_id": new ObjectId(element._id) })
                        var fullname = emp_name.data.username;
                        var name = fullname.substring(0, fullname.lastIndexOf(" "));
                        if (name === "") {
                            name = fullname;
                        }
                    } else if (element.role_id == ("5d9d98a93a0c78039c6dd00d")) {
                        var emp_name = await common_helper.findOne(EmployerDetail, { "user_id": new ObjectId(element._id) })
                        var fullname = emp_name.data.username;
                        var name = fullname.substring(0, fullname.lastIndexOf(" "));
                        if (name === "") {
                            name = fullname;
                        }
                    }

                    var message = await common_helper.findOne(MailContent, { 'mail_type': "offer_expiring_employer" });
                    var upper_content = message.data.upper_content;
                    var middel_content = message.data.middel_content;
                    var lower_content = message.data.lower_content;

                    var location = await common_helper.findOne(Location, { '_id': resp.location });

                    upper_content = upper_content.replace('{candidatename}', `${resp.candidate.firstname + " " + resp.candidate.lastname}`).replace("{title}", resp.title).replace("{location}", location.data.city);

                    let mail_resp = await mail_helper.send("offer_expiring", {
                        "to": element.email,
                        "subject": `${resp.candidate.firstname + " " + resp.candidate.lastname}` + " offer expired"
                    }, {
                        "name": name,
                        "upper_content": upper_content,
                        "middel_content": middel_content,
                        "lower_content": lower_content,
                    });
                }
            } else if (resp.status === "Accepted" && moment(resp.joiningdate).startOf('day').subtract(2, 'day').isSame(current_date)) {
                var employer_name = await common_helper.findOne(EmployerDetail, { "user_id": resp.created_by._id });
                var employer_name1 = await common_helper.findOne(SubEmployerDetail, { "user_id": resp.created_by._id });

                if (employer_name.status == 1) {
                    var employername = employer_name.data.username;
                } else {
                    var employername = employer_name1.data.username;
                }

                var message = await common_helper.findOne(MailContent, { 'mail_type': "offer_expiring" });

                var upper_content = message.data.upper_content;
                var middel_content = message.data.middel_content;
                var lower_content = message.data.lower_content;

                upper_content = upper_content.replace('{employername}', employername).replace('{joiningdate}', moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY'));

                let mail_resp = await mail_helper.send("candidate_has_joined", {
                    "to": resp.user_id.email,
                    "subject": "Your start date at " + `${employername}` + " is here!!!!"
                }, {
                    "name": resp.candidate.firstname,
                    "upper_content": upper_content,
                    "middel_content": middel_content,
                    "lower_content": lower_content,
                });
            }
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

// comunication mail
cron.schedule('* * * * *', async (req, res) => {
    try {
        var resp_data = await Offer.aggregate(
            [
                {
                    $match: {
                        status: { $ne: 'On Hold' },
                    }
                },
                {
                    $lookup:
                    {
                        from: "user",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "candidate"
                    }
                },
                {
                    $unwind: {
                        path: "$candidate",
                    },
                },
                {
                    $lookup:
                    {
                        from: "user",
                        localField: "created_by",
                        foreignField: "_id",
                        as: "created_by"
                    }
                },
                {
                    $unwind: {
                        path: "$created_by",
                    },
                },
                {
                    $lookup:
                    {
                        from: "group",
                        localField: "groups",
                        foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $unwind: {
                        path: "$group",
                        preserveNullAndEmptyArrays: true
                    },
                },

            ]
        )
        var current_date = moment().startOf('day')

        for (const resp of resp_data) {
            if (resp.communication !== undefined && resp.communication.length > 0) {
                for (const comm of resp.communication) {
                    if (comm.trigger == "afterOffer") {
                        var days = comm.day
                        var offer_date = moment(resp.createdAt).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date);
                        var message = comm.message;
                        var email = resp.candidate.email

                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            // var mail_record = await common_helper.insert(MailRecord, { "tracker_id": resp._id + 'communication_afterOffer', "offer_id": resp._id })
                            // logger.trace("sending mail");
                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "reply_to2": `${resp._id}@em7977.hirecommit.com`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "communication_afterOffer"
                            }, obj);

                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "communication._id": comm._id },
                                    {
                                        $set: {
                                            "communication.$.reply": false,
                                            "communication.$.open": false
                                        }
                                    })
                            }

                            // if (mail_resp.status == 1) {
                            //     var update_offer_communication = await common_helper.update(Offer, { "communication._id": comm._id })
                            // }
                            // console.log(' : mail_resp ==> ', mail_resp);

                            // let mail_resp = new_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                            //     "to": resp.candidate.email,
                            //     "subject": "Communication mail",
                            //     "trackid": resp._id + 'communication_afterOffer'
                            // }, message);
                        }
                    }
                    if (comm.trigger == "beforeJoining") {
                        var days = comm.day
                        var offer_date = moment(resp.joiningdate).startOf('day').subtract(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.message;
                        var email = resp.candidate.email;

                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                // "reply_to2": `${resp._id}@em7977.hirecommit.com`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "communication_beforeJoining"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "communication._id": comm._id },
                                    {
                                        $set: {
                                            "communication.$.reply": false,
                                            "communication.$.open": false
                                        }
                                    })
                            }
                        }
                    }
                    if (comm.trigger == "afterJoining") {
                        var days = comm.day
                        var offer_date = moment(resp.joiningdate).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "communication_afterJoining"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "communication._id": comm._id },
                                    {
                                        $set: {
                                            "communication.$.reply": false,
                                            "communication.$.open": false
                                        }
                                    })
                            }
                        }

                    }
                    if (comm.trigger == "beforeExpiry") {
                        var days = comm.day
                        var offer_date = moment(resp.expirydate).startOf('day').subtract(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "communication_beforeExpiry"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "communication._id": comm._id },
                                    {
                                        $set: {
                                            "communication.$.reply": false,
                                            "communication.$.open": false
                                        }
                                    })
                            }
                        }

                    }
                    if (comm.trigger == "afterExpiry") {
                        var days = comm.day
                        var offer_date = moment(resp.expirydate).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "communication_afterExpiry"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "communication._id": comm._id },
                                    {
                                        $set: {
                                            "communication.$.reply": false,
                                            "communication.$.open": false
                                        }
                                    })
                            }
                        }

                    }
                    if (comm.trigger == "afterAcceptance") {
                        var days = comm.day
                        var offer_date = moment(resp.acceptedAt).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "communication_afterAcceptance"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "communication._id": comm._id },
                                    {
                                        $set: {
                                            "communication.$.reply": false,
                                            "communication.$.open": false
                                        }
                                    })
                            }
                        }
                    }
                }
            }

            if (resp.AdHoc !== undefined && resp.AdHoc.length > 0) {
                for (const comm of resp.AdHoc) {
                    if (comm.AdHoc_trigger == "afterOffer") {
                        var days = comm.AdHoc_day;
                        var offer_date = moment(resp.createdAt).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date);
                        var message = comm.AdHoc_message;
                        var email = resp.candidate.email

                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "adhoc_afterOffer"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "AdHoc._id": comm._id },
                                    {
                                        $set: {
                                            "AdHoc.$.reply": false,
                                            "AdHoc.$.open": false
                                        }
                                    })
                            }

                        }
                    }
                    if (comm.AdHoc_trigger == "beforeJoining") {
                        var days = comm.AdHoc_day;
                        var offer_date = moment(resp.joiningdate).startOf('day').subtract(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.AdHoc_message;
                        var email = resp.candidate.email;

                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "adhoc_beforeJoining"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "AdHoc._id": comm._id },
                                    {
                                        $set: {
                                            "AdHoc.$.reply": false,
                                            "AdHoc.$.open": false
                                        }
                                    })
                            }
                        }
                    }
                    if (comm.AdHoc_trigger == "afterJoining") {
                        var days = comm.AdHoc_day;
                        var offer_date = moment(resp.joiningdate).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.AdHoc_message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "adhoc_afterJoining"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "AdHoc._id": comm._id },
                                    {
                                        $set: {
                                            "AdHoc.$.reply": false,
                                            "AdHoc.$.open": false
                                        }
                                    })
                            }
                        }

                    }
                    if (comm.AdHoc_trigger == "beforeExpiry") {
                        var days = comm.AdHoc_day;
                        var offer_date = moment(resp.expirydate).startOf('day').subtract(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.AdHoc_message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "adhoc_beforeExpiry"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "AdHoc._id": comm._id },
                                    {
                                        $set: {
                                            "AdHoc.$.reply": false,
                                            "AdHoc.$.open": false
                                        }
                                    })
                            }
                        }

                    }
                    if (comm.AdHoc_trigger == "afterExpiry") {
                        var days = comm.AdHoc_day;
                        var offer_date = moment(resp.expirydate).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.AdHoc_message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "adhoc_afterExpiry"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "AdHoc._id": comm._id },
                                    {
                                        $set: {
                                            "AdHoc.$.reply": false,
                                            "AdHoc.$.open": false
                                        }
                                    })
                            }
                        }

                    }
                    if (comm.AdHoc_trigger == "afterAcceptance") {
                        var days = comm.AdHoc_day
                        var offer_date = moment(resp.acceptedAt).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        var message = comm.AdHoc_message;
                        var email = resp.candidate.email
                        if (moment(current_date).isSame(offer_date) == true) {
                            var message = comm.message;

                            var candidate_name = await common_helper.findOne(CandidateDetail, { "user_id": resp.candidate._id })
                            var location = await common_helper.findOne(Location, { "_id": resp.location })

                            message = message.replace('||offer_date||', moment(resp.createdAt).startOf('day').format('DD/MM/YYYY')).replace("||candidate_name||", `${candidate_name.data.firstname + " " + candidate_name.data.lastname}`).replace("||title||", resp.title).replace("||location||", location.data.city).replace("||joining_date||", moment(resp.joiningdate).startOf('day').format('DD/MM/YYYY')).replace("||expiry_date||", moment(resp.expirydate).startOf('day').format('DD/MM/YYYY')).replace("||acceptance_date||", moment(resp.acceptedAt).startOf('day').format('DD/MM/YYYY'));

                            var obj = {
                                "message": message,
                                "subject": comm.communicationname
                            }

                            let mail_resp = await communication_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                                "to": resp.candidate.email,
                                "reply_to": `${resp.created_by.email}`,
                                "subject": comm.communicationname,
                                "trackid": resp._id + "adhoc_afterAcceptance"
                            }, obj);
                            if (mail_resp.status == 1) {
                                var update_offer_communication = await common_helper.update(Offer,
                                    { "_id": resp._id, "AdHoc._id": comm._id },
                                    {
                                        $set: {
                                            "AdHoc.$.reply": false,
                                            "AdHoc.$.open": false
                                        }
                                    })
                            }
                        }

                    }
                }
            }
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});


router.post('/get', async (req, res) => {
    try {
        var schema = {

        };
        req.checkBody(schema);
        var errors = req.validationErrors();

        if (!errors) {
            var sortOrderColumnIndex = req.body.order[0].column;
            let sortOrderColumn = sortOrderColumnIndex == 0 ? '_id' : req.body.columns[sortOrderColumnIndex].data;
            let sortOrder = req.body.order[0].dir == 'asc' ? 1 : -1;
            let sortingObject = {
                [sortOrderColumn]: sortOrder
            }

            var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

            if (user.status == 1 && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
                var user_id = user.data.emp_id
            }
            else {
                var user_id = req.userInfo.id
            }
            var aggregate = [
                { $match: { $or: [{ "employer_id": new ObjectId(req.userInfo.id) }, { "employer_id": new ObjectId(user_id) }], "is_del": false } },
                {
                    $lookup:
                    {
                        from: "group",
                        localField: "groups",
                        foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $unwind: {
                        path: "$group",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup:
                    {
                        from: "user",
                        localField: "employer_id",
                        foreignField: "_id",
                        as: "employer_id"
                    }
                },
                {
                    $unwind: {
                        path: "$employer_id",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup:
                    {
                        from: "location",
                        localField: "location",
                        foreignField: "_id",
                        as: "location"
                    }
                },
                {
                    $unwind: {
                        path: "$location",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup:
                    {
                        from: "salary_bracket",
                        localField: "salarybracket",
                        foreignField: "_id",
                        as: "salarybracket"
                    }
                },
                {
                    $unwind: {
                        path: "$salarybracket",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup:
                    {
                        from: "candidateDetail",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "candidate"
                    }
                },
                {
                    $unwind: {
                        path: "$candidate",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "user",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "candidate.user",
                    }
                },
                {
                    $unwind: {
                        path: "$candidate.user",
                        preserveNullAndEmptyArrays: true
                    }
                },
            ]

            const RE = { $regex: new RegExp(`${req.body.search.value} `, 'gi') };

            if (req.body.search && req.body.search.value != '') {
                aggregate.push({
                    "$match":
                        { $or: [{ "createdAt": RE }, { "title": RE }, { "salarytype": RE }, { "salarybracket.from": RE }, { "expirydate": RE }, { "joiningdate": RE }, { "status": RE }, { "offertype": RE }, { "group.name": RE }, { "commitstatus": RE }, { "customfeild1": RE }, { "candidate.user.email": RE }, { "candidate.firstname": RE }] }
                });
            }

            let totalMatchingCountRecords = await Offer.aggregate(aggregate);
            totalMatchingCountRecords = totalMatchingCountRecords.length;

            var resp_data = await offer_helper.get_all_offer(Offer, user_id, req.body.search, req.body.start, req.body.length, totalMatchingCountRecords, sortingObject);

            if (resp_data.status == 1) {
                res.status(config.OK_STATUS).json(resp_data);
            } else {
                res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
            }
        } else {
            logger.error("Validation Error = ", errors);
            res.status(config.BAD_REQUEST).json({ message: errors });
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.put("/status_change", async (req, res) => {
    try {
        var id = req.body.id
        var obj = {
            "status": req.body.status,
        }

        var resp_data = await Offer.aggregate(
            [
                {
                    $match: {
                        "_id": new ObjectId(id)
                    }
                },
                {
                    $lookup:
                    {
                        from: "group",
                        localField: "groups",
                        foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $unwind: {
                        path: "$group",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup:
                    {
                        from: "group_detail",
                        localField: "groups._id",
                        foreignField: "group_id",
                        as: "communication"
                    }
                },
                {
                    $unwind: {
                        path: "$communication",
                        preserveNullAndEmptyArrays: true
                    },
                }
            ]
        )
        var obj = {};
        if (resp_data[0].status == "On Hold") {
            obj.status = "Released"
        }
        if (resp_data[0].status == "Released") {
            obj.status = "Inactive"
        }
        if (resp_data[0].status == "Accepted") {
            obj.status = "Not Joined"
        }

        obj.offer_id = req.body.id
        var interest = await common_helper.insert(History, obj);

        var update_status = await common_helper.update(Offer, { "_id": req.body.id }, obj)

        content = update_status.data.title + "'s status has been changed to " + obj.status

        let mail_resp = await mail_helper.send("status_change", {
            "to": offer_upadate.data.email,
            "subject": "Change Status of offer to." + " " + obj.status
        }, {
            "msg": content,
        });

        res.status(config.OK_STATUS).json({ "message": "Status is changed successfully", "status": obj.status });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.put("/deactive_offer/:id", async (req, res) => {
    try {
        var obj = {
            is_del: true
        }
        var id = req.params.id;
        var resp_data = await common_helper.update(Offer, { "_id": id }, obj);
        if (resp_data.status == 0) {
            logger.error("Error occured while fetching User = ", resp_data);
            res.status(config.INTERNAL_SERVER_ERROR).json(resp_data);
        } else if (resp_data.status == 1) {
            logger.trace("User got successfully = ", resp_data);
            res.status(config.OK_STATUS).json({ "message": "Offer is Updated successfully", resp_data });
        }
        else {
            res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error occurred while fetching data." });
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.put('/', async (req, res) => {
    try {
        var obj = {};

        if (req.body.groups && req.body.groups != "") {
            obj.groups = req.body.groups
        }

        // if (req.body.high_unopened && req.body.high_unopened != "") {
        obj.high_unopened = req.body.high_unopened
        // }
        // if (req.body.high_notreplied && req.body.high_notreplied != "") {
        obj.high_notreplied = req.body.high_notreplied
        // }
        // if (req.body.medium_unopened && req.body.medium_unopened != "") {
        obj.medium_unopened = req.body.medium_unopened
        // }
        // if (req.body.medium_notreplied && req.body.medium_notreplied != "") {
        obj.medium_notreplied = req.body.medium_notreplied
        // }

        if (req.body.title && req.body.title != "") {
            obj.title = req.body.title
        }
        if (req.body.salarytype && req.body.salarytype != "") {
            obj.salarytype = req.body.salarytype
        }

        if (req.body.salaryduration && req.body.salaryduration != "") {
            obj.salaryduration = req.body.salaryduration
        }
        if (req.body.country && req.body.country != "") {
            obj.country = req.body.country
        }
        if (req.body.location && req.body.location != "") {
            obj.location = req.body.location
        }
        if (req.body.currenct_type && req.body.currenct_type != "") {
            obj.currenct_type = req.body.currenct_type
        }
        if (req.body.salarybracket && req.body.salarybracket != "") {
            obj.salarybracket = req.body.salarybracket
        }
        if (req.body.expirydate && req.body.expirydate != "") {
            obj.expirydate = req.body.expirydate
        }
        if (req.body.joiningdate && req.body.joiningdate != "") {
            obj.joiningdate = req.body.joiningdate
        }
        if (req.body.offertype && req.body.offertype != "") {
            obj.offertype = req.body.offertype
        }
        if (req.body.group && req.body.group != "") {
            obj.group = req.body.group
        }
        if (req.body.status && req.body.status != "") {
            obj.status = req.body.status
        }
        if (req.body.notes && req.body.notes != "") {
            obj.notes = req.body.notes
        }

        if (req.body.salary && req.body.salary != "") {
            obj.salary = req.body.salary
        }
        if (req.body.salary_from && req.body.salary_from != "") {
            obj.salary_from = req.body.salary_from
        }
        if (req.body.salary_to && req.body.salary_to != "") {
            obj.salary_to = req.body.salary_to
        }

        if (req.body.customfeild && req.body.customfeild != "") {
            obj.customfeild = JSON.parse(req.body.customfeild)
        }
        if (req.body.data && req.body.data != "") {
            obj.communication = JSON.parse(req.body.data)
        }

        if (req.body.AdHoc && req.body.AdHoc != "") {
            obj.AdHoc = JSON.parse(req.body.AdHoc)
        }

        if (req.body.is_active && req.body.is_active != "") {
            obj.is_active = JSON.parse(req.body.is_active)
        }

        var id = req.body.id;

        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

        if (user && user.data.role_id == ("5d9d99003a0c78039c6dd00f")) {
            employer = await common_helper.findOne(SubEmployerDetail, { emp_id: user.data.emp_id });
        } else {
            employer = await common_helper.findOne(EmployerDetail, { user_id: req.userInfo.id });
        }

        var offer = await common_helper.findOne(Offer, { "_id": ObjectId(id) }, obj);
        if (req.body.salary == "") {
            var unset_salary = await Offer.update({ "_id": ObjectId(id) }, { $unset: { salary: "" } })
        } else if (req.body.salary_from == "" && req.body.salary_to == "") {
            var unset_salary = await Offer.update({ "_id": ObjectId(id) }, { $unset: { salary_from: "", salary_to: "" } })
        }

        if (req.body.groups === "") {
            var unset_groups = await Offer.updateOne({ "_id": ObjectId(id) }, { $unset: { groups: "" } })
        }

        var offer_upadate = await common_helper.update(Offer, { "_id": ObjectId(id) }, obj);
        var user_email = await common_helper.findOne(User, { "_id": offer_upadate.data.user_id })
        obj.status = offer_upadate.data.status;

        if (offer.data.status !== req.body.status) {
            obj.offer_id = offer_upadate.data._id;
            obj.employer_id = req.userInfo.id;
            obj.message = `< span > { employer }</span > has ${req.body.status} this offer for <span>{candidate}</span>`
            var interest = await common_helper.insert(History, obj);
        }

        if (offer_upadate.status == 0) {
            res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
        }
        else if (offer_upadate.status == 1) {

            if (offer.data.status === "Released" && offer_upadate.data.status === "Released") {
                var message = await common_helper.findOne(MailContent, { 'mail_type': "update_offer" });

                let upper_content = message.data.upper_content;
                let middel_content = message.data.middel_content;
                let lower_content = message.data.lower_content;

                upper_content = upper_content.replace('{employername}', employer.data.username).replace("{expirydate}", moment(offer.data.expirydate).startOf('day').format('DD/MM/YYYY'));
                var user_name = await common_helper.findOne(CandidateDetail, { "user_id": offer_upadate.data.user_id })
                var name = user_name.data.firstname;

                let mail_resp = await mail_helper.send("update_offer", {
                    "to": user_email.data.email,
                    "subject": "Offer from " + `${employer.data.username}` + " has been updated"
                }, {
                    "name": name,
                    "upper_content": upper_content,
                    "middel_content": middel_content,
                    "lower_content": lower_content
                });

            } else if (offer.data.status === "Accepted" && offer_upadate.data.status === "Not Joined" && offer_upadate.data.offertype !== "noCommit") {
                var message = await common_helper.findOne(MailContent, { 'mail_type': "not_join_offer" });

                let upper_content = message.data.upper_content;
                let lower_content = message.data.lower_content;

                upper_content = upper_content.replace('{employername}', employer.data.username);
                var user_name = await common_helper.findOne(CandidateDetail, { "user_id": offer_upadate.data.user_id })
                var name = user_name.data.firstname;

                let mail_resp = await mail_helper.send("not_joined_offer", {
                    "to": user_email.data.email,
                    "subject": employer.data.username + " has marked that you have Not Joined after accepting an offer"
                }, {
                    "name": name,
                    "upper_content": upper_content,
                    "lower_content": lower_content
                });
            } else if (offer.data.status === "On Hold" && offer_upadate.data.status === "Released") {
                var user_name = await common_helper.findOne(CandidateDetail, { "user_id": offer_upadate.data.user_id })
                var name = user_name.data.firstname;

                var mailcontent = await common_helper.findOne(MailContent, { 'mail_type': 'offer_mail' });
                var upper_content = mailcontent.data.upper_content;
                var middel_content = mailcontent.data.middel_content;
                var lower_content = mailcontent.data.lower_content;

                upper_content = upper_content.replace("{employername}", `${employer.data.username}`).replace('{offer_expiry_date}', `${moment(offer_upadate.data.expirydate).startOf('day').format('DD/MM/YYYY')}`);

                var obj = {
                    "name": name,
                    "subject": "You have received job offer from " + `${employer.data.username}`,
                    "upper_content": upper_content,
                    "middel_content": middel_content,
                    "lower_content": lower_content,
                }

                var reply_to = await common_helper.findOne(User, { "_id": offer_upadate.data.created_by });
                let mail_resp = await new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                    "to": user_email.data.email,
                    "reply_to1": `${reply_to.data.email}`,
                    "reply_to2": `${offer_upadate.data._id}@em7977.hirecommit.com`,
                    "subject": "You have received job offer from " + `${employer.data.username}`,
                    "trackid": offer_upadate.data._id
                }, obj);
            }

            res.status(config.OK_STATUS).json({ "status": 1, "message": "Offer is Updated successfully", "data": offer_upadate });
        }
        else {
            res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error occurred while fetching data." });
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
})

router.get('/details/:id', async (req, res) => {
    var id = req.params.id;
    try {
        const offer_detail = await Offer.findOne({ '_id': id })
            .populate([
                { path: 'employer_id' },
                { path: 'location' },
                { path: 'group' },
                { path: 'user_id' }
            ])
            .lean();


        var candidate_detail = await common_helper.findOne(CandidateDetail, { 'user_id': offer_detail.user_id._id });
        return res.status(config.OK_STATUS).json({ 'message': "Offer detail", "status": 1, data: offer_detail, 'candidate_data': candidate_detail });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.get('/history/:id', async (req, res) => {
    var id = req.params.id;
    var history = [];
    var message = {};
    try {

        var history_data = await History.aggregate([
            {
                $match: {
                    "offer_id": new ObjectId(id)
                }
            },
            {
                $lookup:
                {
                    from: "offer",
                    localField: "offer_id",
                    foreignField: "_id",
                    as: "offer"
                }
            },

            {
                $unwind: "$offer",
            },
            {
                $lookup:
                {
                    from: "employerDetail",
                    localField: "offer.employer_id",
                    foreignField: "user_id",
                    as: "employer"
                }
            },

            {
                $unwind: "$employer"
            },

        ])


        for (let index = 0; index < history_data.length; index++) {
            const element = history_data[index];
            if (element.employer_id && element.employer_id != undefined) {
                var employer = await common_helper.findOne(EmployerDetail, { "user_id": element.employer_id });

                var sub_employer = await common_helper.findOne(SubEmployerDetail, { "user_id": element.employer_id });

                var candidate = await common_helper.findOne(CandidateDetail, { "user_id": element.offer.user_id });
                var user = await common_helper.findOne(User, { "_id": element.offer.user_id });
                if (employer.status === 1 && candidate.status === 1 && user.status === 1) {
                    var content = element.message;
                    if (candidate.data.firstname !== "" && candidate.data.lastname !== "") {
                        content = content.replace("{employer}", `${employer.data.username} `).replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);

                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                    } else {
                        content = content.replace("{employer}", `${employer.data.username} `).replace('{candidate}', user.data.email);

                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                    }
                    history.push(message);
                } else if (sub_employer.status === 1 && candidate.status === 1 && user.status === 1) {
                    var content = element.message;
                    if (candidate.data.firstname !== "" && candidate.data.lastname !== "") {
                        content = content.replace("{employer}", `${sub_employer.data.username} `).replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }

                    } else {
                        content = content.replace("{employer}", `${employer.data.username} `).replace('{candidate}', user.data.email);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                    }
                    history.push(message);
                }
            } else if (element.employer_id == undefined) {
                var candidate = await common_helper.findOne(CandidateDetail, { "user_id": element.offer.user_id });
                var user = await common_helper.findOne(User, { "_id": element.offer.user_id });
                if (candidate.status === 1 && user.status === 1) {
                    let content = element.message;
                    if (candidate.data.firstname !== "" && candidate.data.lastname !== "") {
                        content = content.replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                    } else {
                        content = content.replace('{candidate}', user.data.email);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                    }
                }
                history.push(message);
            }
        }

        if (history_data) {
            return res.status(config.OK_STATUS).json({ 'message': "Offer history", "status": 1, data: history });
        }
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

router.get("/status_list/:status", async (req, res) => {
    try {
        var status = req.params.status;
        var obj = {};
        if (status === 'On Hold') {
            obj.status = [
                { label: 'On Hold', value: 'On Hold' },
                { label: 'Released', value: 'Released' },
            ];
        } else if (status === 'Released') {
            obj.status = [
                { label: 'Released', value: 'Released' },
                { label: 'Inactive', value: 'Inactive' }
            ];
        }
        else if (status === 'Accepted') {
            obj.status = [
                { label: 'Accepted', value: 'Accepted' },
                { label: 'Not Joined', value: 'Not Joined' },
            ];
        } else if (status === 'Not Joined') {
            obj.status = [
                { label: 'Not Joined', value: 'Not Joined' },
                { label: 'Inactive', value: 'Inactive' }
            ];
        } else if (status === 'Inactive') {
            obj.status = [
                { label: 'Inactive', value: 'Inactive' }
            ];
        }
        res.status(config.OK_STATUS).json({ "message": "Status is changed successfully", "status": obj.status });
    } catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': error.message, "success": false })
    }
});

module.exports = router;

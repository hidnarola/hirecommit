var express = require("express");
var router = express.Router();

var config = require('../../config')
var Offer = require('../../models/offer');
var ObjectId = require('mongoose').Types.ObjectId;
var common_helper = require('../../helpers/common_helper');
var cron = require('node-cron');
var validator = require("email-validator");
var offer_helper = require('../../helpers/offer_helper');
var mail_helper = require('../../helpers/mail_helper');
var new_mail_helper = require('../../helpers/new_mail_helper');

var logger = config.logger;
var moment = require("moment")
var User = require('../../models/user');
var CandidateDetail = require("../../models/candidate-detail");
var SubEmployerDetail = require("../../models/sub-employer-detail");
var EmployerDetail = require("../../models/employer-detail");
var Role = require('../../models/role');
var Status = require("../../models/status");
var History = require('../../models/offer_history');
var MailRecord = require('../../models/mail_record');
var MailContent = require('../../models/mail_content');
var ApiLog = require('../../models/api_log');
var request = require('request');
var http = require("https");

//Offer
router.post("/", async (req, res) => {
    var schema = {
        "email": {
            notEmpty: true,
            errorMessage: "Email is required"
        },
        // "name": {
        //     notEmpty: true,
        //     errorMessage: "Name is required"
        // },
        "title": {
            notEmpty: true,
            errorMessage: "Title is required"
        },
        "salarytype": {
            notEmpty: true,
            errorMessage: "Salary Type is required"
        },
        // "country": {
        //     notEmpty: true,
        //     errorMessage: "Country is required"
        // },
        "location": {
            notEmpty: true,
            errorMessage: "Location is required"
        },
        // "salarybracket": {
        //     notEmpty: true,
        //     errorMessage: "Salary Bracket is required"
        // },
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
        // "groups": {
        //     notEmpty: true,
        //     errorMessage: "Group is required"
        // },
        // "commitstatus": {
        //     notEmpty: true,
        //     errorMessage: "Commit Status is required"
        // }
    };
    req.checkBody(schema);
    // console.log(req.body);

    var errors = req.validationErrors();
    if (!errors) {

        var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })
        // var candidate = await common_helper.findOne(CandidateDetail,
        //     { user_id: new ObjectId(req.body.email) });

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
                // "country": req.body.country,
                "location": req.body.location,
                // "currency_type": req.body.currency_type,
                // "salarybracket": req.body.salarybracket,
                "expirydate": req.body.expirydate,
                "joiningdate": req.body.joiningdate,
                //  "status": true,
                "offertype": req.body.offertype,
                "groups": req.body.groups,
                // "commitstatus": req.body.commitstatus,
                "customfeild": JSON.parse(req.body.customfeild),
                "notes": req.body.notes,
                "salary_from": req.body.salary_from,
                "salary_to": req.body.salary_to,
                "salary": req.body.salary,
                "communication": JSON.parse(req.body.data),
                "message": `<span>{employer}</span> has Created this offer for <span>{candidate}</span>`
            }
        }
        else {
            employer = await common_helper.findOne(EmployerDetail, { user_id: req.userInfo.id });
            company = employer.data.companyname;
            // console.log(' : employer ==> ', company); return false;
            var obj = {
                "employer_id": req.userInfo.id,
                "created_by": req.userInfo.id,
                "email": req.body.email.toLowerCase(),
                "candidate_name": req.body.candidate_name,
                "title": req.body.title,
                "salarytype": req.body.salarytype,
                "salaryduration": req.body.salaryduration,
                // "country": req.body.country,
                "location": req.body.location,
                // "currency_type": req.body.currency_type,
                "salarybracket": req.body.salarybracket,
                "expirydate": req.body.expirydate,
                "joiningdate": req.body.joiningdate,
                //  "status": true,
                "offertype": req.body.offertype,
                "groups": req.body.groups,
                // "commitstatus": req.body.commitstatus,
                "customfeild": JSON.parse(req.body.customfeild),
                "notes": req.body.notes,
                "communication": JSON.parse(req.body.data),
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
                if (candidate_name.length <= 1) {
                    var newcandidate = {
                        'firstname': candidate_name[0],
                        'lastname': '',
                        'user_id': interest_candidate.data._id
                    }
                } else if (candidate_name.length >= 1) {
                    var newcandidate = {
                        'firstname': candidate_name[0],
                        'lastname': candidate_name[1],
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
            // console.log(obj); return false;
            var pastOffer = await common_helper.find(Offer, { "user_id": ObjectId(obj.user_id), status: "Not Joined" })

            if (pastOffer.data.length > 0) {
                obj.status = "On Hold"
                // obj.data = pastOffer.data
            }
            var interest_resp = await common_helper.insert(Offer, obj);
            // console.log(interest_resp);
            // return false;
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
                let content = mailcontent.data.content;

                // if (candidate.data.firstname != "" && candidate.data.lastname != "") {
                content = content.replace("{companyname}", `${company}`).replace('{title}', interest_resp.data.title);
                // } else {
                //     content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', ' you.');
                // }


                let mail_resp = await new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                    "to": user.data.email,
                    "subject": "Offer",
                    "trackid": interest_resp.data._id
                }, content);

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
});

router.post('/pastOffer', async (req, res) => {
    try {
        re = new RegExp(req.body.email, "i");
        value = {
            $regex: re
        };
        var user = await common_helper.findOne(User, { "email": value })
        if (user.status == 1) {
            var pastOffer = await common_helper.find(Offer, { "employer_id": ObjectId(req.userInfo.id), "user_id": ObjectId(user.data._id), status: "Not Joined" });

            if (pastOffer.data.length > 0) {
                pastOffer.displayMessage = "Below are List of offer(s) which the candidate accepted and Not Joined in the past.Offer will be created in Hold status, please manually change it to Released status if desired.";
            }

            var previousOffer = await common_helper.find(Offer, {
                "user_id": ObjectId(user.data._id),
                "created_by": req.userInfo.id,
                $or: [
                    { status: { $eq: "Accepted" } },
                    { status: { $eq: "On Hold" } },
                    // {
                    //     $and:
                    //         [
                    //             { status: { $eq: "Released" } }, {
                    //                 expirydate: {
                    //                     $lte: new Date()
                    //                 }
                    //             }
                    //         ]
                    // }
                ]
            });

            if (previousOffer.data.length > 0) {
                previousOffer.displayMessage = " Please check, this candidate already has offer in either Released, Accepted or On Hold status. You can use edit offer to make any changes to Released and On Hold offers.";
            }

            var ReleasedOffer = await common_helper.find(Offer, {
                "user_id": ObjectId(user.data._id),
                "created_by": req.userInfo.id,
                $and:
                    [
                        { status: { $eq: "Released" } }, {
                            expirydate: {
                                $lte: new Date()
                            }
                        }
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
        // , "previousOffer": previousOffer
        return res.status(config.OK_STATUS).json({ 'message': "Location List", "status": 1, "data": pastOffer, "previousOffer": previousOffer, "ReleasedOffer": ReleasedOffer });

    }
    catch (error) {
        return res.status(config.BAD_REQUEST).json({ 'message': "Error occurred while fetching", "status": 0 });
    }
})

router.post('/check_is_candidate', async (req, res) => {
    try {
        // console.log(req.body.email.toLowerCase());

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


cron.schedule('00 00 * * *', async (req, res) => {
    var resp_data = await Offer.aggregate(
        [
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
                    // preserveNullAndEmptyArrays: true
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
                    from: "group_detail",
                    localField: "group._id",
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

    var current_date = moment().startOf('day')

    // console.log('hi');

    for (const resp of resp_data) {
        if (resp.communication !== undefined && resp.communication.communication !== undefined) {
            for (const comm of resp.communication.communication) {
                if (comm.trigger == "afterOffer") {
                    var days = comm.day
                    var offer_date = moment(resp.createdAt).startOf('day').add(days, 'day')
                    // console.log('offer_date1 ==> ', offer_date.format());
                    offer_date = moment(offer_date);

                    var message = comm.message;
                    var email = resp.candidate.email

                    // console.log("current_date", moment(current_date).format());
                    // console.log(' offer_date:  ==> ', moment(offer_date).format());

                    // console.log(moment(current_date).isSame(offer_date));


                    if (moment(current_date).isSame(offer_date) == true) {
                        var mail_record = await common_helper.insert(MailRecord, { "tracker_id": resp._id + 'afterOffer', "offer_id": resp._id })
                        logger.trace("sending mail");
                        // let mail_resp = await mail_helper.send("offer", {
                        //     "to": email,
                        //     "subject": "Offer Letter"
                        // }, {
                        //     "msg": message
                        // });
                        let mail_resp = new_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                            "to": resp.candidate.email,
                            "subject": "Communication mail",
                            "trackid": resp._id + 'afterOffer'
                        }, message);
                    }

                }

                if (comm.trigger == "beforeJoining") {
                    var days = comm.day
                    var offer_date = moment(resp.joiningdate).startOf('day').subtract(days, 'day')
                    offer_date = moment(offer_date)

                    var message = comm.message;
                    var email = resp.candidate.email

                    if (moment(current_date).isSame(offer_date) == true) {
                        var mail_record = await common_helper.insert(MailRecord, { "tracker_id": resp._id + 'beforeJoining', "offer_id": resp._id })
                        // let mail_resp = await mail_helper.send("offer", {
                        //     "to": resp.candidate.email,
                        //     "subject": "Before Joining"
                        // }, {

                        //     "msg": message
                        // });
                        let mail_resp = new_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                            "to": resp.candidate.email,
                            "subject": "Communication mail",
                            "trackid": resp._id + 'beforeJoining'
                        }, message);

                    }
                }

                if (comm.trigger == "afterJoining") {
                    var days = comm.day
                    var offer_date = moment(resp.joiningdate).startOf('day').add(days, 'day')
                    offer_date = moment(offer_date)

                    var message = comm.message;
                    var email = resp.candidate.email
                    if (moment(current_date).isSame(offer_date) == true) {
                        var mail_record = await common_helper.insert(MailRecord, { "tracker_id": resp._id + 'afterJoining', "offer_id": resp._id })
                        // let mail_resp = await mail_helper.send("offer", {
                        //     "to": email,
                        //     "subject": "After Joining"
                        // }, {

                        //     "msg": message
                        // });
                        let mail_resp = new_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                            "to": resp.candidate.email,
                            "subject": "Communication mail",
                            "trackid": resp._id + 'afterJoining'
                        }, message);
                    }

                }
                if (comm.trigger == "beforeExpiry") {
                    var days = comm.day
                    var offer_date = moment(resp.expirydate).startOf('day').subtract(days, 'day')
                    offer_date = moment(offer_date)

                    var message = comm.message;
                    var email = resp.candidate.email
                    if (moment(current_date).isSame(offer_date) == true) {
                        var mail_record = await common_helper.insert(MailRecord, { "tracker_id": resp._id + 'beforeExpiry', "offer_id": resp._id })
                        // let mail_resp = await mail_helper.send("offer", {
                        //     "to": email,
                        //     "subject": "Before Expiry"
                        // }, {

                        //     "msg": message
                        // });
                        let mail_resp = new_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                            "to": resp.candidate.email,
                            "subject": "Communication mail",
                            "trackid": resp._id + 'beforeExpiry'
                        }, message);
                    }

                }
                if (comm.trigger == "afterExpiry") {
                    var days = comm.day
                    var offer_date = moment(resp.expirydate).startOf('day').add(days, 'day')
                    offer_date = moment(offer_date)

                    var message = comm.message;
                    var email = resp.candidate.email
                    if (moment(current_date).isSame(offer_date) == true) {
                        var mail_record = await common_helper.insert(MailRecord, { "tracker_id": resp._id + 'afterExpiry', "offer_id": resp._id })
                        // let mail_resp = await mail_helper.send("offer", {
                        //     "to": email,
                        //     "subject": "After Expiry"
                        // }, {

                        //     "msg": message
                        // });
                        let mail_resp = new_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                            "to": resp.candidate.email,
                            "subject": "Communication mail",
                            "trackid": resp._id + 'afterExpiry'
                        }, message);
                    }

                }
                if (comm.trigger == "afterAcceptance") {
                    var days = comm.day
                    var offer_date = moment(resp.acceptedAt).startOf('day').add(days, 'day')
                    offer_date = moment(offer_date)

                    var message = comm.message;
                    var email = resp.candidate.email
                    if (moment(current_date).isSame(offer_date) == true) {
                        var mail_record = await common_helper.insert(MailRecord, { "mail_record": resp._id + 'afterAcceptance', "offer_id": resp._id })
                        // let mail_resp = await mail_helper.send("offer", {
                        //     "to": email,
                        //     "subject": "After Acceptance"
                        // }, {
                        //     "msg": message
                        // });
                        let mail_resp = new_mail_helper.send('d-e3cb56d304e1461d957ffd8fe141819c', {
                            "to": resp.candidate.email,
                            "subject": "Communication mail",
                            "trackid": resp._id + 'afterAcceptance'
                        }, message);
                    }

                }

            }
        }
    }

    // res.status(config.OK_STATUS).json({ "mesage": "mail sent for before joining", resp_data });
});

cron.schedule('00 00 * * *', async (req, res) => {
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
                    from: "group_detail",
                    localField: "group._id",
                    foreignField: "group_id",
                    as: "communication"
                }
            },
            {
                $unwind: {
                    path: "$communication",
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

    for (let index = 0; index < resp_data.length; index++) {
        const resp = resp_data[index];
        setTimeout(function (index) {
            if (resp.communication !== undefined && resp.communication.communication !== undefined) {
                for (const comm of resp.communication.communication) {
                    if (comm.trigger == "afterOffer") {
                        // console.log(' : comm.trigger ==> ', comm.trigger);
                        var days = comm.day
                        var offer_date = moment(resp.createdAt).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)
                        let element = resp;
                        var options = {
                            method: 'GET',
                            url: "https://api.sendgrid.com/v3/messages?limit=10&query=(unique_args%5B'trackid'%5D%3D%22" + element._id + "afterOffer" + "%22)",
                            headers: { authorization: 'Bearer ' + config.SENDGRID_API_KEY },
                        };

                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var new_resp = JSON.parse(response.body);
                            if (new_resp && new_resp.error) {
                                console.log(new_resp.error);
                            } else if (new_resp && new_resp.messages) {

                                // console.log(' : new_resp.message ==> ', new_resp.messages);

                                for (const newresp of new_resp.messages) {
                                    var last_mail_time = moment(newresp.last_event_time).startOf('day')
                                    if (newresp.opens_count == 0 && moment(last_mail_time).isSame(offer_date) == true) {
                                        // console.log('new_resp ==> ', newresp);
                                        var resend_mail_date = moment(offer_date).startOf('day').add(resp.group.high_unopened, 'day')
                                        var resend_mail_date1 = moment(offer_date).startOf('day').add(resp.group.medium_unopened, 'day')

                                        if (moment(current_date).isSame(resend_mail_date) == true || moment(current_date).isSame(resend_mail_date1) == true) {
                                            var total_days;
                                            if (moment(current_date).isSame(resend_mail_date) == true) {
                                                total_days = resp.group.high_unopened
                                            } else if (moment(current_date).isSame(resend_mail_date1) == true) {
                                                total_days = resp.group.medium_unopened
                                            }
                                            content = "We have send " + `${resp.title}` + " offer mail to the " + `${resp.candidate.firstname}` + " " + `${resp.candidate.lastname}` + " but he has not open this email for " + `${total_days}` + " days. Please get in touch with the candidate."

                                            let mail_resp = new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                                                // "to": newresp.to_email,
                                                "to": resp.created_by.email,
                                                "subject": "Notification Mail",
                                                "trackid": element._id + 'high'
                                            }, content);
                                        }
                                    } else {
                                        console.log("end");
                                    }
                                }
                            }
                        });

                    }
                    else if (comm.trigger == "beforeJoining") {
                        var days = comm.day
                        var offer_date = moment(resp.joiningdate).startOf('day').subtract(days, 'day')
                        offer_date = moment(offer_date)

                        let element = resp;
                        var options = {
                            method: 'GET',
                            url: "https://api.sendgrid.com/v3/messages?limit=10&query=(unique_args%5B'trackid'%5D%3D%22" + element._id + "beforeJoining" + "%22)",
                            headers: { authorization: 'Bearer ' + config.SENDGRID_API_KEY },
                        };


                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var new_resp = JSON.parse(response.body);
                            if (new_resp && new_resp.error) {
                                console.log(new_resp.error);
                            } else if (new_resp && new_resp.messages) {
                                // console.log(' : new_resp.message ==> ', new_resp.messages);
                                for (const newresp of new_resp.messages) {
                                    var last_mail_time = moment(newresp.last_event_time).startOf('day')
                                    if (newresp.opens_count == 0 && moment(last_mail_time).isSame(offer_date) == true) {
                                        // console.log('new_resp ==> ', newresp);
                                        var resend_mail_date = moment(offer_date).startOf('day').add(resp.group.high_unopened, 'day')
                                        var resend_mail_date1 = moment(offer_date).startOf('day').add(resp.group.medium_unopened, 'day')

                                        if (moment(current_date).isSame(resend_mail_date) == true || moment(current_date).isSame(resend_mail_date1) == true) {

                                            var total_days;
                                            if (moment(current_date).isSame(resend_mail_date) == true) {
                                                total_days = resp.group.high_unopened
                                            } else if (moment(current_date).isSame(resend_mail_date1) == true) {
                                                total_days = resp.group.medium_unopened
                                            }

                                            content = "We have send " + `${resp.title}` + " offer mail to the " + `${resp.candidate.firstname}` + " " + `${resp.candidate.lastname}` + " but he has not open this email for " + `${total_days}` + " days. Please get in touch with the candidate."

                                            let mail_resp = new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                                                "to": resp.created_by.email,
                                                "subject": "Notification Mail",
                                                "trackid": element._id + 'high'
                                            }, content);
                                        }
                                    } else {
                                        console.log("end");
                                    }
                                }
                            }
                        });

                    }
                    else if (comm.trigger == "afterJoining") {
                        var days = comm.day
                        var offer_date = moment(resp.joiningdate).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        let element = resp;
                        var options = {
                            method: 'GET',
                            url: "https://api.sendgrid.com/v3/messages?limit=10&query=(unique_args%5B'trackid'%5D%3D%22" + element._id + "afterJoining" + "%22)",
                            headers: { authorization: 'Bearer ' + config.SENDGRID_API_KEY },
                        };

                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var new_resp = JSON.parse(response.body);
                            if (new_resp && new_resp.error) {
                                console.log(new_resp.error);
                            } else if (new_resp && new_resp.messages) {
                                // console.log(' : new_resp.message ==> ', new_resp.messages);
                                for (const newresp of new_resp.messages) {
                                    var last_mail_time = moment(newresp.last_event_time).startOf('day')
                                    if (newresp.opens_count == 0 && moment(last_mail_time).isSame(offer_date) == true) {
                                        // console.log('new_resp ==> ', newresp);
                                        var resend_mail_date = moment(offer_date).startOf('day').add(resp.group.high_unopened, 'day')
                                        var resend_mail_date1 = moment(offer_date).startOf('day').add(resp.group.medium_unopened, 'day')
                                        if (moment(current_date).isSame(resend_mail_date) == true || moment(current_date).isSame(resend_mail_date1) == true) {
                                            var total_days;
                                            if (moment(current_date).isSame(resend_mail_date) == true) {
                                                total_days = resp.group.high_unopened
                                            } else if (moment(current_date).isSame(resend_mail_date1) == true) {
                                                total_days = resp.group.medium_unopened
                                            }

                                            content = "We have send " + `${resp.title}` + " offer mail to the " + `${resp.candidate.firstname}` + " " + `${resp.candidate.lastname}` + " but he has not open this email for " + `${total_days}` + " days. Please get in touch with the candidate."

                                            let mail_resp = new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                                                "to": resp.created_by.email,
                                                "subject": "Notification Mail",
                                                "trackid": element._id + 'high'
                                            }, content);
                                        }
                                    } else {
                                        console.log("end");
                                    }
                                }
                            }
                        });

                    }
                    else if (comm.trigger == "beforeExpiry") {
                        var days = comm.day
                        var offer_date = moment(resp.expirydate).startOf('day').subtract(days, 'day')
                        offer_date = moment(offer_date)

                        let element = resp;
                        var options = {
                            method: 'GET',
                            url: "https://api.sendgrid.com/v3/messages?limit=10&query=(unique_args%5B'trackid'%5D%3D%22" + element._id + "beforeExpiry" + "%22)",
                            headers: { authorization: 'Bearer ' + config.SENDGRID_API_KEY },
                        };


                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var new_resp = JSON.parse(response.body);
                            if (new_resp && new_resp.error) {
                                console.log(new_resp.error);
                            } else if (new_resp && new_resp.messages) {
                                // console.log(' : new_resp.message ==> ', new_resp.messages);
                                for (const newresp of new_resp.messages) {
                                    var last_mail_time = moment(newresp.last_event_time).startOf('day')
                                    if (newresp.opens_count == 0 && moment(last_mail_time).isSame(offer_date) == true) {
                                        // console.log('new_resp ==> ', newresp);
                                        var resend_mail_date = moment(offer_date).startOf('day').add(resp.group.high_unopened, 'day')
                                        var resend_mail_date1 = moment(offer_date).startOf('day').add(resp.group.medium_unopened, 'day')
                                        if (moment(current_date).isSame(resend_mail_date) == true || moment(current_date).isSame(resend_mail_date1) == true) {

                                            var total_days;
                                            if (moment(current_date).isSame(resend_mail_date) == true) {
                                                total_days = resp.group.high_unopened
                                            } else if (moment(current_date).isSame(resend_mail_date1) == true) {
                                                total_days = resp.group.medium_unopened
                                            }

                                            content = "We have send " + `${resp.title}` + " offer mail to the " + `${resp.candidate.firstname}` + " " + `${resp.candidate.lastname}` + " but he has not open this email for " + `${total_days}` + " days. Please get in touch with the candidate."

                                            let mail_resp = new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                                                "to": resp.created_by.email,
                                                "subject": "Notification Mail",
                                                "trackid": element._id + 'high'
                                            }, content);
                                        }
                                    } else {
                                        console.log("end");
                                    }
                                }
                            }
                        });

                    }
                    else if (comm.trigger == "afterExpiry") {
                        var days = comm.day
                        var offer_date = moment(resp.expirydate).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        let element = resp;
                        var options = {
                            method: 'GET',
                            url: "https://api.sendgrid.com/v3/messages?limit=10&query=(unique_args%5B'trackid'%5D%3D%22" + element._id + "afterExpiry" + "%22)",
                            headers: { authorization: 'Bearer ' + config.SENDGRID_API_KEY },
                        };


                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var new_resp = JSON.parse(response.body);
                            if (new_resp && new_resp.error) {
                                console.log(new_resp.error);
                            } else if (new_resp && new_resp.messages) {
                                // console.log(' : new_resp.message ==> ', new_resp.messages);
                                for (const newresp of new_resp.messages) {
                                    var last_mail_time = moment(newresp.last_event_time).startOf('day')
                                    if (newresp.opens_count == 0 && moment(last_mail_time).isSame(offer_date) == true) {
                                        // console.log('new_resp ==> ', newresp);
                                        var resend_mail_date = moment(offer_date).startOf('day').add(resp.group.high_unopened, 'day')
                                        var resend_mail_date1 = moment(offer_date).startOf('day').add(resp.group.medium_unopened, 'day')
                                        if (moment(current_date).isSame(resend_mail_date) == true || moment(current_date).isSame(resend_mail_date1) == true) {

                                            var total_days;
                                            if (moment(current_date).isSame(resend_mail_date) == true) {
                                                total_days = resp.group.high_unopened
                                            } else if (moment(current_date).isSame(resend_mail_date1) == true) {
                                                total_days = resp.group.medium_unopened
                                            }

                                            content = "We have send " + `${resp.title}` + " offer mail to the " + `${resp.candidate.firstname}` + " " + `${resp.candidate.lastname}` + " but he has not open this email for " + `${total_days}` + " days. Please get in touch with the candidate."

                                            let mail_resp = new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                                                "to": resp.created_by.email,
                                                "subject": "Notification Mail",
                                                "trackid": element._id + 'high'
                                            }, content);
                                        }
                                    } else {
                                        console.log("end");
                                    }
                                }
                            }
                        });

                    }
                    else if (comm.trigger == "afterAcceptance") {
                        var days = comm.day
                        var offer_date = moment(resp.acceptedAt).startOf('day').add(days, 'day')
                        offer_date = moment(offer_date)

                        let element = resp;
                        var options = {
                            method: 'GET',
                            url: "https://api.sendgrid.com/v3/messages?limit=10&query=(unique_args%5B'trackid'%5D%3D%22" + element._id + "afterAcceptance" + "%22)",
                            headers: { authorization: 'Bearer ' + config.SENDGRID_API_KEY },
                        };

                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var new_resp = JSON.parse(response.body);
                            if (new_resp && new_resp.error) {
                                console.log(new_resp.error);
                            } else if (new_resp && new_resp.messages) {
                                // console.log(' : new_resp.message ==> ', new_resp.messages);
                                for (const newresp of new_resp.messages) {
                                    var last_mail_time = moment(newresp.last_event_time).startOf('day')
                                    if (newresp.opens_count == 0 && moment(last_mail_time).isSame(offer_date) == true) {
                                        // console.log('new_resp ==> ', newresp);
                                        var resend_mail_date = moment(offer_date).startOf('day').add(resp.group.high_unopened, 'day')
                                        var resend_mail_date1 = moment(offer_date).startOf('day').add(resp.group.medium_unopened, 'day')
                                        if (moment(current_date).isSame(resend_mail_date) == true || moment(current_date).isSame(resend_mail_date1) == true) {

                                            var total_days;
                                            if (moment(current_date).isSame(resend_mail_date) == true) {
                                                total_days = resp.group.high_unopened
                                            } else if (moment(current_date).isSame(resend_mail_date1) == true) {
                                                total_days = resp.group.medium_unopened
                                            }

                                            content = "We have send " + `${resp.title}` + " offer mail to the " + `${resp.candidate.firstname}` + " " + `${resp.candidate.lastname}` + " but he has not open this email for " + `${total_days}` + " days. Please get in touch with the candidate."

                                            let mail_resp = new_mail_helper.send('d-96c1114e4fbc45458f2039f9fbe14390', {
                                                "to": resp.created_by.email,
                                                "subject": "Notification Mail",
                                                "trackid": element._id + 'high'
                                            }, content);
                                        }
                                    } else {
                                        console.log("end");
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }, index * 15000, index)
    }
})

router.post('/get', async (req, res) => {
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

        const RE = { $regex: new RegExp(`${req.body.search.value}`, 'gi') };

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
});

router.put("/status_change", async (req, res) => {
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
    console.log('<<<<mail_resp', mail_resp);

    res.status(config.OK_STATUS).json({ "message": "Status is changed successfully", "status": obj.status });

});

router.put("/deactive_offer/:id", async (req, res) => {
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
});

router.put('/', async (req, res) => {
    var obj = {};

    if (req.body.groups && req.body.groups != "") {
        obj.groups = req.body.groups
    }

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

    // console.log("========>", obj);

    if (offer.data.status !== req.body.status) {
        obj.offer_id = offer_upadate.data._id;
        obj.employer_id = req.userInfo.id;
        obj.message = `<span>{employer}</span> has ${req.body.status} this offer for <span>{candidate}</span>`
        var interest = await common_helper.insert(History, obj);
    }

    if (offer_upadate.status == 0) {
        res.status(config.INTERNAL_SERVER_ERROR).json({ "status": 0, "message": "No data found" });
    }
    else if (offer_upadate.status == 1) {

        if (offer.data.status !== offer_upadate.data.status) {
            // var user = await common_helper.findOne(User, { _id: new ObjectId(req.body.user_id) })
            var status = await common_helper.findOne(Status, { 'status': offer_upadate.data.status });

            let content = status.data.MessageContent;
            content = content.replace("{employer}", `${employer.data.username}`).replace('{title}', offer_upadate.data.title).replace("{candidate}", offer_upadate.data.candidate_name);

            // console.log("@@@", offer_upadate.data.email);

            // let mail_resp = await mail_helper.send('d-4e82d6fcf94e4acdb8b94d71e4c32455', {
            //     "to": offer_upadate.data.email,
            //     "subject": "Change Status of offer.",
            //     // "trackid": ''
            // }, content);
            console.log('offer_upadate.data.email', user_email.data.email);

            let mail_resp = await mail_helper.send("status_change", {
                "to": user_email.data.email,
                "subject": "Change Status of offer."
            }, {
                "msg": content,
            });
            console.log('mailmmmm _resp', mail_resp);

        }
        res.status(config.OK_STATUS).json({ "status": 1, "message": "Offer is Updated successfully", "data": offer_upadate });
    }
    else {
        res.status(config.BAD_REQUEST).json({ "status": 2, "message": "Error occurred while fetching data." });
    }
})

router.get('/details/:id', async (req, res) => {
    var id = req.params.id;
    console.log(req.params.id);
    try {
        const offer_detail = await Offer.findOne({ '_id': id })
            .populate([
                { path: 'employer_id' },
                // { path: 'salarybracket' },
                { path: 'location' },
                { path: 'group' },
                { path: 'user_id' }
            ])
            .lean();

        console.log(offer_detail);

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
        // var user = await common_helper.findOne(User, { _id: new ObjectId(req.userInfo.id) })

        // if (user && user.status == 1 && user.data.role_id == ObjectId("5d9d99003a0c78039c6dd00f")) {
        //     var user_id = user.data.emp_id
        // }
        // else {
        //     var user_id = req.userInfo.id
        // }
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
                // preserveNullAndEmptyArrays: true
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
            // {
            //     $lookup:
            //     {
            //         from: "candidateDetail",
            //         localField: "offer.user_id",
            //         foreignField: "user_id",
            //         as: "candidate"
            //     }
            // },

            // {
            //     $unwind: {
            //         path: "$candidate"
            //     },
            // },
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
                        content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);
                        // console.log(element.createdAt);
                        // message.push(content);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                    } else {
                        content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', user.data.email);
                        // message.push(content);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                    }
                    history.push(message);
                } else if (sub_employer.status === 1 && candidate.status === 1 && user.status === 1) {
                    var content = element.message;
                    if (candidate.data.firstname !== "" && candidate.data.lastname !== "") {
                        content = content.replace("{employer}", `${sub_employer.data.username}`).replace('{candidate}', candidate.data.firstname + " " + candidate.data.lastname);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
                    } else {
                        content = content.replace("{employer}", `${employer.data.username}`).replace('{candidate}', user.data.email);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
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
                        // message.push(content);
                    } else {
                        content = content.replace('{candidate}', user.data.email);
                        message = {
                            "content": content,
                            "createdAt": element.createdAt
                        }
                        // message.push(content);
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
    var status = req.params.status;
    var obj = {};
    if (status === 'On Hold') {
        obj.status = [
            // { label: 'On Hold', value: 'On Hold' },
            { label: 'Released', value: 'Released' },
            // { label: 'Inactive', value: 'Inactive' }
        ];
    } else if (status === 'Released') {
        obj.status = [
            // { label: 'Released', value: 'Released' },
            { label: 'Inactive', value: 'Inactive' }
        ];
    }
    else if (status === 'Accepted') {
        obj.status = [
            // { label: 'Accepted', value: 'Accepted' },
            { label: 'Not Joined', value: 'Not Joined' },
            // { label: 'Inactive', value: 'Inactive' }
        ];
    } else if (status === 'Not Joined') {
        obj.status = [
            // { label: 'Not Joined', value: 'Not Joined' },
            { label: 'Inactive', value: 'Inactive' }
        ];
    } else if (status === 'Inactive') {
        obj.status = [
            { label: 'Inactive', value: 'Inactive' }
        ];
    }
    res.status(config.OK_STATUS).json({ "message": "Status is changed successfully", "status": obj.status });
});

module.exports = router;

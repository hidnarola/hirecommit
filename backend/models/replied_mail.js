const mongoose = require("mongoose");

const schema = new mongoose({
    offerid: {
        type: mongoose.Types.ObjectId,
        ref: "Offer",
        require: true
    },
    message: {},
}, { timestamp: true });

module.exports = mongoose.model('RepliedMail', schema, 'RepliedMail');

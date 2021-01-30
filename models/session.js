const mongoose = require('mongoose');

const Schema = new mongoose.Schema ({
    sid: { type : String , unique : true, required : true, index: true },
    created: { type: Date, required : true, default: Date.now },
    updated: { type: Date, required : true, default: Date.now },
    data: { type : Object, required : true, default: {} },
});

var model = mongoose.model('Session', Schema);
module.exports = model;
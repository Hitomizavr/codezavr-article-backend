const mongoose = require('mongoose');

const Schema = new mongoose.Schema ({
    login: { type : String , unique : true, required : true, index: true },
    password: { type : String, required : true },
    salt: { type : String, required : true },
    role: { type : String, required : true, default: "user" },
    email: { type: String, required: true}
});

Schema.index({login: 1}, {unique: true});

var model = mongoose.model('User', Schema);
module.exports = model;
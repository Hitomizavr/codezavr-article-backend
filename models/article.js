const mongoose = require('mongoose');

const Schema = new mongoose.Schema ({
    title: String,
    date: { type: Date, default: Date.now }, //Чтобы дата указывалась автоматически
    subtitle: String,
    text: String,
    tags: [String], //Массив строк в котором у нас будут теги
    image: String,
    views: Number,
    likes: Number,
});

var model = mongoose.model('Article', Schema);
module.exports = model;
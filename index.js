var express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.all('*', cors());
app.use(express.static('static'));


app.use(bodyParser.urlencoded({extended: true})); // Без этого парсер не запустится
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/codezavr', { useMongoClient: true});

require('./routes/article.js')(app);
require('./routes/user.js')(app);

app.listen(3001);


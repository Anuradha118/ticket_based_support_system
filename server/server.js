var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var config = require('./configs/config.js');
var session = require('express-session');
var cors = require('cors');
const port=process.env.PORT;
var mongoose = require('./db/mongoose');

// Init App
var app = express();
app.use(cors());

//Logger
app.use(morgan('dev'));

//session
app.use(session({
  secret: "sEcrEt",
  saveUninitialized: true,
  resave: true,
}));

// BodyParser Middleware
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

console.log(path.join(__dirname, './../public/css'));
//Set view to angular folder
app.use(express.static(path.join(__dirname, './../public')));

//Setting routes main file
app.use('/', require('./controllers/index.js'));

// catch 404 and forward to error handler
app.get('*', function (req, res, next) {
  req.status = 404;
  next("Page Not Found!!");
});

// error handler
app.use(function (err, req, res, next) {
  res.send(err);
});

//listening port
app.listen(port, function () {
  console.log(`Started up at port ${port}`);
});
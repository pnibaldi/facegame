var express = require('express');

var app = express();

var port = process.env.PORT || 8080;
console.log('Starting server on port', port);

var bodyParser = require('body-parser');
var glob = require('glob');
var _ = require('lodash');
var validator = require('validator');

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://guest:FaceGame2016@ds047040.mongolab.com:47040/facegamedb');

var db = mongoose.connection;

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  email: {
    validate: [validator.isEmail, 'invalid email']
  },
  bio: {
    type: String
  },
  profileUrl: {
    type: String,
    required: true
  }
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to DB');
});

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var files = glob.sync('./router/routes/*.js');
_.each(files, function(file) {
  require(file)(app);
});

app.listen(port);
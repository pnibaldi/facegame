var express = require('express');

var app = express();

var port = process.env.PORT || 8080;
console.log('Starting server on port', port);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
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

// Authentication
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
app.use(cookieParser());
// configure app to use bodyParser()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());


var LocalUserSchema = new mongoose.Schema({
  user: String,
  pwd: String,
  roles: [String]
});

var User = mongoose.model('user', LocalUserSchema);

var isAdminUser = function(user) {
  if (!user || !user.roles) {
    return false;
  }
  return user.roles.indexOf('admin') !== -1;
};

app.isAdmin = function(req, res, next) {
  if (req.isAuthenticated() && isAdminUser(req.user)) {
    return next();
  }
  res.status(400).send('Unauthorized user');
}


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({
    user: username
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
    if (user.pwd !== password) {
      return done(null, false, {
        message: 'Incorrect password.'
      });
    }
    if (user.pwd === password) return done(null, user);
  });
}));

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var login = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.pwd = undefined;

      req.login(user, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          //res.jsonp(user);
          res.send(user);
        }
      });
    }
  })(req, res);
};


app.post('/login', login);

var files = glob.sync('./router/routes/*.js');
_.each(files, function(file) {
  require(file)(app);
});


app.listen(port);
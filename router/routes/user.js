module.exports = function(app) {
  var mongoose = require('mongoose'),
    User = mongoose.model('user');

  var getProfiles = function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        res.status(401).send({
          message: 'Error while retrieving profiles'
        });
      }
      res.send(users);
    });
  };

  app.get('/api/profiles', app.isAdmin, getProfiles);
};
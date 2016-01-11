module.exports = function(app) {
  var addUser = function(req, res) {
    console.log("Received request");
    res.send('Hello world!');
  };

  var getUser = function(req, res) {
    
    res.send('Hello world!');
  };

  app.route('/api/user')
    .post(addUser)
    .get(getUser);
};
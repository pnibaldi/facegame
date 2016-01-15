module.exports = function(app) {
  var callback = function(req, res) {
    if (!req.isAuthenticated()) {
      res.status(401).send({
        message: 'User is not logged in'
      });
    }
    console.log("Received request");
    res.send('Hello world!');
  }
  app.get('/', callback);
};
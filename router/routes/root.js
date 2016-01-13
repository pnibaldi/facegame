module.exports = function(app) {
  var callback = function(req, res) {
    console.log("Received request");
    res.send('Hello world!');
  }
  app.get('/', callback);
};
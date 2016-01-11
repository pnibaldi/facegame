module.exports = function (app) {
  app.use('/api/user', require('./routes/user'));
  app.use('/api/account', require('./routes/account'));
};
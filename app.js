var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');

var routes = require('./routes/index');
var emails = require('./routes/emails');
var monitor = require('./routes/monitor');
var camera = require('./routes/camera');
var dbtest = require('./routes/dbtest');
var polling = require('./polling');
var alert = require('./alarms');

var app = express();

var admins = { 'username': { password: 'password' } };

// app.use(function (req, res, next) {
//   var user = auth(req);
//   if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
//     res.set('WWW-Authenticate', 'Basic realm="example"');
//     return res.status(401).send();
//   }
//   return next();
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/emails', emails);
app.use('/api/monitor', monitor);
app.use('/api/camera', camera);
app.use('/dbtest', dbtest);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    error: {}
  });
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');

var dashboard = require('./routes/dashboard');
var home = require('./routes/home');
var notifications = require('./routes/notifications');
var dashboard_api = require('./routes/dashboard_api');
var camera_api = require('./routes/camera_api');
var monitor_api = require('./routes/monitor_api');

var polling = require('./polling');
var alarms = require('./alarms');
var hostdiscovery = require('./hostdiscovery');

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
app.set('view engine', 'pug');

// uncomment after placing favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboard);
app.use('/home', home);
app.use('/notifications', notifications);
app.use('/api/dashboard', dashboard_api)
app.use('/api/monitor', monitor_api);
app.use('/api/camera', camera_api);

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

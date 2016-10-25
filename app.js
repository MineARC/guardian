var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var jumpers = require('./jumpers');

var dashboard = require('./routes/overview');
var chamber = require('./routes/home');

if (jumpers.mode == 0) var elv = require('./routes/elv');
if (jumpers.mode == 1) var elvp = require('./routes/elvp');
if (jumpers.mode == 2) var series3 = require('./routes/series3');
if (jumpers.mode == 3) var series4 = require('./routes/series4');

var camera_internal = require('./routes/camera_internal');
if (jumpers.extn) var camera_external = require('./routes/camera_external');
var notifications = require('./routes/notifications');
var settings = require('./routes/settings');
var overview_api = require('./routes/overview_api');
var camera_api = require('./routes/camera_api');
var monitor_api = require('./routes/monitor_api');

if (jumpers.mode == 0) var elv_polling = require('./elv_polling');
if (jumpers.mode == 1) var elvp_polling = require('./elvp_polling');
if (jumpers.mode == 2) var series3_polling = require('./series3_polling');
if (jumpers.mode == 3) var series4_polling = require('./series4_polling');
if (jumpers.cams) var cams_polling = require('./cams_polling');
if (jumpers.aura) var aura_polling = require('./aura_polling')
var alarms_polling = require('./alarms_polling');
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
app.use('/chamber', chamber);

if (jumpers.mode == 0) app.use('/monitor', elv);
if (jumpers.mode == 1) app.use('/monitor', elvp);
if (jumpers.mode == 2) app.use('/monitor', series3);
if (jumpers.mode == 3) app.use('/monitor', series4);

app.use('/camera_internal', camera_internal);
if (jumpers.extn) app.use('/camera_external', camera_external);
app.use('/notifications', notifications);
app.use('/settings', settings);
app.use('/api/overview', overview_api)
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

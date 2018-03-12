var express = require('express');
var app = express();
module.exports = app;

///// UPDATE /////
var AutoUpdater = require('auto-updater');

var autoupdater = new AutoUpdater(
    {pathToJson : '', autoupdate : false, checkgit : true, jsonhost : 'raw.githubusercontent.com', contenthost : 'codeload.github.com', progressDebounce : 0, devmode : false});

// State the events
autoupdater.on('git-clone', function() { console.log("You have a clone of the repository. Use 'git pull' to be up-to-date"); });
autoupdater.on('check.up-to-date', function(v) { console.info("You have the latest version: " + v); });
autoupdater.on('check.out-dated', function(v_old, v) {
  console.warn("Your version is outdated. " + v_old + " of " + v);
  autoupdater.fire('download-update'); // If autoupdate: false, you'll have to do this manually.
  // Maybe ask if the'd like to download the update.
});
autoupdater.on('update.downloaded', function() {
  console.log("Update downloaded and ready for install");
  autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on('update.not-installed', function() {
  console.log("The Update was already in your folder! It's read for install");
  autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on('update.extracted', function() {
  console.log("Update extracted successfully!");
  console.warn("RESTART THE APP!");
  process.exit();
});
autoupdater.on('download.start', function(name) { console.log("Starting downloading: " + name); });
autoupdater.on('download.progress', function(name, perc) { process.stdout.write("Downloading " + perc + "% \033[0G"); });
autoupdater.on('download.end', function(name) { console.log("Downloaded " + name); });
autoupdater.on('download.error', function(err) { console.error("Error when downloading: " + err); });
autoupdater.on('end', function() {
  console.log("The app is ready to function");
  afterUpdate();
});
autoupdater.on('error', function(name, e) { console.error(name, e); });

// Start checking
require('dns').resolve('github.com', function(err) {
  if (!err)
    autoupdater.fire('check');
  else
    afterUpdate();
});

function afterUpdate() {
  var jumpers = require('./jumpers');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var auth = require('basic-auth');
  var compression = require('compression');
  var cors = require('cors');

  ///// ROUTES /////
  var dashboard = require('./routes/overview');
  var notifications = require('./routes/notifications');
  var settings = require('./routes/settings');
  var overview_api = require('./routes/overview_api');
  var hosts_api = require('./routes/hosts_api');
  var camera_api = require('./routes/camera_api');
  var monitor_api = require('./routes/monitor_api');
  var contact = require('./routes/contact');

  if (jumpers.mode == 4)
    var chamber = require('./routes/battmon');
  else {
    var chamber = require('./routes/home');
    var camera_internal = require('./routes/camera_internal');

    if (jumpers.mode == 0)
      var elv = require('./routes/elv');
    if (jumpers.mode == 1)
      var elvp = require('./routes/elvp');
    if (jumpers.mode == 2)
      var series3 = require('./routes/series3');
    if (jumpers.mode == 3)
      var series4 = require('./routes/series4');
    if (jumpers.extn)
      var camera_external = require('./routes/camera_external');
  }

  ///// POLLING /////
  if (jumpers.mode == 4)
    var battmon_polling = require('./battmon_polling');
  else {
    if (jumpers.mode == 0)
      var elv_polling = require('./elv_polling');
    if (jumpers.mode == 1)
      var elvp_polling = require('./elvp_polling');
    if (jumpers.mode == 2)
      var series3_polling = require('./series3_polling');
    if (jumpers.mode == 3)
      var series4_polling = require('./series4_polling');
    if (jumpers.cams)
      var cams_polling = require('./cams_polling');
    if (jumpers.aura)
      var aura_polling = require('./aura_polling');
  }

  var alarms_polling = require('./alarms_polling');
  var hostdiscovery = require('./hostdiscovery');

  ///// GENERAL /////
  app.use(cors());
  app.options('*', cors());

  app.use(compression())

      var admins = {'username' : {password : 'password'}};

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
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : false}));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  ///// PATHS /////

  app.use('/', dashboard);
  app.use('/dashboard', chamber);
  app.use('/chamber', chamber);
  app.use('/camera_internal', camera_internal);

  if (jumpers.mode == 0)
    app.use('/monitor', elv);
  if (jumpers.mode == 1)
    app.use('/monitor', elvp);
  if (jumpers.mode == 2)
    app.use('/monitor', series3);
  if (jumpers.mode == 3)
    app.use('/monitor', series4);
  if (jumpers.extn)
    app.use('/camera_external', camera_external);

  app.use('/notifications', notifications);
  app.use('/settings', settings);
  app.use('/api/overview', overview_api);
  app.use('/api/hosts', hosts_api);
  app.use('/api/monitor', monitor_api);
  app.use('/api/camera', camera_api);
  app.use('/contact', contact);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {error : err});
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {error : {}});
  });
}
var express = require('express');
var AutoUpdater = require('auto-updater');
var jumpers = require('./jumpers');

// Export empty app
var app = express();
module.exports = app;

var autoupdater = new AutoUpdater({
  pathToJson: '',
  autoupdate: false,
  checkgit: true,
  jsonhost: 'raw.githubusercontent.com',
  contenthost: 'codeload.github.com',
  progressDebounce: 0,
  devmode: false
});

// State the events
autoupdater.on('git-clone', function () {
  console.log(
    'You have a clone of the repository. Use \'git pull\' to be up-to-date');
});
autoupdater.on('check.up-to-date', function (v) {
  console.info('You have the latest version: ' + v);
});
autoupdater.on('check.out-dated', function (v_old, v) {
  console.warn('Your version is outdated. ' + v_old + ' of ' + v);
  autoupdater.fire('download-update');  // If autoupdate: false, you'll have to
  // do this manually.
  // Maybe ask if the'd like to download the update.
});
autoupdater.on('update.downloaded', function () {
  console.log('Update downloaded and ready for install');
  autoupdater.fire(
    'extract');  // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on('update.not-installed', function () {
  console.log('The Update was already in your folder! It\'s read for install');
  autoupdater.fire(
    'extract');  // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on('update.extracted', function () {
  console.log('Update extracted successfully!');
  console.warn('RESTART THE APP!');
  process.exit();
});
autoupdater.on('download.start', function (name) {
  console.log('Starting downloading: ' + name);
});
autoupdater.on('download.progress', function (name, perc) {
  process.stdout.write('Downloading ' + perc + '% \033[0G');
});
autoupdater.on('download.end', function (name) {
  console.log('Downloaded ' + name);
});
autoupdater.on('download.error', function (err) {
  console.error('Error when downloading: ' + err);
});
autoupdater.on('end', function () {
  console.log('The app is ready to function');
});
autoupdater.on('error', function (name, e) {
  console.error(name, e);
});

// Start checking
require('dns').resolve('github.com', function (err) {
//  if (!err) autoupdater.fire('check');
});

setTimeout(guardian, 1000);

function guardian() {
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var auth = require('basic-auth');
  var compression = require('compression');
  var cors = require('cors');
  var dashboard = require('./routes/overview');
  var chamber = require('./routes/home');
  if (jumpers.mode == 0) var elv = require('./routes/elv');
  if (jumpers.mode == 1) var elvp = require('./routes/elvp');
  if (jumpers.mode == 2) var series3 = require('./routes/series3');
  if (jumpers.mode == 3) var series4 = require('./routes/series4');
  var camera_internal = require('./routes/camera_internal');
  if (jumpers.extn) var camera_external = require('./routes/camera_external');
  if (jumpers.tagboard) var tagboard = require('./routes/tagboard');
  var notifications = require('./routes/notifications');
  var settings = require('./routes/settings');
  var overview_api = require('./routes/overview_api');
  var hosts_api = require('./routes/hosts_api');
  var camera_api = require('./routes/camera_api');
  var monitor_api = require('./routes/monitor_api');
  var contact = require('./routes/contact');

  if (jumpers.mode == 0) var elv_polling = require('./elv_polling');
  if (jumpers.mode == 1) var elvp_polling = require('./elvp_polling');
  if (jumpers.mode == 2) var series3_polling = require('./series3_polling');
  if (jumpers.mode == 3) var series4_polling = require('./series4_polling');
  if (jumpers.cams) var cams_polling = require('./cams_polling');
  if (jumpers.aura) var aura_polling = require('./aura_polling');
  if (jumpers.firefly) var firefly = require('./firefly');
  var alarms_polling = require('./alarms_polling');
  var hostdiscovery = require('./hostdiscovery');
  var modbus_api = require('./modbus_api');

  app.use(cors());
  app.options('*', cors());

  app.use(compression())

  var admins = { 'username': { password: 'password' } };

  // app.use(function (req, res, next) {
  //   var user = auth(req);
  //   if (!user || !admins[user.name] || admins[user.name].password !==
  //   user.pass) {
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
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // Add firefly to request
  app.use('*', (req, res, next) => {
    if (jumpers.firefly) res.locals.firefly = firefly;
    next();
  });

  // Add aura to request
  app.use('*', (req, res, next) => {
    // Add aura
    res.locals.aura_params =
    {
      Temp: { gas: 'Temp', color: '#C5E3BF', title:'Apparent Temperature', unit: 'C', decimal: 1, range: { min: 0, max: 50 }, warning: { min: 10, max: 35 }, alarm: { min: 0, max: 40 } },
      Temp_F: { gas: 'Temp_F', color: '#C5E3BF', title:'Apparent Temperature', unit: 'F', decimal: 1, range: { min: 32, max: 122 }, warning: { min: 50, max: 95 }, alarm: { min: 32, max: 104 } },
      O2: { gas: 'O2', color: '#C5E3BF', title:'Oxygen', unit: '%', decimal: 1, range: { min: 17.5, max: 25 }, warning: { min: 19.5, max: 22 }, alarm: { min: 18.5, max: 23 } },
      CO2: { gas: 'CO2', color: '#C5E3BF', title:'Carbon Dioxide', unit: '%', decimal: 2, range: { min: 0, max: 2 }, warning: { min: -1, max: 0.5 }, alarm: { min: -1, max: 1 } },
      CO: { gas: 'CO', color: '#C5E3BF', title:'Carbon Monoxide', unit: 'ppm', decimal: 1, range: { min: 0, max: 50 }, warning: { min: -1, max: 15 }, alarm: { min: -1, max: 25 } },
      H2S: { gas: 'H2S', color: '#C5E3BF', title:'Hydrogen Sulfide', unit: 'ppm', decimal: 1, range: { min: 0, max: 20 }, warning: { min: -1, max: 2 }, alarm: { min: -1, max: 10 } },
      NH3: { gas: 'NH3', color: '#C5E3BF', title:'Ammonia', unit: 'ppm', decimal: 1, range: { min: 0, max: 100 }, warning: { min: -1, max: 25 }, alarm: { min: -1, max: 50 } },
      Cl: { gas: 'Cl', color: '#C5E3BF', title:'Chlorine', unit: 'ppm', decimal: 1, range: { min: 0, max: 2 }, warning: { min: -1, max: 0.5 }, alarm: { min: -1, max: 1 } },
      NO: { gas: 'NO', color: '#C5E3BF', title:'Nitrogen Monoxide', unit: 'ppm', decimal: 1, range: { min: 0, max: 50 }, warning: { min: -1, max: 12 }, alarm: { min: -1, max: 25 } },
      NO2: { gas: 'NO2', color: '#C5E3BF', title:'Nitrogen Dioxide', unit: 'ppm', decimal: 1, range: { min: 0, max: 10 }, warning: { min: -1, max: 1 }, alarm: { min: -1, max: 5 } },
      CH4: { gas: 'CH4', color: '#C5E3BF', title:'Methane', unit: 'ppm', decimal: 1, range: { min: 0, max: 100 }, warning: { min: -1, max: 20 }, alarm: { min: -1, max: 40 } },
      SO2: { gas: 'SO2', color: '#C5E3BF', title:'Sulfur Dioxide', unit: 'ppm', decimal: 1, range: { min: 0, max: 25 }, warning: { min: -1, max: 2 }, alarm: { min: -1, max: 5 } },
      HF: { gas: 'HF', color: '#C5E3BF', title:'Hydrogen Fluride', unit: 'ppm', decimal: 1, range: { min: 0, max: 10 }, warning: { min: -1, max: 1.5 }, alarm: { min: -1, max: 3 } },
      ClO2: { gas: 'ClO2', color: '#C5E3BF', title:'Chlorine Dioxide', unit: 'ppm', decimal: 1, range: { min: 0, max: 10 }, warning: { min: -1, max: 1.5 }, alarm: { min: -1, max: 3 } },
      HCL: { gas: 'HCL', color: '#C5E3BF', title:'Hydrogen Chloride', unit: 'ppm', decimal: 1, range: { min: 0, max: 10 }, warning: { min: -1, max: 1.5 }, alarm: { min: -1, max: 3 } }
    };

    next();
  });

  app.use('*', (req, res, next) => {
    // Add jumpers
    res.locals.app_jumpers = jumpers;
    next();
  });


  app.use('/', dashboard);
  app.use('/dashboard', chamber);
  app.use('/chamber', chamber);

  if (jumpers.mode == 0) app.use('/monitor', elv);
  if (jumpers.mode == 1) app.use('/monitor', elvp);
  if (jumpers.mode == 2) app.use('/monitor', series3);
  if (jumpers.mode == 3) app.use('/monitor', series4);

  app.use('/camera_internal', camera_internal);
  if (jumpers.extn) app.use('/camera_external', camera_external);
  if (jumpers.tagboard) app.use('/tagboard', tagboard);
  app.use('/notifications', notifications);
  app.use('/settings', settings);
  app.use('/api/overview', overview_api);
  app.use('/api/hosts', hosts_api);
  app.use('/api/monitor', monitor_api);
  app.use('/api/camera', camera_api);
  app.use('/contact', contact);

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
      res.render('error', { error: err });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', { error: {} });
  });

  module.exports = app;
}

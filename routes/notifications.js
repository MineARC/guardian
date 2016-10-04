var express = require('express');
var jumpers = require('../jumpers');
if (jumpers.mode == 0) var elv_polling = require('../elv_polling');
if (jumpers.mode == 1) var elvp_polling = require('../elvp_polling');
if (jumpers.mode == 2) var series3_polling = require('../series3_polling');
if (jumpers.mode == 3) var series4_polling = require('../series4_polling');
var db = require('../database')
var router = express.Router();

var alarms = ["SDCard failed on Display board",
  "Internal log is full",
  "Battery Rail has failed on Display board",
  "SMPS Rail has failed on Display board",
  "Fan board 1 has failed",
  "Battery Rail has failed on Fan board 1",
  "SMPS Rail has failed on Fan board 1",
  "CO2 fan 1 has failed on Fan board 1",
  "CO2 fan 2 has failed on Fan board 1",
  "CO fan has failed on Fan board 1",
  "Lighting has failed on Fan board 1",
  "Siren has failed on Fan board 1",
  "Green strobe light has failed on Fan board 1",
  "Red strobe light has failed on Fan board 1",
  "Yellow strobe light has failed on Fan board 1",
  "Fan board 2 has failed",
  "Battery Rail has failed on Fan board 2",
  "SMPS Rail has failed on Fan board 2",
  "CO2 fan 1 has failed on Fan board 2",
  "CO2 fan 2 has failed on Fan board 2",
  "CO fan has failed on Fan board 2",
  "Lighting has failed on Fan board 2",
  "Siren has failed on Fan board 2",
  "Green strobe light has failed on Fan board 2",
  "Red strobe light has failed on Fan board 2",
  "Yellow strobe light has failed on Fan board 2",
  "Current board has failed",
  "Battery Rail has failed on Current board",
  "SMPS Rail has failed on Current board",
  "Current Loop 1 has failed",
  "Current Loop 2 has failed",
  "Current Loop 3 has failed",
  "Current Loop 4 has failed",
  "Current Loop 5 has failed",
  "Current Loop 6 has failed",
  "Voice board has failed",
  "Battery Rail has failed on Voice board",
  "SMPS Rail has failed on Voice board",
  "SDCard has failed on Voice board",
  "Speaker failed",
  "General board has failed",
  "Battery Rail has failed on General board",
  "SMPS Rail has failed on General board",
  "Chamber temperature failed",
  "Outside temperature failed",
  "Mains power has been disconnected",
  "Inverter voltage has failed",
  "Inverter fault signal has been detected",
  "Battery board has failed",
  "Battery power is unavailable",
  "Battery discharge current failed",
  "Battery charge current failed",
  "Battery voltage failed",
  "Battery temperature failed",
  "Battery current failed",
  "Load Test has failed"];

/* GET users listing. */
router.get('/', function (req, res, next) {
  var data = {};
  if (jumpers.mode == 0) data['elv'] = elv_polling.data;
  if (jumpers.mode == 1) data['elvp'] = elvp_polling.data;
  if (jumpers.mode == 2) data['series3'] = series3_polling.data;
  if (jumpers.mode == 3) data['series4'] = series4_polling.data;
  data['static_alarms'] = alarms;
  db.getAll(function (err, all) {
    data['emails'] = all;
    res.render('notifications', data);
  });
});

router.post('/addEmail', function (req, res, next) {
  var email = req.body.email;

  if (!email || !email.match('\\w+@\\w+')) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');
  }

  db.addEmail(email, null, function (err, success) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }
    else if (success) {
      return res.send('User added');
    }
    else {
      return res.send('Something went wrong');
    }
  });
});

router.post('/saveSubscriptions', function (req, res, next) {
  var email = req.body.email;
  var subscriptions = JSON.parse(req.body.subscriptions);

  if (!email || !subscriptions || !email.match('\\w+@\\w+')) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');
  }

  var subs = [];
  subscriptions.reduce(function (prev, curr, index) {
    prev.push(alarms[subscriptions[index]]);
    return prev;
  }, subs);

  db.setSubscription(email, subs, function (err, success) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }
    else if (success) {
      res.send('Subscriptions saved');
    }
    else {
      res.send('Something went wrong');
    }
  });
});

router.post('/delEmail', function (req, res, next) {
  var email = req.body.email;

  if (!email || !email.match('\\w+@\\w+')) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');
  }

  db.removeEmail(email, function (err, success) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }
    else if (success) {
      res.send('Email deleted');
    }
    else {
      res.send('Something went wrong');
    }
  });
});

router.get('/getAlarms', function (req, res, next) {
  res.send(alarms);
});

function merge() {
  var args = Array.from(arguments);
  var result = {};
  for (var obj in args) {
    for (var key in obj)
      result[key] = obj[key];
  }
  return result;
}

module.exports = router;

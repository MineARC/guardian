var express = require('express');
var polling = require('../polling');
var db = require('../database')
var router = express.Router();

var alarms = ["sdcard failed on display board",
  "internal log is full",
  "battery rail has failed on display board",
  "smps rail has failed on display board",
  "fan board 1 has failed",
  "battery rail has failed on fan board 1",
  "smps rail has failed on fan board 1",
  "co2 fan 1 has failed on fan board 1",
  "co2 fan 2 has failed on fan board 1",
  "co fan has failed on fan board 1",
  "lightining has failed on fan board 1",
  "siren has failed on fan board 1",
  "green strobe light has failed on fan board 1",
  "red strobe light has failed on fan board 1",
  "yellow strobe light has failed on fan board 1",
  "fan board 2 has failed",
  "battery rail has failed on fan board 2",
  "smps rail has failed on fan board 2",
  "co2 fan 1 has failed on fan board 2",
  "co2 fan 2 has failed on fan board 2",
  "co fan has failed on fan board 2",
  "lightining has failed on fan board 2",
  "siren has failed on fan board 2",
  "green strobe light has failed on fan board 2",
  "red strobe light has failed on fan board 2",
  "yellow strobe light has failed on fan board 2",
  "current board has failed",
  "battery rail has failed on current board",
  "smps rail has failed on current board",
  "current loop 1 has failed",
  "current loop 2 has failed",
  "current loop 3 has failed",
  "current loop 4 has failed",
  "current loop 5 has failed",
  "current loop 6 has failed",
  "voice board has failed",
  "battery rail has failed on voice board",
  "smps rail has failed on voice board",
  "sdcard has failed on voice board",
  "speaker failed",
  "general board has failed",
  "battery rail has failed on general board",
  "smps rail has failed on general board",
  "chamber temperature failed",
  "outside temperature failed",
  "mains power has been disconnected",
  "inverter voltage has failed",
  "inverter fault signal has been detected",
  "battery board has failed",
  "battery power is unavailable",
  "battery discharge current failed",
  "battery charge current failed",
  "battery voltage failed",
  "battery temperature failed",
  "battery current failed",
  "load test has failed"];

/* GET users listing. */
router.get('/', function (req, res, next) {
  var data = polling.monitor_data;
  db.getAll(function (err, all) {
    data['emails'] = all
    res.render('emails', data);
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
  var subscriptions = req.query.subscriptions;

  if (!email || !subscriptions || !email.match('\\w+@\\w+')) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');
  }

  db.setSubscriptions(email, subscriptions, function (err, success) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }
    else if (success) {
      res.send('Subscriptions saved');
    }
    else {
      re.send('Something went wrong');
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

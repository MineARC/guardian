var express = require('express');
var polling = require('../polling');
var db = require('../database')
var router = express.Router();

var alarms = ["Sdcard failed on display board",
  "Internal log is full",
  "Battery rail has failed on display board",
  "Smps rail has failed on display board",
  "Fan board 1 has failed",
  "Battery rail has failed on fan board 1",
  "Smps rail has failed on fan board 1",
  "Co2 fan 1 has failed on fan board 1",
  "Co2 fan 2 has failed on fan board 1",
  "Co fan has failed on fan board 1",
  "Lightining has failed on fan board 1",
  "Siren has failed on fan board 1",
  "Green strobe light has failed on fan board 1",
  "Red strobe light has failed on fan board 1",
  "Yellow strobe light has failed on fan board 1",
  "Fan board 2 has failed",
  "Battery rail has failed on fan board 2",
  "Smps rail has failed on fan board 2",
  "Co2 fan 1 has failed on fan board 2",
  "Co2 fan 2 has failed on fan board 2",
  "Co fan has failed on fan board 2",
  "Lightining has failed on fan board 2",
  "Siren has failed on fan board 2",
  "Green strobe light has failed on fan board 2",
  "Red strobe light has failed on fan board 2",
  "Yellow strobe light has failed on fan board 2",
  "Current board has failed",
  "Battery rail has failed on current board",
  "Smps rail has failed on current board",
  "Current loop 1 has failed",
  "Current loop 2 has failed",
  "Current loop 3 has failed",
  "Current loop 4 has failed",
  "Current loop 5 has failed",
  "Current loop 6 has failed",
  "Voice board has failed",
  "Battery rail has failed on voice board",
  "Smps rail has failed on voice board",
  "Sdcard has failed on voice board",
  "Speaker failed",
  "General board has failed",
  "Battery rail has failed on general board",
  "Smps rail has failed on general board",
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
  "Load test has failed"];

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
  var subscriptions = JSON.parse(req.body.subscriptions);

  if (!email || !subscriptions || !email.match('\\w+@\\w+')) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');
  }

  var subs = [];
  subscriptions.reduce(function (prev, curr, index) {
    prev.push(alarms[subscriptions[index]]);
    return prev;
  }, subs)

  console.log(subs);

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

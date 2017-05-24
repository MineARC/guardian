var express = require('express');
var jumpers = require('../jumpers');
if (jumpers.cams) var cams_polling = require('../cams_polling');
if (jumpers.aura) var aura_polling = require('../aura_polling');
if (jumpers.mode == 0) var elv_polling = require('../elv_polling');
if (jumpers.mode == 1) var elvp_polling = require('../elvp_polling');
if (jumpers.mode == 2) var series3_polling = require('../series3_polling');
if (jumpers.mode == 3) var series4_polling = require('../series4_polling');
var db = require('../database');
var alias = require('../alias');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  var data = {};
  data['alias'] = alias.alias;
  if (jumpers.cams) data['cams'] = cams_polling.alarms;
  if (jumpers.aura) data['aura'] = aura_polling.alarms;
  if (jumpers.extn) data['extn'] = true;
  if (jumpers.mode == 0) data['elv'] = elv_polling.alarms;
  if (jumpers.mode == 1) data['elvp'] = elvp_polling.alarms;
  if (jumpers.mode == 2) data['series3'] = series3_polling.alarms;
  if (jumpers.mode == 3) data['series4'] = series4_polling.alarms;
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

  var subs = {};
  for (key in subscriptions) {
    switch (key) {
      case 'elv':
        if (subscriptions[key].length > 0)
          subs['elv'] = subscriptions[key].filter(function (element) {
            return element in elv_polling.alarms;
          });
        break;
      case 'elvp':
        if (subscriptions[key].length > 0)
          subs['elvp'] = subscriptions[key].filter(function (element) {
            return element in elvp_polling.alarms;
          });
        break;
      case 'series3':
        if (subscriptions[key].length > 0)
          subs['series3'] = subscriptions[key].filter(function (element) {
            return element in elv_polling.alarms;
          });
        break;
      case 'series4':
        if (subscriptions[key].length > 0)
          subs['series4'] = subscriptions[key].filter(function (element) {
            return element in series4_polling.alarms;
          });
        break;
      case 'cams':
        if (subscriptions[key].length > 0)
          subs['cams'] = subscriptions[key].filter(function (element) {
            return element in cams_polling.alarms;
          });
        break;
      case 'aura':
        if (subscriptions[key].length > 0)
          subs['aura'] = subscriptions[key].filter(function (element) {
            return element in aura_polling.alarms;
          });
        break;
      default:
        break;
    }
  }

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

// router.get('/getAlarms', function (req, res, next) {
//   res.send(alarms);
// });

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
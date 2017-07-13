var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var jumpers = require('../jumpers');
if (jumpers.cams) var cams_polling = require('../cams_polling');
if (jumpers.aura) var aura_polling = require('../aura_polling');
if (jumpers.mode == 0) var elv_polling = require('../elv_polling');
if (jumpers.mode == 1) var elvp_polling = require('../elvp_polling');
if (jumpers.mode == 2) var series3_polling = require('../series3_polling');
if (jumpers.mode == 3) var series4_polling = require('../series4_polling');
var underscore = require('underscore');
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
  var emails = [];
  hostdiscovery.hosts_data.forEach(function (element) {
    if (element.emails)
      emails = emails.concat(element.emails);
  }, this);
  emails = underscore.uniq(emails);
  data['emails'] = emails;
  data['hosts'] = hostdiscovery.hosts_data;
  data['ips'] = { ips: [] };
  hostdiscovery.hosts_data.forEach(function (element) {
    data['ips']['ips'].push(element.ip);
  }, this);
  res.render('notifications', data);
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

module.exports = router;
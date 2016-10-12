var request = require('request');
var nodemailer = require('nodemailer');
var async = require('async');
var jumpers = require('./jumpers');
if (jumpers.cams) var cams_polling = require('./cams_polling');
if (jumpers.aura) var aura_polling = require('./aura_polling');
if (jumpers.mode == 0) var elv_polling = require('./elv_polling');
if (jumpers.mode == 1) var elvp_polling = require('./elvp_polling');
if (jumpers.mode == 2) var series3_polling = require('./series3_polling');
if (jumpers.mode == 3) var series4_polling = require('./series4_polling');
var underscore = require('underscore');
var db = require('./database');

// Set up polling of alarms
var alert_is_polling = true;
poll_alerts(function () {
  alert_is_polling = false;
});

// Poll for updates to alarms every 30 seconds
setInterval(function () {
  if (!alert_is_polling) {
    alert_is_polling = true;
    poll_alerts(function () {
      alert_is_polling = false;
    });
  }
}, 10000);

// Check the active alerts against the database and send out emails
function poll_alerts(next) {
  var alarms = {};
  if (jumpers.cams) alarms['cams'] = cams_polling.alarms;
  if (jumpers.aura) alarms['aura'] = aura_polling.alarms;
  if (jumpers.mode == 0) alarms['elv'] = elv_polling.alarms;
  if (jumpers.mode == 1) alarms['elvp'] = elvp_polling.alarms;
  if (jumpers.mode == 2) alarms['series3'] = series3_polling.alarms;
  if (jumpers.mode == 3) alarms['series4'] = series4_polling.alarms;

  var alarms_active = [];
  for (var type in alarms) {
    for (var alarm in alarms[type])
      if (alarm.state)
        alarms_active.push(alarm);
  }

  // If there are any active alarms retrive the database so we can continue with checks
  if (alarms_active.length > 0) {
    db.getAll(get_all_callback.bind(null, alarms_active));
  }
  else {
    console.log('No active alarms');
  }

  next();
}

function send_mail(fromName, fromAddress, to, subject, text, callback) {
  var smtpConfig = {
    host: 'remote.nessco.com.au',
    port: 25,
    ignoreTLS: true,
    // authMethod: 'LOGIN',
    // // secure: false, // use SSL
    // auth: {
    //   user: 'lhgroup\mitchell.pontague',
    //   pass: ''
    // }
  }

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(smtpConfig);



  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"' + fromName + '"' + fromAddress, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text // plaintext body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return callback(false);
    }
    console.log('Message sent: ' + info.response);
    return callback(true);
  });
}

// Called when the database returns with everything
function get_all_callback(alarms_active, err, all) {
  if (err) {
    return console.log(err.message);
  }

  // For each email in the database do checks individually
  all.forEach(function (email) {
    var result = [];
    var send = false;

    // Check active alarms against alarms that the email is subscribed to
    // if they are subscribed and a message hasnt been sent recently
    // send them a new email for all active alarms.
    underscore.intersection(alarms_active, email.subscription)
      .reduce(function (prev, curr) {
        // Check if alarm has never been sent or if its due to be sent
        if (!email.sent[curr] || email.sent[curr] <= Date.now()) {
          send = true;
        }
        prev.push(curr);
        return prev;
      }, result);

    // If any active alarms meet the test to be sent, send     
    if (send) {
      var sent = email.sent;
      result.reduce(function (prev, curr) {
        sent[curr] = Date.now() + 300000;
        return prev;
      }, sent);
      // Send mail for alarms and update database afterwards
      send_mail('Guardian', 'guardian@minearc.com.au', email.email, 'Guardian', format_alarms(alarms_active), send_mail_callback.bind(null, email.email, sent));
    }
  });
}

function send_mail_callback(email, sent, success) {
  // If the email was sent, write to the database the new sent status
  if (success) {
    db.setSent(email, sent, function (err, changes) {
      if (err) {
        return console.log(err.message);
      }
      console.log('Updated database send for ' + email);
    })
  }
}

// Put the active alarms into an attractive format for the message body
function format_alarms(alarms) {
  return JSON.stringify(alarms);
}
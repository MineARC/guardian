var request = require('request');
var nodemailer = require('nodemailer');
var async = require('async');
var os = require('os');
var alias = require('./alias');
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

  var alarms_active = {};
  for (var type in alarms) {
    for (var alarm in alarms[type]) {
      if (alarms[type][alarm].state) {
        if (!(type in alarms_active))
          alarms_active[type] = [];
        alarms_active[type].push(alarm);
      }
    }
  }

  // If there are any active alarms retrive the database so we can continue with checks
  db.getAll(get_all_callback.bind(null, alarms_active));
  next();
}

function send_mail(fromName, fromAddress, to, subject, text, callback) {
  var smtpConfig = {
    host: 'remote.nessco.com.au',
    port: 25,
    // requireTLS: true,
    tls: { rejectUnauthorized: false },
    authMethod: 'LOGIN',
    auth: {
      user: 'LHgroup.local\\Guardian',
      pass: 'Guardian'
    },
    logger: true,
    debug: true
  }

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(smtpConfig);

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"' + fromName + '"' + fromAddress, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: text, // html body
    attachments: [{
      filename: 'header.jpg',
      path: process.cwd() + '/public/images/header.jpg',
      cid: 'header'
    }]
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
    var result = {};
    var send = false;

    // Check active alarms against alarms that the email is subscribed to
    // if they are subscribed and a message hasnt been sent recently
    // send them a new email for all active alarms.
    for (var type in alarms_active) {
      if (email.subscription[type]) {
        var alarm = underscore.intersection(alarms_active[type], email.subscription[type])
        for (var i = 0; i < alarm.length; i++) {
          // Check if alarm has never been sent or if its due to be sent
          if (!email.sent[type])
            email.sent[type] = {};
          if (!email.sent[type][alarm[i]] || email.sent[type][alarm[i]] <= Date.now()) {
            send = true;
            if (!result[type])
              result[type] = []
            result[type].push(alarm[i]);
          }
        }
      }
    }

    // If any active alarms meet the test to be sent, send     
    if (send) {
      var sent = email.sent;
      for (var type in result) {
        for (var alarm in result[type]) {
          sent[type][result[type][alarm]] = Date.now() + 3600000;
        }
      }
      // Send mail for alarms and update database afterwards
      send_mail('Guardian', 'Guardian@minearc.com.au', email.email, 'Guardian', format_alarms(alarms_active), send_mail_callback.bind(null, email.email, sent));
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
  var ma = os.hostname().split('-')[1];
  var name = alias.alias;

  var strVar = "";
  strVar += "<body>";
  strVar += "	<style>";
  strVar += "		.small {";
  strVar += "			font-size: 7pt;";
  strVar += "		}";
  strVar += "		";
  strVar += "		div {";
  strVar += "			margin: 0;";
  strVar += "		}";
  strVar += "		p {";
  strVar += "			font-family: Arial, Helvetica, sans-serif";
  strVar += "		}";
  strVar += "	<\/style>";
  strVar += "	<div>";
  strVar += "		<table width=\"798\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;background-color:white;\">";
  strVar += "			<tbody>";
  strVar += "				<tr>";
  strVar += "					<td>";
  strVar += "						<div><img src=\"cid:header\"";
  strVar += "								height=\"76\" width=\"794\">";
  strVar += "						<\/div>";
  strVar += "					<\/td>";
  strVar += "				<\/tr>";
  strVar += "				<tr>";
  strVar += "					<td>";
  strVar += "            <br>";
  strVar += "						<div>";
  strVar += "							<span>The chamber: <b>" + name + "<\/b> with MA number: <b>" + ma + "<\/b> has experienced the following fault(s)<\/span>";
  strVar += "						<\/div>";
  strVar += "            <br>";
  strVar += "						<div>";
  strVar += "							<table>";
  strVar += "								<tbody>";
  for (var t in alarms) {
    strVar += "									<tr>";
    strVar += "										<td>";
    strVar += "											<span><b>" + t.toUpperCase() + ":<\/b><\/span>";
    strVar += "										<\/td>";
    strVar += "									<\/tr>";
    for (var j = 0; j < alarms[t].length; j++) {
      strVar += "									<tr>";
      strVar += "										<td>";
      strVar += "											<span>" + alarms[t][j] + "<\/span>";
      strVar += "										<\/td>";
      strVar += "									<\/tr>";
    }
  }
  strVar += "								<\/tbody>";
  strVar += "							<\/table>";
  strVar += "						<\/div>";
  strVar += "            <br>";
  strVar += "						<div>";
  strVar += "							<span>Please check and reset fault(s).<\/span>";
  strVar += "						<\/div>";
  strVar += "						<div>";
  strVar += "							<span>For further information about this fault please contact MineARC service at <\/span>";
  strVar += "							<a href=\"redir.aspx?C=8lGQmt9ZmEmZpGFhDyAd65Vtg5J0B9QIFKPjm_Mbrm8zTSVOj8PfpwYR2rL2jg4GcP0sxnpf1wk.&amp;URL=mailto%3aservice%40minearc.com.au%3fSubject%3dGuardian%2520Event\"";
  strVar += "								target=\"_blank\">";
  strVar += "								<span>service@minearc.com.au<\/span>";
  strVar += "							<\/a>";
  strVar += "						<\/div>";
  strVar += "						<div align=\"center\" style=\"text-align:center;margin:0;\">";
  strVar += "							<hr width=\"100%\" size=\"2\" align=\"center\" style=\"width:100%;\">";
  strVar += "						<\/div>";
  strVar += "						<div class=\"small\">";
  strVar += "							<span><i>This transmission is for the intended addressee only and is confidential information. If you have received this transmission in error, please delete it and notify the sender or forward the message to <\/i><\/span>";
  strVar += "							<a href=\"redir.aspx?C=8lGQmt9ZmEmZpGFhDyAd65Vtg5J0B9QIFKPjm_Mbrm8zTSVOj8PfpwYR2rL2jg4GcP0sxnpf1wk.&amp;URL=mailto%3ainfo%40minearc.com.au\"";
  strVar += "								target=\"_blank\">";
  strVar += "								<span><i>info@minearc.com.au<\/i><\/span>";
  strVar += "							<\/a>";
  strVar += "							<span><i>. The contents of this e-mail are the opinion of the writer only and are not endorsed by MineARC&nbsp;unless expressly stated otherwise. MineARC do not represent that this communication (including any files attached) is free from computer viruses or other faults or defects. It is the responsibility of any person opening any files attached to this communication to scan those files for computer viruses<\/i><\/span>";
  strVar += "						<\/div>";
  strVar += "					<\/td>";
  strVar += "				<\/tr>";
  strVar += "			<\/tbody>";
  strVar += "		<\/table>";
  strVar += "	<\/div>";
  strVar += "<\/body>";

  return strVar;
}
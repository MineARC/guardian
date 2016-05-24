var express = require('express');
var router = express.Router();
var db = require('../database');

router.get('/', function (req, res) {
  res.render('dbtest');
});

router.get('/getAll', function (req, res) {
  db.getAll(function (err, data) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      res.send(data);
    }
  });
});

router.get('/getEmailsAndSubscriptions', function (req, res) {
  db.getEmailsAndSubscriptions(function (err, data) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      res.send(data);
    }
  });
});

router.get('/getEmails', function (req, res) {
  db.getEmails(function (err, emails) {
    if (err) {
      return res.send(err.message);
    }

    return res.send(emails);

  });
});

router.get('/addEmail', function (req, res) {
  var email = req.query.email;
  var subscribe = req.query.subscribe;

  if (!email) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');

  }

  db.addEmail(email, subscribe, function (err, success) {
    if (err) {
      return res.send(err.message);
    }
    else {
      return res.send('User added');
    }
  });
});

router.get('/removeEmail', function (req, res) {
  var username = req.query.username;

  db.getUsersEmail(username, function (err, data) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      res.send(data);
    }
  });
});

router.get('/setEmail', function (req, res) {
  var username = req.query.username;
  var email = req.query.email;

  db.updateUsersEmail(username, email, function (err, data) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      res.send(data);
    }
  });
});

router.post('/getSubscribe', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.compareUsersPassword(username, password, function (err, data) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }
    else {
      res.send(data);
    }
  });
});

router.get('/setSubscribe', function (req, res) {
  var username = req.query.username;
  var password = req.query.password;

  db.updateUsersPassword(username, password, function (err, data) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      res.send(data);
    }
  });
});

module.exports = router;
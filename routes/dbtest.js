var express = require('express');
var router = express.Router();
var db = require('../database');

router.get('/', function (req, res) {
  res.render('dbtest');
});

router.get('/getUsers', function (req, res) {
  db.getUsers(function (err, data) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      console.log(data);
      res.send(data);
    }
  });
});

router.get('/addUser', function (req, res) {
  var username = req.query.username;
  var password = req.query.password;
  var email = req.query.email;

  db.addUser(username, password, email, function (err) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      console.log(data);
      res.send('user added');
    }
  });
});

router.get('/removeUser', function (req, res) {
  var username = req.query.username;

  db.removeUser(username, function (err) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      res.send('records updated');
    }
  });
});

router.get('/getUsersEmail', function (req, res) {
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

router.get('/updateUsersEmail', function (req, res) {
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

router.post('/compareUsersPassword', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.compareUsersPassword(username, password, function (err, data) {
    if (err) {
      console.log(err);
      return res.render('error', { error: err });
    }
    else {
      res.send(data);
    }
  });
});

router.get('/updateUsersPassword', function (req, res) {
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
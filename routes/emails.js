var express = require('express');
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
  res.render('emails');
});

router.post('/addEmail', function (req, res, next) {
  
});

router.post('/saveSubscriptions', function (req, res, next) {

});

router.post('/delEmail', function (req, res, next) {
  
});

router.get('/getAlarms', function (req, res, next) {
  res.send(alarms);
});

module.exports = router;

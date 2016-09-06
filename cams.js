var rpio = require('rpio');

var buffer = [];
var rate = 0
var occupied = false;
var state = false;

exports.cams_data = { occupied: occupied, rate: rate };

rpio.open(29, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(31, rpio.INPUT, rpio.PULL_DOWN);

function pollPins(pin) {
  console.log(pin);
  console.log(rpio.read(pin));
  switch (pin) {
    case 29:
      occupied = rpio.read(pin) == 1;
      break;
    case 31:
      state = rpio.read(pin);
      if ((buffer.length > 0 && (buffer[buffer.length - 1].state != state)) || buffer.length == 0) {
        buffer.push({ time: Date.now(), state: state });
      }
      break;
  }

  exports.cams_data = { occupied: occupied, rate: rate };
}

function updateEvents(pin) {
  var now = Date.now();
  buffer = buffer.filter(function (value) {
    return value.time > now - 30000;
  });
  rate = buffer.length;
}

rpio.poll(29, pollPins);
rpio.poll(31, pollPins);

setInterval(updateEvents, 10000);
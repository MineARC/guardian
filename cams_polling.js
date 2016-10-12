var rpio = require('rpio');

var occupied_pin = 31;
var solenoid_pin = 29

var buffer = [];
var state = false;

var cams_alarms = {
  'Air Leak': { state: false, type: 'cams' },
  'Air Quality': { state: false, type: 'cams' }
}

var cams_data = {
  occupied: false,
  solenoid: true,
  rate: 0,
  alarms_totals: 0
};

exports.data = cams_data;
exports.alarms = cams_alarms;

rpio.open(occupied_pin, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(solenoid_pin, rpio.INPUT, rpio.PULL_DOWN);

function pollPins(pin) {
  console.log(pin);
  console.log(rpio.read(pin));
  switch (pin) {
    case occupied_pin:
      cams_data.occupied = !!rpio.read(pin);
      break;
    case solenoid_pin:
      state = !!rpio.read(pin);
      cams_data.solenoid = state;
      if ((buffer.length == 0) || buffer[buffer.length - 1].state != state) {
        buffer.push({ time: Date.now(), state: state });
        updateEvents();
        updateAlarms();
        // exports.data = cams_data;
        // exports.alarms = cams_alarms;
      }
      break;
  }
}

function updateEvents() {
  var now = Date.now();
  buffer = buffer.filter(function (event) {
    return event.time > (now - 3600000);
  });
  console.log('Buffer :');
  console.log(buffer);
  var uptime = 0;
  var rate = 0;
  if (buffer.length > 0) {
    buffer.forEach(function (event, index) {
      if (index == buffer.length - 1 && !event.state)
        uptime += now - event.time;
      else if (index == 0 && event.state)
        ; // Do nothing
      else if (event.state)
        uptime += event.time;
      else
        uptime -= event.time;
    });

    console.log('Uptime :');
    console.log(uptime);

    rate = uptime / 3600000;

    console.log('Rate :');
    console.log(rate);
  }

  cams_data.rate = rate;
}

function updateAlarms() {
  var alarms_totals = 0;
  cams_alarms['Air leak'] = (!cams_data.occupied && cams_data.rate >= 0.15)
  cams_alarms['Air quality'] = (cams_data.occupied && cams_data.solenoid)

  for (key in cams_alarms) {
    if (cams_alarms[key]) {
      alarms_totals++;
    }
  }

  cams_data.alarms_totals = alarms_totals;
}

cams_data.occupied = !!rpio.read(occupied_pin);
cams_data.solenoid = !!rpio.read(solenoid_pin);

rpio.poll(occupied_pin, pollPins);
rpio.poll(solenoid_pin, pollPins);
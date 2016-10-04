var rpio = require('rpio');

var buffer = [];
var state = false;
var cams_alarms = {
  'Air leak': { state: false },
  'Air quality': { state: false }
}
var cams_data = {
  occupied: false,
  solenoid: true,
  rate: 0,
  alarms: cams_alarms,
  alarms_totals: 0
};
exports.data = cams_data;

rpio.open(31, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(29, rpio.INPUT, rpio.PULL_DOWN);

function pollPins(pin) {
  console.log(pin);
  console.log(rpio.read(pin));
  switch (pin) {
    case 31:
      cams_data.occupied = rpio.read(pin) == 1;
      break;
    case 29:
      state = rpio.read(pin) == 1;
      cams_data.solenoid = state;
      if ((buffer.length == 0) || buffer[buffer.length - 1].state != state) {
        buffer.push({ time: Date.now(), state: state });
        updateEvents();
        updateAlarms();
        exports.data = cams_data;
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
  cams_data.alarms_totals = 0;
  cams_data.alarms['Air leak'] = (!cams_data.occupied && cams_data.rate >= 0.15)
  cams_data.alarms['Air quality'] = (cams_data.occupied && cams_data.solenoid)

  for (key in cams_data.alarms) {
    if (cams_data.alarms[key]) {
      cams_data.alarms_totals++;
    }
  }
}

rpio.poll(29, pollPins);
rpio.poll(31, pollPins);
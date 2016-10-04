var serialport = require('serialport');
var rpio = require('rpio');
var db = require('./database');

var mains_pin = 33;
var inverter_pin = 35;

rpio.open(mains_pin, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(inverter_pin, rpio.INPUT, rpio.PULL_DOWN);
var elvp_alarms = {
  'Low Battery Voltage': { state: false }
};
var elvp_data = {
  mains: false,
  inverter: false,
  serial: {
    PID: '',
    V: '',
    VS: '',
    I: '',
    P: '',
    CE: '',
    SOC: '',
    TTG: '',
    Alarm: '',
    Relay: '',
    AR: '',
    BMV: '',
    FW: '',
    H1: '',
    H2: '',
    H3: '',
    H4: '',
    H5: '',
    H6: '',
    H7: '',
    H8: '',
    H9: '',
    H10: '',
    H11: '',
    H12: '',
    H15: '',
    H16: '',
    H17: '',
    H18: ''
  },
  alarms: elvp_alarms,
  alarms_total: 0
}
exports.data = elvp_data;

var battMon = new serialport('/dev/ttyS0', {
  baudRate: 19200,
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline('\r\n')
});

battMon.on('open', showPortOpen);
battMon.on('data', sendSerialData);
battMon.on('close', showPortClose);
battMon.on('error', showError);

function showPortOpen() {
  console.log('port open. Data rate: ' + battMon.options.baudRate);
}

function sendSerialData(data) {
  //console.log(data);
  var v = data.split('\t');

  if (v[0] in elvp_data.serial) {
    elvp_data.serial[v[0]] = v[1];
  }

  if (v[0] == 'H18') {
    exports.data = elvp_data;
    db.addMonitorData(1, elvp_data, function (err, success) {
      if (err)
        return console.log(err.message);
    });
  }
}

function showPortClose() {
  console.log('port closed.');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}

serialport.list(function (err, ports) {
  ports.forEach(function (port) {
    console.log(port.comName);
  });
});

function pollPins(pin) {
  console.log(pin);
  console.log(rpio.read(pin));
  switch (pin) {
    case mains_pin:
      elvp_data.mains = !!rpio.read(pin);
      break;
    case inverter_pin:
      elvp_data.inverter = !!rpio.read(pin);
      break;
  }
}

rpio.poll(mains_pin, pollPins);
rpio.poll(inverter_pin, pollPins);

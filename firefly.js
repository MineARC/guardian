var mqtt = require('mqtt');
var jumpers = require('./jumpers');
if (jumpers.cams) var cams_polling = require('./cams_polling');
if (jumpers.mode == 3) var series4_polling = require('./series4_polling');
var exports = module.exports;

var client = mqtt.connect('mqtt://172.17.0.1');

client.on('connect', function() {
  client.subscribe('firefly/emergency', function(err) {
    if (!err) {
      console.log('MQTT Connected');
    }
  });
});

client.on('message', function(topic, message) {});

publish_json = {
  'color': 'GREEN',
  'led_state': 'ON',
  'on_time': 20,
  'off_time': 20,
  'train': 1
};

last_json = {
  'color': 'GREEN',
  'led_state': 'OFF',
  'on_time': 300,
  'off_time': 200,
  'train': 10
};

setInterval(poll_firefly, 10000);
poll_firefly();

function poll_firefly() {
  if (jumpers.cams && cams_polling.data.occupied) {
    publish_json.color = 'GREEN';
    publish_json.led_state = 'BACKWARD';
    exports.color = 'Green';
    exports.state = 'Follow';
  } else if (jumpers.mode == 3 && series4_polling.data.mode == 'Emergency') {
    publish_json.color = 'GREEN';
    publish_json.led_state = 'BACKWARD';
    exports.color = 'Green';
    exports.state = 'Follow';
    // } else if (alarm) {
    //   publish_json.color = 'RED';
    //   publish_json.led_state = 'STROBE';
    //   exports.color = 'Red';
    //   exports.state = 'Strobe';
  } else {
    publish_json.color = 'GREEN';
    publish_json.led_state = 'ON';
    exports.color = 'Green';
    exports.state = 'On';
  }

  if (JSON.stringify(publish_json).localeCompare(JSON.stringify(last_json)) !=
      0) {
    last_json = JSON.parse(JSON.stringify(publish_json));
    client.publish('firefly/emergency', JSON.stringify(publish_json));
  }
}

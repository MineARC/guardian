var fs = require('fs');
var mqtt = require('mqtt');
var db = require('./database');
var jumpers = require('./jumpers');
if (jumpers.cams) var cams_polling = require('./cams_polling');

var client = mqtt.connect('mqtt://localhost');

client.on('connect', function() {
  client.subscribe('firefly/emergency', function(err) {
    if (!err) {
      console.log('MQTT Connected');
    }
  });
});

client.on('message', function(topic, message) {
  // console.log(message.toString());
});

level_json = {
  'color': 'GREEN',
  'led_state': 'ON',
  'on_time': 5,
  'off_time': 5,
  'train': 2
};

port_json = {
  'level1': level_json,
  'level2': level_json,
  'level3': level_json,
  'level4': level_json,
  'level5': level_json,
  'level6': level_json
};

publish_json = {
  'port1': port_json,
  'port2': port_json,
  'port3': port_json,
  'port4': port_json
};

setInterval(poll_firefly, 10000);
poll_firefly();

function poll_firefly() {
  if (jumpers.cams && cams_polling.data.occupied) {
    level_json.color = 'GREEN';
    level_json.led_state = 'BACKWARD';
    level_json.train = 2;
    exports.color = 'Green'
    exports.state = 'Follow'

  } else {
    level_json.color = 'GREEN';
    level_json.led_state = 'ON';
    exports.color = 'Green'
    exports.state = 'On'
  }

  client.publish('firefly/emergency', JSON.stringify(publish_json));
}

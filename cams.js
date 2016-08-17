var rpio = require('rpio');

var pin0_history = [];
var pin2_history = [];
var pin29_state = false;
var pin31_state = false;

exports.cams_data = { pin0: pin29_state, pin2: pin31_state };

rpio.open(15, rpio.INPUT, rpio.PULL_DOWN);

function pollPins(pin) {
  console.log(pin);
  console.log(rpio.read(pin));
  switch (pin) {
    case 15:
      console.log("Hello");
      break;
  }
}

rpio.poll(15, pollPins);

// gpio.on('change', function (channel, state) {
//   switch (channel) {
//     case 29:
//       pin0_change(state);
//       break;
//     case 31:
//       pin2_change(state);
//       break;
//   }
// });

// gpio.setup(29, gpio.DIR_IN, gpio.EDGE_BOTH, function (err) {
//   console.log(err);
// });
// gpio.setup(31, gpio.DIR_IN, gpio.EDGE_BOTH, function (err) {
//   console.log(err);
// });


// function pin0_change(state) {
//   pin29_state = state;

//   // Ignore double edge events
//   if (pin0_history.length > 0 && (pin0_history[pin0_history.length - 1].state != state)) {
//     var now = Date.now();

//     // Add time that new state happened to array
//     pin0_history.push({ time: Date.now(), state: state });
//   } else if (pin0_history.length == 0) {
//     var now = Date.now();

//     // Add time that new state happened to array
//     pin0_history.push({ time: Date.now(), state: state });
//   }

//   exports.cams_data = { pin0: pin29_state, pin2: pin31_state, pin0h: pin0_history, pin2h: pin2_history };

//   console.log('pin0 ' + state);
// }

// function pin2_change(state) {
//   pin31_state = state;

//   var now = Date.now();

//   // Add time that new state happened to array
//   pin2_history.push({ time: Date.now(), state: state });

//   // Dont keep old events in the array
//   pin2_history = pin2_history.filter(function (value) {
//     return value.time > now - 300000;
//   });

//   exports.cams_data = { pin0: pin29_state, pin2: pin31_state, pin0h: pin0_history, pin2h: pin2_history };

//   console.log('pin2 ' + state);
// }

// function stats() {
//   var now = Date.now();
//   pin0_history.sort(function (a, b) {
//     return a.time - b.time;
//   })
//   pin0_history = pin0_history.filter(function (value) {
//     return value.time > now - 300000;
//   });

//   var pin0_uptime;
//   var pin0_events = pin0_history.length;

//   gpio.read(29, function (err, state) {
//     if (pin0_history[0]) {
//       // Using the oldest known state of the pin calculate uptime
//       var time = now - 300000, state = !pin0_history[0].state;
//       pin0_uptime = pin0_history.reduce(function (prev, curr) {
//         var dif = curr.time - time;
//         time = curr.time;
//         state = curr.state;
//         if (!curr.state) {
//           return dif;
//         } else {
//           return prev;
//         }
//       }, 0);

//       if (state) {
//         pin0_uptime += now - time;
//       }
//     }
//     else {
//       // There are no known states so the current state is assumed for full duration
//       pin0_uptime = 300000 * state;
//     }

//     console.log('uptime ' + pin0_uptime);
//     console.log('events' + pin0_events);
//   });
// }

// setInterval(function () {
//   stats();
// }, 10000);
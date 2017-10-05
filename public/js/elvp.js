var elvp_voltage_emergency_data = [];
var elvp_voltage_standby_data = [];
var elvp_voltage_mains_data = [];
var elvp_voltage_inverter_data = [];
var elvp_current_battery_data = [];

var elvp_voltage_emergency_chart = new CanvasJS.Chart("graph-voltage-1", {
  title: { text: "Emergency Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: elvp_voltage_emergency_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Voltage V',
    minimum: 0,
    maximum: 60,
    interval: 10,
    stripLines: [{
      startValue: 48,
      endValue: 58,
      color: "#C5E3BF"
    }]
  }
});

var elvp_voltage_standby_chart = new CanvasJS.Chart("graph-voltage-2", {
  title: { text: "Standby Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: elvp_voltage_standby_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Voltage V',
    minimum: 0,
    maximum: 60,
    interval: 10,
    stripLines: [{
      startValue: 24,
      endValue: 29,
      color: "#C5E3BF"
    }]
  }
});

var elvp_voltage_mains_chart = new CanvasJS.Chart("graph-voltage-3", {
  title: { text: "Mains Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: elvp_voltage_mains_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Voltage V',
    minimum: 0,
    maximum: 300,
    interval: 50,
    stripLines: [{
      startValue: 220,
      endValue: 250,
      color: "#C5E3BF"
    }]
  }
});

var elvp_voltage_inverter_chart = new CanvasJS.Chart("graph-voltage-4", {
  title: { text: "Inverter Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: elvp_voltage_inverter_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Voltage V',
    minimum: 0,
    maximum: 300,
    interval: 50,
    stripLines: [{
      startValue: 220,
      endValue: 250,
      color: "#C5E3BF"
    }]
  }
});

var elvp_current_battery_chart = new CanvasJS.Chart("graph-current-1", {
  title: { text: "Battery Current" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} A",
    dataPoints: elvp_current_battery_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Current A',
    minimum: -90,
    maximum: 90,
    interval: 30
  }
});

$("#voltage_1_modal").on('shown.bs.modal', function () {
  elvp_voltage_emergency_chart.render();
});

$("#voltage_2_modal").on('shown.bs.modal', function () {
  elvp_voltage_standby_chart.render();
});

$("#current_1_modal").on('shown.bs.modal', function () {
  elvp_current_battery_chart.render();
});

function updateELVPHistory(data) {
  var last = (Date.now() / 1000 | 0) - 86400;
  while (data[0].Time > last) {
    elvp_voltage_emergency_data.push({ x: last, y: -1 });
    elvp_voltage_standby_data.push({ x: last, y: -1 });
    elvp_voltage_mains_data.push({ x: last, y: -1 });
    elvp_voltage_inverter_data.push({ x: last, y: -1 });
    elvp_current_battery_data.push({ x: last, y: -1 });
    last += 10;
  }
  for (var i = 0; i < data.length; i++) {
    elvp_voltage_emergency_data.push({ x: data[i].Time, y: data[i].voltage_emergency });
    elvp_voltage_standby_data.push({ x: data[i].Time, y: data[i].voltage_standby });
    elvp_voltage_mains_data.push({ x: data[i].Time, y: data[i].voltage_mains });
    elvp_voltage_inverter_data.push({ x: data[i].Time, y: data[i].voltage_inverter });
    elvp_current_battery_data.push({ x: data[i].Time, y: data[i].current_battery });
  }

  elvp_voltage_emergency_chart.render();
  elvp_voltage_standby_chart.render();
  elvp_voltage_mains_chart.render();
  elvp_voltage_inverter_chart.render();
  elvp_current_battery_chart.render();
}

function updateELVP(data) {
  $('#table-elv tr:contains("Mains Present") .row-info').text(data.mains ? 'Yes' : 'No');
  $('#table-elv tr:contains("Inverter Output") .row-info').text(data.inverter ? 'Yes' : 'No');
  $('#table-elv tr:contains("Emergency Bank Voltage") .row-info').text((data.serial.V / 1000).toFixed(2) + ' V');
  $('#table-elv tr:contains("Current Bank Voltage") .row-info').text((data.serial.VS / 1000).toFixed(2) + ' V');
  $('#table-elv tr:contains("Current") .row-info').text((data.serial.I / 1000).toFixed(2) + ' A');
  $('#table-elv tr:contains("Power") .row-info').text(data.serial.P + ' W');
  $('#table-elv tr:contains("Consumed Energy") .row-info').text((data.serial.CE / 1000).toFixed(2) + ' Ah');

  var n = ((data.serial.V / 1000).toFixed(1) - $('#readout-voltage-emergency .value')[0].childNodes[0].nodeValue).toFixed(1);
  $('#readout-voltage-emergency .delta')[0].childNodes[1].nodeValue = n;
  $('#readout-voltage-emergency .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-emergency .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = ((data.serial.VS / 1000).toFixed(1) - $('#readout-voltage-standby .value')[0].childNodes[0].nodeValue).toFixed(1);
  $('#readout-voltage-standby .delta')[0].childNodes[1].nodeValue = n;
  $('#readout-voltage-standby .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-standby .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = ((data.serial.I / 1000).toFixed(2) - $('#readout-current-battery .value')[0].childNodes[0].nodeValue).toFixed(2);
  $('#readout-current-battery .delta')[0].childNodes[1].nodeValue = n;
  $('#readout-current-battery .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-current-battery .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  $('#readout-voltage-emergency .value')[0].childNodes[0].nodeValue = (data.serial.V / 1000).toFixed(1);
  $('#readout-voltage-standby .value')[0].childNodes[0].nodeValue = (data.serial.VS / 1000).toFixed(1);
  $('#readout-voltage-mains .value')[0].childNodes[0].nodeValue = data.mains ? 'Yes' : 'No';
  $('#readout-voltage-inverter .value')[0].childNodes[0].nodeValue = data.inverter ? 'Yes' : 'No';
  $('#readout-current-battery .value')[0].childNodes[0].nodeValue = (data.serial.I / 1000).toFixed(2);

  elvp_voltage_emergency_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.V / 1000).toFixed(2)) });
  elvp_voltage_standby_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.VS / 1000).toFixed(2)) });
  elvp_voltage_mains_data.push({ x: Date.now() / 1000 | 0, y: data.mains });
  elvp_voltage_inverter_data.push({ x: Date.now() / 1000 | 0, y: data.inverter });
  elvp_current_battery_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.I / 1000).toFixed(2)) });

  if (elvp_voltage_emergency_data.length > dataLength) { elvp_voltage_emergency_data.shift(); }
  if (elvp_voltage_standby_data.length > dataLength) { elvp_voltage_standby_data.shift(); }
  if (elvp_voltage_mains_data.length > dataLength) { elvp_voltage_mains_data.shift(); }
  if (elvp_voltage_inverter_data.length > dataLength) { elvp_voltage_inverter_data.shift(); }
  if (elvp_current_battery_data.length > dataLength) { elvp_current_battery_data.shift(); }

  elvp_voltage_emergency_chart.render();
  elvp_voltage_standby_chart.render();
  elvp_voltage_mains_chart.render();
  elvp_voltage_inverter_chart.render();
  elvp_current_battery_chart.render();
}
var elv_voltage_data = [];
var elv_current_data = [];

// Battery voltage chart options
var elv_chart_voltage = new CanvasJS.Chart("elv-graph-voltage", {
  title: { text: "Battery voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: elv_voltage_data
  }],
  axisX: {
    title: 'Time',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Voltage',
    minimum: 0,
    maximum: 40,
    interval: 10,
    stripLines: [{
      startValue: 25,
      endValue: 30,
      color: "#C5E3BF"
    }]
  }
});

var elv_chart_current = new CanvasJS.Chart("elv-graph-current", {
  title: { text: "Battery current" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} A",
    dataPoints: elv_current_data
  }],
  axisX: {
    title: 'Time',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Current',
    minimum: -100,
    maximum: 100,
    interval: 50
  }
});

$.get('/api/monitor/history').then(function (data) {
  var last = (Date.now() / 1000 | 0) - 86400;
  if ('elv' in data) {
    while (data.elv[0].Time > last) {
      elv_voltage_data.push({ x: last, y: 0 });
      elv_current_data.push({ x: last, y: 0 });
      last += 10;
    }
    for (var i = 0; i < data.elv.length; i++) {
      elv_voltage_data.push({ x: data.elv[i].Time, y: +(data.elv[i].voltage_battery) });
      elv_current_data.push({ x: data.elv[i].Time, y: +(data.elv[i].current_battery) });
    }
  }
  else {
    for (var i = 0; i < dataLength; i++) {
      elv_voltage_data.push({ x: last, y: 0 });
      elv_current_data.push({ x: last, y: 0 });
      last += 10;
    }
  }

  elv_chart_voltage.render();
  elv_chart_current.render();
});

function updateELV(data) {
  var html = '<h3>ELV</h3><table class="table">' +
    '<tr><td>Mains Present</td><td class="table-right">' + (data.mains ? 'Yes' : 'No') + '</td>' +
    '<tr><td>Inverter Output</td><td class="table-right">' + (data.inverter ? 'Yes' : 'No') + '</td>' +
    '<tr><td>Emergency Bank Voltage</td><td class="table-right">' + (data.serial.V / 1000).toFixed(2) + ' V' + '</td>' +
    '<tr><td>Standby Bank Voltage</td><td class="table-right">' + (data.serial.VS / 1000).toFixed(2) + ' V' + '</td>' +
    '<tr><td>Current</td><td class="table-right">' + (data.serial.I / 1000).toFixed(2) + ' A' + '</td>' +
    '<tr><td>Power</td><td class="table-right">' + data.serial.P + ' W' + '</td>' +
    '<tr><td>Consumed Energy</td><td class="table-right">' + (data.serial.CE / 1000).toFixed(2) + ' Ah' + '</td>';

  $('#elv').html(html);

  // Get data from api relevent for the charts,
  // updates the chart data, and renders the new data
  elv_voltage_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.V / 1000).toFixed(2)) });
  elv_current_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.I / 1000).toFixed(2)) });


  if (elv_voltage_data.length > dataLength) { elv_voltage_data.shift(); }
  if (elv_current_data.length > dataLength) { elv_current_data.shift(); }

  elv_chart_voltage.render();
  elv_chart_current.render();
}
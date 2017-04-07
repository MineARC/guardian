var elvp_voltage_data = [];
var elvp_voltage_standby_data = [];
var elvp_current_data = [];

// Battery voltage chart options
var elvp_chart_voltage = new CanvasJS.Chart("elvp-graph-voltage", {
  title: { text: "Battery voltage" },
  legend: {
    horizontalAlign: "right", // "center" , "right"
    verticalAlign: "top",  // "top" , "bottom"
    fontSize: 15
  },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: elvp_voltage_data,
    showInLegend: true,
    legendText: "Emergency"
  }, {
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: elvp_voltage_standby_data,
    showInLegend: true,
    legendText: "Standby"
  }],
  axisX: {
    title: 'Time',
    valueFormatString: " ",
    interval: 3600,
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

var elvp_chart_current = new CanvasJS.Chart("elvp-graph-current", {
  title: { text: "Battery current" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} A",
    dataPoints: elvp_current_data
  }],
  axisX: {
    title: 'Time',
    valueFormatString: " "
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
  if ('elvp' in data) {
    while (data.elvp[0].Time > last) {
      elvp_voltage_data.push({ x: last, y: 0 });
      elvp_voltage_standby_data.push({ x: last, y: 0 });
      elvp_current_data.push({ x: last, y: 0 });
      last += 10;
    }
    for (var i = 0; i < data.elvp.length; i++) {
      elvp_voltage_data.push({ x: data.elvp[i].Time, y: +((data.elvp[i].serial.V / 1000).toFixed(2)) });
      elvp_voltage_standby_data.push({ x: data.elvp[i].Time, y: +((data.elvp[i].serial.VS / 1000).toFixed(2)) });
      elvp_current_data.push({ x: data.elvp[i].Time, y: +((data.elvp[i].serial.I / 1000).toFixed(2)) });
    }
  }
  else {
    for (var i = 0; i < dataLength; i++) {
      elvp_voltage_data.push({ x: last, y: 0 });
      elvp_voltage_standby_data.push({ x: last, y: 0 });
      elvp_current_data.push({ x: last, y: 0 });
      last += 10;
    }
  }

  elvp_chart_voltage.render();
  elvp_chart_current.render();
});

function updateELVP(data) {
  var html = '<h3>ELVP</h3><table class="table">' +
    '<tr><td>Mains Present</td><td class="table-right">' + (data.mains ? 'Yes' : 'No') + '</td>' +
    '<tr><td>Inverter Output</td><td class="table-right">' + (data.inverter ? 'Yes' : 'No') + '</td>' +
    '<tr><td>Emergency Bank Voltage</td><td class="table-right">' + (data.serial.V / 1000).toFixed(2) + ' V' + '</td>' +
    '<tr><td>Standby Bank Voltage</td><td class="table-right">' + (data.serial.VS / 1000).toFixed(2) + ' V' + '</td>' +
    '<tr><td>Current</td><td class="table-right">' + (data.serial.I / 1000).toFixed(2) + ' A' + '</td>' +
    '<tr><td>Power</td><td class="table-right">' + data.serial.P + ' W' + '</td>' +
    '<tr><td>Consumed Energy</td><td class="table-right">' + (data.serial.CE / 1000).toFixed(2) + ' Ah' + '</td>';

  $('#elvp').html(html);

  // Get data from api relevent for the charts,
  // updates the chart data, and renders the new data
  elvp_voltage_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.V / 1000).toFixed(2)) });
  elvp_voltage_standby_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.VS / 1000).toFixed(2)) });
  elvp_current_data.push({ x: Date.now() / 1000 | 0, y: +((data.serial.I / 1000).toFixed(2)) });


  if (elvp_voltage_data.length > dataLength) { elvp_voltage_data.shift(); }
  if (elvp_voltage_standby_data.length > dataLength) { elvp_voltage_standby_data.shift(); }
  if (elvp_current_data.length > dataLength) { elvp_current_data.shift(); }

  elvp_chart_voltage.render();
  elvp_chart_current.render();
}
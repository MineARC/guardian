var series4_mains_data = [];
var series4_battery_data = [];
var series4_inverter_data = [];
var series4_chamber_data = [];
var series4_outside_data = [];

// Mains voltage chart options
var series4_chart_mains = new CanvasJS.Chart("graph-mains", {
  title: { text: "Mains voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series4_mains_data
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
    maximum: 300,
    interval: 50,
    stripLines: [{
      startValue: 220,
      endValue: 250,
      color: "#C5E3BF"
    }]
  }
});

// Battery voltage chart options
var series4_chart_battery = new CanvasJS.Chart("graph-battery", {
  title: { text: "Battery voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series4_battery_data
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
    maximum: 60,
    interval: 10,
    stripLines: [{
      startValue: 48,
      endValue: 58,
      color: "#C5E3BF"
    }]
  }
});

// Inverter voltage chart options
var series4_chart_inverter = new CanvasJS.Chart("graph-inverter", {
  title: { text: "Inverter voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series4_inverter_data
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
    maximum: 300,
    interval: 50,
    stripLines: [{
      startValue: 220,
      endValue: 250,
      color: "#C5E3BF"
    }]
  }
});

// Temperature chart options
var series4_chart_temp = new CanvasJS.Chart("graph-temp", {
  title: { text: "Temperature °C" },
  legend: {
    horizontalAlign: "right", // "center" , "right"
    verticalAlign: "top",  // "top" , "bottom"
    fontSize: 15
  },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} °C",
    dataPoints: series4_chamber_data,
    showInLegend: true,
    legendText: "Chamber",
  }, {
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} °C",
    dataPoints: series4_outside_data,
    showInLegend: true,
    legendText: "Outside",
  }],
  axisX: {
    title: 'Time',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Temperature °C',
    minimum: 0,
    maximum: 60,
    interval: 10,
    stripLines: [{
      startValue: 10,
      endValue: 40,
      color: "#C5E3BF"
    }]
  }
});


$.get('/api/monitor/history').then(function (data) {
  var last = (Date.now() / 1000 | 0) - 86400;
  if ('series4' in data) {
    while (data.series4[0].Time > last) {
      series4_mains_data.push({ x: last, y: 0 });
      series4_battery_data.push({ x: last, y: 0 });
      series4_inverter_data.push({ x: last, y: 0 });
      series4_chamber_data.push({ x: last, y: 0 });
      series4_outside_data.push({ x: last, y: 0 });
      last += 10;
    }
    for (var i = 0; i < data.series4.length; i++) {
      series4_mains_data.push({ x: data.series4[i].Time, y: +(data.series4[i].voltage_mains) });
      series4_battery_data.push({ x: data.series4[i].Time, y: +(data.series4[i].voltage_battery) });
      series4_inverter_data.push({ x: data.series4[i].Time, y: +(data.series4[i].voltage_inverter) });
      series4_chamber_data.push({ x: data.series4[i].Time, y: +(data.series4[i].temp_internal) });
      series4_outside_data.push({ x: data.series4[i].Time, y: +(data.series4[i].temp_external) });
    }
  }
  else {
    for (var i = 0; i < dataLength; i++) {
      series4_mains_data.push({ x: last, y: 0 });
      series4_battery_data.push({ x: last, y: 0 });
      series4_inverter_data.push({ x: last, y: 0 });
      series4_chamber_data.push({ x: last, y: 0 });
      series4_outside_data.push({ x: last, y: 0 });
      last += 10;
    }
  }

  series4_chart_mains.render();
  series4_chart_battery.render();
  series4_chart_inverter.render();
  series4_chart_temp.render();
});


function updateSeries4(data) {
  // Updates each element in each table with data from the api
  $('.row-mode').text(data.mode);

  $('#table-system-info').find('.row-info').each(function (index, element) {
    $(element).text(data.system_information[index].row_info + ' ' + data.system_information[index].row_unit);
  });

  $('#table-fan-board-1').find('.row-info').each(function (index, element) {
    $(element).text(data.fan_board_1[index].row_info + ' ' + data.fan_board_1[index].row_unit);
  });

  $('#table-fan-board-2').find('.row-info').each(function (index, element) {
    $(element).text(data.fan_board_2[index].row_info + ' ' + data.fan_board_2[index].row_unit);
  });

  $('#table-current-loops').find('.row-info').each(function (index, element) {
    $(element).text(data.current_loops[index].row_info + ' ' + data.current_loops[index].row_unit);
  });

  // Get data from api relevent for the charts,
  // updates the chart data, and renders the new data
  series4_mains_data.push({ x: Date.now() / 1000 | 0, y: +(data.system_information[0].row_info) });
  series4_battery_data.push({ x: Date.now() / 1000 | 0, y: +(data.system_information[1].row_info) });
  series4_inverter_data.push({ x: Date.now() / 1000 | 0, y: +(data.system_information[2].row_info) });
  series4_chamber_data.push({ x: Date.now() / 1000 | 0, y: +(data.system_information[5].row_info) });
  series4_outside_data.push({ x: Date.now() / 1000 | 0, y: +(data.system_information[6].row_info) });

  if (series4_mains_data.length > dataLength) { series4_mains_data.shift(); }
  if (series4_battery_data.length > dataLength) { series4_battery_data.shift(); }
  if (series4_inverter_data.length > dataLength) { series4_inverter_data.shift(); }
  if (series4_chamber_data.length > dataLength) { series4_chamber_data.shift(); }
  if (series4_outside_data.length > dataLength) { series4_outside_data.shift(); }

  series4_chart_mains.render();
  series4_chart_battery.render();
  series4_chart_inverter.render();
  series4_chart_temp.render();
}
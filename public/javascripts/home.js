$(document).ready(function ($) {
  var mains_data = [];
  var battery_data = [];
  var inverter_data = [];
  var chamber_data = [];
  var outside_data = [];

  // Mains voltage chart options
  var chart_mains = new CanvasJS.Chart("graph-mains", {
    title: { text: "Mains voltage" },
    data: [{
      type: "line",
      markerType: 'none',
      dataPoints: mains_data
    }],
    axisX: {
      title: 'Time',
      interval: 1,
      valueFormatString: " "
    },
    axisY: {
      title: 'Voltage',
      minimum: 0,
      maximum: 300,
      interval: 50,
      stripLines: [{
        startValue: 235,
        endValue: 245,
        color: "#C5E3BF"
      }]
    }
  });

  // Battery voltage chart options
  var chart_battery = new CanvasJS.Chart("graph-battery", {
    title: { text: "Battery voltage" },
    data: [{
      type: "line",
      markerType: 'none',
      dataPoints: battery_data
    }],
    axisX: {
      title: 'Time',
      interval: 1,
      valueFormatString: " "
    },
    axisY: {
      title: 'Voltage',
      minimum: 0,
      maximum: 60,
      interval: 10,
      stripLines: [{
        startValue: 46,
        endValue: 50,
        color: "#C5E3BF"
      }]
    }
  });

  // Inverter voltage chart options
  var chart_inverter = new CanvasJS.Chart("graph-inverter", {
    title: { text: "Inverter voltage" },
    data: [{
      type: "line",
      markerType: 'none',
      dataPoints: inverter_data
    }],
    axisX: {
      title: 'Time',
      interval: 1,
      valueFormatString: " "
    },
    axisY: {
      title: 'Voltage',
      minimum: 0,
      maximum: 300,
      interval: 50,
      stripLines: [{
        startValue: 235,
        endValue: 245,
        color: "#C5E3BF"
      }]
    }
  });

  // Chamber temperature chart options
  var chart_chamber = new CanvasJS.Chart("graph-chamber", {
    title: { text: "Chamber temperature" },
    data: [{
      type: "line",
      markerType: 'none',
      dataPoints: chamber_data
    }],
    axisX: {
      title: 'Time',
      interval: 1,
      valueFormatString: " "
    },
    axisY: {
      title: 'Temperature',
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

  // Outside temperature chart options
  var chart_outside = new CanvasJS.Chart("graph-outside", {
    title: { text: "Outside temperature" },
    data: [{
      type: "line",
      markerType: 'none',
      dataPoints: outside_data
    }],
    axisX: {
      title: 'Time',
      interval: 1,
      valueFormatString: " "
    },
    axisY: {
      title: 'Temperature',
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

  var xVal = 0;
  var yVal = 0;
  var updateInterval = 2000; // How often api is polled to update page
  var dataLength = 20; // number of dataPoints visible at any point

  // Chart data is filled with null values
  for (var i = -dataLength; i < 0; i++) {
    mains_data.push({ x: i, y: null });
    battery_data.push({ x: i, y: null });
    inverter_data.push({ x: i, y: null });
    chamber_data.push({ x: i, y: null });
    outside_data.push({ x: i, y: null });
  }

  // Gets data from api relevent for the charts,
  // updates the chart data, and renders the new data
  function updateCharts(data) {
    yVal = parseFloat(data.system_information[0].row_info);
    mains_data.push({ x: xVal, y: yVal });

    yVal = parseFloat(data.system_information[1].row_info);
    battery_data.push({ x: xVal, y: yVal });

    yVal = parseFloat(data.system_information[2].row_info);
    inverter_data.push({ x: xVal, y: yVal });

    yVal = parseFloat(data.system_information[5].row_info);
    chamber_data.push({ x: xVal, y: yVal });

    yVal = parseFloat(data.system_information[6].row_info);
    outside_data.push({ x: xVal, y: yVal });

    xVal++;

    if (mains_data.length > dataLength) { mains_data.shift(); }
    if (battery_data.length > dataLength) { battery_data.shift(); }
    if (inverter_data.length > dataLength) { inverter_data.shift(); }
    if (chamber_data.length > dataLength) { chamber_data.shift(); }
    if (outside_data.length > dataLength) { outside_data.shift(); }

    chart_mains.render();
    chart_battery.render();
    chart_inverter.render();
    chart_chamber.render();
    chart_outside.render();
  }

  // Updates each element in each table with data from the api
  function updateTables(data) {
    $('#mode').find('b').text(data.mode);

    $('#table-system-info').find('.row-info').each(function (index, element) {
      $(element).text(data.system_information[index].row_info);
    });

    $('#table-fan-board-1').find('.row-info').each(function (index, element) {
      $(element).text(data.fan_board_1[index].row_info);
    });

    $('#table-fan-board-2').find('.row-info').each(function (index, element) {
      $(element).text(data.fan_board_1[index].row_info);
    });

    $('#table-current-loops').find('.row-info').each(function (index, element) {
      $(element).text(data.current_loops[index].row_info);
    });
  }

  // Updates the active alarms from the api
  function updateAlarms(data) {
    var html = '<h2>Alarms</h2>'
    data.alarms.forEach(function (alarm) {
      if (alarm.alarm_status)
        html += '<p class="alert alert-danger">' + alarm.alarm_name;
    });
    $('#alarms').html(html);
  }

  // Update charts, tables, and alarms after specified time. 
  setInterval(function () {
    $.get('/api/monitor/').then(function (data) {
      updateCharts(data);
      updateTables(data);
      updateAlarms(data);
    });
  }, updateInterval);
});
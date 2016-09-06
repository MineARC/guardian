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
        startValue: 220,
        endValue: 250,
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
        startValue: 48,
        endValue: 58,
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
        startValue: 220,
        endValue: 250,
        color: "#C5E3BF"
      }]
    }
  });

  // Chamber temperature chart options
  var chart_temp = new CanvasJS.Chart("graph-temp", {
    title: { text: "Temperature °C" },
    legend: {
      horizontalAlign: "right", // "center" , "right"
      verticalAlign: "top",  // "top" , "bottom"
      fontSize: 15
    },
    data: [{
      type: "line",
      markerType: 'none',
      dataPoints: chamber_data,
      showInLegend: true,
      legendText: "Chamber",
    }, {
        type: "line",
        markerType: 'none',
        dataPoints: outside_data,
        showInLegend: true,
        legendText: "Outside",
      }],
    axisX: {
      title: 'Time',
      interval: 1,
      valueFormatString: " "
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

  // // Outside temperature chart options
  // var chart_outside = new CanvasJS.Chart("graph-outside", {
  //   title: { text: "Outside temperature" },
  //   data: [{
  //     type: "line",
  //     markerType: 'none',
  //     dataPoints: outside_data
  //   }],
  //   axisX: {
  //     title: 'Time',
  //     interval: 1,
  //     valueFormatString: " "
  //   },
  //   axisY: {
  //     title: 'Temperature',
  //     minimum: 0,
  //     maximum: 60,
  //     interval: 10,
  //     stripLines: [{
  //       startValue: 10,
  //       endValue: 40,
  //       color: "#C5E3BF"
  //     }]
  //   }
  // });

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
    chart_temp.render();
  }

  // Updates each element in each table with data from the api
  function updateTables(data) {
    $('#mode').find('b').text(data.mode);

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
  }

  // Updates the active alarms from the api
  function updateAlarms(data) {
    var html = '';
    if (data.alarms_total > 0) {
      data.alarms_active.forEach(function (alarm) {
        html += '<p class="alert alert-danger">' + alarm;
      });
    }
    $('#alarms').html(html);
  }

  function updateCams(data) {
    if (data.cams) {
      var html = '<h3>CAMS</h3><table class="table"><tr><td>Occupied</td><td class="table-right">' + (data.cams.occupied ? 'Yes' : 'No') + '</tr><tr><td>Airflow</td><td class="table-right">' + ((data.cams.rate > 0) ? 'Yes' : 'No') + '</td></tr></table>';
      $('#cams').html(html);
    }
  }

  function updateFGM(data) {
    if (data.fgm) {
      var html = '<h3>Aura-FX</h3><table class="table"><tr><th>Name</th><th class="table-right">Value</th></tr>';
      data.fgm.forEach(function (gas) {
        html += '<tr><td>' + gas.gas_name + '</td>';
        html += '<td class="table-right">' + gas.gas_value + '</td></tr>';
      });
      html += '</table>';
      $('#fgm').html(html);
    }
  }

  // Update charts, tables, and alarms after specified time. 
  setInterval(function () {
    $.get('/api/monitor/').then(function (data) {
      updateCharts(data);
      updateTables(data);
      updateAlarms(data);
      updateCams(data);
      updateFGM(data);
    });
  }, updateInterval);
});
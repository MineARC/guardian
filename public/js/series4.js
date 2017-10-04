var series4_voltage_mains_data = [];
var series4_voltage_inverter_data = [];
var series4_voltage_battery_data = [];
var series4_temp_internal_data = [];
var series4_temp_external_data = [];
var series4_temp_battery_data = [];
var series4_current_battery_data = [];

var series4_voltage_mains_chart = new CanvasJS.Chart("graph-voltage-1", {
  title: { text: "Mains Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series4_voltage_mains_data
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

var series4_voltage_inverter_chart = new CanvasJS.Chart("graph-voltage-2", {
  title: { text: "Inverter Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series4_voltage_inverter_data
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

var series4_voltage_battery_chart = new CanvasJS.Chart("graph-voltage-3", {
  title: { text: "Battery Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series4_voltage_battery_data
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

switch (localize) {
  case 'us':
    var series4_temp_internal_chart = new CanvasJS.Chart("graph-temp-1", {
      title: { text: "Internal Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °F",
        dataPoints: series4_temp_internal_data,
      }],
      axisX: {
        title: 'Time H',
        labelFormatter: function (e) {
          return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
        },
        interval: 7200,
      },
      axisY: {
        title: 'Temperature °F',
        minimum: 32,
        maximum: 140,
        interval: 18,
        stripLines: [{
          startValue: 50,
          endValue: 104,
          color: "#C5E3BF"
        }]
      }
    });

    var series4_temp_external_chart = new CanvasJS.Chart("graph-temp-2", {
      title: { text: "External Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °F",
        dataPoints: series4_temp_external_data,
      }],
      axisX: {
        title: 'Time H',
        labelFormatter: function (e) {
          return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
        },
        interval: 7200,
      },
      axisY: {
        title: 'Temperature °F',
        minimum: 32,
        maximum: 140,
        interval: 18,
        stripLines: [{
          startValue: 50,
          endValue: 104,
          color: "#C5E3BF"
        }]
      }
    });

    var series4_temp_battery_chart = new CanvasJS.Chart("graph-temp-3", {
      title: { text: "Battery Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °F",
        dataPoints: series4_temp_battery_data,
      }],
      axisX: {
        title: 'Time H',
        labelFormatter: function (e) {
          return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
        },
        interval: 7200,
      },
      axisY: {
        title: 'Temperature °F',
        minimum: 32,
        maximum: 140,
        interval: 18,
        stripLines: [{
          startValue: 50,
          endValue: 104,
          color: "#C5E3BF"
        }]
      }
    });
    break;

  default:
    var series4_temp_internal_chart = new CanvasJS.Chart("graph-temp-1", {
      title: { text: "Internal Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series4_temp_internal_data,
      }],
      axisX: {
        title: 'Time H',
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

    var series4_temp_external_chart = new CanvasJS.Chart("graph-temp-2", {
      title: { text: "External Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series4_temp_external_data,
      }],
      axisX: {
        title: 'Time H',
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

    var series4_temp_battery_chart = new CanvasJS.Chart("graph-temp-3", {
      title: { text: "Battery Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series4_temp_battery_data,
      }],
      axisX: {
        title: 'Time H',
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
    break;
}

var series4_current_battery_chart = new CanvasJS.Chart("graph-current-1", {
  title: { text: "Battery Current" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} A",
    dataPoints: series4_current_battery_data,
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
  series4_voltage_mains_chart.render();
});

$("#voltage_2_modal").on('shown.bs.modal', function () {
  series4_voltage_inverter_chart.render();
});

$("#voltage_3_modal").on('shown.bs.modal', function () {
  series4_voltage_battery_chart.render();
});

$("#temp_1_modal").on('shown.bs.modal', function () {
  series4_temp_internal_chart.render();
});

$("#temp_2_modal").on('shown.bs.modal', function () {
  series4_temp_external_chart.render();
});

$("#temp_3_modal").on('shown.bs.modal', function () {
  series4_temp_battery_chart.render();
});

$("#current_1_modal").on('shown.bs.modal', function () {
  series4_current_battery_chart.render();
});

function updateSeries4History(data) {
  var last = (Date.now() / 1000 | 0) - 86400;
  while (data[0].Time > last) {
    series4_voltage_mains_data.push({ x: last, y: 0 });
    series4_voltage_inverter_data.push({ x: last, y: 0 });
    series4_voltage_battery_data.push({ x: last, y: 0 });
    series4_temp_internal_data.push({ x: last, y: 0 });
    series4_temp_external_data.push({ x: last, y: 0 });
    series4_temp_battery_data.push({ x: last, y: 0 });
    series4_current_battery_data.push({ x: last, y: 0 });
    last += 10;
  }
  for (var i = 0; i < data.length; i++) {
    series4_voltage_mains_data.push({ x: data[i].Time, y: data[i].voltage_mains });
    series4_voltage_inverter_data.push({ x: data[i].Time, y: data[i].voltage_inverter });
    series4_voltage_battery_data.push({ x: data[i].Time, y: data[i].voltage_battery });
    series4_temp_internal_data.push({ x: data[i].Time, y: data[i].temp_internal });
    series4_temp_external_data.push({ x: data[i].Time, y: data[i].temp_external });
    series4_temp_battery_data.push({ x: data[i].Time, y: data[i].temp_battery });
    series4_current_battery_data.push({ x: data[i].Time, y: data[i].current_battery });
  }

  series4_voltage_mains_chart.render();
  series4_voltage_inverter_chart.render();
  series4_voltage_battery_chart.render();
  series4_temp_internal_chart.render();
  series4_temp_external_chart.render();
  series4_temp_battery_chart.render();
  series4_current_battery_chart.render();
}

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

  var n = (data.system_information[0].row_info - $('#readout-voltage-mains .value')[0].childNodes[0].nodeValue).toFixed(0)
  $('#readout-voltage-mains .delta')[0].childNodes[1].nodeValue = n
  $('#readout-voltage-mains .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-mains .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.system_information[2].row_info - $('#readout-voltage-inverter .value')[0].childNodes[0].nodeValue).toFixed(0)
  $('#readout-voltage-inverter .delta')[0].childNodes[1].nodeValue = n
  $('#readout-voltage-inverter .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-inverter .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.system_information[1].row_info - $('#readout-voltage-battery .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-voltage-battery .delta')[0].childNodes[1].nodeValue = n
  $('#readout-voltage-battery .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-battery .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.system_information[5].row_info - $('#readout-temp-internal .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-temp-internal .delta')[0].childNodes[1].nodeValue = n
  $('#readout-temp-internal .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-temp-internal .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.system_information[6].row_info - $('#readout-temp-external .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-temp-external .delta')[0].childNodes[1].nodeValue = n
  $('#readout-temp-external .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-temp-external .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.system_information[4].row_info - $('#readout-temp-battery .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-temp-battery .delta')[0].childNodes[1].nodeValue = n
  $('#readout-temp-battery .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-temp-battery .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.system_information[3].row_info - $('#readout-current-battery .value')[0].childNodes[0].nodeValue).toFixed(0)
  $('#readout-current-battery .delta')[0].childNodes[1].nodeValue = n
  $('#readout-current-battery .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-current-battery .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  $('#readout-voltage-mains .value')[0].childNodes[0].nodeValue = data.system_information[0].row_info
  $('#readout-voltage-inverter .value')[0].childNodes[0].nodeValue = data.system_information[2].row_info;
  $('#readout-voltage-battery .value')[0].childNodes[0].nodeValue = data.system_information[1].row_info;
  $('#readout-temp-internal .value')[0].childNodes[0].nodeValue = data.system_information[5].row_info;
  $('#readout-temp-external .value')[0].childNodes[0].nodeValue = data.system_information[6].row_info;
  $('#readout-temp-battery .value')[0].childNodes[0].nodeValue = data.system_information[4].row_info;
  $('#readout-current-battery .value')[0].childNodes[0].nodeValue = data.system_information[3].row_info;

  $('#readout-temp-internal .easyPieChart').data('easyPieChart').update((data.system_information[5].row_info / 40) * 100);
  $('#readout-temp-external .easyPieChart').data('easyPieChart').update((data.system_information[6].row_info / 40) * 100);
  $('#readout-temp-battery .easyPieChart').data('easyPieChart').update((data.system_information[4].row_info / 40) * 100);

  series4_voltage_mains_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.system_information[0].row_info) });
  series4_voltage_inverter_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.system_information[2].row_info) });
  series4_voltage_battery_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.system_information[1].row_info) });
  series4_temp_internal_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.system_information[5].row_info) });
  series4_temp_external_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.system_information[6].row_info) });
  series4_temp_battery_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.system_information[4].row_info) });
  series4_current_battery_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.system_information[3].row_info) });

  if (series4_voltage_mains_data.length > dataLength) { series4_voltage_mains_data.shift(); }
  if (series4_voltage_inverter_data.length > dataLength) { series4_voltage_inverter_data.shift(); }
  if (series4_voltage_battery_data.length > dataLength) { series4_voltage_battery_data.shift(); }
  if (series4_temp_internal_data.length > dataLength) { series4_temp_internal_data.shift(); }
  if (series4_temp_external_data.length > dataLength) { series4_temp_external_data.shift(); }
  if (series4_temp_battery_data.length > dataLength) { series4_temp_battery_data.shift(); }
  if (series4_current_battery_data.length > dataLength) { series4_current_battery_data.shift(); }

  series4_voltage_mains_chart.render();
  series4_voltage_inverter_chart.render();
  series4_voltage_battery_chart.render();
  series4_temp_internal_chart.render();
  series4_temp_external_chart.render();
  series4_temp_battery_chart.render();
  series4_current_battery_chart.render();
}
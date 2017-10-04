var series3_voltage_inverter_data = [];
var series3_voltage_bridge_data = [];
var series3_voltage_battery_data = [];
var series3_temp_internal_data = [];
var series3_temp_external_data = [];
var series3_temp_battery_data = [];
var series3_current_battery_data = [];

var series3_voltage_inverter_chart = new CanvasJS.Chart("graph-voltage-1", {
  title: { text: "Inverter Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series3_voltage_inverter_data
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

var series3_voltage_bridge_chart = new CanvasJS.Chart("graph-voltage-2", {
  title: { text: "Bridge Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series3_voltage_bridge_data
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

var series3_voltage_battery_chart = new CanvasJS.Chart("graph-voltage-3", {
  title: { text: "Battery Voltage" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} V",
    dataPoints: series3_voltage_battery_data
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
    var series3_temp_internal_chart = new CanvasJS.Chart("graph-temp-1", {
      title: { text: "Internal Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °F",
        dataPoints: series3_temp_internal_data,
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

    var series3_temp_external_chart = new CanvasJS.Chart("graph-temp-2", {
      title: { text: "External Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °F",
        dataPoints: series3_temp_external_data,
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

    var series3_temp_battery_chart = new CanvasJS.Chart("graph-temp-3", {
      title: { text: "Battery Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °F",
        dataPoints: series3_temp_battery_data,
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
    var series3_temp_internal_chart = new CanvasJS.Chart("graph-temp-1", {
      title: { text: "Internal Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series3_temp_internal_data,
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

    var series3_temp_external_chart = new CanvasJS.Chart("graph-temp-2", {
      title: { text: "External Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series3_temp_external_data,
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

    var series3_temp_battery_chart = new CanvasJS.Chart("graph-temp-3", {
      title: { text: "Battery Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series3_temp_battery_data,
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


var series3_current_battery_chart = new CanvasJS.Chart("graph-current-1", {
  title: { text: "Battery Current" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} A",
    dataPoints: series3_current_battery_data,
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
  series3_voltage_inverter_chart.render();
});

$("#voltage_2_modal").on('shown.bs.modal', function () {
  series3_voltage_bridge_chart.render();
});

$("#voltage_3_modal").on('shown.bs.modal', function () {
  series3_voltage_battery_chart.render();
});

$("#temp_1_modal").on('shown.bs.modal', function () {
  series3_temp_internal_chart.render();
});

$("#temp_2_modal").on('shown.bs.modal', function () {
  series3_temp_external_chart.render();
});

$("#temp_3_modal").on('shown.bs.modal', function () {
  series3_temp_battery_chart.render();
});

$("#current_1_modal").on('shown.bs.modal', function () {
  series3_current_battery_chart.render();
});


function updateSeries3History(data) {
  var last = (Date.now() / 1000 | 0) - 86400;
  while (data[0].Time > last) {
    series3_voltage_inverter_data.push({ x: last, y: -1 });
    series3_voltage_bridge_data.push({ x: last, y: -1 });
    series3_voltage_battery_data.push({ x: last, y: -1 });
    series3_temp_internal_data.push({ x: last, y: -1 });
    series3_temp_external_data.push({ x: last, y: -1 });
    series3_temp_battery_data.push({ x: last, y: -1 });
    series3_current_battery_data.push({ x: last, y: -1 });
    last += 10;
  }
  for (var i = 0; i < data.length; i++) {
    series3_voltage_inverter_data.push({ x: data[i].Time, y: data[i].voltage_inverter });
    series3_voltage_bridge_data.push({ x: data[i].Time, y: data[i].voltage_bridge });
    series3_voltage_battery_data.push({ x: data[i].Time, y: data[i].voltage_battery });
    series3_temp_internal_data.push({ x: data[i].Time, y: data[i].temp_internal });
    series3_temp_external_data.push({ x: data[i].Time, y: data[i].temp_external });
    series3_temp_battery_data.push({ x: data[i].Time, y: data[i].temp_battery });
    series3_current_battery_data.push({ x: data[i].Time, y: data[i].current_battery });
  }

  series3_voltage_inverter_chart.render();
  series3_voltage_bridge_chart.render();
  series3_voltage_battery_chart.render();
  series3_temp_internal_chart.render();
  series3_temp_external_chart.render();
  series3_temp_battery_chart.render();
  series3_current_battery_chart.render();
}

function updateSeries3(data) {
  $('.row-mode').text(data.mode);

  $('#table-system-info').find('.row-info').each(function (index, element) {
    $(element).text(data.raw[index].row_info + ' ' + data.raw[index].row_unit);
  });

  var n = (data.raw[6].row_info - $('#readout-voltage-inverter .value')[0].childNodes[0].nodeValue).toFixed(0)
  $('#readout-voltage-inverter .delta')[0].childNodes[1].nodeValue = n
  $('#readout-voltage-inverter .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-inverter .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.raw[12].row_info - $('#readout-voltage-bridge .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-voltage-bridge .delta')[0].childNodes[1].nodeValue = n
  $('#readout-voltage-bridge .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-bridge .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.raw[10].row_info - $('#readout-voltage-battery .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-voltage-battery .delta')[0].childNodes[1].nodeValue = n
  $('#readout-voltage-battery .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-voltage-battery .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.raw[0].row_info - $('#readout-temp-internal .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-temp-internal .delta')[0].childNodes[1].nodeValue = n
  $('#readout-temp-internal .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-temp-internal .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.raw[2].row_info - $('#readout-temp-external .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-temp-external .delta')[0].childNodes[1].nodeValue = n
  $('#readout-temp-external .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-temp-external .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.raw[4].row_info - $('#readout-temp-battery .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-temp-battery .delta')[0].childNodes[1].nodeValue = n
  $('#readout-temp-battery .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-temp-battery .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (data.raw[8].row_info - $('#readout-current-battery .value')[0].childNodes[0].nodeValue).toFixed(1)
  $('#readout-current-battery .delta')[0].childNodes[1].nodeValue = n
  $('#readout-current-battery .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-current-battery .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  $('#readout-voltage-inverter .value')[0].childNodes[0].nodeValue = data.raw[6].row_info;
  $('#readout-voltage-bridge .value')[0].childNodes[0].nodeValue = data.raw[12].row_info;
  $('#readout-voltage-battery .value')[0].childNodes[0].nodeValue = data.raw[10].row_info;
  $('#readout-temp-internal .value')[0].childNodes[0].nodeValue = data.raw[0].row_info;
  $('#readout-temp-external .value')[0].childNodes[0].nodeValue = data.raw[2].row_info;
  $('#readout-temp-battery .value')[0].childNodes[0].nodeValue = data.raw[4].row_info;
  $('#readout-current-battery .value')[0].childNodes[0].nodeValue = data.raw[8].row_info;

  $('#readout-temp-internal .easyPieChart').data('easyPieChart').update((data.raw[0].row_info / 40) * 100);
  $('#readout-temp-external .easyPieChart').data('easyPieChart').update((data.raw[2].row_info / 40) * 100);
  $('#readout-temp-battery .easyPieChart').data('easyPieChart').update((data.raw[4].row_info / 40) * 100);

  series3_voltage_inverter_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.raw[6].row_info) });
  series3_voltage_bridge_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.raw[12].row_info) });
  series3_voltage_battery_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.raw[10].row_info) });
  series3_temp_internal_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.raw[0].row_info) });
  series3_temp_external_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.raw[2].row_info) });
  series3_temp_battery_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.raw[4].row_info) });
  series3_current_battery_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(data.raw[8].row_info) });

  if (series3_voltage_inverter_data.length > dataLength) { series3_voltage_inverter_data.shift(); }
  if (series3_voltage_bridge_data.length > dataLength) { series3_voltage_bridge_data.shift(); }
  if (series3_voltage_battery_data.length > dataLength) { series3_voltage_battery_data.shift(); }
  if (series3_temp_internal_data.length > dataLength) { series3_temp_internal_data.shift(); }
  if (series3_temp_external_data.length > dataLength) { series3_temp_external_data.shift(); }
  if (series3_temp_battery_data.length > dataLength) { series3_temp_battery_data.shift(); }
  if (series3_current_battery_data.length > dataLength) { series3_current_battery_data.shift(); }

  series3_voltage_inverter_chart.render();
  series3_voltage_bridge_chart.render();
  series3_voltage_battery_chart.render();
  series3_temp_internal_chart.render();
  series3_temp_external_chart.render();
  series3_temp_battery_chart.render();
  series3_current_battery_chart.render();
}
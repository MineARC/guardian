var aura_temp_data = [];
var aura_o2_data = [];
var aura_co2_data = [];
var aura_co_data = [];

switch (localize) {
  case 'us':
    var aura_temp_chart = new CanvasJS.Chart("graph-aura-1", {
      title: { text: "Apparent Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} F",
        dataPoints: aura_temp_data
      }],
      axisX: {
        title: 'Time H',
        labelFormatter: function (e) {
          return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
        },
        interval: 7200,
      },
      axisY: {
        title: 'Temperature F',
        minimum: 14,
        maximum: 122,
        interval: 18,
        stripLines: [{
          startValue: 50,
          endValue: 86,
          color: "#C5E3BF"
        }]
      }
    });
    break;

  default:
    var aura_temp_chart = new CanvasJS.Chart("graph-aura-1", {
      title: { text: "Apparent Temperature" },
      data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} C",
        dataPoints: aura_temp_data
      }],
      axisX: {
        title: 'Time H',
        labelFormatter: function (e) {
          return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
        },
        interval: 7200,
      },
      axisY: {
        title: 'Temperature C',
        minimum: -10,
        maximum: 50,
        interval: 10,
        stripLines: [{
          startValue: 10,
          endValue: 30,
          color: "#C5E3BF"
        }]
      }
    });
    break;
}

var aura_o2_chart = new CanvasJS.Chart("graph-aura-2", {
  title: { text: "Oxygen" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} %",
    dataPoints: aura_o2_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Concentration %',
    minimum: 17.5,
    maximum: 23.5,
    interval: 1,
    stripLines: [{
      startValue: 19.5,
      endValue: 22.5,
      color: "#C5E3BF"
    }]
  }
});

var aura_co2_chart = new CanvasJS.Chart("graph-aura-3", {
  title: { text: "Carbon Dioxide" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} %",
    dataPoints: aura_co2_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Concentration %',
    minimum: 0,
    maximum: 3,
    interval: 0.5,
    stripLines: [{
      startValue: 0,
      endValue: 1,
      color: "#C5E3BF"
    }]
  }
});

var aura_co_chart = new CanvasJS.Chart("graph-aura-4", {
  title: { text: "Carbon Monoxide" },
  data: [{
    type: "line",
    markerType: 'none',
    toolTipContent: "{y} ppm",
    dataPoints: aura_co_data
  }],
  axisX: {
    title: 'Time H',
    labelFormatter: function (e) {
      return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
    },
    interval: 7200,
  },
  axisY: {
    title: 'Concentration ppm',
    minimum: 0,
    maximum: 100,
    interval: 16,
    stripLines: [{
      startValue: 0,
      endValue: 10,
      color: "#C5E3BF"
    }]
  }
});

$("#aura_1_modal").on('shown.bs.modal', function () {
  aura_temp_chart.render();
});

$("#aura_2_modal").on('shown.bs.modal', function () {
  aura_o2_chart.render();
});

$("#aura_3_modal").on('shown.bs.modal', function () {
  aura_co2_chart.render();
});

$("#aura_4_modal").on('shown.bs.modal', function () {
  aura_co_chart.render();
});

function updateAuraHistory(data) {
  var last = (Date.now() / 1000 | 0) - 86400;
  while (data[0].Time > last) {
    aura_temp_data.push({ x: last, y: -11 });
    aura_o2_data.push({ x: last, y: -1 });
    aura_co2_data.push({ x: last, y: -1 });
    aura_co_data.push({ x: last, y: -1 });
    last += 10;
  }
  for (var i = 0; i < data.length; i++) {
    if (data[i]['Temp'])
      aura_temp_data.push({ x: data[i].Time, y: parseFloat(data[i].Temp) });
    if (data[i]['O2'])
      aura_o2_data.push({ x: data[i].Time, y: parseFloat(data[i].O2) });
    if (data[i]['CO2'])
      aura_co2_data.push({ x: data[i].Time, y: parseFloat(data[i].CO2) });
    if (data[i]['CO'])
      aura_co_data.push({ x: data[i].Time, y: parseFloat(data[i].CO) });
  }

  aura_temp_chart.render();
  aura_o2_chart.render();
  aura_co2_chart.render();
  aura_co_chart.render();
}

function updateAura(data) {
  var temp = '-';
  var o2 = '-';
  var co2 = '-';
  var co = '-';

  for (var key in data) {
    if (data[key].isRecent)
      switch (key) {
        case 'Temp':
          temp = data[key].value;
          break;
        case 'Temp_F':
          temp = data[key].value
          break;
        case 'O2':
          o2 = data[key].value;
          break;
        case 'CO2':
          co2 = data[key].value;
          break;
        case 'CO':
          co = data[key].value;
          break;
      }
  }

  var n = (temp - $('#readout-temp-aura .value')[0].childNodes[0].nodeValue).toFixed(1);
  $('#readout-temp-aura .delta')[0].childNodes[1].nodeValue = n;
  $('#readout-temp-aura .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-temp-aura .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (o2 - $('#readout-aura-o2 .value')[0].childNodes[0].nodeValue).toFixed(1);
  $('#readout-aura-o2 .delta')[0].childNodes[1].nodeValue = n;
  $('#readout-aura-o2 .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-aura-o2 .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (co2 - $('#readout-aura-co2 .value')[0].childNodes[0].nodeValue).toFixed(2);
  $('#readout-aura-co2 .delta')[0].childNodes[1].nodeValue = n;
  $('#readout-aura-co2 .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-aura-co2 .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  var n = (co - $('#readout-aura-co .value')[0].childNodes[0].nodeValue).toFixed(1);
  $('#readout-aura-co .delta')[0].childNodes[1].nodeValue = n;
  $('#readout-aura-co .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
  $('#readout-aura-co .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');

  $('#readout-temp-aura .value')[0].childNodes[0].nodeValue = temp;
  $('#readout-aura-o2 .value')[0].childNodes[0].nodeValue = o2;
  $('#readout-aura-co2 .value')[0].childNodes[0].nodeValue = co2;
  $('#readout-aura-co .value')[0].childNodes[0].nodeValue = co;

  $('#readout-temp-aura .easyPieChart').data('easyPieChart').update((temp / 40) * 100);
  $('#readout-aura-o2 .easyPieChart').data('easyPieChart').update(((o2 - 18.5) / 4.5) * 100);
  $('#readout-aura-co2 .easyPieChart').data('easyPieChart').update(co2 * 100);
  $('#readout-aura-co .easyPieChart').data('easyPieChart').update((co / 30) * 100);

  $('#table-aura .Temp .row-info').text(data['Temp'].value + ' ' + data['Temp'].unit);
  $('#table-aura .Temp_F .row-info').text(data['Temp_F'].value + ' ' + data['Temp_F'].unit);
  $('#table-aura .O2 .row-info').first().text(data['O2'].value + ' ' + data['O2'].unit);
  $('#table-aura .CO2 .row-info').text(data['CO2'].value + ' ' + data['CO2'].unit);
  $('#table-aura .CO .row-info').first().text(data['CO'].value + ' ' + data['CO'].unit);
  $('#table-aura .H2S .row-info').text(data['H2S'].value + ' ' + data['H2S'].unit);

  if (temp != '-')
    aura_temp_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(temp) });
  if (o2 != '-')
    aura_o2_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(o2) });
  if (co2 != '-')
    aura_co2_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(co2) });
  if (co != '-')
    aura_co_data.push({ x: Date.now() / 1000 | 0, y: parseFloat(co) });

  if (aura_temp_data.length > dataLength) { aura_temp_data.shift(); }
  if (aura_o2_data.length > dataLength) { aura_o2_data.shift(); }
  if (aura_co2_data.length > dataLength) { aura_co2_data.shift(); }
  if (aura_co_data.length > dataLength) { aura_co_data.shift(); }

  aura_temp_chart.render();
  aura_o2_chart.render();
  aura_co2_chart.render();
  aura_co_chart.render();
}
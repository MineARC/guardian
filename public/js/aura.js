var aura_data = [];
var aura_chart = [];
var aura_ext_data = [];
var aura_ext_chart = [];

for (aura in aura_params) {
  aura = aura_params[aura];
  aura_data[aura.gas] = [];
  aura_ext_data[aura.gas] = [];

  aura_chart[aura.gas] = new CanvasJS.Chart("graph-aura-" + aura.gas, {
    title: { text: aura.title },
    data: [{
      type: "line",
      markerType: 'none',
      toolTipContent: "{y} " + aura.unit,
      dataPoints: aura_data[aura.gas]
    }],
    axisX: {
      title: 'Time H',
      labelFormatter: function (e) {
        return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
      },
      interval: 7200,
    },
    axisY: {
      title: aura.unit,
      minimum: aura.range.min,
      maximum: aura.range.max,
      interval: aura.range.max / 10,
      stripLines: [{
        startValue: aura.alarm.min,
        endValue: aura.alarm.max,
        color: aura.color
      }]
    }
  });

  aura_ext_chart[aura.gas] = new CanvasJS.Chart("graph-aura-ext-" + aura.gas, {
    title: { text: aura.title },
    data: [{
      type: "line",
      markerType: 'none',
      toolTipContent: "{y} " + aura.unit,
      dataPoints: aura_ext_data[aura.gas]
    }],
    axisX: {
      title: 'Time H',
      labelFormatter: function (e) {
        return CanvasJS.formatDate(new Date(null).setSeconds(e.value), "H");
      },
      interval: 7200,
    },
    axisY: {
      title: aura.unit,
      minimum: aura.range.min,
      maximum: aura.range.max,
      interval: aura.range.max / 10,
      stripLines: [{
        startValue: aura.alarm.min,
        endValue: aura.alarm.max,
        color: aura.color
      }]
    }
  });


  $("#aura_" + aura.gas + "_modal").on('shown.bs.modal', function () {
    aura_chart[aura.gas].render();
  });

  $("#aura_ext_" + aura.gas + "_modal").on('shown.bs.modal', function () {
    aura_ext_chart[aura.gas].render();
  });

}

function updateAuraHistory(data) {
  for (aura in aura_params) {
    aura = aura_params[aura];

    var last = (Date.now() / 1000 | 0) - 86400;
    while (data[0].Time > last) {
      aura_data[aura.gas].push({ x: last, y: -100 });
      aura_ext_data[aura.gas].push({ x: last, y: -100 });
      last += 10;
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i][aura.gas]) {
        aura_data[aura.gas].push({ x: data[i].Time, y: parseFloat(data[i][aura.gas]) });
        aura_ext_data[aura.gas].push({ x: data[i].Time, y: parseFloat(data[i][aura.gas + '_ext']) });
      }
    }

    aura_chart[aura.gas].render();
    aura_ext_chart[aura.gas].render();
  }
}

function updateAura(data) {
  for (aura in aura_params) {
    aura = aura_params[aura];

    if (data[aura.gas]) {
      if ($('#readout-' + aura.gas + '-aura').length > 0) {
        var n = (data[aura.gas].value - $('#readout-' + aura.gas + '-aura .value')[0].childNodes[0].nodeValue).toFixed(aura.decimal);
        $('#readout-' + aura.gas + '-aura .delta')[0].childNodes[1].nodeValue = n;
        $('#readout-' + aura.gas + '-aura .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
        $('#readout-' + aura.gas + '-aura .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');
        $('#readout-' + aura.gas + '-aura .value')[0].childNodes[0].nodeValue = data[aura.gas].value;
        $('#readout-' + aura.gas + '-aura .easyPieChart').data('easyPieChart').update(((data[aura.gas].value - aura.range.min) / (aura.range.max - aura.range.min)) * 100);
      }

      $('#table-aura .' + aura.gas + ' .row-info').text(data[aura.gas].value + ' ' + aura_params[aura.gas].unit);
      aura_data[aura.gas].push({ x: Date.now() / 1000 | 0, y: parseFloat(data[aura.gas].value) });
      if (aura_data[aura.gas].length > dataLength) { aura_data[aura.gas].shift(); }
    }

    aura_chart[aura.gas].render();
  }
}

function updateAuraExt(data) {
  for (aura in aura_params) {
    aura = aura_params[aura];

    if (data[aura.gas]) {
      if ($('#readout-' + aura.gas + '-aura-ext').length > 0) {
        var n = (data[aura.gas].value - $('#readout-' + aura.gas + '-aura-ext .value')[0].childNodes[0].nodeValue).toFixed(aura.decimal);
        $('#readout-' + aura.gas + '-aura-ext .delta')[0].childNodes[1].nodeValue = n;
        $('#readout-' + aura.gas + '-aura-ext .delta > i').removeClass('fa-circle fa-caret-up fa-caret-down text-muted text-danger text-success');
        $('#readout-' + aura.gas + '-aura-ext .delta > i').addClass(n > 0 ? 'fa-caret-up text-success' : n < 0 ? 'fa-caret-down text-danger' : 'fa-circle text-muted');
        $('#readout-' + aura.gas + '-aura-ext .value')[0].childNodes[0].nodeValue = data[aura.gas].value;
        $('#readout-' + aura.gas + '-aura-ext .easyPieChart').data('easyPieChart').update(((data[aura.gas].value - aura.range.min) / (aura.range.max - aura.range.min)) * 100);
      }

      aura_ext_data[aura.gas].push({ x: Date.now() / 1000 | 0, y: parseFloat(data[aura.gas].value) });
      $('#table-aura-ext .' + aura.gas + ' .row-info').text(data[aura.gas].value + ' ' + aura_params[aura.gas].unit);
      if (aura_ext_data[aura.gas].length > dataLength) { aura_data[aura.gas].shift(); }
    }

    aura_ext_chart[aura.gas].render();
  }
}
var updateInterval = 10000; // How often api is polled to update page
var dataLength = 8630; // number of dataPoints visible at any point

$(document).ready(function ($) {
  $('#alias').editable({
    type: 'text',
    mode: 'inline',
    showbuttons: false,
    url: function (params) {
      var d = new $.Deferred();
      $.post('/settings/setAlias', { alias: params.value }).then(function () {
        d.resolve();
      });
      return d.promise();
    }
  });
});

// Updates the active alarms from the api
function updateAlarms(data) {
  var html = '';
  for (key in data) {
    if (data[key].state)
      html += '<p class="alert alert-danger">' + key;
  }
  $('#alarms').html(html);
}

// Update charts, tables, and alarms after specified time. 
setInterval(updatefromapi, updateInterval);
setTimeout(updatefromapi, 100);

function updatefromapi() {
  $.get('/api/monitor/').then(function (data) {
    if (data.elv) updateELV(data.elv);
    if (data.elvp) updateELVP(data.elvp);
    if (data.series3) updateSeries3(data.series3);
    if (data.series4) updateSeries4(data.series4);
    if (data.cams) updateCams(data.cams);
    if (data.aura) updateAura(data.aura);
    updateAlarms(data.alarms);
  });
}
$(document).ready(function ($) {
  setInterval(updateFleetAndAlerts, 10000);
  updateFleetAndAlerts();

  function updateFleetAndAlerts() {
    $.get('/api/hosts/').then(function (data) {
      var fleethtml = '';
      var alertshtml = '';
      data.hosts.forEach(function (host) {
        fleethtml += '<li><a href="//' + host.ip + '/chamber"><i class="icon-tag"></i><span>' + (host.alias ? host.alias : host.hostname.split('-')[1]) + '</span></a></li>';
        for (var types in host.alarms_active) {
          host.alarms_active[types].forEach(function (alert) {
            alertshtml += '<li class="list-group-item"><div class="clear"><i class="fa fa-exclamation-circle m-r-xs"></i><span class="alef">' + alert + '</span></div><small class="text-muted">' + (host.alias ? host.alias : host.hostname.split('-')[1]) + '</small></li>';
          }, this);
        }
      }, this);
      $('#fleet').html(fleethtml);
      $('#alerts').html(alertshtml);
    });
  }
});
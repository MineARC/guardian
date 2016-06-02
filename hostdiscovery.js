var nmap = require('libnmap');
var request = require('request');
var os = require('os');
var v6 = require('ip-address').Address6;
var exports = module.exports;


// Define object for access from where they are needed
var hosts_data = [];
exports.hosts_data = { systems: hosts_data };

// Spin up polling of backend services
var nmap_is_polling = true;
poll_nmap(function () {
  exports.hosts_data = { systems: hosts_data };
  nmap_is_polling = false;
});
setInterval(function () {
  if (!nmap_is_polling) {
    nmap_is_polling = true;
    poll_nmap(function () {
      exports.hosts_data = { systems: hosts_data };
      nmap_is_polling = false;
    });
  }
}, 60000);

function adapters() {
  var ret = []
    , adapter = ''
    , netmask = ''
    , adapters = os.networkInterfaces();

  for (var iface in adapters) {

    for (var dev in adapters[iface]) {
      adapter = adapters[iface][dev];

      if (!adapter.internal) {

        if (!adapter.netmask)
          return false;

        if (adapter.netmask) {

          netmask = adapter.netmask;

          /* Convert netmask to CIDR notation if IPv6 */
          if (/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/.test(netmask)) {
            netmask = new v6(netmask).subnet.substring(1);
          }

          ret.push(adapter.address + '/' + netmask);
        }
      }
    }
  }

  return ret;
}

function poll_nmap(next) {
  hosts_data = [];

  var opts = {
    // timeout: 1,
    range: adapters(),
    flags: [
      '-e eth0',
      '--open'],
    ports: '8000,445'
  };

  // Scan all hosts to see which have port 80 open
  nmap.scan(opts, function (err, report) {
    if (err) throw new Error(err);
    var hosts = [];
    for (var range in report) {
      // Seach through all the active hosts
      for (var host in report[range].host) {
        var ipv4_addr = '';
        var hostname = '';
        // All guardian systems run on raspberry pi's
        for (var address in report[range].host[host].address) {
          // Grab only the ipv4 address
          if (report[range].host[host].address[address].item.addrtype == 'ipv4')
            ipv4_addr = report[range].host[host].address[address].item.addr
        }
        if (report[range].host[host].hostnames[0].hostname)
          hostname = report[range].host[host].hostnames[0].hostname[0].item.name;
        hosts.push({ ip: ipv4_addr, hostname: hostname });
      }
    }

    hosts.forEach(function (element) {
      var request_options = {
        url: 'http://' + element.ip + '/api/dashboard',
        proxy: ''
      };

      request.get(request_options, function (err, res, body) {
        try {
          if (!err && res.statusCode == 200) {
            api_res = JSON.parse(body);
            if (api_res.guardian) {
              element['status'] = api_res.status;
              element['alarms'] = api_res.alarms;
              hosts_data.push(element);
            }
          }
          next();
        }
        catch (e) { }
      });
    });
  });
};

$(document).ready(function ($) {
  var external_showing = $('#external');
  var timeout;
  var timestamp = Date.now() - 10001;
  $('#external').bind('load', update_external_image);

  update_external_image();

  function update_external_image() {
    if ($('#enableCameras').prop('checked') && timestamp + 10000 <= Date.now()) {
      external_showing.attr('src', '/api/camera/external?' + Math.floor(Date.now() / 10000));
      clearTimeout(timeout);
      timeout = setTimeout(update_external_image, 20000);
      timestamp = Date.now();
    }
    else {
      setTimeout(update_external_image, Date.now - timestamp + 10000);
    }
  }
});
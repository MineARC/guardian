$(document).ready(function ($) {
  var internal_showing = $('#internal');
  var timeout;
  var timestamp = Date.now() - 10001;
  $('#internal').bind('load', update_internal_image);

  update_internal_image();

  function update_internal_image() {
    if ($('#enableCameras').prop('checked') && timestamp + 10000 <= Date.now()) {
      internal_showing.attr('src', '/api/camera/internal?' + Math.floor(Date.now() / 10000));
      clearTimeout(timeout);
      timeout = setTimeout(update_internal_image, 20000);
      timestamp = Date.now();
    }
    else {
      setTimeout(update_internal_image, Date.now - timestamp + 10000);
    }
  }
});
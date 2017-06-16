$(document).ready(function ($) {
  $('#btn-save').hide();

  // Check all button selects all the checkboxes for an email
  $('.check_all').click(function () {
    if ($(this).is(':checked'))
      $(this).closest('ul.dropdown-menu').find('input:checkbox').prop('checked', true);
    else
      $(this).closest('ul.dropdown-menu').find('input:checkbox').prop('checked', false);
    $(this).closest('ul.dropdown-menu').find('input.subscription:checkbox').addClass('updated');
  });

  // Listen for changes to the checkboxes to update the number of subscriptions
  $('input.subscription:checkbox').change(function () {
    $(this).addClass('updated');
    row_is_updated(this);
  });

  // Update the number of subscriptions
  function row_is_updated(element) {
    var length = $(element).closest('ul.dropdown-menu').find('input.subscription:checkbox:checked').length;
    // $(element).closest('div.dropdown').find('.num_subs').text(length);
    $('#btn-save').show();
  }

  // Dont close the dropdown when you are clicking on elements inside it
  $('.dropdown-menu').click(function (event) {
    event.stopPropagation();
  });

  // Show a confirmation box to delete an email for the database
  $('.btn-delete').click(function (event) {
    var email = $(this).data('email');
    bootbox.confirm('Are you sure you wish to remove ' + email, function (result) {
      if (result) {
        JSON.parse($('#notification-list').attr('ips')).forEach(function (ip) {
          $.post('//' + ip + '/notifications/delEmail', { email: email })
          $(this).closest('tr').hide();
        }, this);
      }
    });
  });

  // Save the selected subscriptions for the corresponding email
  $('#btn-save').click(function (event) {
    $('.updated').each(function (index, element) {
      var email = $(this).data('email');
      var ip = $(element).data('target');
      if ($(element).is(':checked')) {
        $.post('//' + ip + '/notifications/addEmail', { email: email })
      }
      else {
        $.post('//' + ip + '/notifications/delEmail', { email: email })
      }
    });
    $('#btn-save').hide();
  });

  // Attempt to add email to the database else show error box
  $('#btn-add').click(function (event) {
    add_email($(this).closest('form.input-group'));
    $('#form-add input').val('');
  });

  // Same as above for pressing enter
  $('#form-add').keypress(function (event) {
    if ('13' == (event.keyCode ? event.keyCode : event.which)) {
      add_email(this);
      $('#form-add input').val('');
    }
  });

  function add_email(event) {
    var email = $(event).find('input').val();
    JSON.parse($('#notification-list').attr('ips')).forEach(function (ip) {
      $.post('//' + ip + '/notifications/addEmail', { email: email });
    }, this);
  }

  $('ul.dropdown-menu').each(function (index, value) {
    var length = $(value).closest('ul.dropdown-menu').find('input.subscription:checkbox:checked').length;
    //$(value).closest('div.dropdown').find('.num_subs').text(length);
  });
});

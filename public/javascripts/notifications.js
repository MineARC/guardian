$(document).ready(function ($) {
  $('.btn-save').hide();

  // Check all button selects all the checkboxes for an email
  $('.check_all').click(function () {
    // Check all checkboxes when check_all is clicked
    $(this).closest('ul.dropdown-menu').find('input:checkbox').prop('checked', true);
    row_is_updated(this);
  });

  // Opisite of check all
  $('.uncheck_all').click(function () {
    // Uncheck all checkboxes when check_all is clicked
    $(this).closest('ul.dropdown-menu').find('input:checkbox').prop('checked', false);
    row_is_updated(this);
  });

  // Listen for changes to the checkboxes to update the number of subscriptions
  $('input:checkbox').change(function () {
    row_is_updated(this);
  });

  function row_is_updated(element) {
    // Update the number of subscriptions
    var length = $(element).closest('ul.dropdown-menu').find('input:checkbox:checked').length;
    $(element).closest('div.dropdown').find('.num_subs').text(length);

    // Update the save button
    $(element).closest('tr').find('.btn-delete').parent().addClass('input-group-btn');
    $(element).closest('tr').find('.btn-save').show();
  }

  // Dont close the dropdown when you are clicking on elements inside it
  $('.dropdown-menu').click(function (event) {
    event.stopPropagation();
  });

  // Show a confirmation box to delete an email for the database
  $('.btn-delete').click(function (event) {
    var element = this;
    var email = $(element).data('email');
    bootbox.confirm('Are you sure you wish to delete ' + email, function (result) {
      if (result) {
        $.post('/notifications/delEmail', { email: email }).then(function () {
          $(element).closest('tr').hide();
        });
      }
    });
  });

  // Save the selected subscriptions for the corresponding email
  $('.btn-save').click(function (event) {
    var element = this;
    var email = $(this).data('email');
    var subscriptions = [];
    $(element).closest('tr').find('input:checkbox:checked').each(function (index, element) {
      subscriptions.push($(element).data('index'));
    });
    $.post('/notifications/saveSubscriptions', { email: email, subscriptions: JSON.stringify(subscriptions) }).then(function () {
      $(element).closest('tr').find('.btn-delete').parent().removeClass('input-group-btn');
      $(element).closest('tr').find('.btn-save').hide();
    });
  })

  // Attempt to add email to the database else show error box
  $('#btn-add').click(function (event) {
    console.log($(this).closest('form.input-group'));
    add_email($(this).closest('form.input-group'));
  });

  // Same as above for pressing enter
  $('#form-add').keypress(function (event) {
    if ('13' == (event.keyCode ? event.keyCode : event.which)) {
      add_email(this);
    }
  });

  function add_email(event) {
    var email = $(event).find('input').val();
    $.post('/notifications/addEmail', { email: email }).then(function (res) {
      if (res == 'User added') {
        location.reload();
      }
      else {
        $('#error-alert').show();
        window.setTimeout(function () {
          $('#error-alert').hide();
        }, 3000);
      }
    });
  }
});

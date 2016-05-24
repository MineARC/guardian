$.getJSON('/dbtest/getEmailsAndSubscriptions', function (data) {
  var tr;
  for (var i = 0; i < data.length; i++) {
    tr = $('<tr/>');
    tr.append('<td>' + data[i].email + '</td>');
    tr.append('<td>' + '<div class="dropdown"> \
    <button class="btn_sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><p class="numSel">0</p> Selected \
    <span class="caret"></span></button> \
    <ul class="dropdown-menu"> \
      <li><a href="#">HTML</a><a href="#">CSS</a></li> \
      <li><a href="#">JavaScript</a></li> \
    </ul> \
  </div>' + '</td>');
    $('#email_table').append(tr);
  }
});
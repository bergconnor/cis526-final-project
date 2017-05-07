// sends a POST request with the login
// form data
$('#login-form').on('submit', (event) => {
  event.preventDefault();
  var user = $("#login-form :input").serialize();
  $.post('/sessions/', user, function() {
    window.location.replace("/");
  }).fail(function() {
    alert('Unsuccessful login');
  });
});

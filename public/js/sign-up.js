// sends a POST request with the sign-up
// form data
$('#sign-up-form').on('submit', (event) => {
  event.preventDefault();
  var user = $("#sign-up-form :input").serialize();
  $.post('/users/', user, function() {
    window.location.replace("/");
  }).fail(function() {
    alert('Invalid username/email');
  });
});

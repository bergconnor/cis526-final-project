// handles the click event for the login/logout
// link based on the user's login status
$('#login-logout-link').on('click', (event) => {
  event.preventDefault();
  if(isLoggedIn()) {
    // destroy the user's session
    $.get('/sessions/encryptedSession/destroy', function() {
      window.location.replace("/");
    }).fail(function() {
      alert('Failed to logout');
    });
  } else {
    // redirect the user to the login page
    window.location.replace('/login.html');
  }
});

// sends a POST request with the subpage
// form data
$('#subpage-form').on('submit', (event) => {
  event.preventDefault();
  var subpage = $("#subpage-form :input").serialize();
  $.post('/subpages/', subpage, function() {
    window.location.replace('/');
  }).fail(function() {
    alert('This subpage already exists');
  });
});

// sets the login/logout link according
// to the users login status
$(document).ready(function() {
  if(isLoggedIn()) {
    $('#login-logout-link').text('Logout');
  } else {
    $('#login-logout-link').text('Login');
  }
});

// TO DO: add description and separate tasks
$(document).ready(function() {
  $.get('/subpages/', (subpages) => {
    subpages.forEach(function(subpage) {
      var li = $('<li>').addClass("subpage-nav-item")
        .append($('<a>').text(subpage.name).attr("href", "/").on('click', (event) => {
          event.preventDefault();
          $("a.active").removeClass("active");
          $(event.target).addClass("active");
          $('#subpage-content').empty();
          $('<h1>').text(subpage.name).appendTo('#subpage-content');
          $('<p>').text(subpage.description).appendTo('#subpage-content');
          $.get('/posts/' + subpage.id + '/subpage', (posts) => {
            posts.forEach(function(post) {
              if(post.fileType === 'image') {
                $('<img>').attr('src', post.filename).appendTo('#subpage-content');
              } else if(post.fileType === 'video') {
                $('<video>').attr('controls', true).attr('src', post.filename).appendTo('#subpage-content');
              }
            });
          });
          $('#subpage-form').load('post-form.html').on('submit', (event) => {
            event.preventDefault();

            var post = new FormData($('form')[0]);
            post.append('subpage_id', subpage.id);

            $.post({
              url: '/posts/',
              data: post,
              async: false,
              cache: false,
              contentType: false,
              processData: false,
              success: function() {
                window.location.replace('/home.html');
              }
            });
          });
          });
      li.appendTo('#subpage-list');
    });
  }).fail(function() {
    alert('Failed to load subpage');
  });
});

/**
 * @function isLoggedIn
 * Determines if a user is logged in based
 * on the session cookie.
 * @returns {boolean} Whether or not a user
 * is logged in.
 */
function isLoggedIn() {
  // get the session cookie
  var value = "; " + document.cookie;
  var parts = value.split("; encryptedSession=");
  var cryptedCookie = "";
  // get the value of the session cookie
  if(parts.length == 2) {
    cryptedCookie = parts.pop().split(";").shift();
  }

  // if the cookie value is not an empty string
  // a user is logged in
  return (cryptedCookie.length > 0);
}

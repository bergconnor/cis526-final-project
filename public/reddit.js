function getCryptedCookie() {
  var value = "; " + document.cookie;
  var parts = value.split("; encryptedSession=");
  var cryptedCookie = "";
  if(parts.length == 2) {
    return parts.pop().split(";").shift();
  }
}

$('#login-form').on('submit', (event) => {
  event.preventDefault();
  var user = $("#login-form :input").serialize();
  $.post('/sessions/', user, function() {
    window.location.replace("/");
  }).fail(function() {
    alert('Unsuccessful login');
  });
});

$('#sign-up-form').on('submit', (event) => {
  event.preventDefault();
  var user = $("#sign-up-form :input").serialize();
  $.post('/users/', user, function() {
    window.location.replace("/");
  }).fail(function() {
    alert('Invalid username/email');
  });
});

if($('#login-logout-link').length > 0) {
  $(document).ready(function() {
    var cryptedCookie = getCryptedCookie();
    if(cryptedCookie.length > 0) {
      $('#login-logout-link').text('Logout');
    } else {
      $('#login-logout-link').text('Login');
    }
  });
}

$('#login-logout-link').on('click', (event) => {
  event.preventDefault();
  var cryptedCookie = getCryptedCookie();
  if(cryptedCookie.length > 0) {
    $.get('/sessions/encryptedSession/destroy', function() {
      window.location.replace("/");
    }).fail(function() {
      alert('Failed to logout');
    });
  } else {
    window.location.replace('login.html');
  }
});

$('#subpage-form').on('submit', (event) => {
  event.preventDefault();
  var subpage = $("#subpage-form :input").serialize();
  $.post('/subpages/', subpage, function() {
    window.location.replace('/');
  }).fail(function() {
    alert('This subpage already exists');
  });
});

if($('#subpage-list').length > 0) {
  $(document).ready(function() {
    $.get('/subpages/', (subpages) => {
      subpages.forEach(function(subpage) {
        $('<a>').text(subpage.name).attr("href", "/").on('click', (event) => {
          event.preventDefault();
          $("a.active").removeClass("active");
          $(event.target).addClass("active");
          $('#subpage-content').empty();
          $('<h1>').text(subpage.name).appendTo('#subpage-content');
          $('<p>').text(subpage.description).appendTo('#subpage-content');
          $.get('/posts/' + subpage.id + '/subpage', (posts) => {
            posts.forEach(function(post) {
              $('<img>').attr('src', post.media).appendTo('#subpage-content');
            });
          });
          $('#subpage-form').load('post-form.html').on('submit', (event) => {
            event.preventDefault();
            var post = new FormData($('form')[0]);
            post.append('subpage_id', subpage.id);
            console.log(post);
            $.post({
              url: '/posts/',
              data: post,
              contentType: false,
              processData: false,
              success: function() {
                window.location.replace('/home.html');
              }
            });
          });
        }).appendTo('#subpage-list');
      });
    }).fail(function() {
      alert('Failed to load subpage');
    });
  });
}

"use strict";

/** @module session
  * Adds functions for handling user
  * session related activites
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  /** @function newSession
   * Displays a form to create a new session
   * based on the user's login information
   */
   reddit.newSession = function() {
     // grab and clear the content element
     var content = $('#content').empty();

     // append a title
     $('<h1>').text('Login').appendTo(content);

     var form = $('<form>').appendTo(content);
     $('<div>').addClass('form-group')
       .append($('<label>').text('Username'))
       .append($('<input name="username" type="text" class="form-control">'))
       .appendTo(form);
     $('<div>').addClass('form-group')
       .append($('<label>').text('Password'))
       .append($('<input name="password" type="password" class="form-control">'))
       .appendTo(form);
     $('<button>').text("Login")
       .addClass('btn btn-primary')
       .appendTo(form)
       .on('click', function(e) {
         e.preventDefault();
         $.post('/sessions/', form.serialize(), function() {
           window.location.replace("/");
         }).fail(function() {
           alert('Invalid username/password');
         });
       });
     $('<button>').text("Sign Up")
       .addClass('btn btn-primary')
       .appendTo(form)
       .on('click', function(e) {
         e.preventDefault();
         reddit.newUser();
       });
   }

   /** @function destroySession
    * Destroys the current session
    */
    reddit.destroySession = function() {
      $.get('/sessions/encryptedSession/destroy', function() {
        window.location.replace("/");
      });
    }

    /**
     * @function isLoggedIn
     * Determines if a user is logged in based
     * on the session cookie.
     * @returns {boolean} Whether or not a user
     * is logged in.
     */
    reddit.isLoggedIn = function() {
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
}

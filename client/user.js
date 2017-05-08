"use strict";

/** @module user
  * Adds functions for handling user
  * related activites
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  /** @function newUser
   * Displays a form to create a new user
   */
   reddit.newUser = function() {
     // grab and clear the content element
     var content = $('#content').empty();

     // append a title
     $('<h1>').text('Sign Up').appendTo(content);

     var form = $('<form>').appendTo(content);
     $('<div>').addClass('form-group')
       .append($('<label>').text('Email'))
       .append($('<input name="email" type="email" class="form-control">'))
       .appendTo(form);
     $('<div>').addClass('form-group')
       .append($('<label>').text('Username'))
       .append($('<input name="username" type="text" class="form-control">'))
       .appendTo(form);
     $('<div>').addClass('form-group')
       .append($('<label>').text('Password'))
       .append($('<input name="password" type="password" class="form-control">'))
       .appendTo(form);
     $('<div>').addClass('form-group')
       .append($('<label>').text('Verify Password'))
       .append($('<input name="verify-password" type="password" class="form-control">'))
       .appendTo(form);
     $('<button>').text("Sign Up")
       .addClass('btn btn-primary')
       .appendTo(form)
       .on('click', function(e) {
         e.preventDefault();
         $.post('/users/', form.serialize(), function() {
           window.location.replace("/");
         }).fail(function() {
           alert('Something went wrong');
         });
       });
   }
}

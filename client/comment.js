"use strict";

/** @module comment
  * Adds functions for displaying posts
  * to the supplied library object
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  reddit.octicons = require('octicons');

  /** @function listComments
   * Displays a list of comments sorted
   * by popularity.
   */
   reddit.listComments = function() {
     // grab and clear the content element
     var content = $('#content').empty();

     $.get('/comments/', function(comments) {
       comments.forEach(function(comment) {
           $('<div>').addClass("comment")
           .append($('<div>').addClass("vote")
             .append($('<div>').addClass("upvote")
               .append($('<a>')
                 .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                 .on('click', function(e) {
                   reddit.updateComment(comment.id, 1);
                 })))
             .append($('<div>').addClass("score")
               .text(comment.score))
             .append($('<div>').addClass("downvote")
               .append($('<a>')
                 .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                 .on('click', function(e) {
                   reddit.updateComment(comment.id, -1);
                 }))))
             .append($('<div>').addClass("details")
               .append($('<h5>').text(comment.content))
               .append($('<h6>').text('comments'))
             ).appendTo('#content');

       });
     });
   }

   /** @function listCommentsByID
    * Displays a list of comments with
    * the given post ID
    */
    reddit.listCommentsByID = function(post_id) {
      $.get('/comments/' + posts_id + '/posts', {posts_id: posts_id}, function(comments) {
        // grab and clear the content element
        var content = $('#content');

        comments.forEach(function(comment) {
            $('<div>').addClass("comment")
            .append($('<div>').addClass("vote")
              .append($('<div>').addClass("upvote")
                .append($('<a>')
                  .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                  .on('click', function(e) {
                    reddit.updateComment(post.id, 1);
                  })))
              .append($('<div>').addClass("score")
                .text(comment.score))
              .append($('<div>').addClass("downvote")
                .append($('<a>')
                  .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                  .on('click', function(e) {
                    reddit.updateComment(comment.id, -1);
                  }))))
              .append($('<div>').addClass("details")
                .append($('<h5>').text(comment.content))
                .append($('<h6>').text('comments'))
              ).appendTo('#content');
        });
      });
    }

  /** @function newComment
   * Displays a form to create a new project
   * in the page's content div
   */
  reddit.newPost = function(posts_id) {
    // set the modal title
    var title = "Create Comment";

    // create the modal form
    var form = $('<form>')
      .append($('<div>').addClass('form-group')
        .append($('<input name="content" type="text" class="form-control">')
          .attr('placeholder', "content")))
      .append($('<div>').addClass('form-group')
        .append($('<div>').addClass("progress-bar")
          .attr('role', 'progressbar')
          .height(20)
          .width(0)));

    // creat the modal footer
    var modalFooter = $('<div>').addClass("modal-footer")
      .append($('<button>').addClass("btn btn-secondary")
        .text("Close")
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .attr('aria-label', "Cancel"))
      .append($('<button>').addClass("btn btn-primary")
        .text("Create")
        .attr('type', 'button')
        .on('click', function(e) {
          event.preventDefault();
          var formData = new FormData(form.get(0));
          formData.append('posts_id', posts_id);

          if(formData.get('content').length > 50) {
            modal.modal('hide');
            $('<div>').addClass("alert alert-danger alert-dismissable fade show text-center")
              .attr('role', 'alert')
              .attr('id', 'alert-message')
              .append($('<button>').addClass("close")
                .attr('type', 'button')
                .attr('data-dismiss', 'alert')
                .attr('aria-label', 'Close')
                .append($('<span>').html("&times;")
                  .attr('aria-hidden', 'true')))
              .append($('<strong>').text("Invalid comment! "))
              .append("Max content length is 50 characters.")
              .prependTo('#content');
              window.setTimeout(function() {
                $("#alert-message").fadeTo(500, 0).slideUp(500, function() {
                  $(this).remove();
                });
              }, 4000);
          }

          $.ajax({
            url: '/comments/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
              console.log('Upload successful - ' + data);
            },
            xhr: function() {
              // create an XMLHttpRequest
              var xhr = new XMLHttpRequest();

              // listen to the 'progress' event
              xhr.upload.addEventListener('progress', function(evt) {
                if (evt.lengthComputable) {
                  // calculate the percentage of upload completed
                  var percentComplete = evt.loaded / evt.total;
                  percentComplete = parseInt(percentComplete * 100);

                  // update the Bootstrap progress bar with the new percentage
                  $('.progress-bar').text(percentComplete + '%');
                  $('.progress-bar').width(percentComplete + '%');

                  // once the upload reaches 100%, set the progress bar text to done
                  if (percentComplete === 100) {
                    $('.progress-bar').html('Done');
                    modal.modal('hide');
                    setTimeout(function() {
                      reddit.showPost(posts_id);
                    }, 1500);
                  }
                }
              }, false);

              return xhr;
            }
          });
      }));

    // create the modal body and append the form
    var modalBody = $('<div>').addClass("modal-body")
      .append(form);

    // create the modal header
    var modalHeader = $('<div>').addClass("modal-header")
      .append($('<h5>').text(title))
      .append($('<button>').addClass("close")
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .attr('aria-label', "Close")
        .append($('<span>').html("&times;")
          .attr('aria-hidden', 'true')));

    // create the modal content and append the modal header, footer and body
    var modalContent = $('<div>').addClass("modal-content")
      .append(modalHeader)
      .append(modalBody)
      .append(modalFooter);

    // create the modal dialog and append the modal content
    var modalDialog = $('<div>').addClass("modal-dialog")
      .attr('role', 'document')
      .append(modalContent);

    // create the modal and append the modal dialog
    var modal = $('<div>').addClass("modal fade")
      .append(modalDialog);

    // show the modal
    modal.modal('show');
  }

  /** @function updateComment
 * Increments/decrements the likes column of
 * the comment.
 * @param {integer} id - the post to update
 */
reddit.updateComment = function(id, val) {
  $.get('/comments/' + id, (comment) => {
    comment.score += val;
    $.post('/comments/' + id, JSON.stringify(comment), function() {
      reddit.listPosts();
    });
  });
}

}

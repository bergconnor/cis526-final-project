"use strict";

/** @module post
  * Adds functions for displaying posts
  * to the supplied library object
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  reddit.octicons = require('octicons');

  /** @function listPosts
   * Displays a list of posts sorted
   * by popularity.
   */
   reddit.listPosts = function() {
     // grab and clear the content element
     var content = $('#content').empty();

     $.get('/posts/', function(posts) {
       posts.forEach(function(post) {
         var img;
         var type = post.fileType.split('/')[0];
         if(type === 'video') {
           addVideoPost(post);
         } else if(type === 'image') {
           var img = $('<img>').addClass("thumbnail-img")
             .attr("src", post.filename);
           $('<div>').addClass("post")
           .append($('<div>').addClass("vote")
             .append($('<div>').addClass("upvote")
               .append($('<a>')
                 .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                 .on('click', function(e) {
                   reddit.updatePost(post.id, 1);
                 })))
             .append($('<div>').addClass("score")
               .text(post.score))
             .append($('<div>').addClass("downvote")
               .append($('<a>')
                 .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                 .on('click', function(e) {
                   reddit.updatePost(post.id, -1);
                 }))))
             .append($('<a>').addClass("thumbnail-link")
               .append(img))
             .append($('<div>').addClass("details")
               .append($('<h5>').text(post.title))
               .append($('<h6>').text('comments'))
             ).appendTo('#content');
         }
       });
     });
   }

   /** @function listPostsByID
    * Displays a list of posts with
    * the given subpage ID
    */
    reddit.listPostsByID = function(subpage_id) {
      $.get('/posts/', {subpage_id: subpage_id}, function(posts) {
        posts.forEach(function(post) {
          var img;
          var type = post.fileType.split('/')[0];
          if(type === 'video') {
            addVideoPost(post);
          } else if(type === 'image') {
            var img = $('<img>').addClass("thumbnail-img")
              .attr("src", post.filename);
            $('<div>').addClass("post")
            .append($('<div>').addClass("vote")
              .append($('<div>').addClass("upvote")
                .append($('<a>')
                  .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                  .on('click', function(e) {
                    reddit.updatePost(post.id, 1);
                  })))
              .append($('<div>').addClass("score")
                .text(post.score))
              .append($('<div>').addClass("downvote")
                .append($('<a>')
                  .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                  .on('click', function(e) {
                    reddit.updatePost(post.id, -1);
                  }))))
              .append($('<a>').addClass("thumbnail-link")
                .append(img))
              .append($('<div>').addClass("details")
                .append($('<p>').text(post.title))
                .append($('<p>').text('comments'))
              ).appendTo('#content');
          }
        });
      });
    }

  /** @function newPost
   * Displays a form to create a new project
   * in the page's content div
   */
  reddit.newPost = function(subpage_id) {
    // grab and clear the content element
    var content = $('#content').empty();

    // append a title
    $('<h1>').text('Create New Post').appendTo(content);

    // display the edit form
    var form = $('<form>').appendTo(content);
    $('<div>').addClass('form-group')
      .append($('<label>').text('Title'))
      .append($('<input name="title" type="text" class="form-control">'))
      .appendTo(form);
    $('<div>').addClass('form-group')
      .append($('<label>').text('Content'))
      .append($('<input name="content" type="text" class="form-control">'))
      .appendTo(form);
    $('<div>').addClass('form-group')
      .append($('<label>').text('Media'))
      .append($('<input name="media" type="file" class="form-control">'))
      .appendTo(form);
    $('<div>').addClass('progress')
      .append($('<div>').addClass('progress-bar').attr('role', 'progressbar'))
      .appendTo(form);
    $('<button>').text("Create Post")
      .addClass('btn btn-primary')
      .appendTo(form)
      .on('click', function(e) {
        event.preventDefault();
        var formData = new FormData(form.get(0));
        var files = form.find('input[type=file]')[0].files;

        if(files.length > 0) {
          var file = files[0];
          formData.append('media', file, file.name);
          formData.append('subpage_id', subpage_id);

          $.ajax({
            url: '/posts/',
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
                    reddit.showSubpage(subpage_id);
                  }
                }
              }, false);

              return xhr;
            }
          });
        }
      });
  }

  /** @function updatePost
 * Increments/decrements the likes column of
 * the post.
 * @param {integer} id - the post to update
 */
reddit.updatePost = function(id, val) {
  $.get('/posts/' + id, (post) => {
    post.score += val;
    $.post('/posts/' + id, JSON.stringify(post), function() {
      reddit.listPosts();
    });
  });
}

  function addVideoPost(post) {
    var video = $('<video>')
      .append($('<source>')
        .attr('type', post.fileType)
        .attr('src', post.filename)).get(0);
    video.addEventListener('loadeddata', function() {
      var canvas = $('<canvas>').get(0);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var dataURI = canvas.toDataURL('image/jpg');
      var img = $('<img>').attr("src", dataURI);
      img = getThumbnail(img, video.videoWidth, video.videoHeight);
      // var arrow-up = octicons['arrow-up'].toSVG();
      $('<div>').addClass("post")
        .append($('<div>').addClass("vote")
          .append($('<div>').addClass("upvote")
            .append($('<a>')
              .append(octicons['arrow-up'].toSVG())
              .on('click', function(e) {
                reddit.updatePost(post.id, 1);
              })))
          .append($('<div>').addClass("downvote")
            .append($('<a>')
              .append(octicons['arrow-down'].toSVG())
              .on('click', function(e) {
                reddit.updatePost(post.id, -1);
              }))))
        .append($('<a>').addClass("thumbnail-link")
          .append(img))
        .append($('<div>').addClass("details")
          .append($('<p>').text(post.title))
          .append($('<p>').text('comments')))
        .appendTo('#content');
   });
   video.addEventListener("error", function () {
     console.log(this.error);
   });
  }

  function getThumbnail(img, oldWidth, oldHeight) {
    // adjust thumbnail size
    var maxWidth = 200;
    var ratio = 0;
    var width = oldWidth;
    var height = oldHeight;

    if(width > maxWidth) {
      ratio = maxWidth / width;
      img.css("width", maxWidth);
      img.css("height", height * ratio);
      height = height * ratio;
      width = width * ratio;
    }
    return img;
  }
}

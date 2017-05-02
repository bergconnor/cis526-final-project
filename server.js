/** server.js
 * Server for a reddit-like web app.
 */

"use strict";

// Constants
var PORT = 3000;
var SESSION = "encryptedSession";

// Requires
var http = require('http');
var encryption = require('./lib/encryption');
var parseCookie = require('./lib/cookie-parser');
var fileserver = require('./lib/fileserver');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('reddit.sqlite3', function(err) {
  if(err) console.error(err);
});
var router = new (require('./lib/route')).Router(db);

// Cache static directory in the fileserver
fileserver.loadDir('public');

// Define our routes
var subpage = require('./src/resource/subpage');
var user = require('./src/resource/user');
var session = require('./src/resource/session');
router.resource('/subpages', subpage);
router.resource('/users', user);
router.resource('/sessions', session);

var server = new http.Server(function(req, res) {
  // We need to determine if there is a logged-in user.
  // We'll check for a session cookie
  var cookies = parseCookie(req.headers.cookie);

  // To better protect against manipulation of the session
  // cookie, we encrypt it before sending it to the
  // client.  Therefore, the cookie they send back is
  // likewise encrypted, and must be decrypted before
  // we can make sense of it.
  var encryptedSession = cookies[SESSION];

  // There may not yet be a session
  if(!encryptedSession) {
    // if not, set req.session to be empty
    req.session = {}
  } else {
    // if so, the session is encrypted, and must be decrypted
    var sessionData = encryption.decipher(encryptedSession);
    // further, it is in JSON form, so parse it and set the
    // req.session object to be its parsed value
    req.session = JSON.parse(sessionData);
  }

  // Remove the leading '/' from the resource url
  var resource = req.url.slice(1);
  // console.log(resource + ' --> ', req.headers.cookie);
  // If no resource is requested, serve the cached index page.
  if(resource == '')
    fileserver.serveFile('/index.html', req, res);
  // If the resource is cached in the fileserver, serve it
  else if(fileserver.isCached(resource))
    fileserver.serveFile(resource, req, res);
  // Otherwise, route the request
  else router.route(req, res);
});

// Launch the server
server.listen(PORT, function(){
  console.log("listening on port " + PORT);
  // db.all('SELECT * from users', function(err, table) {
  //   console.log(table);
  // });
});

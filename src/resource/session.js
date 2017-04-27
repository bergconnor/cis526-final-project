/** @module sessions
* a module represesnting a user session
*/

module.exports = {
create: create,
destroy: destroy,
loginRequired: loginRequired
}

var urlencoded = require('./../../lib/form-urlencoded');
var encryption = require('./../../lib/encryption');

/** @function create
* creates a new session
*/
function create(req, res, db) {
urlencoded(req, res, function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  db.get("SELECT * FROM users WHERE username=?", [username], function(err, user) {
    if(err) {
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!user) {
      // username not in database
      res.statusCode = 403;
      res.end("Incorrect username/password");
      return;
    }
    var cryptedPassword = encryption.digest(password + user.salt);
    if(cryptedPassword != user.cryptedPassword) {
      // invalid password/username combination
      res.statusCode = 403;
      res.end("Incorrect username/password");
      return;
    } else {
      // successful login
      // encrypt user.id and store in the cookies
      var cookieData = JSON.stringify({userId: user.id});
      var encryptedCookie = encryption.encipher(cookieData);
      res.setHeader("Set-Cookie", ["session=" + encryptedCookie]);
      res.statusCode = 200;
      res.end("Successful login");
    }
  });
});
}

/** @function destroy
* destroys a session
*/
function destroy(req, res) {
res.setHeader("Set-Cookie", [""]);
res.statusCode = 200;
res.end("Logged out successfully");
}

/** @function loginRequired
*
*/
function loginRequired(req, res, next) {
  var session = req.headers.cookie.session;
  var sessionData = encryption.decipher(session);
  var sessionObj = JSON.parse(sessionData);
  if(sessionObj.userId) {
    req.currentUserId = sessionObj.userId;
    return next(req, res);
  } else {
    res.statusCode = 403;
    res.end("Authentication required");
  }
}

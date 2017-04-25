"use strict";

/** @module project
 * A RESTful resource representing a user
 * implementing the CRUD methods.
 */

module.exports = {
  create: create,
  update: update,
  read: read
}

var json = './../lib/form-json');
var encryption = require('./../lib/encryption');

function create( req, res, db) {
  json(req, res, function(req, res) {
    var user = req.body;
    var salt = encryption.salt();
    var cryptedPassword = encryption.digest(user.password + salt);
    db.run('INSERT INTO users (eid, email, firtName, lastName, cryptedPassword, salt) VALUES (?, ?, ?, ?, ?, ?)', [
      user.eid,
      user.email,
      user.firstName,
      user.lastName,
      cryptedPassword,
      salt
    ], function(err) {
      if(err) {return;}
      res.statusCode(200);
      res.end("User Created");
    }
  )
  });
}

function update( req, res, db) {
  var id = req.params.id;
  db.get('SELECT eid, email, firstName, lastName FROM users where id=?', [id], function(user) {
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(user));
  });
}

function read( req, res, db) {

}

/*
// ==================================================
                  Oauth Server Notes            

  + Change Mongo URI
  + Configure model.js (see model.js notes).

// ==================================================
*/

// ================ Dependencies ==================
var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
// ================================================

// ================ Mongoose ======================
var mongoose = require('mongoose');
var uristring = 'mongodb://oauth:oauth@linus.mongohq.com:10075/oauth';

mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});
// =================================================

// ================ Server set-up ==================
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.oauth = oauthserver({
  model: require('./model'),
  grants: ['authorization_code', 'password', 'refresh_token'],
  debug: false
});

// =================================================

/*
    |=================|
    |    Endpoints    |
    |=================|
*/

/**
  * Attempts to grant user an authorization and refresh token.
  * Must use 'x-www-form-urlencoded'.
  * @param {Object} grant_type: This server uses the 'password' grant type.
  * @param {Object} client_id
  * @param {Object} client_secret
  * @param {Object} username Not required if requesting a refresh token.
  * @param {Object} password: Not required if requesting a refresh token.
  * @param {Object} refresh_token: Not required if requesting using a username and password.
**/
app.all('/oauth/token', app.oauth.grant());

/**
  * Attempts to authenticate user with access token.
  * Must set authorization header.
  * Example: Authorization Bearer beb1bb1070af5db0169665564521a12a72b6b6
**/
app.get('/', app.oauth.authorise(), function (req, res) {
  res.status(200).end();
});

// ================ Start Server ===================
app.use(app.oauth.errorHandler());
app.listen(3000);
// =================================================
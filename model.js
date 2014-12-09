// =============== Oauth Model Notes ===============
/*
  * Create a client record in mongoDB.
  * Add the clientID to the authorizedClientIds.
*/
// =================================================

// ================ Function list ==================
/*
  * Clients:
  ** getClient
  ** grantTypeAllowed

  * Users:
  ** getUser

  * Access Tokens:
  ** getAccessToken
  ** saveAccessToken

  * Refresh Tokens:
  ** getRefreshToken
  ** saveRefreshToken
*/
// =================================================

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  model = module.exports;

// ================ Clients Model ===================
var OAuthClientsSchema = new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUri: { type: String }
});

mongoose.model('OAuthClients', OAuthClientsSchema);
var OAuthClientsModel = mongoose.model('OAuthClients');

model.getClient = function (clientId, clientSecret, callback) {
  console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');
  if (clientSecret === null) {
    return OAuthClientsModel.findOne({ clientId: clientId }, callback);
  }
  OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);
};

// Put the clientID here.
var authorizedClientIds = ['bennett'];
model.grantTypeAllowed = function (clientId, grantType, callback) {
  console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

  if (grantType === 'password') {
    return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  }

  callback(false, true);
};
// ==================================================

// ================= User Model =====================
var OAuthUsersSchema = new Schema({
  username: { type: String },
  password: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, default: '' }
});

mongoose.model('OAuthUsers', OAuthUsersSchema);
var OAuthUsersModel = mongoose.model('OAuthUsers');


model.getUser = function (username, password, callback) {
  console.log('in getUser (username: ' + username + ', password: ' + password + ')');
  if (password === null) {
    return OAuthUsersModel.findOne({ username: username }, callback);
  }
  OAuthUsersModel.findOne({ username: username, password: password }, callback);
};
// ==================================================

// ============== AccessToken Model =================
var OAuthAccessTokensSchema = new Schema({
  accessToken: { type: String },
  clientId: { type: String },
  userId: { type: String },
  expires: { type: Date }
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens');

model.getAccessToken = function (bearerToken, callback) {
  console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

  OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, callback);
};

model.saveAccessToken = function (token, clientId, expires, userId, callback) {
  console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

  var accessToken = new OAuthAccessTokensModel({
    accessToken: token,
    clientId: clientId,
    userId: userId,
    expires: expires
  });

  accessToken.save(callback);
};
// ==================================================

// ============== RefreshToken Model ================
var OAuthRefreshTokensSchema = new Schema({
  refreshToken: { type: String },
  clientId: { type: String },
  userId: { type: String },
  expires: { type: Date }
});

mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
var OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens');

model.getRefreshToken = function (refreshToken, callback) {
  console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

  OAuthRefreshTokensModel.findOne({ refreshToken: refreshToken }, callback);
};

model.saveRefreshToken = function (token, clientId, expires, userId, callback) {
  console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId +', userId: ' + userId + ', expires: ' + expires + ')');

  var refreshToken = new OAuthRefreshTokensModel({
    refreshToken: token,
    clientId: clientId,
    userId: userId,
    expires: expires
  });

  refreshToken.save(callback);
};
// ==================================================
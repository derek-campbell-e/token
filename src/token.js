module.exports = function Token(){
  const crypto = require('crypto');
  
  const UUID = function(){
    return crypto.randomBytes(4).toString('hex') + '-' + crypto.randomBytes(8).toString('hex');
  };

  const db = require('./db');
  const password = require('./password')();

  let token = {};

  token.createUser = function(username, password){
    
  };

  let init = function(){
    return token;
  };

  return init();
};
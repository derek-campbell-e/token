module.exports = function Token(){
  const crypto = require('crypto');
  const jwt = require('jsonwebtoken');
  
  const UUID = function(){
    return crypto.randomBytes(4).toString('hex') + '-' + crypto.randomBytes(8).toString('hex');
  };

  const db = require('./db')();
  const password = require('./password')();

  let token = {};

  token.name = 'token';
  token.actions = {};
  token.actions.createUser = async function(ctx){
    let result = await token.createUser(ctx.params.username, {}, null);
    return result;
  };

  token.actions.validateToken = async function(ctx){
    let result = await token.validateToken(ctx.params.uuid, ctx.params.token);
    return result;
  };

  token.actions.refreshToken = async function(ctx){
    let result = await token.refreshToken(ctx.params.uuid);
    return result;
  };

  let secret = 'shhhhhSuperSecret';

  token.createToken = function(uuid, tokenSecret, callback){
    let payload = {};
    payload.uuid = uuid;
    payload.secret = tokenSecret;
    let options = {};
    jwt.sign(payload, secret, options, callback);
  };

  token.refreshToken = function(uuid, callback){
    return new Promise(function(resolve, reject){
      callback = callback || function(){};
      let tokenSecret = UUID();
      db.query('update tokens set tokenSecret=$1 where uuid=$2', [tokenSecret, uuid], function(error, res){
        token.createToken(uuid, tokenSecret, function(error, token){
          if(error){
            return reject(false);
          }
          return resolve(token);
        });
      });
    });
  };

  token.validateToken = function(uuid, token, callback){
    return new Promise(function(resolve, reject){
      callback = callback || function(){};
      jwt.verify(token, secret, function(error, decoded){
        if(error){
          reject(false);
          return callback(false);
        }
        let sameUUID = decoded.uuid === uuid;
        db.query('select tokensecret from tokens where uuid=$1', [uuid], function(error, res){
          let row = res.rows[0] || {};
          if(row.tokenSecret || row.tokensecret){
            let tokenSecret = row.tokenSecret || row.tokensecret;
            let isSameSecret = decoded.secret === tokenSecret;
            resolve(sameUUID && isSameSecret);
            return callback(sameUUID && isSameSecret);
          }
        });
      });
    });
  };

  token.createUser = function(username, roles, callback){
    return new Promise(function(resolve, reject){
      callback = callback || function(){};
      roles = roles || {};
      let uuid = UUID();
      let tokenSecret = UUID();
      let values = [uuid, username, roles, tokenSecret];
      db.query('insert into tokens (uuid, username, roles, tokenSecret) values ($1, $2, $3, $4)', values, function(error, res){
        let json = {};
        if(error){
          json.status = 'unsuccessful';
          json.error = 'an error occured creating user';
          json.token = null;
          json.uuid = null;
          reject(json);
          return callback(json);
        }
        json.error = null;
        json.status = 'ok';
        token.createToken(uuid, tokenSecret, function(error, token){
          json.token = token;
          json.uuid = uuid;
          resolve(json);
          return callback(error, json);
        });
      });
    });
  };

  let init = function(){   
    return token;
  };

  return init();
};
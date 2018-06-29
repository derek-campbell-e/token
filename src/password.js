module.exports = function SecurePassword(){
  const crypto = require('crypto');

  let sp = {};

  let generateSalt = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
  };

  let sha512 = function(password, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return {
      salt: salt,
      hash: hash.digest('hex')
    };
  };

  sp.verifyPassword = function(recordedPassword, recordedSalt, password){
    let thisHash = sha512(password, recordedSalt);
    let thisHashBuffer = new Buffer(thisHash.hash);
    let recordedHashBuffer = new Buffer(recordedPassword);
    return crypto.timingSafeEqual(thisHashBuffer, recordedHashBuffer);
  };

  sp.saltPassword = function(password){
    let salt = generateSalt(16);
    let data = sha512(password, salt);
    return data;
  };

  let init = function(){
    return sp;
  };

  return init();
};
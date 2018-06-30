module.exports = function Postgres(){
  const { Pool, Client } = require('pg')

  let opts = {
    user: 'postgres',
    host: 'localhost',
    password: 'example',
    port: 5432,
    database: 'api.ugenu.io'
  };

  const pool = new Pool(opts);

  let db = {};

  db.query = function(statement, args, callback){
    args = args || [];
    pool.connect(function(error, client, done){
      if(error){
        return callback(error);
      }
      return client.query(statement, args, function(error, res){
        done();
        return callback(error, res);
      });
    });
  };

  let bind = function(){
    pool.on('error', function(error, client){
      console.log(error);
    });
  };

  let init = function(){
    bind();
    return db;
  };

  return init();
};
/*
const db = require('./src/db')();

db.query('select * from users', null, function(error, res){
  console.log(error, res.rows);
});
*/

module.exports = require('./src/token')();
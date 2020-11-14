var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'developer',
  password : 'PMuchiri@123',
  database : 'bifa'
});
 
connection.connect();

module.exports = connection
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "10As2000*",
  database: "urldb",
});

module.exports = con;

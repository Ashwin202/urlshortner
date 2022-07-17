var express = require("express");
var mysql = require("mysql");
const app = express();
var router_sms = require("./routes/sms_index");
var router = require("./routes/index");
// var router_sms = require("./routes/sms_index");

var con = require("./routes/database/db");

con.connect((err) => {
  if (err) {
    console.log("Error in connecting the server with url table");
  } else {
    console.log("Database connected to url database");
  }
});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/", router_sms);
app.use("/", router);
app.listen(3000, () => {
  console.log("Server Started");
});

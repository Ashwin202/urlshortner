var express = require("express");
var mysql = require("mysql");
const app = express();
var router = require("./routes/index");

var con = require("./routes/database/db");

con.connect((err) => {
  if (err) {
    console.log("Error in connecting the server");
  } else {
    console.log("Database connected");
  }
});
app.use("/", router);
app.listen(3000, () => {
  console.log("Server Started");
});

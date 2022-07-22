var con = require("../../database/db");

function linktodb(str) {
  let uniqueID = Math.random()
    .toString(36)
    .replace(/[^a-z]/gi, "")
    .substr(0, 6);
  con.query(
    `insert into urltable(longurl,shorturl) values('${str}','${uniqueID}')`,
    (err) => {
      if (err) {
        throw err;
        // res.status(500).json({ status: "Error in inserting url to the db" });
      }
    }
  );
  return uniqueID;
}
module.exports = linktodb;

const { json } = require("body-parser");
const bodyParser = require("body-parser");
var express = require("express");
const app = express();
var router = express.Router();

var con = require("./database/db");

var jsonParser = bodyParser.json();
router
  .route("/urlshort")
  .post(jsonParser, (req, res) => {
    var longurl = req.body.longurl;
    console.log(longurl);
    let uniqueID = Math.random()
      .toString(36)
      .replace(/[^a-z0-9]/gi, "")
      .substr(2, 10);
    con.query(
      `insert into urltable(longurl,shorturl) values('${longurl}','${uniqueID}')`,
      (err) => {
        if (!err) {
          res.status(200).json({ status: "Insertion to the database success" });
        } else {
          res.status(200).json({ status: "Insertion of longurl failed" });
        }
      }
    );
  })
  .get((req, res) => {
    res.status(200).json({ status: "get ok" });
  });

// redirection to the next page using short url
router.get("/geturl/:geturl", (req, res) => {
  var short = req.params.geturl;
  con.query(
    `SELECT longurl FROM urltable WHERE  shorturl="${short}";`,
    (error, result) => {
      if (!error) {
        res.redirect(result[0].longurl);
      } else {
        console.log("Please create the shorturl");
        res.status(200).json({ status: "error" });
      }
    }
  );
  con.query(
    `UPDATE urltable SET hits=hits+1 WHERE  shorturl="${short}";`,
    (err, result) => {
      if (err) {
        res.status(500).json({ status: "error in hits adding" });
      }
    }
  );
});
// end of redirection to the next page using short url

// display all data
router.get("/getall", (req, res) => {
  con.query(`select * from urltable`, (err, result) => {
    res.json(result);
  });
});
// end of display all data

module.exports = router;

const bodyParser = require("body-parser");
var express = require("express");
const app = express();
var router = express.Router();
var con = require("./database/db");
var urlParser = bodyParser.urlencoded();
var path = require("path");

var linktodb = require("./functions/shortkey");

process.env.PORT = process.env.PORT || 3000;
router
  .route("/")
  .post(urlParser, (req, res) => {
    var longurl = req.body.longurl;
    var uniqueID = linktodb(longurl);
    res.redirect("back");
  })
  .get((req, res) => {
    con.query(`select * from urltable`, (err, result) => {
      res.render("../views/pages/index.ejs", { userData: result });
    });
  });

// redirection to the next page using short url
router.get("/:geturl", (req, res) => {
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

module.exports = router;

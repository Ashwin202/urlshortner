const bodyParser = require("body-parser");
var router = require("express").Router();
var con = require("../database/db");
var excecuteQuery = require("./functions/excecuteQuery");
var buildQuery = require("./functions/query");
var urlParser = bodyParser.urlencoded();
var path = require("path");

var linktodb = require("./functions/shortkey");

// process.env.PORT = process.env.PORT || 3000;
router
  .route("/")
  .post(urlParser, (req, res) => {
    var longurl = req.body.longurl;
    var uniqueID = linktodb(longurl);
    res.redirect("back");
  })
  .get(async (req, res) => {
    result = await excecuteQuery(buildQuery.getURLTable());
    return res.render("../views/pages/index.ejs", { userData: result });
  });

// redirection to the next page using short url
router.get("/:geturl", async (req, res) => {
  var short = req.params.geturl;
  result = await excecuteQuery(buildQuery.fetchLongURL(short));
  console.log({ result });
  if (result.length > 0) {
    res.redirect(result[0].longurl);
  } else {
    res.send("Error 404");
  }

  result_hits = await excecuteQuery(buildQuery.hitsAddup(short));
  if (result_hits.length < 0) {
    res.send("Error 404");
  }
  // con.query(
  //   `UPDATE urltable SET hits=hits+1 WHERE  shorturl="${short}";`,
  //   (err, result) => {
  //     if (err) {
  //       res.status(500).json({ status: "error in hits adding" });
  //     }
  //   }
  // );
});

module.exports = router;

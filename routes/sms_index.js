const bodyParser = require("body-parser");
var express = require("express");
const app = express();
var router = express.Router();
var con = require("./database/db");
var jsonParser = bodyParser.json();
var urlParser = bodyParser.urlencoded();

var checklink = require("./functions/checklink");
var linktodb = require("./functions/shortkey");

router.get("/getsms/messagetemplate", (req, res) => {
  con.query(`select * from sms`, (err, result) => {
    if (!err) {
      res.render("../views/pages/sms_temp.ejs", { userData: result });
      // res.json(result);
    } else {
      res.status(500).json({ status: "Error in getting the templates" });
    }
  });
});

router.post("/getsms/messagetemplate", urlParser, (req, res) => {
  var id = req.body.id;
  con.query(`select template from sms where id="${id}";`, (err, result) => {
    if (!err) {
      res.json(result[0]);
    } else {
      res
        .status(500)
        .json({ status: "Error in getting the template from the given id" });
    }
  });
});

router.post("/createsms", urlParser, (req, res) => {
  var id = req.body.id;
  var name = req.body.c1;
  var date = req.body.c2;
  var mail = req.body.c3;
  var temp = [name, date, mail];
  console.log(temp);
  //check which is the link an create the short url
  for (let i = 0; i < 3; i++) {
    var condition_link = checklink(temp[i]);
    if (condition_link) {
      var hostPart = "localhost:3000/";
      var short_key = hostPart.concat(linktodb(temp[i]));
      break;
    }
  }
  con.query(`select template from sms where id="${id}";`, (err, result) => {
    if (!err) {
      console.log(result);
      var message = result[0].template;
      let new_message = message
        .replace("c1", name)
        .replace("c2", date)
        .replace("c3", short_key);
      console.log(new_message);
      res.render("../views/pages/sms_generation.ejs", { message: new_message });
    } else {
      res
        .status(500)
        .json({ status: "Error in getting the template from the given id" });
    }
  });
});
router.get("/createsms", (req, res) => {
  res.render("../views/pages/sms_generation.ejs", { message: "" });
});

module.exports = router;

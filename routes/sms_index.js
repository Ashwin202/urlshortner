const bodyParser = require("body-parser");
var express = require("express");
const app = express();
var router = express.Router();
var con = require("./database/db");
var jsonParser = bodyParser.json();

function checklink(str) {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

//to add short and long url to the database
function linktodb(str) {
  let uniqueID = Math.random()
    .toString(36)
    .replace(/[^a-z]/gi, "")
    .substr(0, 6);
  con.query(
    `insert into urltable(longurl,shorturl) values('${str}','${uniqueID}')`,
    (err) => {
      if (err) {
        res.status(500).json({ status: "Error in inserting url to the db" });
      }
    }
  );
  return uniqueID;
}
//to add short and long url to the database END

router.get("/getsms", (req, res) => {
  con.query(`select * from sms`, (err, result) => {
    if (!err) {
      res.json(result);
    } else {
      res.status(500).json({ status: "Error in getting the templates" });
    }
  });
});

router.post("/getsms", jsonParser, (req, res) => {
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

router.post("/createsms", jsonParser, (req, res) => {
  var id = req.body.id;
  var name = req.body.c1;
  var date = req.body.c2;
  var mail = req.body.c3;
  var temp = [name, date, mail];
  //check which is the link an create the short url
  for (let i = 0; i < 3; i++) {
    var condition_link = checklink(temp[i]);
    if (condition_link) {
      console.log("Its a link = " + temp[i]);
      var hostPart = "localhost:3001/";
      var short_key = hostPart.concat(linktodb(temp[i]));
      break;
    }
  }
  con.query(`select template from sms where id="${id}";`, (err, result) => {
    if (!err) {
      var message = result[0].template;
      console.log(message.length);
      let new_message = message
        .replace("c1", name)
        .replace("c2", date)
        .replace("c3", short_key);
      console.log(new_message);
      res.send(new_message);
      //   console.log("The message is = " + result[0].template);
      // res.json(result[0]);
    } else {
      res
        .status(500)
        .json({ status: "Error in getting the template from the given id" });
    }
  });
});

module.exports = router;

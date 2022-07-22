const bodyParser = require("body-parser");
var router = require("express").Router();
var con = require("../database/db");
var urlParser = bodyParser.urlencoded();

var excecuteQuery = require("./functions/excecuteQuery");
var buildQuery = require("./functions/query");

var checklink = require("./functions/checklink");
var linktodb = require("./functions/shortkey");

router.get("/getsms/messagetemplate", async (req, res) => {
  result = await excecuteQuery(buildQuery.getSMSTable());
  console.log({ result });
  if (result.length > 0) {
    res.render("../views/pages/sms_temp.ejs", { userData: result });
  } else {
    res.send("Error 404");
  }
});
router.post("/getsms/messagetemplate", urlParser, async (req, res) => {
  var id = req.body.id;
  result = await excecuteQuery(buildQuery.getSMSbyId(id));
  if (result.length > 0) {
    res.json(result[0]);
  } else {
    res.send("Error 404");
  }
});
router.post("/createsms", urlParser, async (req, res) => {
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
  result = await excecuteQuery(buildQuery.getSMSbyId(id));
  if (result.length > 0) {
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
router.get("/createsms", (req, res) => {
  res.render("../views/pages/sms_generation.ejs", { message: "" });
});
module.exports = router;

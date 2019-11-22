// Dependencies
const express = require("express");
var compression = require("compression");
const app = express();
var cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");
/*var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/clicks");
var Schema = mongoose.Schema;

(buttonSchema = new Schema({
  "Count me in!": Number,
  Mr: Number,
  "Miss/Mrs": Number,
  Mumbai: Number,
  Kolkata: Number,
  Delhi: Number,
  Chennai: Number
})),
  (UserClick = mongoose.model("clicks", buttonSchema));
module.exports = UserClick;*/

app.use("/static", express.static(path.join(__dirname, "assets")));
// app.use(express.static(__dirname + "/css"));
// app.use(express.static(__dirname + "/videos"));

app.use(
  bodyparser.urlencoded({
    extended: false
  })
);

app.use(compression());

// Defining IP-Address and PORT number
const ipaddress = "127.0.0.1";
const port = 3000;

// Listening to the IP-Address:PORT number
app.listen(port, ipaddress, () =>
  console.log(`Listening at ${ipaddress}:${port}...`)
);

// Body Parser will parse the HTML and return it in JSON format
app.use(bodyparser.json());
app.use(cors());
app.get("/base64", (req, res) => {
  // Reading the excel file and creating JSON Objects
  console.log("JSON DATA");
  res.json({
    status: "success",
    videoData: videoData
  });
});

// ============================================================================= //

// --------------------------------------------------------------------------------------
//                            HOSTING FILES
// --------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/assets/files/index.html");
});

// --------------------------------------------------------------------------------------
//                            END OF HOSTING
// --------------------------------------------------------------------------------------

var item = {};
app.post("/videoConversation", function(req, res) {
  item = {
    "Count me in!": req.body.button,
    Mr: req.body.button,
    "Miss/Mrs": req.body.button,
    Mumbai: req.body.button,
    Kolkata: req.body.button,
    Delhi: req.body.button,
    Chennai: req.body.button
  };

  /*var data = new UserClick(item);
  data.save(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(JSON.stringify(data));
      console.log("Success");
    }
  });*/
});

app.get("/videoConversation", function(req, res) {
  /*UserClick.find({})
    .then(function(result) {
      console.log("result" + result);
      res.json(result);
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    });*/
  res.send(item);
});

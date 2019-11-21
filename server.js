// Dependencies
const express = require("express");
var compression = require("compression");
const app = express();
var cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");
/*var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/click");
var Schema = mongoose.Schema;

(userSchema = new Schema({
  "Count me in!": Number,
  Mr: Number,
  "Miss/Mrs": Number,
  Mumbai: Number,
  Kolkata: Number,
  Delhi: Number,
  Chennai: Number
})),
  (UserClick = mongoose.model("click", userSchema));
module.exports = UserClick;*/
var arr = [];
console.log("array==" + arr);
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

/*app.post("/videoConversation", function(req, res) {
  var click = {
    "Count me in!": req.body,
    Mr: req.body,
    "Miss/Mrs": req.body,
    Mumbai: req.body,
    Kolkata: req.body,
    Delhi: req.body,
    Chennai: req.body
  };

  var data = new UserClick(item);
  data.update(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(JSON.stringify(data));
      console.log("Success");
    }
  });
});*/

// --------------------------------------------------------------------------------------
//                            END OF HOSTING
// --------------------------------------------------------------------------------------

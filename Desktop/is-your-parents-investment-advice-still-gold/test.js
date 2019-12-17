var newID = "UTIswatantra_672906650457";
var fs = require("fs");
fs.readFile("loader.js", "utf8", function(err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/JubiMoney_788585788275/g, newID);

  fs.writeFile("loader.js", result, "utf8", function(err) {
    if (err) return console.log(err);
  });
});

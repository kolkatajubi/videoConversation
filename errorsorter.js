var fs = require('fs'),
    path = require('path');

fs.readFile('errorlog.txt', 'utf8', function(err, data) {
    var arr = data.toString().split('\n'),
        names = [];
    for (var i in arr) {
        if (arr[i].length !== 0) {
            names.push(arr[i].trim('\n'));
            
        }

    }

    for (var j in names) {
   
    console.log(names[j]);
    }
});
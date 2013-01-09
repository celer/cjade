var express = require('express');
var cjade = require('../lib/cjade');

var app = express();

app.engine('.jade',require('jade').__express);
app.use(cjade("templates","c_templates"));

app.use(express.static(__dirname + '/static'));

app.set('view options', {
  layout: false
});

app.get("/",function(req,res){
  res.render("index.jade"); 
});


app.listen(3010);

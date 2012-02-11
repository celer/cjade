var express = require('express');
var cjade = require('../lib/cjade');

var app = express.createServer();

app.register('.jade',require('jade'));
app.use(cjade("templates","c_templates"));

app.set('view options', {
  layout: false
});

app.get("/",function(req,res){
  res.render("index.jade"); 
});



app.listen(3000);

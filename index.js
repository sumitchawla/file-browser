#!/usr/bin/env node

var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('util');

var app = express();
var dir =  process.cwd();
app.use(express.static(dir)); //app public directory
app.use(express.static(__dirname)); //module directory
var server = http.createServer(app);
server.listen(8088);
console.log("Please open the link in your browser http://<YOUR-IP>:8088");

app.get('/files', function(req, res) {
 fs.readdir(dir, function (err, files) {
     if (err) {
        throw err;
      }
      var data = [];
      files
      .filter(function (file) {
          return true;
      }).forEach(function (file) {
        var ext = path.extname(file);
        //console.log("%s (%s)", file,ext );
        data.push({ File : file, Ext : ext });
      });
      res.json(data);
  });
});

app.get('/', function(req, res) {
 res.redirect('lib/template.html'); 
});

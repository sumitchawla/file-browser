#!/usr/bin/env node

var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('util');

var app = express();
var dir =  __dirname;
app.use(express.static(dir)); //app public directory
var server = http.createServer(app);
server.listen(8088);
console.log("Please open the link in your browser http://<YOUR-IP>:8088");

app.get('/', function(req, res) {
  fs.readdir(dir, function (err, files) {
    if (err) {
        throw err;
    }
    res.write('<html><body><ul>');
    files
    /*.map(function (file) {
        return path.join(dir, file);
    })*/.filter(function (file) {
        return true;
//        return fs.statSync(file).isFile();
    }).forEach(function (file) {
        console.log("%s (%s)", file, path.extname(file));
        res.write(util.format('<li><a href="%s">%s</a></li>',file, file));
    });
    res.write('</ul></body></html>');
    res.end();
  });
});



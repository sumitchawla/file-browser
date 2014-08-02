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

var extensionsMap = {
                      ".zip" : "fa-file-archive-o",         
                      ".mp3" : "fa-file-audio-o",         
                      ".cs" : "fa-file-code-o",         
                      ".c++" : "fa-file-code-o",         
                      ".cpp" : "fa-file-code-o",         
                      ".js" : "fa-file-code-o",         
                      ".xls" : "fa-file-excel-o",         
                      ".png" : "fa-file-image-o",         
                      ".jpg" : "fa-file-image-o",         
                      ".jpeg" : "fa-file-image-o",         
                      ".gif" : "fa-file-image-o",         
                      ".mpeg" : "fa-file-movie-o",         
                      ".pdf" : "fa-file-pdf-o",         
                      ".ppt" : "fa-file-powerpoint-o",         
                      ".ppx" : "fa-file-powerpoint-o",         
                      ".txt" : "fa-file-text-o",         
                      ".doc" : "fa-file-word-o",         
                    };

function getFileIcon(ext) {
  console.log(ext, extensionsMap[ext]);
  return extensionsMap[ext] || 'fa-file-o';
}


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

app.get('/template', function(req, res) {
    res.redirect
    fs.readFile('lib/template.html', function (err, template) {
      if (err) throw err;
       res.write(template);
       res.end();
    });
});

/* fs.readFile(path.join(__dirname, 'lib/template.html'), function (err, template) {
      console.log(typeof(template));
      if (err) throw err;
      fs.readdir(dir, function (err, files) {
       if (err) {
        throw err;
      }
      var data = '<ul>';
      files
      .map(function (file) {
        return path.join(dir, file);
      }).filter(function (file) {
          return true;
//        return fs.statSync(file).isFile();
      }).forEach(function (file) {
        var ext = path.extname(file);
        console.log("%s (%s)", file,ext );
        data += util.format('<li><a href="%s"><i class="fa %s"></i>%s</a></li>',file, getFileIcon(ext) ,file);
      });
      data+= '</ul>';
      res.write(template.toString().replace("{links-holder}", data));
      res.end();
  });
  });      
 */

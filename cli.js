#!/usr/bin/env node

var http = require('http');
var express = require('express');
var fb = require('./index.js');

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('$0', 'Browse file system.')
  .example('$0 -e .js .swf .apk', 'Exclude extensions while browsing.')
  .alias('i', 'include')
  .array('i')
  .describe('i', 'File extension to include.')
  .alias('e', 'exclude')
  .array('e')
  .describe('e', 'File extensions to exclude.')
  .alias('p', 'port')
  .describe('p', 'Port to run the file-browser. [default:8088]')
  .help('h')
  .alias('h', 'help')
  // .describe('h', '')
  // .epilog('copyright 2015')
  // .demandOption(['i', 'e']) // required fields
  .check(_checkValidity)
  .argv;

function _checkValidity(argv) {
  if (argv.i && argv.e) return new Error('Select -i or -e.');
  if (argv.i && argv.i.length == 0) return new Error('Supply at least one extension for -i option.');
  if (argv.e && argv.e.length == 0) return new Error('Supply at least one extension for -e option.');
  return true;
}

function collect(val, memo) {
  if(val && val.indexOf('.') != 0) val = "." + val;
  memo.push(val);
  return memo;
}

var app = express();
var dir =  process.cwd();
app.use(express.static(dir)); //app public directory
app.use(express.static(__dirname)); //module directory
var server = http.createServer(app);

fb.setcwd(dir, argv.include, argv.exclude);

if(!argv.port) argv.port = 8088;

server.listen(argv.port);
console.log("Please open the link in your browser http://localhost:" + argv.port);

app.get('/files', fb.get);

app.get('/', function(req, res) {
 res.redirect('lib/template.html'); 
});

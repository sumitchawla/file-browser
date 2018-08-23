#!/usr/bin/env node

const http = require('http');
const express = require('express');
const path = require('path');
const fb = require('./index.js');

fb.configure({
    removeLockString: true
});

function checkValidity(argv) {
  if (argv.i && argv.e) return new Error('Select -i or -e.');
  if (argv.i && argv.i.length === 0) return new Error('Supply at least one extension for -i option.');
  if (argv.e && argv.e.length === 0) return new Error('Supply at least one extension for -e option.');
  return true;
}

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
  .check(checkValidity)
  .argv;

const app = express();

var dir =  process.cwd();
app.get('/b', function(req, res) {
    let file = path.join(dir,req.query.f);
    res.sendFile(file);
})


app.use(express.static(__dirname)); // module directory
var server = http.createServer(app);

fb.setcwd(dir, argv.include, argv.exclude);

if(!argv.port) argv.port = 8088;

server.listen(argv.port);

// eslint-disable-next-line no-console
console.log("Please open the link in your browser http://localhost:" +
            argv.port);

app.get('/files', fb.get);

app.get('/', function(req, res) {
    res.redirect('lib/template.html');
});

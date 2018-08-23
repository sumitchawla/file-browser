const fs = require('fs');
const _ = require('lodash');
const path = require('path');

let dir;
let include;
let exclude;

// default configuration
let config = {
    removeLockString: false
};

exports.moduleroot = __dirname;

exports.setcwd = function(cwd, inc, exc) {
    dir = cwd;
    include = inc;
    exclude = exc;
}

exports.get = function(req, res) {
 let currentDir =  dir;
 let query = req.query.path || '';
 if (query) currentDir = path.join(dir, query);
 fs.readdir(currentDir, function (err, files) {
     if (err) {
        throw err;
      }
      let data = [];
      files
      .filter(function () {
          return true;
      })
      .forEach(function (file) {
        let isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
        if (isDirectory) {
            data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
        } else {
            var ext = path.extname(file);
            if(exclude && _.contains(exclude, ext)) {
                return;
            }
            else if(include && !_.contains(include, ext)) {
                return;
            }
            let filestr;
            if (config.removeLockString) {
                filestr = file.replace('.lock','');
            } else {
                filestr = file;
            }
            data.push({
                Name : filestr,
                Ext : ext,
                IsDirectory: false,
                Path : path.join(query, file)
            });
        }
      });
      data = _.sortBy(data, function(f) { return f.Name });
      res.json(data);
  });
};

exports.configure = function(c) {
    if (!c) return;
    config = c;
}

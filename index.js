var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var dir;
var include;
var exclude;

exports.setcwd = function(cwd, inc, exc) {
    dir = cwd;
    include = inc;
    exclude = exc;
}

exports.get = function(req, res) {
 var currentDir =  dir;
 var query = req.query.path || '';
 if (query) currentDir = path.join(dir, query);
 console.log("browsing ", currentDir);
 fs.readdir(currentDir, function (err, files) {
     if (err) {
        throw err;
      }
      var data = [];
      files
      .filter(function (file) {
          return true;
      })
      .forEach(function (file) {
        try {
                //console.log("processing ", file);
                var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                if (isDirectory) {
                  data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
                } else {
                  var ext = path.extname(file);
                  if(exclude && _.contains(exclude, ext)) {
                    console.log("excluding file ", file);
                    return;
                  }
                  else if(include && !_.contains(include, ext)) {
                    console.log("not including file", file);
                    return;
                  }
                  data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
                }

        } catch(e) {
          console.log(e);
        }

      });
      data = _.sortBy(data, function(f) { return f.Name });
      res.json(data);
  });
};

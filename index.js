const fs = require('fs');
const _ = require('lodash');
const path = require('path');

let dir;
let include;
let exclude;

// default configuration
let config = {
    removeLockString: false,
    otherRoots: []
};

exports.moduleroot = __dirname;

exports.setcwd = function(cwd, inc, exc) {
    dir = cwd;
    include = inc;
    exclude = exc;
}

function displayFiles(err, files, currentDir, query) {
    if (err) {
        throw err;
    }
    let data = [];
    files.forEach(function (file) {
        let isDirectory =
            fs.statSync(path.join(currentDir, file)).isDirectory();
        if (isDirectory) {
            data.push({
                Name : file,
                IsDirectory: true,
                Path : path.join(query, file)
            });
        } else {
            let ext = path.extname(file);
            if(exclude && _.contains(exclude, ext)) {
                return;
            } else if(include && !_.contains(include, ext)) {
                return;
            }
            let filestr;
            if (config.removeLockString) {
                filestr = file.replace('.lock','');
            } else {
                filestr = file;
            }
            let rstr = '';
            if (currentDir !== dir) {
                rstr = currentDir;
            }
            data.push({
                Name : filestr,
                Ext : ext,
                IsDirectory: false,
                Path : path.join(query, file),
                Root : rstr
            });
        }
    });
    return data;
}

/*
 * readRoots: read the list of files in a list of roots.
 * This is a recursive function, calling itself in
 * the readdir() callback until the list is iterated through.
 */
function readRoots(roots, res, query, fullList) {
    let currentDir = roots.shift();

    fs.readdir(currentDir, function (err, files) {
        let data = fullList.concat(displayFiles(err, files, currentDir, query));

        if (roots.length > 0) {
            // loop to the next element
            readRoots(roots, res, query, data);
        } else {
            res.json(_.sortBy(data, function(f) { return f.Name }));
        }
    });

}

exports.get = function(req, res) {
    let currentDir =  dir;
    let query = req.query.path || '';
    let roots = [];
    if (query) {
        roots.push(path.join(dir, query));
    } else {
        // top level, add all roots
        roots = config.otherRoots.slice();
        roots.push(currentDir);
    }
    readRoots(roots, res, query, []);
};

exports.configure = function(c) {
    if (!c) return;
    config = c;
}

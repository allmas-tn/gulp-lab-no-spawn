'use strict';

const domain = require('domain');
const gutil = require('gulp-util');
const through = require('through2');
const Lab = require('lab');

module.exports = function gulpLab(options) {
  const paths = [];

  return through.obj(function(file, enc, cb) {
    paths.push(file.path);
    cb(null, file);
  }, function(cb) {
    const d = domain.create();

    d.on('error', (err) => this.emit('error', err));

    d.run(() => {
      const scripts = [];

      paths.forEach((path) => {
        global._labScriptRun = false;
        const pkg = require(path);

        if (pkg.lab && pkg.lab._root) {
          scripts.push(pkg.lab);

          if (pkg.lab._cli) {
            applyOptions(options, pkg.lab._cli);
          }
        }
        else if (global._labScriptRun)
          throw new gutil.PluginError('gulp-lab-no-spawn', `The file '${path}' includes a lab script that is not exported via exports.lab`, {showProperties: false});
      });

      Lab.report(scripts, options, (err) => {
        if (err)
          this.emit('error', err);
        else
          this.emit('end');

        cb();
      });
    });
  });
};

function applyOptions(parent, child) {
  Object.keys(child).forEach((key) => {
    parent[key] = child[key];
  });
}

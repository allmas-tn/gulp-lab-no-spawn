# Gulp lab no spawn

A [Gulp](http://gulpjs.com) plugin for running [lab](https://github.com/hapijs/lab) tests programmatically in the same
process as Gulp.

## Install

```shell
npm install --save-dev gulp-lab-no-spawn
```

## Usage

```js
const gulp = require('gulp');
const lab = require('gulp-lab-no-spawn');

gulp.task('test', () => {
  return gulp
    .src(['test/**/*.spec.js', 'modules/**/*.spec.js'], {read: false})
    .pipe(lab({
      verbose: true,
      leaks: false
    }))
    .once('error', function(err) {
      done(err);
      process.exit(1);
    })
    .once('end', function() {
      done();
      process.exit();
    });
});
```

For the list of options supported by your lab version, see `internals.defaults` in `node_modules/lab/lib/runner.js`.

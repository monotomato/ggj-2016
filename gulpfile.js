var gulp = require('gulp');
var fs = require('fs');
var concat = require('gulp-concat');
var wiredep = require('wiredep').stream;
var insert = require('gulp-insert');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
  entryFile: './src/js/Main.js',
  htmlTemplate: './src/index.tpl.html',
  outputHtml: 'index.html',
  outputDir: './build/',
  outputFile: 'main.js'
};
var jsPaths = ['./src/','./src/js'];

var genNote = {
    js: '// NOTE: This file has been generated automatically\n',
    html: '<!-- NOTE: This file has been generated automatically -->\n'
};

gulp.task('html', function() {
  gulp.src(config.htmlTemplate)
   .pipe(concat(config.outputHtml))
   .pipe(gulp.dest('./'))
   .pipe(wiredep())
   .pipe(insert.prepend(genNote.html))
   .pipe(gulp.dest('./'));
});

gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend(
        { debug: true, paths: jsPaths }, watchify.args
    )));
  }
  return bundler;
}

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', ['clean'], function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    server: {
      baseDir: './'
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent');
  });
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
